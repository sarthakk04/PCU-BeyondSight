import asyncio
import edge_tts
from playsound import playsound
import os
import uuid

def text_to_speech(text):
    async def speak(text):
        try:
            filename = f"voice_{uuid.uuid4().hex}.mp3"
            communicate = edge_tts.Communicate(
                text,
                voice="en-IN-PrabhatNeural",  # You can change to 'en-IN-NeerjaNeural' for female
                rate="+10%"  # Slightly faster rate
            )
            await communicate.save(filename)
            playsound(filename)
            os.remove(filename)
            print("✅ Speech played successfully.")
        except Exception as e:
            print("❌ TTS Error:", str(e))

    try:
        asyncio.run(speak(text))
    except RuntimeError as e:
        # If event loop already running (e.g., inside Jupyter or Flask with ASGI)
        print("⚠️ Using existing event loop...")
        loop = asyncio.get_event_loop()
        task = loop.create_task(speak(text))
        loop.run_until_complete(task)

    return speak()
