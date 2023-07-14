# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from typing import Optional
from pydantic import BaseModel


class UsuarioModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de Usuario"""
    id: Optional[int] = 0
    username: str
    senha: int
    admin: Optional[int] = 0
    preferencias: Optional[list] = []
    amigos: Optional[list] = []
    bloqueados: Optional[list] = []
    grupos: Optional[list] = []


class UsuarioUpdateModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de Update de Usuario"""
    senha: Optional[int]
    admin: Optional[int] = 0
    preferencias: Optional[list]
    amigos: Optional[list]
    bloqueados: Optional[list]
    grupos: Optional[list]
