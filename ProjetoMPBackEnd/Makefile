all:
	python -m uvicorn --port 8000 app.src.main:app --reload

test:
	pytest -vv --cov

pylint:
	pylint ./app

clean:
	rm -r app/__pycache__ ./app/src/__pycache__ ./app/src/models/__pycache__ ./app/tests/__pycache__