"""Importando módulos básicos para conexão com DBcd"""
import json
from typing import Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app.src.models.grupo_model import GrupoModel
from app.src.config_db import bancoAtlax
from app.src import exceptions
from app.src.utils.busca_grupo import busca_grupo_id, busca_grupo_nome
from app.src.utils.busca_usuario import busca_usuario_username

router = APIRouter(
    prefix="/Grupos",
    tags=["Grupos"],
    responses={404: {"description": "Not Found"}}
)


# ------------------------- CREATE -------------------------


@router.post("/add-grupo/{usr_name}/{senha}")
async def add_grupo(dados: GrupoModel, usr_name: str, senha: int):
    """Cria um Grupo
    Assertivas de Entrada: Username do usuário e senha, para checar
    se é admin, dados do grupo em formato json:{"id: "int",
    "nome": "string", "membros": "list", "preferencias": "list"}.

    Assertiva de saída: O grupo é criado no banco de dados.

    Em caso de erro retorna: 404(Usuário não encontrado.),
    401(Usuário não é admin.), 409(Grupo de nome nome_do_grupo
    já existente.)"""

    admin = 0
    usuarios = bancoAtlax.reference("/Usuarios").get()
    if usr_name is None:
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            break

        if usr_name == usuario['username']:
            if usuario['admin'] == 1:
                if senha == usuario['senha']:
                    admin = 1
    if admin == 0:
        raise HTTPException(
            status_code=401,
            detail="Erro: Usuário não é admin."
        )

    grupos = bancoAtlax.reference("/Grupos").get()
    total_id = bancoAtlax.reference("/Grupos/Total").child("num").get()
    dados.id = total_id + 1  # incrementa id
    body = json.loads(dados.json())

    for key, grupo_existente in grupos.items():
        if key == "Total":
            break

        if dados.nome == grupo_existente['nome']:
            raise HTTPException(
                status_code=409,
                detail=f"Erro: Grupo de nome {dados.nome} já existe."
            )

    bancoAtlax.reference("/Grupos").push(body)
    bancoAtlax.reference("/Grupos").child("Total").update({"num": dados.id})

    return JSONResponse(
        status_code=201,
        content={"message": "Grupo criado com sucesso!"}
    )


# ------------------------- READ -------------------------


@router.get("/lista-grupos",
            response_model=Optional[list[GrupoModel]])
async def lista_grupos():
    """Lista Grupos.

    Assertiva de entrada: Nenhum parâmetro.

    Assertiva de saída: Retorna grupos armazenados na base de dados."""

    response = []
    grupos = bancoAtlax.reference("/Grupos").get()
    for key, grupo in grupos.items():
        if key == "Total":
            continue
        response.append(grupo)
    return response


@router.get("/busca-grupos-por-id/{id_grupo}",
            response_model=Optional[GrupoModel])
async def busca_grupos_por_id(id_grupo: int):
    """Busca Grupo por ID.

    Assertiva de entrada: ID do Grupo.

    Assertiva de saída: Retorna o grupo com id igual.

    Em caso de erro retorna 404(Grupo de id 'id_grupo'
    não encontrado.)"""
    grupos = bancoAtlax.reference("/Grupos").get()
    try:
        return busca_grupo_id(id_grupo, grupos)

    except HTTPException as exception:
        raise exception


@router.get("/busca-grupos-por-nome/{n_grupo}",
            response_model=Optional[GrupoModel])
async def busca_grupos_por_nome(n_grupo: str):
    """Busca Grupo por nome.

    Assertiva de entrada: Nome do grupo.

    Assertiva de saída: Grupo procurado.

    Em caso de erro retorn 404(Grupo de nome
    'nome_grupo' não encontrado.)"""
    grupos = bancoAtlax.reference("/Grupos").get()
    try:
        return busca_grupo_nome(n_grupo, grupos)

    except HTTPException as exception:
        raise exception


@router.get("/list-grupos-pref/{preferencia}",
            response_model=Optional[list[GrupoModel]])
async def lista_grupos_por_preferencia(preferencia: str):
    """Lista grupos por preferência.

    Assertiva de entrada: Preferência à ser pesquisada.

    Assertiva de saída: Lista de nomes de grupos com a
    preferencia desejada.

    Em caso de erro retorna 404(Nenhum grupo encontrado.)"""

    grupos = bancoAtlax.reference("/Grupos").get()
    resultado = []
    if preferencia is None:
        raise exceptions.ERRO_CAMPO
    for key, grupo in grupos.items():
        if key == "Total":
            break
        if preferencia in grupo['preferencias']:
            resultado.append(grupo)
    if not resultado:
        raise HTTPException(
            status_code=404,
            detail="Nenhum grupo encontrado."
        )
    return resultado


@router.get("/list-membros/{n_grupo}",
            response_model=Optional[list[str]])
async def grupo_lista_membros(n_grupo: str):
    """Lista membros de um grupo.

    Assertiva de entrada: Nome do grupo.

    Assertiva de saída: Membros do grupo.

    Em caso de erro retorna 404(Grupo não encontrado.)."""
    grupos = bancoAtlax.reference("/Grupos").get()
    if n_grupo is None:
        raise exceptions.ERRO_CAMPO
    for key, grupo in grupos.items():
        if key == "Total":
            break
        if n_grupo == grupo['nome']:
            return grupo['membros']
    raise HTTPException(
        status_code=404,
        detail="Grupo não encontrado."
    )


# ------------------------- UPDATE -------------------------


@router.put("/att-grupo/del-membro/{n_grupo}/{usr_name}",
            response_model=Optional[GrupoModel])
async def atualizar_grupo_deletar_membro(n_grupo: str, usr_name: str):
    """Remove um membro de um grupo.

    Assertiva de entrada: username do usuario a ser removido, nome do grupo.

    Assertiva de saída: o grupo é atualizado no banco e retornado na resposta
    em caso de sucesso.

    Em caso de erro retorna 404(Usuário não encontrado.),
    404(Grupo não encontrado.).
    """
    grupos = bancoAtlax.reference("/Grupos").get()
    usuarios = bancoAtlax.reference("/Usuarios").get()

    if usr_name is None:
        raise exceptions.ERRO_CAMPO
    if n_grupo is None:
        raise exceptions.ERRO_CAMPO

    for key, grupo in grupos.items():
        if key == "Total":
            break

        if n_grupo == grupo['nome']:
            for membro in grupo['membros']:
                if membro == usr_name:
                    grupo['membros'].remove(usr_name)
                    grupo_att = grupo
                    bancoAtlax.reference("/Grupos").child(
                        str(key)).update(grupo_att)
                    for chave, usuario in usuarios.items():
                        if chave == "Total":
                            break
                        if usr_name == usuario['username']:
                            usr_att = usuario
                            list_grupos = usr_att['grupos']
                            for elemento in list_grupos:
                                if elemento == n_grupo:
                                    list_grupos.remove(elemento)
                            usr_att['grupos'] = list_grupos
                            bancoAtlax.reference("/Usuarios").child(
                                str(chave)).update(usr_att)
                            return bancoAtlax.reference("/Grupos").child(
                                str(key)).get()
            raise HTTPException(status_code=404,
                                detail="Erro: Membro não encontrado.")
    raise HTTPException(status_code=404,
                        detail="Erro: Grupo não encontrado.")


@router.put("/att-grupo/add-membro/{n_grupo}/{usr_name}/",
            response_model=Optional[GrupoModel])
async def atualizar_grupo_adicionar_membro(n_grupo: str, usr_name: str,):
    """Adiciona um membro à um grupo.

    Assertiva de entrada: nome do grupo, username do usuario à ser adicionado.

    Assertiva de saída: o grupo é atualizado no banco e retornado na resposta
    em caso de sucesso.

    Em caso de erro retorna 404(Grupo não encontrado.), 409(Membro já
    registrado no grupo.), 404(Usuário não encontrado).
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    grupos = bancoAtlax.reference("/Grupos").get()
    busca_usuario_username(usr_name, usuarios)

    if usr_name is None:
        raise exceptions.ERRO_CAMPO
    if n_grupo is None:
        raise exceptions.ERRO_CAMPO

    for key, grupo in grupos.items():
        if key == "Total":
            break

        if n_grupo == grupo['nome']:
            for membro in grupo['membros']:
                if membro == usr_name:
                    raise HTTPException(
                        status_code=409,
                        detail="Erro: Membro já registrado no grupo."
                    )
            grupo['membros'].append(usr_name)
            grupo_att = grupo
            bancoAtlax.reference("/Grupos").child(str(key)).update(grupo_att)
            for chave, usuario in usuarios.items():
                if chave == "Total":
                    break
                if usr_name == usuario['username']:
                    usr_att = usuario
                    usr_att['grupos'].append(n_grupo)
                    bancoAtlax.reference("/Usuarios").child(
                        str(chave)).update(usr_att)
            return bancoAtlax.reference("/Grupos").child(str(key)).get()
    raise HTTPException(status_code=404,
                        detail="Erro: Grupo não encontrado.")


# ------------------------- DELETE -------------------------


@router.delete("/del-grupo/{usr_name}/{senha}/{n_grupo}")
async def deletar_grupo(usr_name: str, senha: int, n_grupo: str):
    """Deleta o grupo se o usuário for admin e o grupo for válido.

    Assertivas de Entrada: Nome do usuário e senha, nome do grupo a
    ser deletado.

    Assertivas de Saída: O grupo é deletado no banco de dados.

    Em caso de erro retorna 404 (Grupo não encontrado.), 404 (Usuário não
    encontrado.), 401 (Usuário não é admin.)."""

    admin = 0
    usuarios = bancoAtlax.reference("/Usuarios").get()
    grupos = bancoAtlax.reference("/Grupos").get()

    if usr_name is None:
        raise exceptions.ERRO_CAMPO

    for key, usuario in usuarios.items():
        if key == "Total":
            break

        if usr_name == usuario['username']:
            if usuario['admin'] == 1:
                if senha == usuario['senha']:
                    admin = 1
    if admin == 0:
        raise HTTPException(
            status_code=401,
            detail="Erro: Usuário não é admin."
        )

    for key, grupo in grupos.items():
        if key == "Total":
            break

        if n_grupo == grupo['nome']:
            bancoAtlax.reference("/Grupos").child(str(key)).delete()
            return JSONResponse(
                status_code=200,
                content={"message": "Grupo deletado com sucesso."}
                )
    raise HTTPException(
        status_code=404,
        detail="Grupo não encontrado."
    )
