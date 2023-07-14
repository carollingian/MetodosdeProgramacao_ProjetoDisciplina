"""Exceções"""
from fastapi.exceptions import HTTPException
from app.src import exceptions


def busca_usuario_id(id_usuario, usuarios):
    """Realiza busca de usuario por id
    Assertiva de entrada: id_usuario - id do usuario procurado
                          usuarios - lista de usuarios
    Assertiva de saída: usuario - usuario encontrado ou erro 404 (NotFound)
    """
    if id_usuario is None:
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            break

        if id_usuario == usuario['id']:
            return usuario

    raise HTTPException(
                status_code=404,
                detail=f"Erro: Usuário de id {id_usuario} não encontrado."
                )


def busca_usuario_username(username, usuarios):
    """Realiza busca de usuario por username
    Assertiva de entrada: username - id do usuario procurado
                          usuarios - lista de usuarios
    Assertiva de saída: usuario - usuario encontrado ou erro 404 (NotFound)
    """
    if username is None:
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            break

        if username == usuario['username']:
            return usuario

    raise HTTPException(
                status_code=404,
                detail=f"Erro: Usuário de username {username} não encontrado."
                )
