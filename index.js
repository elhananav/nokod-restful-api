const express = require('express');
const Joi = require('joi');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swaggerConfig'); // Import the Swagger configuration
const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use(express.json())

const todos = [
    {id:1, name: "todO1"},
    {id:2, name: "todO2"},
    {id:3, name: "todO3"}
];

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of todos
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/todo', (req, res) => {
    res.send(todos)
});

/**
 * @swagger
 * /todo/:id:
 *   get:
 *     summary: Get todo by id
 *     description: Get todo by id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
app.get('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) return res.status(404).send('the toDo with given ID was not found');
    res.send(todo);
});

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Create a new TODO
 *     description: Create a new TODO item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Sample TODO
 *     responses:
 *       200:
 *         description: Successful creation of a new TODO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             example:
 *               id: 1
 *               name: Sample TODO
 *       400:
 *         description: Bad request due to validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Name field is incorect
 */
app.post('/todo', (req, res) => { 
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    const todo = {
        id: todos.length + 1,
        name: req.body.name
    }
    todos.push(todo)
    res.send(todo)
});

/**
 * @swagger
 * /todo/{id}:
 *   put:
 *     summary: Update a TODO by ID
 *     description: Update an existing TODO item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TODO item to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Updated TODO
 *     responses:
 *       200:
 *         description: Successful update of the TODO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             example:
 *               id: 1
 *               name: Updated TODO
 *       400:
 *         description: Bad request due to validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Name field is incorect
 *       404:
 *         description: TODO with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The TODO with the given ID was not found
 */
app.put('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) res.status(404).send('the todo with given ID was not found');
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    todo.name = req.body.name
    res.send(todo);
});

/**
 * @swagger
 * /todo/{id}:
 *   delete:
 *     summary: Delete a TODO by ID
 *     description: Delete an existing TODO item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TODO item to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful deletion of the TODO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             example:
 *               id: 1
 *               name: Deleted TODO
 *       404:
 *         description: TODO with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The TODO with the given ID was not found
 */
app.delete('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) res.status(404).send('the todo with given ID was not found');
    
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    res.send(todo);
});

function validateTodo(body) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(body, schema);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port}...'))