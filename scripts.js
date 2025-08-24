// Handle form submission
async function handleSubmit() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (!message) return; // Don't send empty messages
    
    // Add the user's message to the chat display
    const responseDiv = document.getElementById("response");
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("message", "user");
    userMessageDiv.innerHTML = marked.parse(message);
    responseDiv.appendChild(userMessageDiv);
    
    // Scroll to the bottom to show the new message
    responseDiv.scrollTop = responseDiv.scrollHeight;

    // Clear the input field immediately
    messageInput.value = '';
    
    // Show a loading indicator
    const loadingMessageDiv = document.createElement("div");
    loadingMessageDiv.classList.add("message", "bot");
    loadingMessageDiv.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span>`;
    responseDiv.appendChild(loadingMessageDiv);
    responseDiv.scrollTop = responseDiv.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Remove the loading indicator
        responseDiv.removeChild(loadingMessageDiv);

        if (data.success) {
            console.log('AI Response:', data.response);

            // Instead of overwriting response, append as a new message bubble
            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot");
            botMessage.innerHTML = marked.parse(data.response);
            responseDiv.appendChild(botMessage);

            // Scroll to bottom
            responseDiv.scrollTop = responseDiv.scrollHeight;

            // Render MathJax after inserting message
            MathJax.typeset();
        } else {
            console.error('Error from server:', data.error);
        }
        
        // Refocus the input field
        messageInput.focus();
    } catch (error) {
        console.error('Error:', error);
        responseDiv.removeChild(loadingMessageDiv);
        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("message", "bot");
        errorMessageDiv.textContent = "Sorry, something went wrong.";
        responseDiv.appendChild(errorMessageDiv);
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }
}