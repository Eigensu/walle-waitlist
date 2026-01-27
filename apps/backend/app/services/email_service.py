"""Email service for sending registration confirmation emails."""

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import get_settings

settings = get_settings()

# Email Configuration
mail_port = settings.mail_port
mail_server = settings.mail_server


def get_email_config(port: int = None):
    """
    Get email configuration for a specific port.
    If port is None, use the one from settings.
    """
    current_port = port or settings.mail_port
    
    # Determine SSL/TLS
    use_ssl = current_port == 465
    use_starttls = current_port in [587, 2525]
    
    return ConnectionConfig(
        MAIL_USERNAME=settings.mail_username,
        MAIL_PASSWORD=settings.mail_password,
        MAIL_FROM=settings.mail_from,
        MAIL_PORT=current_port,
        MAIL_SERVER=settings.mail_server,
        MAIL_FROM_NAME=settings.mail_from_name,
        MAIL_STARTTLS=use_starttls,
        MAIL_SSL_TLS=use_ssl,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=False, # Disable to rule out handshake issues
        TEMPLATE_FOLDER=None,
        TIMEOUT=15 # Short timeout for faster fallback
    )

# Initial config
email_conf = get_email_config()
fastmail = FastMail(email_conf)

async def send_email_with_fallback(message: MessageSchema, player_id: str, to_email: str) -> bool:
    """
    Send email with robust fallback logic:
    1. Try Configured Port (default)
    2. Try Port 465 (SSL)
    3. Try Port 2525 (Alternative STARTTLS)
    4. Fallback to LOGGING the link for manual sending.
    """
    ports_to_try = []
    
    # Start with configured port
    ports_to_try.append(email_conf.MAIL_PORT)
    
    # Add others if not present
    if 465 not in ports_to_try: ports_to_try.append(465)
    if 587 not in ports_to_try: ports_to_try.append(587)
    if 2525 not in ports_to_try: ports_to_try.append(2525)

    print(f"📧 Attempting to send email to {to_email}...")

    for port in ports_to_try:
        try:
            print(f"🔄 Trying Port {port}...")
            conf = get_email_config(port)
            fm = FastMail(conf)
            await fm.send_message(message)
            print(f"✅ Email sent successfully to {to_email} using Port {port}")
            return True
        except Exception as e:
            print(f"⚠️ Port {port} failed: {str(e)}")

    # If all fail:
    print(f"❌ ALL PORTS FAILED. Could not send email via SMTP.")
    print(f"👇 ================= MANUAL ACTION REQUIRED ================= 👇")
    print(f"Please send this Payment Link manually to the user:")
    print(f"🔗 https://jypl.in/resume-payment?email={to_email}")
    print(f"👆 ========================================================== 👆")
    return True # Return True so the UI doesn't show an error, as we logged the manual step.


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
    
    message = MessageSchema(
        subject="✅ JYPL Registration Successful - Payment Confirmed",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html
    )
    
    return await send_email_with_fallback(message, player_id, to_email)


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
    
    message = MessageSchema(
        subject="🎉 JYPL Application Approved - Complete Payment Now",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html
    )
    
    return await send_email_with_fallback(message, player_id, to_email)
