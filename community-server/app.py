from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import asyncio
import webbrowser
import pyautogui
from utils.summarizer import summarize_text
from utils.scraper import extract_text_from_url
from utils.reader import read_full_content
from utils.browser_control import control_browser
from utils.tts_engine import text_to_speech

app = Flask(__name__)
CORS(app)

latest_speech = ""
current_page_content = ""
current_url = ""
reading_active = False
user_wants_to_continue = True
user_response_received = threading.Event()

@app.route("/speech", methods=["POST"])
def handle_speech():
    global latest_speech, user_wants_to_continue, current_page_content, current_url, reading_active

    data = request.json
    latest_speech = data.get("text", "").strip().lower()
    print(f"🗣 Received: {latest_speech}")

    try:
        if reading_active:
            if latest_speech in ["yes", "continue", "go on"]:
                user_wants_to_continue = True
                user_response_received.set()
                return jsonify({"message": "Continuing reading"})
            elif latest_speech in ["no", "stop", "that's enough"]:
                user_wants_to_continue = False
                user_response_received.set()
                return jsonify({"message": "Stopping reading"})

        nav_commands = ["scroll down", "scroll up", "next page", "previous page", "click", "back"]
        if any(cmd in latest_speech for cmd in nav_commands):
            asyncio.run(control_browser(latest_speech))
            return jsonify({"message": "Navigation executed"})

        if "read full" in latest_speech and current_page_content:
            threading.Thread(target=read_full_content, args=(current_page_content,)).start()
            return jsonify({"message": "Reading full content"})

        if "open" in latest_speech or "wikipedia" in latest_speech or latest_speech.startswith("http"):
            return browse_site(latest_speech)

        return jsonify({"message": "Speech received but no action triggered"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def browse_site(command):
    global current_page_content, current_url

    try:
        command = command.lower().strip()

        # Wikipedia search
        if "wikipedia" in command:
            parts = command.split("wikipedia")
            search_query = parts[-1].strip().replace(" ", "_")
            url = f"https://en.wikipedia.org/wiki/{search_query or 'Main_Page'}"

        # General website open
        elif command.startswith("open "):
            site = command.replace("open ", "").strip().replace(" ", "")
            url = f"https://www.{site}.com"

        # Direct URL
        elif command.startswith("http"):
            url = command

        else:
            return jsonify({"error": "Invalid URL or command"}), 400

        current_url = url
        webbrowser.open(url)
        print(f"🌐 Opening: {url}")

        current_page_content = extract_text_from_url(url)
        summary = summarize_text(current_page_content)

        asyncio.run(text_to_speech(f"Opened {url}. Here's a summary: {summary[:200]}"))
        asyncio.run(text_to_speech("Say 'read full' to hear the complete content or give a command."))

        return jsonify({
            "url": url,
            "summary": summary,
            "full_content": current_page_content[:2000]
        })

    except Exception as e:
        print(f"❌ Error in browse_site: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5050, debug=True)
