const express = require('express');
const Joi = require('joi');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swaggerConfig'); // Import the Swagger configuration
const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json())

const tasks = [
    {id:1, title: "task1"},
    {id:2, title: "task2"},
    {id:3, title: "task3"}
];

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of tasks
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/task', (req, res) => {
    res.send(tasks)
});

/**
 * @swagger
 * /task/:id:
 *   get:
 *     summary: Get task by id
 *     description: Get task by id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
app.get('/task/:id', (req, res) => {
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) return res.status(404).send('the TASK with given ID was not found');
    res.send(task);
});

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new TASK
 *     description: Create a new TASK item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             example:
 *               title: Sample TASK
 *     responses:
 *       200:
 *         description: Successful creation of a new TASK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *             example:
 *               id: 1
 *               title: Sample TASK
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
 *               message: title field is incorect
 */
app.post('/task', (req, res) => { 
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    const task = {
        id: tasks.length + 1,
        title: req.body.title
    }
    tasks.push(task)
    res.send(task)
});

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a TASK by ID
 *     description: Update an existing TASK item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TASK item to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             example:
 *               title: Updated TASK
 *     responses:
 *       200:
 *         description: Successful update of the TASK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *             example:
 *               id: 1
 *               title: Updated TASK
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
 *               message: title field is incorect
 *       404:
 *         description: TASK with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The TASK with the given ID was not found
 */
app.put('/task/:id', (req, res) => {
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) res.status(404).send('the task with given ID was not found');
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    task.title = req.body.title
    res.send(task);
});

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a TASK by ID
 *     description: Delete an existing TASK item by its ID
 *     parameters:
 *       - in: path
 *         title: id
 *         required: true
 *         description: ID of the TASK item to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful deletion of the TASK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *             example:
 *               id: 1
 *               title: Deleted TASK
 *       404:
 *         description: TASK with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The TASK with the given ID was not found
 */
app.delete('/task/:id', (req, res) => {
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) res.status(404).send('the task with given ID was not found');
    
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    res.send(task);
});

function validateTodo(body) {
    const schema = {
        title: Joi.string().required()
    };
    return Joi.validate(body, schema);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port}...'))