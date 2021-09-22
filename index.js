const express = require('express')
const app = express()
const PORT = 3002
const usersRouter = require('./router/usersRouter')
const ordersRouter = require('./router/ordersRouter')
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))

app.get('/', (req,res) => {
    res.send('Welcome to the PG API')
})

app.use('/users', usersRouter )
app.use('/orders', ordersRouter )



app.listen(PORT, () => console.log(`Server is listening on port ${3002}`) )