#!/usr/bin/env python3
"""Check available Gemini models"""
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("No API key found!")
    exit(1)

client = genai.Client(api_key=api_key)

print("Fetching available models...")
try:
    models = client.models.list()
    print(f"\nAvailable models ({len(list(models))} total):\n")
    for model in models:
        print(f"- {model.name}")
        if hasattr(model, 'supported_generation_methods'):
            print(f"  Methods: {model.supported_generation_methods}")
        if hasattr(model, 'description'):
            print(f"  Description: {model.description[:100]}...")
        print()
except Exception as e:
    print(f"Error: {e}")
