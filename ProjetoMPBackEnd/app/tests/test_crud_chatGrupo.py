# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

""" ------------------------- TESTE GET -------------------------  """

def test_busca_mensagem_por_id_sucesso():
    """Teste"""
    response = client.get("/ChatGrupo/grupos_mensagens/1/mensagens/")
    assert response.status_code == 404
    assert response.json()

def test_busca_mensagem_idgrupo_erro():
    """Teste"""
    response = client.get("/ChatGrupo/grupos_mensagens/1000000/mensagens/")
    assert response.status_code == 404
    assert response.json()

def test_usuario_no_grupo():
    """Teste"""
    response = client.get("/ChatGrupo/usuario_grupo/254/5/")
    assert response.status_code == 404
    assert response.json()

