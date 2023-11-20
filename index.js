const Joi = require('joi');
const express = require('express');
const app = express();
const { specs, swaggerUi } = require('../swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json())

const todos = [
    {id:1, name: "todO1"},
    {id:2, name: "todO2"},
    {id:3, name: "todO3"}
];

app.get('/', (req, res) => {
    res.send("hello world")
});

app.get('/todo', (req, res) => {
    res.send(todos)
});

app.get('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) return res.status(404).send('the toDo with given ID was not found');
    res.send(todo);
});

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

app.put('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) res.status(404).send('the todo with given ID was not found');
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message)
});

app.delete('/todo/:id', (req, res) => {
    const todo = todos.find(c => c.id === parseInt(req.params.id));
    if(!todo) res.status(404).send('the todo with given ID was not found');
    
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    res.send(todo);
});

function validateTodo(todo) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(req.body, schema);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port}...'))