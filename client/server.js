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
app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname,'login', 'login.css'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname,'login', 'login.html'));
});

app.get('/login.js', (req, res) => {
    res.sendFile(path.join(__dirname,'login', 'login.js'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname,'home', 'home.html'));
});


app.get('/home.css', (req, res) => {
    res.sendFile(path.join(__dirname,'home', 'home.css'));
});

app.get('/home.js', (req, res) => {
    res.sendFile(path.join(__dirname,'home', 'home.js'));
});

app.get('/licencepage.html', (req, res) => {
    res.sendFile(path.join(__dirname,'home', 'licencepage.html'));
});

app.use('/client/images', express.static(path.join(__dirname, 'images')));


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
