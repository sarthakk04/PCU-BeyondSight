import asyncio
from utils.tts_engine import text_to_speech


def read_full_content(content):
    from app import user_response_received, user_wants_to_continue
    sentences = [s.strip() for s in content.split(". ") if s.strip()]
    for i in range(0, len(sentences), 3):
        if not user_wants_to_continue:
            break
        chunk = ". ".join(sentences[i:i+3])
        asyncio.run(text_to_speech(chunk))
        if i + 3 < len(sentences):
            asyncio.run(text_to_speech("Should I continue? Say 'yes' or 'no'."))
            user_response_received.clear()
            if not user_response_received.wait(15):
                asyncio.run(text_to_speech("No response, stopping."))
                break
    asyncio.run(text_to_speech("End of article."))
