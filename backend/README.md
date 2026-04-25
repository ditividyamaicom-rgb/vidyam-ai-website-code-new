# Backend API for WhatsApp Message Sending (Python/Flask)

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create a `.env` file in the backend directory** (if not already created):
   ```
   WABA_PHONE_ID=321708041022651
   WHATSAPP_TOKEN=your_whatsapp_business_api_token
   PORT=3001
   SUPABASE_URL=https://kwapdqllgpxvfxuoucjv.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start the backend server:**
   ```bash
   # From backend directory
   python app.py
   # Or using Flask CLI
   flask run --port=3001
   ```

4. **Start the frontend (in a separate terminal):**
   ```bash
   # From root directory
   npm start
   ```

   The frontend is configured to proxy API requests to `http://localhost:3001` during development.

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── models/
│   └── users.py          # User model with Supabase integration
├── routes/
│   └── send_message.py   # Send message API route
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (create this)
└── README.md             # This file
```

## API Endpoint

### POST `/api/send-message`

**Request Body:**
```json
{
  "userId": 2,
  "message": "hi diti",  // Required if templateId is null
  "templateId": null      // null for manual message, template name for template message
}
```

**Response:**
```json
{
  "status": "sent-free-form"  // or "sent-template"
}
```

**Error Responses:**
- `400`: Missing userId, user outside 24-hour window, etc.
- `404`: User not found
- `500`: Internal server error

## Notes

- The backend checks if a user is within the 24-hour session window before allowing free-form messages
- Template messages can be sent at any time
- Uses Supabase `user_data` table for user lookup
- Phone number field is `mobile_no` in the database

## Development

For development with auto-reload:
```bash
# Install watchdog for auto-reload
pip install watchdog

# Run with auto-reload
flask run --port=3001 --reload
```
