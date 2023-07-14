# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app

client = TestClient(app)

""" ----------------------------Teste create------------------------------------ """
def test_criar_usuario_sucesso():
    """Teste"""
    response = client.post("/Usuarios/criar-usuario",
                         json={
                            "id": 989,
                            "username": "testeCriarUsuario",
                            "senha": 999999,
                            "admin": 0,
                            "preferencias": [0],
                            "amigos": [1],
                            "bloqueados": [0],
                            "grupos": [0]
                            }
                        )
    assert response.status_code == 201
    assert response.json() == {
                    "message": "Usuário adicionado com sucesso!",
                    }

def test_criar_usuario_erro_ja_existe():
    """Teste"""
    response = client.post("/Usuarios/criar-usuario",
                         json={
                            "id": 989,
                            "username": "testeCriarUsuario",
                            "senha": 999999,
                            "admin": 0,
                            "preferencias": [0],
                            "amigos": [1],
                            "bloqueados": [0],
                            "grupos": [0]
                            }
                        )
    assert response.status_code == 409
    assert response.json() == {
                        "detail": "Erro: Usuário de username testeCriarUsuario já existe."
                        }
"""----------------------------Teste Get------------------------------------"""

def test_lista_usuarios_sucesso():
    """Teste"""
    response = client.get("/Usuarios/lista-usuarios")
    assert response.status_code == 200
    assert response.json()

def test_lista_usuarios_erro():
    """Teste"""
    response = client.get("/Usuarios/listausuarios")
    assert response.status_code == 404
    assert response.json()

def test_lista_usuario_por_id_sucesso():
    """Teste"""
    response = client.get("/Usuarios/lista-usuario-por-id/1")
    assert response.status_code == 200
    assert response.json()

def test_lista_usuario_por_username_sucesso():
    """Teste"""
    response = client.get("/Usuarios/lista-usuario-por-username/testeCriarUsuario")
    assert response.status_code == 200
    assert response.json()


def test_lista_usuario_por_id_erro_404():
    """Teste"""
    response = client.get("/Usuarios/lista-usuario-por-id/0")
    assert response.status_code == 404
    assert response.json() == {
                    "detail": "Erro: Usuário de id 0 não encontrado.",
                    }

def test_lista_usuario_por_username_erro_404():
    """Teste"""
    response = client.get("/Usuarios/lista-usuario-por-username/naovaidarnao")
    assert response.status_code == 404
    assert response.json() == {
                    "detail": "Erro: Usuário de username naovaidarnao não encontrado.",
                    }
"""----------------------------Teste Put------------------------------------"""

def test_update_usuario_sucesso():
    """Teste para atualizar usuário"""
    response = client.put("/Usuarios/update/2",
                           json={
                               "senha": 888888,
                               "preferencias": [1,2],
                               "amigos": [1],
                               "bloqueados": [0],
                               "grupos": [1]
                           })
    assert response.status_code == 200
    assert response.json() == {
                                "admin": 0,
                                "amigos": [1],
                                "bloqueados": [0],
                                "grupos": [1],
                                "id": 2,
                                "preferencias": [1,2],
                                "senha": 888888,
                                "username": "zezin"
                            }

    client.put("/Usuarios/update/2",
                           json={
                               "senha": 123456,
                               "preferencias": [1],
                               "amigos": [1],
                               "bloqueados": [0],
                               "grupos": [1]
                           })

def test_update_usuario_erro():
    """Teste"""
    response = client.put("/Usuarios/update/0",
                          json={"senha": 1111})

    assert response.status_code == 404

def test_update_usuario_bad_request():
    """Teste"""
    response = client.put("/Usuarios/update/0",
                          json={"senha": 0})

    assert response.status_code == 400

"""----------------------------Teste delete------------------------------------"""

def test_deletar_usuario_sucesso():
    """Teste"""
    response = client.delete("/Usuarios/deletar-usuario/testeCriarUsuario")
    assert response.status_code == 200

def test_deletar_usuario_erro():
    """Teste"""
    response = client.delete("/Usuarios/deletar-usuario/888")

    assert response.status_code == 404
    assert response.json() == {
                        "detail": "Usuário não encontrado."
                        }
