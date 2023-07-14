# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from pydantic import BaseModel


class Login(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de Usuario"""
    username: str
    senha: int
