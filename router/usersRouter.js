const express = require('express')
const usersRouter = express.Router()
const pool = require('../conf/connection')
usersRouter.use(express.json())
const {body, validationResult} = require('express-validator')

const Validator = [
    body('first_name').isLength({min : 1, max : 50}).isString(),
    body('last_name').isLength({min : 1, max : 50}).isString(),
    body('age').isInt({min : 18, max : 90})
]

usersRouter.get('/', (req, res) => {
    pool.query(`SELECT * FROM users`)
    .then(data => res.json(data.rows))
    .catch(e => res.status(500).send(e))
})

usersRouter.get('/:id', (req, res) => {
    const {id} = req.params
    pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))

})

usersRouter.get('/:id/orders', (req, res) => {
    const {id} = req.params
    pool.query(`SELECT *, orders.user_id, orders.date, orders.price, orders.user_id FROM users JOIN orders ON  users.id = orders.user_id  WHERE users.id = $1  `, [id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))

})


usersRouter.post('/', Validator, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())  res.status(400).json({errors : errors.array()})
    const {first_name, last_name, age} = req.body
    pool.query(`INSERT INTO users (first_name, last_name, age) VALUES($1, $2, $3) RETURNING *`, [first_name, last_name, age])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))
})

usersRouter.put('/:id', Validator, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())  res.status(400).json({errors : errors.array()})
    const {first_name, last_name, age} = req.body
    const {id} = req.params 
    pool.query(`UPDATE users  SET first_name = $1, last_name = $2 , age = $3 WHERE id = $4 RETURNING *`,  [first_name, last_name, age, id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))
})

usersRouter.put('/:id/check-inactive', Validator, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())  res.status(400).json({errors : errors.array()})
    const {id} = req.params 
    pool.query(`UPDATE users SET active = false WHERE id = $1 AND id NOT IN (SELECT user_id FROM orders) RETURNING *`,  [id])
    .then(data => res.json(data.rows))
    .catch(e => res.status(404).send(e))
})



usersRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    pool.query(`DELETE FROM users WHERE id = $1`, [id])
    .then(() => res.send('User deleted'))
    .catch(e => res.status(404).send(e))
})




module.exports = usersRouter