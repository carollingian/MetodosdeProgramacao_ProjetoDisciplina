"""Modulos firebase"""
import firebase_admin
from firebase_admin import db

cred = firebase_admin.credentials.Certificate("serviceAccountKeys.json")
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': "https://atlas-98158-default-rtdb.firebaseio.com"
})

bancoAtlax = db
