const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Database connection has been established successfully.');
    } catch (error) {
        res.status(500).send('Unable to connect to the database:', error);
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database connected and synchronized');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error connecting to the database:', err));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
