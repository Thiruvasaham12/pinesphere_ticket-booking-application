import redis
import os

# Redis connection
redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.Redis.from_url(redis_url, decode_responses=True)  # returns strings instead of bytes
