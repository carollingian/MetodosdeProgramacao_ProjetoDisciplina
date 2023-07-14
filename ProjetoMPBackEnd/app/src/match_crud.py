"""Importando módulos básicos para conexão com DB"""
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from app.src.config_db import bancoAtlax
from app.src.utils.busca_usuario import busca_usuario_id
from app.algoritmo_match import match_lists

router = APIRouter(
    prefix="/Match",
    tags=["Match"],
    responses={404: {"description": "Not Found"}}
)

# EU 5 - Interação com Grupos e Usuários


@router.get("/lista-match-grupo-por-usuario/{id_usuario_base}")
async def lista_match_grupo_por_usuario(id_usuario_base: int):
    """
    Lista os matchs entre um usuário e os grupos existentes

    Assertiva de entrada: um id de usuario para fazer as comparações entre
    grupos.

    Assertiva de saída: retorna dicionário com a relação entre os usuario
    especificado e os grupos existentes, (404) Not Found, quando o usuario
    não é encontrado, ou (500) Internal Server Error, quando ocorre algum
    erro no banco de dados.
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    grupos = bancoAtlax.reference("/Grupos").get()
    matchs_dict = {}

    try:
        usuario_base = busca_usuario_id(id_usuario_base, usuarios)
        for key, grupo in grupos.items():
            if key == "Total":
                break
            try:
                match = match_lists(grupo["preferencias"],
                                    usuario_base["preferencias"])
                match_porcentagem = f"{match:.2%}"
                relacao_grupo_match = {grupo["nome"]: match_porcentagem}
                matchs_dict.update(relacao_grupo_match)
            except KeyError:
                relacao_grupo_match = {grupo["nome"]: "0%"}
                matchs_dict.update(relacao_grupo_match)

        return matchs_dict

    except HTTPException as exception:
        raise exception


@router.get("/lista-match-usuarios-por-usuario/{id_usuario_base}")
async def lista_match_usuarios_por_usuario(id_usuario_base: int):
    """
    Lista os matchs entre o usuario especificado e os usuarios existentes

    Assertiva de entrada: um id de usuario para fazer as comparações entre
    grupos.

    Assertiva de saída: retorna dicionário com a relação entre os usuario
    especificado e os usuarios existentes, (404) Not Found, quando o
    usuario não é encontrado, ou (500) Internal Server Error, quando
    ocorre algum erro no banco de dados.

    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    matchs_dict = {}

    try:
        usuario_base = busca_usuario_id(id_usuario_base, usuarios)
        for key, usuario in usuarios.items():
            if key == "Total":
                break

            if (usuario["username"] != usuario_base["username"] and usuario["id"] != 1):
                try:
                    match = match_lists(usuario["preferencias"], usuario_base["preferencias"])
                    match_porcentagem = f"{match:.2%}"
                    relacao_usuario_match = {usuario["username"]: match_porcentagem}
                    matchs_dict.update(relacao_usuario_match)
                except KeyError:
                    relacao_usuario_match = {usuario["username"]: "0%"}
                    matchs_dict.update(relacao_usuario_match)

        return matchs_dict

    except HTTPException as exception:
        raise exception
