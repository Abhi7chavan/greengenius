const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'licence', 'licence.html'));
});

app.get('/licence/licence.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'licence', 'licence.js'));
});

app.get('/licence/licence.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname,'licence', 'licence.css'));
});

app.get('/submeter_page.html', (req, res) => {
    res.sendFile(path.join(__dirname,'submeter', 'main.html'));
});


app.get('/main.css', (req, res) => {
    res.sendFile(path.join(__dirname,'submeter', 'main.css'));
});

app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname,'submeter', 'main.js'));
});




// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
