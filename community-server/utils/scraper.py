import requests
from bs4 import BeautifulSoup

def extract_text_from_url(url):
    try:
        html = requests.get(url).text
        soup = BeautifulSoup(html, "html.parser")
        for script in soup(["script", "style", "nav", "header", "footer", "aside", "form", "noscript"]):
            script.decompose()
        return soup.get_text(separator=" ", strip=True)
    except Exception as e:
        print("❌ Scraping Error:", e)
        return ""
