import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_text(text):
    if len(text) < 200:
        return text
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(f"Summarize this article:\n{text[:3000]}")
        return response.text if response else "No summary."
    except Exception as e:
        print("❌ Summarization Error:", e)
        return "Could not summarize."

