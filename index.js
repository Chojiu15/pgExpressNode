const express = require('express')
const app = express()
const PORT = 3002
const pool = require('./conf/connection')
require('dotenv').config()


app.get('/', (req,res) => {
    res.send('Welcome to the PG API')
})

app.get('/users', (req, res) => {
    pool.query(`SELECT * FROM users`)
    .then(data => res.json(data.rows))
    .catch(e => res.status(500).send(e))
})



app.listen(PORT, () => console.log(`Server is listening on port ${3002}`) )