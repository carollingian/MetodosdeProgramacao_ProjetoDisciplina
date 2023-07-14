"""Importando módulos básicos para conexão com DBcd"""
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app.src.models.chatPrivado_model import ChatPrivadoModel
from app.src.config_db import bancoAtlax
from datetime import datetime
from app.src.utils.busca_usuario import busca_usuario_id

router = APIRouter(
    prefix="/ChatPrivado",
    tags=["Chat Privado"],
    responses={404: {"description": "Not Found"}}
)

# ------------------------- READ -------------------------


@router.get("/buscar-mensagens/{idRUsuario}/{idDUsuario}")
async def buscar_mensagens(idRUsuario: int, idDUsuario: int):
    """Lista Mensagens do chat.
    Assertiva de entrada: IDs dos usuários 
    (ID que envia as mensagens e o ID que recebe as mensagens)
    
    Assertiva de saída: Mensagens armazenados na base de dados."""
        
    usuarios = bancoAtlax.reference("/Usuarios").get()
    try:
        busca_usuario_id(idRUsuario, usuarios)
        busca_usuario_id(idDUsuario, usuarios)
        todasMensagens = bancoAtlax.reference('/ChatPrivado').get()
        listaMensagens = []
        for key, mensagem in todasMensagens.items():
            try:
                if (mensagem["idRUsuario"] == idDUsuario and mensagem["idDUsuario"] == idRUsuario) or (mensagem["idRUsuario"] == idRUsuario and mensagem["idDUsuario"] == idDUsuario):
                    listaMensagens.append(mensagem)
            except KeyError:
                pass
        return listaMensagens

    except HTTPException as exception:
        raise exception
    

# ------------------------- CREATE -------------------------


@router.post("/enviar-mensagem/{idRUsuario}/{idDUsuario}")
async def enviar_mensagem(dados: ChatPrivadoModel, idRUsuario: int, idDUsuario: int):
    """Cria um Chat
    Assertivas de Entrada: ID do usuário que enviara a mensagem e
    ID do usuário que recebera a mensagem.
    
    Assertiva de saída: A mensagem é criado no banco de dados
    Em caso de erro retorna: 404(Usuário não encontrado.)"""
     
    usuarios = bancoAtlax.reference("/Usuarios").get()
    try:
        busca_usuario_id(idRUsuario, usuarios)
        busca_usuario_id(idDUsuario, usuarios)
        total_id = bancoAtlax.reference("/ChatPrivado/Total").child("num").get()
        body = json.loads(dados.json())
        body["idRUsuario"] = idRUsuario
        body["idDUsuario"] = idDUsuario
        body["timestamp"] = str(datetime.now()) if body["timestamp"] == None else body["timestamp"]
        bancoAtlax.reference("/ChatPrivado").push(body)
        bancoAtlax.reference("/ChatPrivado").child("Total").update({"num": total_id + 1})      
        return JSONResponse(
            status_code=201,
            content={"message": "Mensagem enviada com sucesso!"}
        )
    except HTTPException as exception:
        raise exception
