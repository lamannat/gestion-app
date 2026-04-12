from flask import Flask
from flask_cors import CORS
from modules.gastos.routes import gastos_bp

app = Flask(__name__)
CORS(app) # Permite que el frontend (Next.js) se conecte

# Registramos el módulo. Todas las rutas empezarán con /api/gastos
app.register_blueprint(gastos_bp, url_prefix='/api/gastos')

if __name__ == '__main__':
    app.run(debug=True, port=5000)