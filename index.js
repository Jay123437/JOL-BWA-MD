const express = require('express');
const path = require('path');
const router = require('./inconnu');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

app.listen(PORT, () => {
    console.log(`✅ JOLIBWA MD server is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
