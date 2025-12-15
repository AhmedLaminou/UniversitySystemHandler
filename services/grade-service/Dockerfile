FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Le service de notes (Grade Service) doit écouter sur le port 8000
# pour être cohérent avec la documentation, le docker-compose et la
# collection Postman.
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
