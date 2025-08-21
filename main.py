from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the client
client = genai.Client(api_key="AIzaSyC7FFNXKUJyifOj7HGWquxdQ61SrYm9Xj8")

# Create a chat session
chat = client.chats.create(model="models/gemini-2.0-flash")

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    message = data.get('message', '')
    
    try:
        res = chat.send_message(message)
        return jsonify({
            "success": True,
            "response": res.text
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
