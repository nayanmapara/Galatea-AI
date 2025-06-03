from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import random
from groq import Groq
import uvicorn
from dotenv import load_dotenv
import sqlite3
from fastapi.responses import FileResponse

load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Database setup
DATABASE_URL = "models.db"

# Initialize Groq client
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Traits for image generation
traits = {
    "nationality": ["Indian", "African", "Asian", "Latino", "Caucasian", "Middle Eastern", "Mediterranean", "Caribbean"],
    "clothing": ["casual", "sporty", "formal", "traditional", "summer wear", "winter coat"],
    "activity": ["posing", "sitting", "headshot"],
    "setting": [
        "on a sandy beach",
        "next to the shoreline of a modern city",
        "in a dense forest",
        "on a mountain trail",
        "in a futuristic cityscape",
    ],
    "weather": ["on a sunny day", "during sunset", "on a cloudy afternoon", "on a snowy evening"],
    "accessory": ["holding a cup of coffee", "with sunglasses on", "wearing a hat", ""],
}

# Function to generate a random prompt
def generate_random_prompt(traits):
    prompt = []
    for category, options in traits.items():
        prompt.append(random.choice(options))

    output = f"{prompt[0]} female in {prompt[1]} clothing {prompt[2]} {prompt[3]} {prompt[4]}, {prompt[5]} for a Tinder profile."

    return output 

# Function to generate a name and Tinder-like profile using Groq
def generate_name_and_profile_with_groq(prompt):
    profile_prompt = (
        f"""To create a Tinder-style profile for a female character based on the description {prompt}. 
        Include a name and 3-5 hobbies or interests as 1-2 sentences for the bio. No other text or reply needs to be generated nothing else is needed. Just have Name: [Name] and Bio: [Bio]"""
    )
    try:
        # Groq API request
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": profile_prompt}],
            model="llama3-8b-8192",  # Example Groq model, adjust as needed
        )
        # Extract generated content
        content = response.choices[0].message.content.strip()
        return content
    except Exception as e:
        return {"error": f"Failed to generate profile: {str(e)}"}

# Initialize SQLite database
def init_db():
    with sqlite3.connect(DATABASE_URL) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS models (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            prompt TEXT,
                            image_url TEXT,
                            profile TEXT
                        )''')
        conn.commit()

# Function to add model to database
def add_model_to_db(prompt, image_url, profile):
    with sqlite3.connect(DATABASE_URL) as conn:
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO models (prompt, image_url, profile) 
                          VALUES (?, ?, ?)''', (prompt, image_url, profile))
        conn.commit()
        return cursor.lastrowid

# Function to get model by ID
def get_model_by_id(model_id):
    with sqlite3.connect(DATABASE_URL) as conn:
        cursor = conn.cursor()
        cursor.execute('''SELECT * FROM models WHERE id = ?''', (model_id,))
        model = cursor.fetchone()
        return model

# Function to get all models
def get_all_models():
    with sqlite3.connect(DATABASE_URL) as conn:
        cursor = conn.cursor()
        cursor.execute('''SELECT * FROM models''')
        models = cursor.fetchall()
        return models

# Function to check profile match using Groq
def check_profile_match(user_profile, girl_profile):
    match_prompt = (
        f"""Based on the following two profiles, determine if they match:
        User Profile: {user_profile}
        Girl Profile: {girl_profile}
        Return 'true' if they match at least 60-70%, otherwise return 'false'."""
    )
    try:
        # Groq API request to compare the profiles
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": match_prompt}],
            model="llama3-8b-8192",  # Adjust model as needed
        )
        content = response.choices[0].message.content.strip().lower()
        return True if "true" in content else False
    except Exception as e:
        return {"error": f"Failed to compare profiles: {str(e)}"}

# FastAPI endpoint to generate image and profile
@app.post("/generate-profile-image")
async def generate_profile_image():
    # Generate random prompt
    prompt = generate_random_prompt(traits)

    # Check if the "images" folder exists, if not, return an error
    image_folder = "images"  # Folder containing images (named a0.png, a1.png, etc.)
    if not os.path.exists(image_folder):
        raise HTTPException(status_code=500, detail="Images folder does not exist")

    # Get all PNG images in the "images" folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith(".png")]
    if not image_files:
        raise HTTPException(status_code=500, detail="No images found in the folder")

    # Select a random image from the "images" folder
    selected_image = random.choice(image_files)  # Randomly select an image

    # Build the image URL
    image_url = f"/images/{selected_image}"  # Return image path as URL

    # Generate profile using Groq
    profile = generate_name_and_profile_with_groq(prompt)

    # Save to database
    model_id = add_model_to_db(prompt, image_url, profile)

    return {
        "id": model_id,
        "prompt": prompt,
        "image_url": image_url,
        "profile": profile
    }

# Endpoint to get a specific model by ID
@app.get("/models/{id}")
async def get_model(id: int):
    model = get_model_by_id(id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return {
        "id": model[0],
        "prompt": model[1],
        "image_url": model[2],
        "profile": model[3]
    }

# Endpoint to get all models
@app.get("/models")
async def get_models():
    models = get_all_models()
    return [{"id": model[0], "prompt": model[1], "image_url": model[2], "profile": model[3]} for model in models]

# New endpoint to check if two profiles match
@app.post("/check-profile-match")
async def check_match(user_profile: str, girl_profile: str):
    # Check if profiles match using Groq
    match = check_profile_match(user_profile, girl_profile)
    return {"matched": match}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Profile Image Generator API powered by Replicate and Groq!"}

# Serve images from the "images" folder
@app.get("/images/{image_name}")
async def get_image(image_name: str):
    # Check if the image exists
    image_folder = "images"
    image_path = os.path.join(image_folder, image_name)
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(image_path)

if __name__ == "__main__":
    init_db()  # Initialize the database on startup
    uvicorn.run(app, port=6000)
