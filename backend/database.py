import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("ERROR: No se encontraron las credenciales en el archivo .env")

# Instancia del cliente
supabase = create_client(url, key)