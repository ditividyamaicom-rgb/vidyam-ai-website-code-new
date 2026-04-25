"""
User model using Supabase
"""
import os
from supabase import create_client, Client
from typing import Optional, Dict

# Initialize Supabase client (lazy initialization)
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get or create Supabase client"""
    global _supabase_client
    
    if _supabase_client is None:
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError('Missing Supabase credentials in environment variables')
        
        _supabase_client = create_client(supabase_url, supabase_key)
    
    return _supabase_client

class Users:
    """User model for interacting with Supabase user_data table"""
    
    @staticmethod
    def find_by_pk(user_id) -> Optional[Dict]:
        """
        Find user by primary key (id)
        
        Args:
            user_id: User ID (integer or string)
            
        Returns:
            Dictionary with user data or None if not found
        """
        try:
            client = get_supabase_client()
            response = client.table('user_data').select('*').eq('id', user_id).execute()
            
            if not response.data or len(response.data) == 0:
                return None
            
            data = response.data[0]
            
            # Map Supabase fields to expected format
            return {
                'id': data.get('id'),
                'phone': data.get('mobile_no') or data.get('phone'),
                'lastIncomingMessageAt': data.get('last_incoming_message_at') or data.get('lastIncomingMessageAt'),
                'name': data.get('name'),
            }
        except Exception as error:
            print(f'Error in find_by_pk: {error}')
            return None
    
    @staticmethod
    def find_by_phone(phone: str) -> Optional[Dict]:
        """
        Find user by phone number
        
        Args:
            phone: Phone number string
            
        Returns:
            Dictionary with user data or None if not found
        """
        try:
            client = get_supabase_client()
            response = client.table('user_data').select('*').eq('mobile_no', phone).execute()
            
            if not response.data or len(response.data) == 0:
                return None
            
            data = response.data[0]
            
            return {
                'id': data.get('id'),
                'phone': data.get('mobile_no') or data.get('phone'),
                'lastIncomingMessageAt': data.get('last_incoming_message_at') or data.get('lastIncomingMessageAt'),
                'name': data.get('name'),
            }
        except Exception as error:
            print(f'Error in find_by_phone: {error}')
            return None

