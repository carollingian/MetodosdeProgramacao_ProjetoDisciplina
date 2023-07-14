# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from typing import Optional
from pydantic import BaseModel


class GrupoModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de grupo """
    id: Optional[int]
    nome: str
    membros: list
    preferencias: list


class GrupoUpdateModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de grupo"""
    membros: Optional[list]
