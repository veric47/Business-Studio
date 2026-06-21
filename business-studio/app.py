from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json
from functools import wraps
from datetime import timedelta
app = Flask(__name__)
app.secret_key = 'businessstudio-secret-key-2024-change-in-prod'
app.permanent_session_lifetime = timedelta(days=7)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
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
        return jsonify({'status': 'success', 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'plan': user['plan']}}), 201
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
    return jsonify({'status': 'success', 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'plan': user['plan']}})
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'success'})
@app.route('/api/auth/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    conn = get_db()
    user = row_to_dict(conn.execute('SELECT id, name, email, plan, created_at FROM users WHERE id = ?', (session['user_id'],)).fetchone())
    conn.close()
    if not user:
        session.clear()
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
    return jsonify({'status': 'success', 'user': user})
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
if __name__ == '__main__':
    print('BusinessStudio Flask backend running on port 8080.')
    app.run(debug=True, host='localhost', port=8080)