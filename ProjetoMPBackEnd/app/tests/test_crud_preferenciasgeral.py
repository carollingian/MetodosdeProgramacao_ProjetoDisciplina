# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

""" ----------------------------Teste get------------------------------------ """
def test_lista_preferencias():
    """Test"""
    response = client.get("/Preferencias/lista-preferencias")
    assert response.status_code == 200
    assert response.json()

def test_update_preferencias():
    """Test"""
    response = client.put("/Preferencias/atualiza-preferencias", json={"preferencias": []})
    assert response.status_code == 200

# def test_preferencias_geral_erro():
#     """"Teste"""
#     response = client.get("/Preferencias/preferenciasgeral")
#     assert response.status_code == 404
#     assert response.json()


# """ ------------------------- TESTE POST ------------------------- """
# def test_cria_preferencias_sucesso():
#     """Teste"""
#     response = client.post("/Preferencias/criar-preferencias/admin",
#                            json = {"NomePreferencias": "TestePraCriarPreferencia"})
#     assert response.status_code == 201
#     assert response.json() == {
#         "message": "Preferência criada com sucesso!"
#     }

# def test_cria_preferencias_erro_preferencia_ja_existe():
#     """Teste"""
#     response = client.post("/Preferencias/criar-preferencias/admin",
#                            json = {"NomePreferencias": "Terror"})
#     assert response.status_code == 409
#     assert response.json() == {
#         "detail": "Erro: Preferência Terror já existe."
#     }

# def test_cria_preferencias_erro_nao_admin():
#     """Teste"""
#     response = client.post("/Preferencias/criar-preferencias/0",
#                            json = {"NomePreferencias": "TestePraCriarPreferencia"})
#     assert response.status_code == 401
#     assert response.json() == {
#         "detail": "Erro: Usuário não é admin."
#     }


# """ ------------------------- TESTE DELETE -------------------------"""
# def test_deleta_preferencias_sucesso():
#     """Teste"""
#     response = client.delete("/Preferencias/deletar-preferencias/admin/TestePraCriarPreferencia")
#     assert response.status_code == 200
#     assert response.json() == {
#         "message": "Preferência deletada com sucesso!"
#     }

# def test_deleta_preferencias_erro_preferencia_nao_existe():
#     """Teste"""
#     response = client.delete("/Preferencias/deletar-preferencias/admin/EsseNaoExiste")
#     assert response.status_code == 404
#     assert response.json() == {
#         "detail": "Erro: Preferência EsseNaoExiste não existe."
#     }

# def test_deleta_preferencias_erro_nao_admin():
#     """Teste"""
#     response = client.delete("/Preferencias/deletar-preferencias/0/TestePraCriarPreferencia")
#     assert response.status_code == 401
#     assert response.json() == {
#         "detail": "Erro: Usuário não é admin."
#     }
