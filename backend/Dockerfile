FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create media directory
RUN mkdir -p /app/media

# ---- ADD THIS LINE ----
# Tell Python where to find your local apps (like 'users', 'posts', etc.)
ENV PYTHONPATH /app
# ---------------------

# Expose port
EXPOSE 8000

# The command will be provided by docker-compose