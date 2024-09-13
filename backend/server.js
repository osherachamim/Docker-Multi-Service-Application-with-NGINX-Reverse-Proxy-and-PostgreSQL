const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
