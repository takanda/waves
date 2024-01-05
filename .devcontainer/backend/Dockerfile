FROM python:latest

WORKDIR /app

COPY .devcontainer/backend/requirements.txt .

RUN apt-get update \
    && apt-get install -y gcc sqlite3 \
    && pip install --no-cache -r requirements.txt

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000"]    