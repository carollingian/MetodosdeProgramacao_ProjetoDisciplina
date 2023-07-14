# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

""" ----------------------------Teste get------------------------------------ """
def test_lista_match_grupo_por_usuario_sucesso():
    """Teste"""
    response = client.get("/Match/lista-match-grupo-por-usuario/2")
    assert response.status_code == 200

def test_lista_match_usuarios_por_usuario_sucesso():
    """Teste"""
    response = client.get("/Match/lista-match-usuarios-por-usuario/2")
    assert response.status_code == 200
