#!/usr/bin/env python3
"""
Quick setup script for Seafood Demand Forecasting
"""

import os
import subprocess
import sys

def run_command(command, check=True):
    """Run a shell command"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        if check:
            sys.exit(1)
        return e

def main():
    print("🚀 Setting up Seafood Demand Forecasting System...")
    
    # Create necessary directories
    directories = [
        "data/raw",
        "data/processed", 
        "data/external",
        "models/saved_models",
        "app/frontend/static/css",
        "app/frontend/static/js",
        "app/frontend/static/images",
        "app/frontend/templates",
        "tests",
        "monitoring"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"📁 Created directory: {directory}")
    
    print("\n✅ Setup completed! Now you can:")
    print("1. Place your CSV file in data/raw/")
    print("2. Run: python scripts/data_pipeline.py")
    print("3. Run: python scripts/train_model.py")
    print("4. Run: python app/main.py")

if __name__ == "__main__":
    main()