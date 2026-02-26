import asyncio
import json

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.core.redis_client import redis_client
from app.core.security import get_user_from_token

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/stream")
async def notification_stream(token: str = Query(...)):
    try:
        user = get_user_from_token(token)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    channel = f"notifications:user:{user.id}"
    pubsub = redis_client.pubsub(ignore_subscribe_messages=True)
    pubsub.subscribe(channel)

    async def event_generator():
        try:
            while True:
                message = pubsub.get_message(timeout=1.0)
                if message and message.get("type") == "message":
                    payload = message.get("data")
                    if isinstance(payload, bytes):
                        payload = payload.decode("utf-8")
                    yield f"data: {payload}\n\n"
                await asyncio.sleep(0.5)
        finally:
            pubsub.unsubscribe(channel)
            pubsub.close()

    return StreamingResponse(event_generator(), media_type="text/event-stream")
