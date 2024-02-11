// Function to toggle chat visibility
function toggleChat() {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
}

// Function to send user message to Susi AI and get a response
async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  const chatMessages = document.getElementById('chat-messages');

  // Display user's message
  chatMessages.innerHTML += `<div>User: ${userInput}</div>`;

  // Get chatbot response from Susi AI
  const botResponse = await getSusiAIResponse(userInput);

  // Display chatbot's response
  chatMessages.innerHTML += `<div>Chatbot: ${botResponse}</div>`;

  // Clear user input
  document.getElementById('user-input').value = '';
}

// Function to interact with Susi AI and get a response
async function getSusiAIResponse(userInput) {
  try {
    // Send the user input to the Susi AI API
    const response = await fetch(`https://api.susi.ai/susi/chat.json?q=${encodeURIComponent(userInput)}`, {
      method: 'GET',
    });

    const result = await response.json();

    // Return the chatbot's response
    return result.answers ? result.answers[0].actions[0].expression : 'Sorry, I cannot understand that.';
  } catch (error) {
    console.error('Error communicating with Susi AI:', error);
    return 'An error occurred while processing your request.';
  }
}
