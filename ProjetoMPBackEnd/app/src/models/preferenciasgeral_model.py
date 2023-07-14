# pylint: disable=no-name-in-module
# pylint: disable=no-self-argument
"""Modulos para definição do modelo"""
from pydantic import BaseModel


class PreferenciasGeralModel(BaseModel):  # pylint: disable=too-few-public-methods
    """Modelo de preferencias """
    preferencias: list
