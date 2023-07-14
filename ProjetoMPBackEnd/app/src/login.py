"""Importando módulos básicos para conexão com DBcd"""
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from app.src.models.login_model import Login
from app.src.config_db import bancoAtlax
from app.src import exceptions

router = APIRouter(
    prefix="/Login",
    tags=["Login"],
    responses={404: {"description": "Not Found"}}
)


@router.post("/")
def login_usuario(login_request: Login):
    """Função de login de usuario

    Assertivas de entrada:
    Json no formato: {username: "string", password: "int"}

    Assertiva de saída:
    Verifica no banco o usuario e senha e retorna o status da requisição.
    Retorna varia entre "sucesso" (200), "Senha inválida" (403),
    "Usuário não encontrado" (404)

    """
    usuarios = bancoAtlax.reference("/Usuarios").get()

    if (login_request.username is None or login_request.username == ""
            or login_request.senha is None or login_request.senha == 0):
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            break

        if login_request.username == usuario["username"]:
            if login_request.senha == usuario["senha"]:
                return usuario
            raise HTTPException(status_code=403,
                                detail={"message": "Senha inválida"})
    raise HTTPException(status_code=404,
                detail={"message": f"Usuário de nome {login_request.username} não encontrado."})
