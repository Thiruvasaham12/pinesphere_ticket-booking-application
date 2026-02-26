import os
from celery import Celery

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

celery = Celery(
    "ticket_booking",
    broker=redis_url,
    backend=redis_url
)

# 🔥 IMPORTANT: discover tasks inside app.tasks
celery.autodiscover_tasks(["app"])
