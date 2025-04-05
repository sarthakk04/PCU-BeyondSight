import pyautogui
import asyncio
from utils.tts_engine import text_to_speech


async def control_browser(command):
    command = command.lower()
    try:
        if "scroll down" in command:
            pyautogui.scroll(-500)
            await text_to_speech("Scrolling down.")
        elif "scroll up" in command:
            pyautogui.scroll(500)
            await text_to_speech("Scrolling up.")
        elif "next page" in command:
            pyautogui.hotkey("ctrl", "tab")
            await text_to_speech("Next tab.")
        elif "previous page" in command:
            pyautogui.hotkey("ctrl", "shift", "tab")
            await text_to_speech("Previous tab.")
        elif "click" in command:
            pyautogui.click()
            await text_to_speech("Clicked.")
        elif "back" in command:
            pyautogui.hotkey("alt", "left")
            await text_to_speech("Going back.")
    except Exception as e:
        print("❌ Control Error:", e)
        await text_to_speech("Could not perform action.")
