# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ChatPrivadoModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de Chat Privado"""
    idRUsuario: Optional[int]
    idDUsuario: Optional[int]
    timestamp: Optional[datetime]
    mensagem: str
