const express = require('express')
const ordersRouter = express.Router()
const pool = require('../conf/connection')
ordersRouter.use(express.json())
const {body, validationResult} = require('express-validator')

const Validator = [
    body('price').isInt({min : 1, max : 5000}),
    body('date').isISO8601(),
    body('user_id').isInt({min : 1})
]



ordersRouter.get('/', (req, res) => {
    pool.query(`SELECT * FROM orders`)
    .then(data => res.json(data.rows))
    .catch(e => res.status(500).send(e))
})

ordersRouter.get('/:id', (req, res) => {
    const {id} = req.params
    pool.query(`SELECT * FROM orders WHERE id = $1`, [id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))

})

ordersRouter.post('/', Validator, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())  res.status(400).json({errors : errors.array()})
    const {price, date, user_id} = req.body
    pool.query(`INSERT INTO orders (price, date, user_id) VALUES($1, $2, $3) RETURNING *`, [price, date, user_id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))
})

ordersRouter.put('/:id', Validator, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())  res.status(400).json({errors : errors.array()})
    const {price, date, user_id} = req.body
    const {id} = req.params 
    pool.query(`UPDATE orders  SET price = $1, date = $2 , user_id = $3 WHERE id = $4 RETURNING *`,  [price, date, user_id, id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))
})

ordersRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    pool.query(`DELETE FROM orders WHERE id = $1`, [id])
    .then(() => res.send('Order deleted'))
    .catch(e => res.status(404).send(e))

})




module.exports = ordersRouter