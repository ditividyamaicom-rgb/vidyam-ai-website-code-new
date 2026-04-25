"""
Send Message API Route
Handles WhatsApp message sending with 24-hour session window validation
"""
from flask import Blueprint, request, jsonify
import os
import re
import requests
from datetime import datetime, timedelta
from dateutil import parser as date_parser
from models.users import Users

send_message_bp = Blueprint('send_message', __name__)

# --- 24-hour session window check ---
def is_within_24_hours(last_user_msg_time):
    """
    Check if user is within 24-hour session window
    
    Args:
        last_user_msg_time: Datetime string, datetime object, or None
        
    Returns:
        Boolean indicating if within 24 hours
    """
    if not last_user_msg_time:
        return False
    
    try:
        # Parse datetime string if needed
        if isinstance(last_user_msg_time, str):
            # Try ISO format first
            try:
                last_msg_dt = datetime.fromisoformat(last_user_msg_time.replace('Z', '+00:00'))
            except:
                # Try other common formats
                last_msg_dt = date_parser.parse(last_user_msg_time)
        elif isinstance(last_user_msg_time, datetime):
            last_msg_dt = last_user_msg_time
        else:
            return False
        
        # Get current time (UTC)
        now = datetime.utcnow()
        
        # Convert last_msg_dt to UTC if it has timezone info
        if last_msg_dt.tzinfo is not None:
            last_msg_dt = last_msg_dt.astimezone(datetime.timezone.utc).replace(tzinfo=None)
        
        # Calculate time difference
        time_diff = now - last_msg_dt
        
        # Check if within 24 hours
        return time_diff <= timedelta(hours=24)
    except Exception as e:
        print(f'Error checking 24-hour window: {e}')
        return False

# --- Free-form WhatsApp Message ---
def send_whatsapp_free_form(phone: str, message: str):
    """
    Send free-form text message via WhatsApp API
    
    Args:
        phone: Phone number (with country code, e.g., "917390809242")
        message: Message text to send
        
    Returns:
        Response from WhatsApp API
    """
    waba_phone_id = os.getenv('WABA_PHONE_ID')
    whatsapp_token = os.getenv('WHATSAPP_TOKEN')
    
    if not waba_phone_id:
        raise ValueError("WABA_PHONE_ID environment variable is not set")
    if not whatsapp_token:
        raise ValueError("WHATSAPP_TOKEN environment variable is not set")
    
    # Use consistent API version (v20.0)
    url = f"https://graph.facebook.com/v20.0/{waba_phone_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {
            "body": message
        }
    }
    
    print(f"[WhatsApp API] Sending free-form message to {phone}")
    print(f"[WhatsApp API] URL: {url}")
    print(f"[WhatsApp API] Phone ID: {waba_phone_id}")
    print(f"[WhatsApp API] Request payload: {data}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        # Better error handling
        if response.status_code != 200:
            error_details = response.text
            try:
                error_json = response.json()
                error_details = error_json
                print(f"[WhatsApp API] Error {response.status_code}: {error_json}")
            except:
                print(f"[WhatsApp API] Error {response.status_code}: {response.text}")
            
            response.raise_for_status()
        
        result = response.json()
        print(f"[WhatsApp API] Success: {result}")
        return result
    except requests.exceptions.HTTPError as e:
        error_msg = str(e)
        if e.response:
            try:
                error_json = e.response.json()
                error_msg = f"{e} - {error_json}"
                print(f"[WhatsApp API] HTTP Error Details: {error_json}")
            except:
                error_msg = f"{e} - {e.response.text}"
                print(f"[WhatsApp API] HTTP Error Response: {e.response.text}")
        print(f"[WhatsApp API] Full Error: {error_msg}")
        raise

# --- Template Message ---
def send_whatsapp_template(phone: str, template_id: str, user_name: str = None, components: list = None, language_code: str = "en_US"):
    """
    Send template message via WhatsApp API
    
    Args:
        phone: Phone number (with country code, e.g., "917390809242")
        template_id: Template name/ID
        user_name: Optional user name for template parameters
        components: Optional list of components (for image headers, etc.)
        language_code: Language code for the template (e.g., "en", "en_US", "hi", "hi_IN")
                      Defaults to "en" if not provided
        
    Returns:
        Response from WhatsApp API
    """
    waba_phone_id = os.getenv('WABA_PHONE_ID')
    whatsapp_token = os.getenv('WHATSAPP_TOKEN')
    
    if not waba_phone_id:
        raise ValueError("WABA_PHONE_ID environment variable is not set")
    if not whatsapp_token:
        raise ValueError("WHATSAPP_TOKEN environment variable is not set")
    
    url = f"https://graph.facebook.com/v20.0/{waba_phone_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    
    # Use the provided language code, default to "en" if not provided
    template_data = {
        "name": template_id,
        "language": {
            "code": language_code
        }
    }
    
    # Add components if provided (for name parameters, image headers, etc.)
    if components:
        template_data["components"] = components
    elif user_name:
        # Default: add name as body parameter if no components provided
        template_data["components"] = [{
            "type": "body",
            "parameters": [{
                "type": "text",
                "text": user_name
            }]
        }]
    
    data = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": template_data
    }
    
    print(f"[WhatsApp API] Sending template message to {phone}")
    print(f"[WhatsApp API] URL: {url}")
    print(f"[WhatsApp API] Phone ID: {waba_phone_id}")
    print(f"[WhatsApp API] Template: {template_id}")
    print(f"[WhatsApp API] Language: {language_code}")
    print(f"[WhatsApp API] Request payload: {data}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        # Better error handling
        if response.status_code != 200:
            error_details = response.text
            try:
                error_json = response.json()
                error_details = error_json
                print(f"[WhatsApp API] Error {response.status_code}: {error_json}")
            except:
                print(f"[WhatsApp API] Error {response.status_code}: {response.text}")
            
            response.raise_for_status()
        
        result = response.json()
        print(f"[WhatsApp API] Success: {result}")
        return result
    except requests.exceptions.HTTPError as e:
        error_msg = str(e)
        if e.response:
            try:
                error_json = e.response.json()
                error_msg = f"{e} - {error_json}"
                print(f"[WhatsApp API] HTTP Error Details: {error_json}")
            except:
                error_msg = f"{e} - {e.response.text}"
                print(f"[WhatsApp API] HTTP Error Response: {e.response.text}")
        print(f"[WhatsApp API] Full Error: {error_msg}")
        raise

# --- MAIN ENDPOINT ---
@send_message_bp.route('/send-message', methods=['POST'])
def send_message():
    """
    Main endpoint for sending WhatsApp messages
    
    Request Body:
        {
            "userId": 2,
            "message": "hi diti",  # Required if templateId is null
            "templateId": null     # null for manual message, template name for template message
        }
    
    Returns:
        {
            "status": "sent-free-form"  # or "sent-template"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Missing request body'}), 400
        
        user_id = data.get('userId')
        message = data.get('message')
        template_id = data.get('templateId')
        template_language = data.get('templateLanguage', 'en_US')  # Get language from frontend, default to 'en'
        image_url = data.get('imageUrl')  # For image-based templates
        
        if not user_id:
            return jsonify({'error': 'Missing userId'}), 400
        
        # Fetch user data
        # Try to find by ID first, if that fails, try by phone number
        user = Users.find_by_pk(user_id)
        if not user:
            # If userId is actually a phone number string, try finding by phone
            user = Users.find_by_phone(str(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get and format phone number
        user_phone = user.get('phone') or user.get('mobile_no')
        if not user_phone:
            return jsonify({'error': 'User phone number not found'}), 400
        
        # Format phone number: remove all non-digits and ensure it starts with country code
        phone_number = re.sub(r'\D', '', str(user_phone))
        
        # If it's 10 digits (India), add 91 prefix
        if len(phone_number) == 10:
            phone_number = '91' + phone_number
        # If it doesn't start with country code and is 10 digits, add 91
        elif not phone_number.startswith('91') and len(phone_number) == 10:
            phone_number = '91' + phone_number
        
        print(f"[Send Message] User ID: {user_id}")
        print(f"[Send Message] User Phone (raw): {user_phone}")
        print(f"[Send Message] User Phone (formatted): {phone_number}")
        
        last_user_msg_time = user.get('lastIncomingMessageAt')
        
        # CASE 1: Manual free-form message (templateId = null)
        if not template_id:
            if not is_within_24_hours(last_user_msg_time):
                return jsonify({
                    'error': 'Template required: User is outside the 24-hour session window'
                }), 400
            
            if not message or not message.strip():
                return jsonify({'error': 'Message is required for free-form messages'}), 400
            
            send_whatsapp_free_form(phone_number, message)
            return jsonify({'status': 'sent-free-form'}), 200
        
        # CASE 2: Template message
        user_name = user.get('name', 'User')
        
        # Build components for template (with image header if image_url provided)
        components = None
        if image_url:
            components = [{
                "type": "header",
                "parameters": [{
                    "type": "image",
                    "image": {
                        "link": image_url
                    }
                }]
            }, {
                "type": "body",
                "parameters": [{
                    "type": "text",
                    "text": user_name
                }]
            }]
        
        send_whatsapp_template(phone_number, template_id, user_name=user_name, components=components, language_code=template_language)
        return jsonify({'status': 'sent-template'}), 200
        
    except requests.exceptions.HTTPError as e:
        error_details = str(e)
        status_code = 500
        
        if e.response:
            try:
                error_json = e.response.json()
                error_details = error_json
                # Check for specific WhatsApp API errors
                if e.response.status_code == 404:
                    status_code = 404
                    error_msg = error_json.get('error', {}).get('message', 'WhatsApp API endpoint not found')
                    print(f"Send message API error (404): {error_msg}")
                    print(f"  - Check if WABA_PHONE_ID ({os.getenv('WABA_PHONE_ID')}) is correct")
                    print(f"  - Verify the phone number ID exists in your WhatsApp Business Account")
                    return jsonify({
                        'error': 'WhatsApp API endpoint not found',
                        'message': error_msg,
                        'details': f"Phone ID: {os.getenv('WABA_PHONE_ID')}",
                        'help': 'Verify WABA_PHONE_ID in your .env file matches your WhatsApp Business Account'
                    }), 404
                elif e.response.status_code == 401:
                    status_code = 401
                    error_msg = error_json.get('error', {}).get('message', 'Unauthorized')
                    print(f"Send message API error (401): {error_msg}")
                    print(f"  - Check if WHATSAPP_TOKEN is valid and not expired")
                    return jsonify({
                        'error': 'WhatsApp API authentication failed',
                        'message': error_msg,
                        'help': 'Verify WHATSAPP_TOKEN in your .env file is correct and not expired'
                    }), 401
            except:
                error_details = e.response.text if e.response.text else str(e)
        
        print(f"Send message API error: {error_details}")
        return jsonify({
            'error': 'WhatsApp API error',
            'details': error_details
        }), status_code
    except ValueError as e:
        # Handle missing environment variables
        print(f"Configuration error: {str(e)}")
        return jsonify({
            'error': 'Configuration error',
            'message': str(e),
            'help': 'Check your .env file in the backend folder'
        }), 500
    except Exception as e:
        print(f"Send message API error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

