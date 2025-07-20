#!/bin/bash

# Exit on any error
set -e

echo "Running pre-start script..."

# Wait for database to be ready
echo "Waiting for database..."
python -c "
import time
import psycopg
from app.core.config import settings

max_attempts = 30
attempt = 0

# Build psycopg connection string with SSL
conn_str = f'host={settings.POSTGRES_SERVER} port={settings.POSTGRES_PORT} dbname={settings.POSTGRES_DB} user={settings.POSTGRES_USER} password={settings.POSTGRES_PASSWORD} sslmode=require'

while attempt < max_attempts:
    try:
        conn = psycopg.connect(conn_str)
        conn.close()
        print('Database is ready!')
        break
    except Exception as e:
        attempt += 1
        print(f'Database not ready yet. Attempt {attempt}/{max_attempts}. Error: {e}')
        time.sleep(2)
else:
    print('Database connection failed after maximum attempts')
    exit(1)
"

# Run migrations
echo "Running database migrations..."
cd /app
export PYTHONPATH=/app:$PYTHONPATH
alembic upgrade head

echo "Pre-start script completed successfully!"