"""Importando módulos básicos para conexão com DB"""
import json
from typing import Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app.src.models.usuario_model import UsuarioModel, UsuarioUpdateModel
from app.src.config_db import bancoAtlax
from app.src import exceptions
from app.src.utils.busca_usuario import busca_usuario_id
from app.src.utils.busca_usuario import busca_usuario_username

router = APIRouter(
    prefix="/Usuarios",
    tags=["Usuarios"],
    responses={404: {"description": "Not Found"}}
)

# EU 1 - Recomendação de Grupos e Usuários


@router.get("/lista-usuarios", response_model=Optional[list[UsuarioModel]])
async def lista_usuarios():
    """Lista usuarios

    Assertivas de entrada: Nenhum parâmetro deve ser passado

    Assertivas de saída: Coleta os usuários no banco de dados
        Retorna uma lista com as informações de todos o usuários
    """
    response = []
    usuarios = bancoAtlax.reference("/Usuarios").get()
    for key, usuario in usuarios.items():
        if key == "Total":
            continue

        response.append(usuario)

    return response


@router.get("/lista-usuario-por-id/{id_usuario}",
            response_model=Optional[UsuarioModel])
async def lista_usuario_por_id(
        id_usuario: int
        ):
    """Busca um usuario por id

    Assertivas de entrada:  id do usuário a ser procurado

    Assertivas de saída: Faz uma busca pelo id no banco de dados
        Retorna as informações do usuário
        Em caso de erro retorna 404 Not Found
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    try:
        return busca_usuario_id(id_usuario, usuarios)

    except HTTPException as exception:
        raise exception


@router.get("/lista-usuario-por-username/{username}",
            response_model=Optional[UsuarioModel])
async def lista_usuario_por_username(
        username: str
        ):
    """Busca um usuario por username

    Assertivas de entrada:  username do usuário a ser procurado

    Assertivas de saída: Faz uma busca pelo username no banco de dados
        Retorna as informações do usuário
        Em caso de erro retorna 404 Not Found
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()

    try:
        return busca_usuario_username(username, usuarios)
    except HTTPException as exception:
        raise exception


@router.post("/criar-usuario",
             response_model=Optional[UsuarioModel])
async def criar_usuario(dados: UsuarioModel):
    """
        Cria um usuario

        Assertiva de entrada: recebe as informações do UsuarioModel,
        sendo obrigatórios username e senha.

        Assertiva de saída: retorna uma mensagem de sucesso caso o username não
        exista no sistema.
        Caso o username exista, retorna (409)
        Conflict para username cadastrado.
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    total_id = bancoAtlax.reference("/Usuarios/Total").child("num").get()
    dados.id = total_id + 1  # incrementa id
    body = json.loads(dados.json())

    for key, usuario_existente in usuarios.items():
        if key == "Total":
            continue

        if dados.username == usuario_existente['username']:
            raise HTTPException(
                status_code=409,
                detail=f"Erro: Usuário de username {dados.username} já existe."
            )

    bancoAtlax.reference("/Usuarios").push(body)
    bancoAtlax.reference("/Usuarios").child("Total").update({"num": dados.id})

    return JSONResponse(
        status_code=201,
        content={"message": "Usuário adicionado com sucesso!"}
    )


@router.put("/update/{id_usuario}", response_model=Optional[UsuarioModel])
async def atualizar_usuario(id_usuario: int, dados: UsuarioUpdateModel):
    """
    Atualiza o usuario

    Assertiva de entrada: id do usuário e json com os dados que deseja alterar,
     excluindo username e id

    Assertiva de saída: o usuario é atualizado no banco e retornado na resposta
    em caso de sucesso.

    Em caso de erro, são retornado 400 (senha inválida), 404
    (Usuário não encontrado)

    """
    usuarios = bancoAtlax.reference("/Usuarios").get()

    if dados.senha == 0:
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            continue

        if id_usuario == usuario['id']:
            usuario_armazenado = usuario
            modelo_usuario = UsuarioModel(**usuario_armazenado)

            # Exclui os campos não preenchidos do modelo para não atualizar
            dados_att = dados.dict(exclude_unset=True)
            user_att = json.loads(modelo_usuario.copy(update=dados_att).json())

            # Atualiza os dados
            bancoAtlax.reference("/Usuarios").child(str(key)).update(user_att)

            return bancoAtlax.reference("/Usuarios").child(str(key)).get()
    raise HTTPException(status_code=404,
                        detail={"message": "Usuario não encontrado"})


@router.delete("/deletar-usuario/{username}")
async def deletar_usuario(username: str):
    """
    Deleta um usuario

    Assertiva de entrada: username do usuário para deletar

    Assertiva de saída: confirmação da deleção do usuário ou erro
    (404) Not Found.

    """
    if username is None:
        raise exceptions.ERRO_CAMPO

    usuarios = bancoAtlax.reference("/Usuarios").get()

    for key, usuario in usuarios.items():
        if key == "Total":
            continue

        if username == usuario['username']:
            bancoAtlax.reference("/Usuarios").child(str(key)).delete()
            return JSONResponse(
                status_code=200,
                content={"message": "Usuário deletado com sucesso."}
                )
    raise HTTPException(
        status_code=404,
        detail="Usuário não encontrado."
    )
