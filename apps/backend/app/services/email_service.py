"""Email service for sending registration confirmation emails."""

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import get_settings

settings = get_settings()

# Email Configuration
# Force use of port 465 (SSL) for Gmail if currently configured for 587 (STARTTLS)
# This fixes common timeout issues in certain environments
mail_port = settings.mail_port
mail_server = settings.mail_server
use_ssl = False
use_starttls = False

if "smtp.gmail.com" in mail_server and mail_port == 587:
    print("⚠️ Detected Gmail on port 587. Forcing switch to port 465 (SSL) to avoid timeouts.")
    mail_port = 465

if mail_port == 465:
    use_ssl = True
    use_starttls = False
elif mail_port == 587:
    use_ssl = False
    use_starttls = True

email_conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=mail_port,
    MAIL_SERVER=mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=use_starttls,
    MAIL_SSL_TLS=use_ssl,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=None,  # We'll use inline HTML
    TIMEOUT=10 # Set timeout to 10 seconds
)

fastmail = FastMail(email_conf)


async def send_success_email(
    to_email: str,
    name: str,
    player_id: str,
    amount: int = 12500
) -> bool:
    """
    Send registration success confirmation email.
    
    Args:
        to_email: Recipient email address
        name: Player's full name
        player_id: Unique player registration ID
        amount: Payment amount in INR (default: 12500)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
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
                .button {{ background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
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
                    
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    
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
        
        await fastmail.send_message(message)
        print(f"✅ Success email sent to {to_email} for player {player_id}")
        return True
        
    except Exception as e:
        # Log error but don't fail the webhook
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def send_approval_email(
    to_email: str,
    name: str,
    player_id: str,
) -> bool:
    """
    Send approval email with payment link.
    
    Args:
        to_email: Recipient email address
        name: Player's full name
        player_id: Unique player registration ID
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
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
                .success-badge {{ background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }}
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
                    <p>Dear <strong>{{name}}</strong>,</p>
                    
                    <p>We are pleased to inform you that your application for <strong>JYPL Season 8</strong> has been approved from the waitlist.</p>
                    
                    <div class="info-box">
                        <h3>Next Steps</h3>
                        <p>You can now proceed with the payment to confirm your spot.</p>
                        <p><strong>Player ID:</strong> {{player_id}}</p>
                        <p><strong>Status:</strong> <span style="color: #10b981;">APPROVED</span></p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{resume_link}}" class="button">Complete Payment Now</a>
                        <p style="font-size: 12px; margin-top: 10px;">Or visit the website and use the "Resume Payment" option with your email.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 16px;">Please complete the payment to secure your registration.</p>
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
            body=html_content.format(name=name, player_id=player_id, resume_link=resume_link),
            subtype=MessageType.html
        )
        
        await fastmail.send_message(message)
        print(f"✅ Approval email sent to {to_email} for player {player_id}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send approval email to {to_email}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
