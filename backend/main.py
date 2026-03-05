import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="NASA APOD API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NASA_API_KEY = os.getenv("NASA_API_KEY")

@app.get("/apod")
async def get_apod(date: str):
    if not NASA_API_KEY:
        raise HTTPException(status_code=500, detail="NASA_API_KEY not configured on server")
    
    url = "https://api.nasa.gov/planetary/apod"
    params = {
        "api_key": NASA_API_KEY,
        "date": date
    }
    
    async with httpx.AsyncClient(verify=False) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
