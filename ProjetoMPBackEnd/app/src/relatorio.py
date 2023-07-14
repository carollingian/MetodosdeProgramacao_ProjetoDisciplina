"""Importando módulos básicos para conexão com DBcd"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.src.utils.busca_usuario import busca_usuario_id
from app.src.config_db import bancoAtlax

router = APIRouter(
    prefix="/relatorio",
    tags=["Relatório"]
)


@router.get("/{id_usuario}")
async def relatorio(id_usuario: int):
    """
    Gera relatório

    Asseriva de entrada: recebe o id do usuário para confirmar
    que é um administrador

    Assertiva de saída: Gera um relatório e envia um .txt baixável
    """
    usuarios = bancoAtlax.reference("/Usuarios").get()
    usuario_base = busca_usuario_id(id_usuario, usuarios)
    if usuario_base["admin"] == 1:
        total_usuarios = 0
        total_preferencias = 0
        total_grupos = 0
        total_chat_privado = 0
        for usuario in usuarios.values():
            total_usuarios += 1

        total_preferencias = len(bancoAtlax.reference("/Preferencias").get()["preferencias"])
        grupos = bancoAtlax.reference("/Grupos").get()

        for key in grupos.items():
            total_grupos += 1
        
        todas_mensagens = bancoAtlax.reference('/ChatPrivado').get()       
        for key in todas_mensagens.items():
            total_chat_privado += 1

        with open("relatorio.txt", "a") as arquivo:
            arquivo.truncate(4)
            lines = f"Total de usuários cadastrados: {total_usuarios}\n"    
            lines += f"Total de preferencias cadastradas: {total_preferencias}\n"
            lines += f"Total de Grupos cadastrados: {total_grupos}\n"
            lines += f"Total de de mensagens privadas enviadas: {total_chat_privado}"

            arquivo.write(lines)

        return FileResponse(path="relatorio.txt", media_type="text/plain", filename="relatorio")
    raise HTTPException(status_code=403, detail="Usuário não é administrador")
