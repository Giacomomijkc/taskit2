const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const PORT = 5050;

require('dotenv').config();

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/logins');
const googleRoute = require('./routes/googleRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', usersRoute)
app.use('/', loginRoute)
app.use('/', googleRoute)

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Server Connection Error!'));
db.once('open', () => {
    console.log('Database MongoDB connected!')
});


app.listen(PORT, () =>
    console.log(`Server avviato ed in ascolto sulla PORTA ${PORT}`)
);