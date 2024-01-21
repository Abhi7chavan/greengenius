from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI





app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to the correct origin or set it to ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
