"""
Quick test script to verify backend setup
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test if all required packages are installed"""
    print("Testing imports...")
    try:
        from flask import Flask
        print("[OK] Flask imported successfully")
    except ImportError as e:
        print(f"X Flask import failed: {e}")
        return False
    
    try:
        from flask_cors import CORS
        print("✓ flask-cors imported successfully")
    except ImportError as e:
        print(f"[ERROR] flask-cors import failed: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("[OK] python-dotenv imported successfully")
    except ImportError as e:
        print(f"[ERROR] python-dotenv import failed: {e}")
        return False
    
    try:
        import requests
        print("[OK] requests imported successfully")
    except ImportError as e:
        print(f"[ERROR] requests import failed: {e}")
        return False
    
    try:
        from supabase import create_client
        print("[OK] supabase imported successfully")
    except ImportError as e:
        print(f"[ERROR] supabase import failed: {e}")
        return False
    
    try:
        from dateutil import parser
        print("[OK] python-dateutil imported successfully")
    except ImportError as e:
        print(f"[ERROR] python-dateutil import failed: {e}")
        return False
    
    return True

def test_app_import():
    """Test if app can be imported"""
    print("\nTesting app import...")
    try:
        from app import app
        print("[OK] App imported successfully")
        return True
    except Exception as e:
        print(f"[ERROR] App import failed: {e}")
        return False

def check_env_file():
    """Check if .env file exists"""
    print("\nChecking .env file...")
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        print("[OK] .env file exists")
        return True
    else:
        print("[WARNING] .env file not found")
        print("  Please create a .env file in the backend directory")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("Backend Setup Test")
    print("=" * 50)
    
    all_ok = True
    all_ok &= test_imports()
    env_exists = check_env_file()
    all_ok &= test_app_import()
    
    print("\n" + "=" * 50)
    if all_ok:
        print("[SUCCESS] All tests passed! You can start the server with: python app.py")
    else:
        print("[FAILED] Some tests failed. Please fix the issues above.")
        print("\nTo install dependencies, run:")
        print("  pip install -r requirements.txt")
    print("=" * 50)

