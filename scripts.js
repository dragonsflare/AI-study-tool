async function handleSubmit() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (!message) return;  // Don't send empty messages
    
    try {
        document.getElementById("response").innerHTML = "Loading...";
        const response = await fetch('http://127.0.0.1:5001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('AI Response:', data.response);
            document.getElementById("response").innerHTML = data.response;
            // You can update the UI here with the response
        } else {
            console.error('Error from server:', data.error);
        }
        
        // Clear the input field after sending
        messageInput.value = '';
    } catch (error) {
        console.error('Error:', error);
    }
}