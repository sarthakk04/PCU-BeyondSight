#notepad

import os
import speech_recognition as sr
import pyautogui
import time
import subprocess
from pynput import keyboard

def recognize_speech():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1.5  # Adjusts pause between phrases (in seconds)
        r.energy_threshold = 300  # Optional: adjust this if recognition is too sensitive or not sensitive enough

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


def open_notepad():
    subprocess.Popen('notepad.exe')
    time.sleep(1)  # Wait for Notepad to open
    pyautogui.hotkey('alt', 'space')
    pyautogui.press('x')  # Maximize window

def save_file(filename):
    pyautogui.hotkey('ctrl', 'shift', 's')  # Save As shortcut in Notepad
    time.sleep(1)
    pyautogui.write(filename)
    pyautogui.press('enter')
    time.sleep(0.5)
    # Handle overwrite prompt if needed
    if pyautogui.locateOnScreen('replace_prompt.png'):  # You'd need an image of the prompt
        pyautogui.press('y')

def on_press(key):
    if key == keyboard.Key.esc:
        print("Stopping dictation...")
        return False  # Stop listener

def main():
    print("Say 'open notepad' to begin...")
    
    while True:
        command = recognize_speech()
        
        if "open notepad" in command:
            open_notepad()
            print("Notepad opened. Start dictating. Press ESC to stop.")
            
            # Start keyboard listener
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
                    break
            else:
                print("Notes not saved.")
                break

if __name__ == "__main__":
    main()