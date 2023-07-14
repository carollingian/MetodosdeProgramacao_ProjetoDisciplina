# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

# ------------------------- TESTE GET ------------------------- 


def test_busca_mensagem_por_id_sucesso():
    """Teste"""
    response = client.get("/ChatPrivado/buscar-mensagens/5/3")
    assert response.status_code == 200
    assert response.json()


def test_busca_mensagem_idR_erro():
    """Teste"""
    response = client.get("/ChatPrivado/buscar-mensagens/300/1")
    assert response.status_code == 404
    assert response.json()


def test_busca_mensagem_idD_erro():
    """Teste"""
    response = client.get("/ChatPrivado/buscar-mensagens/1/300")
    assert response.status_code == 404
    assert response.json()


def test_busca_mensagem_ids_erro():
    """Teste"""
    response = client.get("/ChatPrivado/buscar-mensagens/200/300")
    assert response.status_code == 404
    assert response.json()

# ------------------------- TESTE POST -------------------------


def test_cria_chat_sucesso():
    """Teste"""
    response = client.post("/ChatPrivado/enviar-mensagem/5/3",
                           json={
                                    "mensagem": "testando"
                           })
    assert response.status_code == 201
    assert response.json() == {
        "message": "Mensagem enviada com sucesso!"
    }


def test_cria_chat_idR_erro():
    """Teste"""
    response = client.post("/ChatPrivado/enviar-mensagem/300/1",
                           json={
                                    "mensagem": "test1"
                           })
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Usuário de id 300 não encontrado."
    }


def test_cria_chat_idD_erro():
    """Teste"""
    response = client.post("/ChatPrivado/enviar-mensagem/1/300",
                           json={
                                    "mensagem": "test2"
                           })
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Usuário de id 300 não encontrado."
    }


def test_cria_chat_ids_erro():
    """Teste"""
    response = client.post("/ChatPrivado/enviar-mensagem/500/302",
                           json={
                                    "mensagem": "test3"
                           })
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Usuário de id 500 não encontrado."
    }