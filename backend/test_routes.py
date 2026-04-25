"""
Test script to verify all routes are registered correctly
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app
    print("=" * 60)
    print("Flask App Routes")
    print("=" * 60)
    print("\nRegistered routes:\n")
    
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': ', '.join(sorted(rule.methods - {'HEAD', 'OPTIONS'})),
            'path': rule.rule
        })
    
    # Sort by path
    routes.sort(key=lambda x: x['path'])
    
    for route in routes:
        print(f"  {route['path']:30} [{route['methods']:15}] -> {route['endpoint']}")
    
    print("\n" + "=" * 60)
    print("Testing /api/send-message route...")
    
    # Check if the route exists
    send_message_route = None
    for rule in app.url_map.iter_rules():
        if '/send-message' in rule.rule:
            send_message_route = rule
            break
    
    if send_message_route:
        print(f"✓ Found /api/send-message route")
        print(f"  Path: {send_message_route.rule}")
        print(f"  Methods: {', '.join(send_message_route.methods)}")
        print(f"  Endpoint: {send_message_route.endpoint}")
    else:
        print("✗ /api/send-message route NOT FOUND!")
        print("\nPossible issues:")
        print("  1. Blueprint not registered correctly")
        print("  2. Import error in routes/send_message.py")
        print("  3. Server needs to be restarted")
    
    print("=" * 60)
    
except ImportError as e:
    print(f"✗ Import error: {e}")
    print("\nMake sure Flask is installed:")
    print("  pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

