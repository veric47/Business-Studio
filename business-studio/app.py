from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json
from functools import wraps
from datetime import datetime, timedelta
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.exceptions import RequestEntityTooLarge
from google.auth.transport import requests
from google.oauth2 import id_token
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import threading

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

def configure_cloudinary():
    cloud_name = (os.getenv('CLOUDINARY_CLOUD_NAME') or '').strip()
    api_key = (os.getenv('CLOUDINARY_API_KEY') or '').strip()
    api_secret = (os.getenv('CLOUDINARY_API_SECRET') or '').strip()
    if cloud_name and api_key and api_secret:
        cloudinary.config(cloud_name=cloud_name, api_key=api_key, api_secret=api_secret)
        return None
    missing = [
        name for name, value in (
            ('CLOUDINARY_CLOUD_NAME', cloud_name),
            ('CLOUDINARY_API_KEY', api_key),
            ('CLOUDINARY_API_SECRET', api_secret),
        ) if not value
    ]
    return missing

def cloudinary_config_error():
    missing = configure_cloudinary()
    if missing:
        return jsonify({
            'status': 'error',
            'message': f'File uploads are not configured on the server. Missing: {", ".join(missing)}',
        }), 503
    return None

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
app.secret_key = 'businessstudio-secret-key-2024-change-in-prod'
app.permanent_session_lifetime = timedelta(days=7)
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_HTTPONLY=True,
)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max upload size

ALLOWED_MEDIA_EXTENSIONS = {
    'image': {'jpg', 'jpeg', 'png', 'gif', 'webp'},
    'audio': {'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'},
    'video': {'mp4', 'webm', 'mov', 'ogg'},
}
ALLOWED_ORIGINS = [
    "https://business-studio-green.vercel.app",
    "https://business-studio-7tqf.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS(
     app,
    supports_credentials=True,
    origins=ALLOWED_ORIGINS,
)

# Email Configuration (Gmail SMTP)
GMAIL_EMAIL = os.getenv('GMAIL_EMAIL', 'your-email@gmail.com')
GMAIL_PASSWORD = os.getenv('GMAIL_PASSWORD', 'your-app-password')

def send_email(to_email, subject, html_content):
    """Send email using Gmail SMTP"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = GMAIL_EMAIL
        msg['To'] = to_email

        part = MIMEText(html_content, 'html')
        msg.attach(part)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
            server.sendmail(GMAIL_EMAIL, to_email, msg.as_string())

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_welcome_email(email, name):
    """Send welcome email to new users"""
    subject = "Welcome to Business Studio! 🎉"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Welcome to Business Studio, {name}! 👋</h2>
                <p style="color: #666; font-size: 16px;">Thank you for signing up! We're excited to have you on board.</p>
                <p style="color: #666; font-size: 16px;">You can now:</p>
                <ul style="color: #666; font-size: 16px;">
                    <li>Create beautiful business websites</li>
                    <li>Customize your site with ease</li>
                    <li>Publish and share your website</li>
                </ul>
                <p style="color: #666; font-size: 16px;">Ready to get started? Visit your dashboard to create your first site!</p>
                <p style="color: #999; font-size: 14px; margin-top: 30px;">Best regards,<br>The Business Studio Team</p>
            </div>
        </body>
    </html>
    """
    return send_email(email, subject, html_content)

def send_login_alert_email(email, name):
    """Send login alert email"""
    subject = "You just logged into Business Studio"
    login_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Login Notification</h2>
                <p style="color: #666; font-size: 16px;">Hi {name},</p>
                <p style="color: #666; font-size: 16px;">You successfully logged into your Business Studio account.</p>
                <p style="color: #666; font-size: 14px; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                    <strong>Time:</strong> {login_time}<br>
                    <strong>Account:</strong> {email}
                </p>
                <p style="color: #666; font-size: 16px;">If this wasn't you, please change your password immediately.</p>
                <p style="color: #999; font-size: 14px; margin-top: 30px;">Best regards,<br>The Business Studio Team</p>
            </div>
        </body>
    </html>
    """
    return send_email(email, subject, html_content)


DB_PATH = os.path.join(os.path.dirname(__file__), 'businessstudio.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        plan TEXT DEFAULT 'free',
        profile_picture_url TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    # Add profile_picture_url column if it doesn't exist (for existing databases)
    c.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in c.fetchall()]
    if 'profile_picture_url' not in columns:
        c.execute('ALTER TABLE users ADD COLUMN profile_picture_url TEXT DEFAULT NULL')

    c.execute('''CREATE TABLE IF NOT EXISTS sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        business_name TEXT NOT NULL,
        subdomain TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        layout_style TEXT NOT NULL,
        components TEXT DEFAULT '[]',
        theme TEXT DEFAULT 'light',
        published INTEGER DEFAULT 1,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()

init_db()

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        return f(*args, **kwargs)
    return decorated

def row_to_dict(row):
    return dict(row) if row else None

# AUTH ROUTES
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()

    password = data.get('password', '')
    if not name or not email or not password:
        return jsonify({'status': 'error', 'message': 'All fields required'}), 400
    if len(password) < 6:
        return jsonify({'status': 'error', 'message': 'Password must be at least 6 characters'}), 400
    conn = get_db()
    try:
        hashed = generate_password_hash(password)
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hashed))
        conn.commit()
        user = row_to_dict(conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone())
        session.permanent = True
        session['user_id'] = user['id']

        # Send welcome email in the background so the request doesn't block on SMTP
        threading.Thread(target=send_welcome_email, args=(email, name), daemon=True).start()

        return jsonify({'status': 'success', 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'plan': user['plan'], 'profile_picture_url': user.get('profile_picture_url')}}), 201
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': 'Email already registered'}), 409
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    conn = get_db()
    user = row_to_dict(conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone())
    conn.close()
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401
    session.permanent = True
    session['user_id'] = user['id']

    # Send login alert email in the background so the request doesn't block on SMTP
    threading.Thread(target=send_login_alert_email, args=(user['email'], user['name']), daemon=True).start()

    return jsonify({'status': 'success', 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'plan': user['plan'], 'profile_picture_url': user.get('profile_picture_url')}})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'success'})

@app.route('/api/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'status': 'error', 'message': 'No token provided'}), 400

    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), '647592716254-lfguur8te3na1ju4ec30huem66877n0e.apps.googleusercontent.com')

        email = idinfo['email'].lower()
        name = idinfo.get('name', 'User')

        conn = get_db()

        # Check if user exists
        user = row_to_dict(conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone())

        if not user:
            # Create new user with a placeholder password for Google accounts
            try:
                placeholder_password = generate_password_hash('google_oauth_user')
                conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                           (name, email, placeholder_password))
                conn.commit()
                user = row_to_dict(conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone())
                is_new_user = True
            except sqlite3.IntegrityError:
                conn.close()
                return jsonify({'status': 'error', 'message': 'Email already registered'}), 409
        else:
            is_new_user = False

        conn.close()

        # Set session
        session.permanent = True
        session['user_id'] = user['id']

        # Send appropriate email in the background so the request doesn't block on SMTP
        if is_new_user:
            threading.Thread(target=send_welcome_email, args=(user['email'], user['name']), daemon=True).start()
        else:
            threading.Thread(target=send_login_alert_email, args=(user['email'], user['name']), daemon=True).start()

        return jsonify({'status': 'success', 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'plan': user['plan'], 'profile_picture_url': user.get('profile_picture_url')}})

    except Exception as e:
        print(f"Google token verification failed: {e}")
        return jsonify({'status': 'error', 'message': 'Token verification failed'}), 401

@app.route('/api/auth/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    conn = get_db()
    user = row_to_dict(conn.execute('SELECT id, name, email, plan, profile_picture_url, created_at FROM users WHERE id = ?', (session['user_id'],)).fetchone())
    conn.close()
    if not user:
        session.clear()
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
    return jsonify({'status': 'success', 'user': user})

@app.route('/api/auth/upload-profile-picture', methods=['POST'])
@login_required
def upload_profile_picture():
    """Upload user profile picture to Cloudinary"""
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file selected'}), 400

    config_error = cloudinary_config_error()
    if config_error:
        return config_error

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            folder='business-studio/profiles',
            resource_type='auto',
            quality='auto'
        )

        profile_picture_url = result['secure_url']

        # Update user profile picture in database
        conn = get_db()
        conn.execute('UPDATE users SET profile_picture_url = ? WHERE id = ?',
                    (profile_picture_url, session['user_id']))
        conn.commit()

        user = row_to_dict(conn.execute('SELECT id, name, email, plan, profile_picture_url, created_at FROM users WHERE id = ?',
                                        (session['user_id'],)).fetchone())
        conn.close()

        return jsonify({'status': 'success', 'user': user, 'profile_picture_url': profile_picture_url})

    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Upload failed: {str(e)}'}), 500

@app.route('/api/auth/profile-picture', methods=['PUT'])
@login_required
def set_profile_picture():
    """Save profile picture URL after a direct Cloudinary upload from the browser"""
    data = request.get_json() or {}
    url = (data.get('url') or '').strip()
    if not url:
        return jsonify({'status': 'error', 'message': 'URL required'}), 400

    conn = get_db()
    conn.execute('UPDATE users SET profile_picture_url = ? WHERE id = ?', (url, session['user_id']))
    conn.commit()
    user = row_to_dict(conn.execute(
        'SELECT id, name, email, plan, profile_picture_url, created_at FROM users WHERE id = ?',
        (session['user_id'],)
    ).fetchone())
    conn.close()
    return jsonify({'status': 'success', 'user': user, 'profile_picture_url': url})

@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    return jsonify({'status': 'error', 'message': 'File too large (max 50MB)'}), 413

@app.route('/api/upload', methods=['POST'])
@login_required
def upload_media():
    """Generic upload endpoint for image, audio, or video files used in site components"""
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file provided'}), 400

    file = request.files['file']
    media_type = request.form.get('type', 'image')

    if media_type not in ALLOWED_MEDIA_EXTENSIONS:
        return jsonify({'status': 'error', 'message': 'Invalid media type'}), 400

    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file selected'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in ALLOWED_MEDIA_EXTENSIONS[media_type]:
        allowed = ', '.join(sorted(ALLOWED_MEDIA_EXTENSIONS[media_type]))
        return jsonify({'status': 'error', 'message': f'Unsupported {media_type} file type ".{ext}". Allowed: {allowed}'}), 400

    # Cloudinary stores both audio and video under resource_type "video"
    resource_type = 'image' if media_type == 'image' else 'video'

    config_error = cloudinary_config_error()
    if config_error:
        return config_error

    try:
        upload_kwargs = {'folder': f'business-studio/{media_type}', 'resource_type': resource_type}
        if resource_type == 'image':
            upload_kwargs['quality'] = 'auto'
        result = cloudinary.uploader.upload(file, **upload_kwargs)
        return jsonify({'status': 'success', 'url': result['secure_url'], 'type': media_type})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Upload failed: {str(e)}'}), 500

# SITES ROUTES
@app.route('/api/sites', methods=['GET'])
@login_required
def get_my_sites():
    conn = get_db()
    sites = [row_to_dict(r) for r in conn.execute('SELECT * FROM sites WHERE user_id = ? ORDER BY updated_at DESC', (session['user_id'],)).fetchall()]
    conn.close()
    for s in sites:
        s['components'] = json.loads(s['components'])
    return jsonify({'status': 'success', 'sites': sites})

@app.route('/api/sites', methods=['POST'])
@login_required
def create_site():
    data = request.get_json()
    business_name = data.get('businessName', '').strip()
    subdomain = data.get('subdomain', '').strip().lower()
    category = data.get('category', '')
    layout_style = data.get('layoutStyle', 'single_page')
    components = json.dumps(data.get('components', []))
    theme = data.get('theme', 'light')
    if not business_name or not subdomain or not category:
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
    conn = get_db()
    try:
        cur = conn.execute(
            'INSERT INTO sites (user_id, business_name, subdomain, category, layout_style, components, theme) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (session['user_id'], business_name, subdomain, category, layout_style, components, theme)
        )
        conn.commit()
        site = row_to_dict(conn.execute('SELECT * FROM sites WHERE id = ?', (cur.lastrowid,)).fetchone())
        site['components'] = json.loads(site['components'])
        return jsonify({'status': 'success', 'site': site}), 201
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': 'Subdomain already taken'}), 409
    finally:
        conn.close()

@app.route('/api/sites/<int:site_id>', methods=['PUT'])
@login_required
def update_site(site_id):
    conn = get_db()
    site = row_to_dict(conn.execute('SELECT * FROM sites WHERE id = ? AND user_id = ?', (site_id, session['user_id'])).fetchone())
    if not site:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Site not found'}), 404
    data = request.get_json()
    business_name = data.get('businessName', site['business_name'])
    layout_style = data.get('layoutStyle', site['layout_style'])
    components = json.dumps(data.get('components', []))
    theme = data.get('theme', site['theme'])
    published = 1 if data.get('published', True) else 0
    conn.execute(
        'UPDATE sites SET business_name=?, layout_style=?, components=?, theme=?, published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
        (business_name, layout_style, components, theme, published, site_id)
    )
    conn.commit()
    site = row_to_dict(conn.execute('SELECT * FROM sites WHERE id = ?', (site_id,)).fetchone())
    site['components'] = json.loads(site['components'])
    conn.close()
    return jsonify({'status': 'success', 'site': site})

@app.route('/api/sites/<int:site_id>', methods=['DELETE'])
@login_required
def delete_site(site_id):
    conn = get_db()
    conn.execute('DELETE FROM sites WHERE id = ? AND user_id = ?', (site_id, session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

# GALLERY
@app.route('/api/gallery', methods=['GET'])
def gallery():
    conn = get_db()
    sites = [row_to_dict(r) for r in conn.execute(
        '''SELECT s.id, s.business_name, s.subdomain, s.category, s.layout_style, s.theme, s.views, s.created_at, u.name as owner_name
           FROM sites s JOIN users u ON s.user_id = u.id
           WHERE s.published = 1 ORDER BY s.views DESC, s.created_at DESC LIMIT 50'''
    ).fetchall()]
    conn.close()
    return jsonify({'status': 'success', 'sites': sites})

@app.route('/api/gallery/<subdomain>', methods=['GET'])
def get_site_by_subdomain(subdomain):
    conn = get_db()
    site = row_to_dict(conn.execute('SELECT * FROM sites WHERE subdomain = ? AND published = 1', (subdomain,)).fetchone())
    if not site:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Site not found'}), 404
    conn.execute('UPDATE sites SET views = views + 1 WHERE id = ?', (site['id'],))
    conn.commit()
    conn.close()
    site['components'] = json.loads(site['components'])
    return jsonify({'status': 'success', 'site': site})

@app.route('/api/check-subdomain/<subdomain>', methods=['GET'])
def check_subdomain(subdomain):
    conn = get_db()
    site = conn.execute('SELECT id FROM sites WHERE subdomain = ?', (subdomain,)).fetchone()
    conn.close()
    return jsonify({'available': site is None})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for deployment services"""
    missing = configure_cloudinary()
    return jsonify({
        'status': 'ok',
        'uploads': 'ready' if not missing else 'cloudinary_env_missing',
        'cloudinary_missing': missing or [],
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    print(f'BusinessStudio Flask backend running on port {port}.')
    app.run(debug=debug, host='0.0.0.0', port=port)
