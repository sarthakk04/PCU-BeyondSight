from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import asyncio
import webbrowser
import pyautogui
import time
import subprocess
import speech_recognition as sr
from pynput import keyboard
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
notepad_thread = None


def control_youtube(command):
    controls = {
        'pause': 'k',
        'play': 'k',
        'volume up': 'up',
        'volume down': 'down',
        'mute': 'm',
        'fullscreen': 'f',
        'exit': 'escape'
    }
    
    cmd = command.lower()
    action = controls.get(cmd)
    
    if action:
        pyautogui.press(action)
        return True
    return False

@app.route('/youtube/open', methods=['POST'])
def open_youtube():
    try:
        webbrowser.open("https://www.youtube.com")
        time.sleep(2)
        return jsonify({"message": "YouTube opened. What would you like to watch?"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/youtube/control', methods=['POST'])
def youtube_control():
    try:
        data = request.json
        command = data.get('command', '')
        
        if control_youtube(command):
            return jsonify({"message": f"Executed {command}"})
        
        if 'search' in command:
            query = command.replace('search', '').strip()
            video_url = get_youtube_video_url(query)
            if video_url:
                webbrowser.open(video_url)
                time.sleep(4)
                pyautogui.click(x=pyautogui.size()[0]//2, y=pyautogui.size()[1]//2)
                pyautogui.press('f')
                return jsonify({"message": f"Playing {query}"})
            return jsonify({"error": "Video not found"}), 404
        
        return jsonify({"error": "Invalid command"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_youtube_video_url(query):
    try:
        encoded_query = urllib.parse.quote_plus(query)
        search_url = f"https://www.youtube.com/results?search_query={encoded_query}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        
        response = requests.get(search_url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            for script in soup.find_all('script'):
                if script.string and 'videoId' in script.string:
                    content = script.string
                    start = content.find('"videoId":"') + 11
                    end = content.find('"', start)
                    if start != -1 and end != -1:
                        return f"https://www.youtube.com/watch?v={content[start:end]}"
        return None
    except Exception as e:
        print(f"YouTube Search Error: {str(e)}")
        return None
# Function for speech recognition
def recognize_speech():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1.5
        r.energy_threshold = 300
        try:
            audio = r.listen(source, timeout=5, phrase_time_limit=10)
            text = r.recognize_google(audio)
            print(f"You said: {text}")
            return text.lower()
        except sr.WaitTimeoutError:
            print("Listening timed out while waiting for phrase to start.")
            return ""
        except sr.UnknownValueError:
            print("Sorry, I didn't catch that.")
            return ""
        except sr.RequestError:
            print("Sorry, speech service is down.")
            return ""

# Function to open Notepad
def open_notepad():
    subprocess.Popen('notepad.exe')
    time.sleep(1)
    pyautogui.hotkey('alt', 'space')
    pyautogui.press('x')  # Maximize window

# Function to save the Notepad file
def save_file(filename):
    pyautogui.hotkey('ctrl', 'shift', 's')  # Save As shortcut
    time.sleep(1)
    pyautogui.write(filename)
    pyautogui.press('enter')
    time.sleep(0.5)
    if pyautogui.locateOnScreen('replace_prompt.png'):
        pyautogui.press('y')

# Function to handle keyboard events for stopping dictation
def on_press(key):
    if key == keyboard.Key.esc:
        print("Stopping dictation...")
        return False  # Stop listener

# Notepad automation thread
def notepad_automation():
    open_notepad()
    print("Notepad opened. Start dictating. Press ESC to stop.")
    listener = keyboard.Listener(on_press=on_press)
    listener.start()

    while listener.running:
        text = recognize_speech()
        if text:
            if "stop" in text:
                listener.stop()
                break
            else:
                pyautogui.write(text + " ")

    print("Say 'save as' followed by the filename to save your notes.")
    save_command = recognize_speech()
    if "save as" in save_command:
        filename = save_command.replace("save as", "").strip()
        if not filename:
            print("What would you like to name the file?")
            filename = recognize_speech()
        if filename:
            save_file(filename + ".txt")
            print(f"File saved as {filename}.txt")

# Flask route for starting Notepad automation
@app.route("/start_notepad", methods=["POST"])
def start_notepad():
    global notepad_thread

    if notepad_thread is None or notepad_thread.is_alive() is False:
        notepad_thread = threading.Thread(target=notepad_automation)
        notepad_thread.start()
        return jsonify({"message": "Notepad opened and dictation started."})
    else:
        return jsonify({"message": "Notepad is already running."})

# Flask route for handling speech
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

        # Open website by name
        elif command.startswith("open "):
            site = command.replace("open ", "").strip().replace(" ", "")
            url = f"https://www.{site}.com"

        # Handle full URL command
        elif command.startswith("http"):
            url = command

        else:
            return jsonify({"error": "Invalid URL or command"}), 400

        current_url = url
        webbrowser.open(url)
        print(f"🌐 Opening: {url}")

        current_page_content = extract_text_from_url(url)
        summary = summarize_text(current_page_content)

        # Summarize and read summary
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
