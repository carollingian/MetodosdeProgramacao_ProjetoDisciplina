"""Importando módulos básicos para conexão com DBcd"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.src.models.preferenciasgeral_model import PreferenciasGeralModel
from app.src.config_db import bancoAtlax

router = APIRouter(
    prefix="/Preferencias",
    tags=["Preferencias"],
    responses={404: {"description": "Not Found"}}
)


@router.get("/lista-preferencias")
async def get_lista_preferencias():
    """Lista Preferências Geral.

    Assertiva de entrada: não requer parâmetros de entrada

    Assertiva de saída: Lista de preferências armazenadas
    na base de dados.
    """
    preferencias = bancoAtlax.reference("/Preferencias").get()
    return preferencias["preferencias"]


@router.put("/atualiza-preferencias")
async def update_preferencias(lista_preferencias: PreferenciasGeralModel):
    """Atualiza as preferencias

    Assertiva de entrada: um objeto com uma lista de preferências,
    com valores atualizados pelo admin.

    Assertiva de saída: Atualiza o banco de dados com as preferências
    atualizadas.

    """
    if lista_preferencias.preferencias == []:
        return JSONResponse(status_code=200, content="Nada mudou...")
    dados_atualizados = lista_preferencias.dict()

    # Atualiza os dados
    bancoAtlax.reference("/Preferencias").update(dados_atualizados)
    return JSONResponse(status_code=200, content="Preferencias atualizadas.")
