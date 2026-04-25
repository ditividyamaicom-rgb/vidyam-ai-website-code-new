"""
Test script to verify WhatsApp Business API credentials
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_whatsapp_api():
    """Test WhatsApp API configuration"""
    print("=" * 60)
    print("WhatsApp Business API Configuration Test")
    print("=" * 60)
    print()
    
    # Check environment variables
    waba_phone_id = os.getenv('WABA_PHONE_ID')
    whatsapp_token = os.getenv('WHATSAPP_TOKEN')
    
    print("1. Checking Environment Variables:")
    print("-" * 60)
    
    if not waba_phone_id:
        print("✗ WABA_PHONE_ID is not set in .env file")
        return False
    else:
        print(f"✓ WABA_PHONE_ID: {waba_phone_id}")
    
    if not whatsapp_token:
        print("✗ WHATSAPP_TOKEN is not set in .env file")
        return False
    else:
        # Show only first and last 4 characters for security
        token_preview = f"{whatsapp_token[:4]}...{whatsapp_token[-4:]}" if len(whatsapp_token) > 8 else "***"
        print(f"✓ WHATSAPP_TOKEN: {token_preview}")
    
    print()
    print("2. Testing WhatsApp API Endpoint:")
    print("-" * 60)
    
    # Test endpoint URL
    url = f"https://graph.facebook.com/v20.0/{waba_phone_id}/messages"
    print(f"URL: {url}")
    print()
    
    # Try to get phone number info (this endpoint exists and requires valid credentials)
    test_url = f"https://graph.facebook.com/v20.0/{waba_phone_id}"
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
    }
    
    print("Testing phone number ID access...")
    try:
        response = requests.get(test_url, headers=headers)
        
        if response.status_code == 200:
            phone_info = response.json()
            print("✓ Phone number ID is valid and accessible")
            print(f"  Display Name: {phone_info.get('display_phone_number', 'N/A')}")
            print(f"  Verified Name: {phone_info.get('verified_name', 'N/A')}")
            return True
        elif response.status_code == 404:
            print(f"✗ Phone number ID not found (404)")
            print(f"  The phone number ID '{waba_phone_id}' does not exist")
            print(f"  Please verify the WABA_PHONE_ID in your .env file")
            print()
            try:
                error_json = response.json()
                print(f"  Error details: {error_json}")
            except:
                print(f"  Response: {response.text}")
            return False
        elif response.status_code == 401:
            print(f"✗ Authentication failed (401)")
            print(f"  The WHATSAPP_TOKEN is invalid or expired")
            print(f"  Please verify the token in your .env file")
            print()
            try:
                error_json = response.json()
                print(f"  Error details: {error_json}")
            except:
                print(f"  Response: {response.text}")
            return False
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            try:
                error_json = response.json()
                print(f"  Error details: {error_json}")
            except:
                print(f"  Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error: {e}")
        return False
    
    print()
    print("=" * 60)
    return False

if __name__ == '__main__':
    success = test_whatsapp_api()
    print()
    if success:
        print("✓ All tests passed! Your WhatsApp API configuration is correct.")
    else:
        print("✗ Some tests failed. Please fix the issues above.")
        sys.exit(1)

