# pylint: disable=pointless-string-statement
"""Modulos importando o FastAPI"""
from fastapi.testclient import TestClient
from app.src.main import app


client = TestClient(app)

# ------------------------- TESTE GET -------------------------


def test_lista_grupos_sucesso():
    """"Teste"""
    response = client.get("/Grupos/lista-grupos")
    assert response.status_code == 200
    assert response.json()


def test_lista_grupos_erro():
    """"Teste"""
    response = client.get("/Grupos/listagrupos")
    assert response.status_code == 404
    assert response.json()


def test_busca_grupo_por_id_sucesso():
    """Teste"""
    response = client.get("/Grupos/busca-grupos-por-id/6")
    assert response.status_code == 200
    assert response.json()


def test_busca_grupo_por_id_erro():
    """Teste"""
    response = client.get("/Grupos/busca-grupos-por-id/213214")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Grupo de id 213214 não encontrado."
    }


def test_busca_grupo_por_nome_sucesso():
    """Teste"""
    response = client.get("/Grupos/busca-grupos-por-nome/Romance")
    assert response.status_code == 200
    assert response.json()


def test_busca_grupo_por_nome_erro():
    """Teste"""
    response = client.get("/Grupos/busca-grupos-por-nome/grupo3542")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Grupo de nome grupo3542 não encontrado."
    }


def test_lista_grupo_por_preferencia_sucesso():
    """Teste"""
    response = client.get("/Grupos/list-grupos-pref/Romance")
    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 6,
            "membros": [
                "Jô Soares"
            ],
            "nome": "Romance",
            "preferencias": [
                "Romance"
            ]
        }
        ]


def test_lista_grupo_por_preferencia_erro_nenhum_grupo_com_preferencia():
    """Teste"""
    response = client.get("/Grupos/list-grupos-pref/gurilagrande")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Nenhum grupo encontrado."
    }


def test_grupo_lista_membros_sucesso():
    """Teste"""
    response = client.get("/Grupos/list-membros/Romance")
    assert response.status_code == 200
    assert response.json()


def test_grupo_lista_membros_erro_grupo_nao_encontrado():
    """Teste"""
    response = client.get("/Grupos/list-membros/Gasdasd")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Grupo não encontrado."
    }


# ------------------------- TESTE POST -------------------------


def test_cria_grupo_sucesso():
    """Teste"""
    response = client.post("/Grupos/add-grupo/admin/123456",
                           json={
                               "id": 99,
                               "nome": "Teste",
                               "membros": ["Testinho", "Testão"],
                               "preferencias": ["Testezada"]
                           })
    assert response.status_code == 201
    assert response.json() == {
        "message": "Grupo criado com sucesso!"
    }


def test_cria_grupo_erro_nao_admin():
    """Teste"""
    response = client.post("/Grupos/add-grupo/0/5",
                           json={
                              "id": 22,
                              "nome": "Ação",
                              "membros": ["Julio, Julia"],
                              "preferencias": ["Ação"]
                            })
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Erro: Usuário não é admin."
    }


def test_cria_grupo_erro_nome_existente():
    """Teste"""
    response = client.post("/Grupos/add-grupo/admin/123456",
                           json={
                               "id": 22,
                               "nome": "qualquernome",
                               "membros": ["Jubileu", "Carminha"],
                               "preferencias": ["Ação"]
                               })
    assert response.status_code == 409
    assert response.json() == {
        "detail": "Erro: Grupo de nome qualquernome já existe."
    }


# ------------------------- TESTE PUT -------------------------


def test_grupo_adicionar_membro_sucesso():
    """Teste"""
    response = client.put("/Grupos/att-grupo/add-membro/Romance/zezin")
    assert response.status_code == 200
    assert response.json() == {
        "id": 6,
        "membros": [
            "Jô Soares", "zezin"
        ],
        "nome": "Romance",
        "preferencias": [
            "Romance"
        ]
    }


def test_grupo_adicionar_membro_erro_membro_ja_registrado():
    """Teste"""
    response = client.put("/Grupos/att-grupo/add-membro/Romance/zezin")
    assert response.status_code == 409
    assert response.json() == {
        "detail": "Erro: Membro já registrado no grupo."
    }


def test_grupo_adicionar_membro_erro_grupo_nao_encontrado():
    """Teste"""
    response = client.put("/Grupos/att-grupo/add-membro/mamacos/zezin")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Grupo não encontrado."
    }


def test_grupo_remover_membro_sucesso():
    """Teste"""
    response = client.put("/Grupos/att-grupo/del-membro/Romance/zezin")
    assert response.status_code == 200
    assert response.json() == {
        "id": 6,
        "membros": [
            "Jô Soares"
        ],
        "nome": "Romance",
        "preferencias": [
            "Romance"
        ]
    }


def test_grupo_remover_membro_erro_membro_nao_encontrado():
    """Teste"""
    response = client.put("/Grupos/att-grupo/del-membro/Romance/carlin")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Membro não encontrado."
    }


def test_grupo_remover_membro_erro_grupo_nao_encontrado():
    """Teste"""
    response = client.put("/Grupos/att-grupo/del-membro/j/car")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Erro: Grupo não encontrado."
    }


# ------------------------- TESTE DELETE -------------------------


def test_deleta_grupo_sucesso():
    """Teste"""
    response = client.delete("/Grupos/del-grupo/admin/123456/Teste")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Grupo deletado com sucesso."
    }


def test_deleta_grupo_nao_admin():
    """Teste"""
    response = client.delete("/Grupos/del-grupo/usuario/215/acao")
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Erro: Usuário não é admin."
    }


def test_deleta_grupo_nao_encontrado():
    """Teste"""
    response = client.delete("/Grupos/del-grupo/admin/123456/jeremias")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Grupo não encontrado."
    }
