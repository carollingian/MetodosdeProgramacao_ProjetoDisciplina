"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

def test_relatorio_sucesso():
    response = client.get("/relatorio/1")

    assert response.status_code == 200

def test_relatorio_erro():
    response = client.get("/relatorio/3")

    assert response.status_code == 403