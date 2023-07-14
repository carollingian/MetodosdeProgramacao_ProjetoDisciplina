"""Modulo para gerar erro HTTP"""
from fastapi.exceptions import HTTPException

ERRO_CAMPO = HTTPException(
        status_code=400,
        detail="Erro: Campos não foram corretamente preenchidos"
        )

ERRO_NAO_ESPERADO = HTTPException(
        status_code=900,
        detail="Erro não esperado"
        )
