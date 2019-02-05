require('dotenv').config()
const express = require('express')
const session = require('express-session')
const app = express()
const massive = require('massive')
const {json} = require('body-parser')
const{CONNECTION_STRING, SESSION_SECRET} = process.env
const {dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure} = require('./controllers/treasureController')
const {register, login, logout} = require('./controllers/authController')
const {usersOnly, adminsOnly} = require('./middleware/authMiddleware')

app.use(json())

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)

massive(CONNECTION_STRING).then(dbInstance=>{
    console.log('Database connected')
    app.set('db', dbInstance)
})

app.post('/auth/register', register)
app.post('/auth/login', login)
app.get('/auth/logout', logout)

app.get('/api/treasure/dragon', dragonTreasure)
app.get('/api/treasure/user', usersOnly, getUserTreasure)
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);

app.post('/api/treasure/user', usersOnly, addUserTreasure);

const port = 4000
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})