const express = require('express');
const path = require('path');

const app = express();

// Use __dirname to correctly reference the build folder
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend running on http://localhost:${PORT}`));