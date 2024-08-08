from flask import Flask
from flask_cors import CORS
from .uploadxml.routes import upload_bp
from .chatbot.rotues import chatbot_bp
from .socket import socketio

from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(chatbot_bp, url_prefix='/api')

    # Bind the app with SocketIO
    socketio.init_app(app)

    return app
