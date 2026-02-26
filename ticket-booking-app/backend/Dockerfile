# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (required for Postgres driver)
RUN apt-get update \
    && apt-get install -y gcc libpq-dev \
    && apt-get clean

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Command to run on container start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
