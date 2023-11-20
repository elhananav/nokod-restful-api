const express = require('express');
const app = express();

const toDos = [
    {id:1, name: "toDO1"},
    {id:2, name: "toDO2"},
    {id:3, name: "toDO3"}
];

app.get('/', (req, res) => {
    res.send("hello world")
});

app.get('/toDo', (req, res) => {
    res.send(toDos)
});

app.get('/toDo/:id', (req, res) => {
    const toDo = toDos.find(c => c.id === parseInt(req.params.id));
    if(!toDo) res.status(404).send('the toDo with given ID was not found');
    res.send(toDo);
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port}...'))