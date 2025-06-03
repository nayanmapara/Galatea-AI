# Profile Image Generator API

This API allows you to generate Tinder-style profiles, match profiles based on similarity, and store the data in a SQLite database. It uses Groq for generating profile details and Replicate for generating images based on textual prompts.

## Prerequisites

To run this API, you'll need:

- Python 3.x
- Dependencies from `requirements.txt` (including `fastapi`, `replicate`, `groq`, `sqlite3`, `uvicorn`, and others)
- A `.env` file with the following environment variables set:
    - `REPLICATE_API_TOKEN`: Your Replicate API token.
    - `GROQ_API_KEY`: Your Groq API key.

## Endpoints

### 1. `/generate-profile-image` - Generate Image and Profile

This endpoint generates a random profile and an image based on that profile. It stores the generated profile and image in a SQLite database.

#### Method
- `POST`

#### Request Body
No request body is required. This endpoint generates a random profile and corresponding image.

#### Response
Returns a JSON object containing the generated profile details.

```json
{
  "id": <model_id>,
  "prompt": "<generated_prompt>",
  "image_url": "<image_url>",
  "profile": "<generated_profile>"
}
```

- `id`: The ID of the generated model in the database.
- `prompt`: The textual description of the profile used to generate the image.
- `image_url`: The URL of the generated image.
- `profile`: The generated profile details including a name and bio.

### 2. `/models/{id}` - Get Model by ID

This endpoint retrieves a specific model from the database using its ID.

#### Method
- `GET`

#### URL Parameters
- `id` (required): The ID of the model to retrieve.

#### Response
Returns a JSON object with the details of the model:

```json
{
  "id": <model_id>,
  "prompt": "<generated_prompt>",
  "image_url": "<image_url>",
  "profile": "<generated_profile>"
}
```

### 3. `/models` - Get All Models

This endpoint retrieves all models stored in the database.

#### Method
- `GET`

#### Response
Returns a list of models, each containing the following details:

```json
[
  {
    "id": <model_id>,
    "prompt": "<generated_prompt>",
    "image_url": "<image_url>",
    "profile": "<generated_profile>"
  },
  ...
]
```

### 4. `/check-profile-match` - Check if Two Profiles Match

This endpoint allows you to check if two profiles match based on their content using Groq. It compares the provided user profile with a girl profile and returns a boolean indicating if they match (60-70% similarity).

#### Method
- `POST`

#### Request Body
```json
{
  "user_profile": "<user_profile_string>",
  "girl_profile": "<girl_profile_string>"
}
```

- `user_profile`: The user’s profile, including a name and bio (e.g., `"Name: John, Bio: Enjoys hiking, photography, and reading books."`).
- `girl_profile`: The girl’s profile, including a name and bio (e.g., `"Name: Sarah, Bio: Loves hiking, photography, and cooking."`).

#### Response
Returns a JSON object indicating whether the profiles match.

```json
{
  "matched": true
}
```

If the profiles match:
- `"matched": true`

If the profiles do not match:
- `"matched": false`

### 5. `/` - Root Endpoint

This is the root endpoint of the API that provides a simple welcome message.

#### Method
- `GET`

#### Response
Returns a welcome message.

```json
{
  "message": "Welcome to the Profile Image Generator API powered by Replicate and Groq!"
}
```

## Database

The SQLite database `models.db` stores all generated profiles and images. The database table `models` has the following columns:

- `id`: The unique ID of the model.
- `prompt`: The textual description used for generating the profile and image.
- `image_url`: The URL of the generated image.
- `profile`: The generated profile text (name and bio).

## How to Run

1. Clone the repository and install the required dependencies:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    pip install -r requirements.txt
    ```

2. Create a `.env` file in the root directory with the following content:
    ```env
    REPLICATE_API_TOKEN=<your_replicate_api_token>
    GROQ_API_KEY=<your_groq_api_key>
    ```

3. Run the API using Uvicorn:
    ```bash
    uvicorn main:app --reload
    ```

4. The API will be accessible at `http://127.0.0.1:6000`.