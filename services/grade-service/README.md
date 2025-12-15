# 📝 Grade Service

Ce microservice gère les notes, les examens et les relevés de notes. Il est développé en **Python** avec **FastAPI** et utilise **PostgreSQL**.

## 🚀 Fonctionnalités

- **Gestion des notes** : Saisie, modification et consultation des notes.
- **Calcul de moyennes** : Calcul automatique des moyennes par étudiant et par cours.
- **Relevés de notes** : Génération de bulletins.
- **Statistiques** : Taux de réussite, moyennes par cours.

## 🛠️ Technologies

- **Langage** : Python 3.9+
- **Framework** : FastAPI
- **ORM** : SQLAlchemy
- **Base de données** : PostgreSQL
- **Serveur** : Uvicorn

## ⚙️ Configuration

Le service utilise un fichier `.env` pour la configuration :

```env
DATABASE_URL=postgresql://grade_user:grade_pass@localhost:5433/grade_db
JWT_SECRET=VotreSecretJWT
AUTH_SERVICE_URL=http://localhost:8081
PORT=8000
```

## 📦 Installation et Démarrage

### Prérequis

- Python 3.9+
- PostgreSQL

### Étapes

1.  **Créer un environnement virtuel** (recommandé) :

    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate     # Windows
    ```

2.  **Installer les dépendances** :

    ```bash
    pip install -r requirements.txt
    ```

3.  **Démarrer le serveur** :
    ```bash
    python app/main.py
    ```
    Ou directement avec Uvicorn :
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

## 🐳 Docker

```bash
docker build -t grade-service .
docker run -p 8000:8000 --env-file .env grade-service
```

## 🔗 API Endpoints

La documentation interactive (Swagger UI) est disponible sur `/docs`.

- `POST /api/grades/` : Ajouter une note.
- `GET /api/grades/student/{student_id}` : Notes d'un étudiant.
- `GET /api/grades/student/{student_id}/average` : Moyenne d'un étudiant.
- `GET /api/grades/course/{course_id}/stats` : Statistiques d'un cours.
