export const emailVerificationLink = (link) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to StyleHub - Verify Your Account</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            position: relative;
            overflow: hidden;
        }
        
        .email-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #FE6800, #ff8f3d, #FE6800);
        }
        
        .header {
            text-align: center;
            padding: 50px 40px 30px;
            background: radial-gradient(circle at center, rgba(254, 104, 0, 0.1) 0%, transparent 70%);
        }
        
        .brand-logo {
            font-size: 32px;
            font-weight: 800;
            color: #FE6800;
            margin-bottom: 8px;
            letter-spacing: -1px;
        }
        
        .brand-tagline {
            font-size: 14px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 40px;
        }
        
        .welcome-text {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 12px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #aaa;
            margin-bottom: 0;
        }
        
        .content {
            padding: 0 40px 40px;
        }
        
        .message-box {
            background: rgba(254, 104, 0, 0.05);
            border: 1px solid rgba(254, 104, 0, 0.2);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 35px;
            text-align: center;
        }
        
        .message-text {
            font-size: 16px;
            color: #ccc;
            line-height: 1.7;
            margin-bottom: 25px;
        }
        
        .verify-btn {
            display: inline-block;
            background: linear-gradient(135deg, #FE6800 0%, #ff8f3d 100%);
            color: #ffffff;
            padding: 16px 48px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 32px rgba(254, 104, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid transparent;
        }
        
        .verify-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(254, 104, 0, 0.4);
            border-color: rgba(254, 104, 0, 0.5);
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(254, 104, 0, 0.3), transparent);
            margin: 40px 0;
        }
        
        .backup-link {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .backup-text {
            font-size: 14px;
            color: #888;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .backup-url {
            color: #FE6800;
            font-size: 13px;
            word-break: break-all;
            text-decoration: none;
            display: block;
            text-align: center;
            padding: 10px;
            background: rgba(254, 104, 0, 0.1);
            border-radius: 8px;
            border: 1px dashed rgba(254, 104, 0, 0.3);
        }
        
        .security-alert {
            background: linear-gradient(135deg, rgba(255, 69, 58, 0.1), rgba(255, 159, 10, 0.1));
            border: 1px solid rgba(255, 159, 10, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .security-icon {
            font-size: 20px;
            margin-bottom: 10px;
            display: block;
            text-align: center;
        }
        
        .security-text {
            font-size: 14px;
            color: #ffb347;
            text-align: center;
            line-height: 1.5;
        }
        
        .footer {
            background: #111;
            padding: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-content {
            text-align: center;
        }
        
        .footer-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #FE6800;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
        
        .copyright {
            font-size: 12px;
            color: #444;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
            }
            
            .header,
            .content,
            .footer {
                padding-left: 20px;
                padding-right: 20px;
            }
            
            .welcome-text {
                font-size: 24px;
            }
            
            .verify-btn {
                padding: 14px 36px;
                font-size: 14px;
            }
            
            .message-box {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="brand-logo">STYLEHUB</div>
            <div class="brand-tagline">Premium Fashion</div>
            <h1 class="welcome-text">Welcome to the Club</h1>
            <p class="subtitle">Your style journey begins now</p>
        </div>
        
        <div class="content">
            <div class="message-box">
                <p class="message-text">
                    You're just one click away from accessing exclusive fashion collections, 
                    limited drops, and member-only perks. Verify your email to unlock your account.
                </p>
                <a href="${link}" class="verify-btn">Verify Account</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="backup-link">
                <p class="backup-text">Button not working? Copy this link:</p>
                <a href="${link}" class="backup-url">${link}</a>
            </div>
            
            <div class="security-alert">
                <span class="security-icon">⚡</span>
                <p class="security-text">
                    <strong>Quick Action Required:</strong> This link expires in 1 hour for your security. 
                    Didn't sign up? Simply ignore this email.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <p class="footer-text">
                    Ready to elevate your wardrobe?<br>
                    Connect with us for the latest drops and styling tips.
                </p>
                
                <div class="social-links">
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">TikTok</a>
                </div>
                
                <p class="copyright">
                    © ${new Date().getFullYear()} StyleHub. All rights reserved.<br>
                    Crafted with passion for fashion lovers worldwide.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  return html;
};