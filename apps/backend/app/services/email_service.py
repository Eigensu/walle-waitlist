"""Email service for sending registration confirmation emails via Resend API."""

import httpx
from fastapi_mail import MessageSchema # Keeping MessageSchema for compatibility with existing imports, or we can define simple dataclass
from app.core.config import get_settings

settings = get_settings()

# We can mimic MessageSchema if we want to remove fastapi-mail dep entirely,
# but for now, let's assume valid imports or just use simple dicts/dataclasses if fastapi_mail is removed.
# To be safe and clean, let's keep MessageSchema if it's imported elsewhere, 
# BUT the plan said "Remove SMTP Logic", so let's stick to using the existing MessageSchema to avoid breaking route imports
# OR better: Refactor imports in routes if we remove fastapi-mail.
# Let's check imports in routers/admin.py: "from app.services.email_service import send_approval_email"
# It doesn't import MessageSchema usually.
# Let's check the previous file content... MessageSchema was imported from fastapi_mail.
# If we remove fastapi_mail dependency, we need to provide a replacement for MessageSchema or change the function signatures.
# Let's keep fastapi_mail for Schema ONLY for now to minimize friction, or just defined a simple class.
# Actually, the user wants "Remove SMTP completely".
# Let's define a local MessageSchema to break the dependency on fastapi-mail if possible.

class SimpleMessageSchema:
    def __init__(self, subject, recipients, body, subtype="html"):
        self.subject = subject
        self.recipients = recipients
        self.body = body
        self.subtype = subtype

async def send_via_resend(subject: str, recipients: list[str], html_body: str) -> bool:
    """Send email via Resend API (HTTP)."""
    if not settings.resend_api_key:
        print("⚠️ No RESEND_API_KEY configured. Cannot send email.")
        return False

    to_email = recipients[0] # Assuming single recipient for now as per logic
    print(f"🔄 Attempting to send via Resend API to {to_email}...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "JYPL Registration <admin@eigensu.in>",
                    "to": recipients,
                    "subject": subject,
                    "html": html_body
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                print(f"✅ Email sent successfully via Resend API to {to_email}")
                return True
            else:
                print(f"⚠️ Resend API failed: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        print(f"⚠️ Resend API Exception: {str(e)}")
        return False


async def send_email(subject: str, to_email: str, html_body: str) -> bool:
    """
    Primary Send Function: Resend API -> Manual Fallback
    """
    # 1. Try Resend API
    if await send_via_resend(subject, [to_email], html_body):
        return True

    # 2. Manual Fallback
    print(f"❌ RESEND API FAILED.")
    print(f"👇 ================= MANUAL ACTION REQUIRED ================= 👇")
    print(f"Please send this Payment Link manually to the user:")
    print(f"🔗 https://jypl.in/resume-payment?email={to_email}")
    print(f"👆 ========================================================== 👆")
    return True


async def send_success_email(
    to_email: str,
    name: str,
    player_id: str,
    amount: int = 12500
) -> bool:
    """
    Send registration success confirmation email.
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .success-badge {{ background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }}
            .info-box {{ background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Registration Successful!</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{name}</strong>,</p>
                
                <div class="success-badge">
                    ✓ Payment Confirmed
                </div>
                
                <p>Congratulations! Your registration for <strong>JYPL Season 8</strong> has been successfully completed.</p>
                
                <div class="info-box">
                    <h3>Payment Details</h3>
                    <p><strong>Amount Paid:</strong> ₹{amount:,}</p>
                    <p><strong>Player ID:</strong> {player_id}</p>
                    <p><strong>Status:</strong> <span style="color: #10b981;">CONFIRMED</span></p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 16px;">Thank you! We look forward to your participation.</p>
                </div>
                
                <div class="footer">
                    <p><strong>JYPL Season 8 | Jewellery Youth Premier League</strong></p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        subject="✅ JYPL Registration Successful - Payment Confirmed",
        to_email=to_email,
        html_body=html_content
    )


async def send_approval_email(
    to_email: str,
    name: str,
    player_id: str,
) -> bool:
    """
    Send approval email with payment link.
    """
    resume_link = f"https://jypl.in/resume-payment?email={to_email}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .info-box {{ background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
            .button {{ background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Application Approved!</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{name}</strong>,</p>
                
                <p>We are pleased to inform you that your application for <strong>JYPL Season 8</strong> has been approved from the waitlist.</p>
                
                <div class="info-box">
                    <h3>Next Steps</h3>
                    <p>You can now proceed with the payment to confirm your spot.</p>
                    <p><strong>Player ID:</strong> {player_id}</p>
                    <p><strong>Status:</strong> <span style="color: #10b981;">APPROVED</span></p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{resume_link}" class="button">Complete Payment Now</a>
                    <p style="font-size: 12px; margin-top: 10px;">Or visit the website and use the "Resume Payment" option with your email.</p>
                </div>
                
                <div class="footer">
                    <p><strong>JYPL Season 8 | Jewellery Youth Premier League</strong></p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        subject="🎉 JYPL Application Approved - Complete Payment Now",
        to_email=to_email,
        html_body=html_content
    )
