"""Importando módulos básicos para conexão com DBcd"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.src.usuarios_crud as usuarios_API
import app.src.login as login_API
import app.src.match_crud as match_API
import app.src.grupos_crud as grupos_API
import app.src.chatPrivado_crud as chatPrivado_API
import app.src.chatGrupo_crud as chatGrupo_API
import app.src.preferenciasgeral_crud as preferencias_API
import app.src.relatorio as relatorio


app = FastAPI()

# Configurar as origens permitidas
origins = [
    "http://localhost:3000",  # URL do frontend
    # Adicione outras origens permitidas
]

# Adicionar o middleware CORS ao aplicativo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir os roteadores
app.include_router(usuarios_API.router)
app.include_router(login_API.router)
app.include_router(match_API.router)
app.include_router(grupos_API.router)
app.include_router(chatPrivado_API.router)
app.include_router(chatGrupo_API.router)
app.include_router(preferencias_API.router)
app.include_router(relatorio.router)
