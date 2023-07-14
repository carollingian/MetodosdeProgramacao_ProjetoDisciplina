# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from typing import Optional
from pydantic import BaseModel

class GrupoMensagemModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de Chat de grupo """
    idGrupo: int
class MensagemModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de menssage de grupo """
    idUsuario: Optional[int]
    timestamp: Optional[str]
    message: str
