const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const { authenticateApiKey } = require("./auth"); // Path to the authentication middleware
const specs = require("./swaggerConfig"); // Import the Swagger configuration
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(express.json());

//all methods need authentication with API key except get all tasks
app.use((req, res, next) => {
  if (req.path !== "/task" || req.method !== "GET") {
    authenticateApiKey(req, res, next);
  } else {
    next(); // Skip authentication for GET /task route
  }
});

const tasks = [
  { id: 1, title: "task1" },
  { id: 2, title: "task2" },
  { id: 3, title: "task3" },
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

app.get("/task", (req, res) => {
  res.send(tasks);
});

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve a task item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task item to retrieve
 *         schema:
 *           type: integer
 *       - in: header
 *         name: api_key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of the task
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
 *               title: Sample Task
 *       401:
 *         description: Unauthorized - API key missing or invalid
 *       404:
 *         description: Task with the given ID was not found
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
app.get("/task/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task)
    return res.status(404).send("the TASK with given ID was not found");
  res.send(task);
});

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task item
 *     parameters:
 *       - in: header
 *         name: api_key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
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
 *               title: Sample Task
 *     responses:
 *       200:
 *         description: Successful creation of a new task
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
 *               title: Sample Task
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
 *               message: Error message describing the validation error
 *       401:
 *         description: Unauthorized - API key missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Unauthorized - API key missing or invalid
 */
app.post("/task", (req, res) => {
  const { error } = validateTodo(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
  };
  tasks.push(task);
  res.send(task);
});

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     description: Update an existing task item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task item to update
 *         schema:
 *           type: integer
 *       - in: header
 *         name: api_key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
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
 *               title: Updated Task Title
 *     responses:
 *       200:
 *         description: Successful update of the task
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
 *               title: Updated Task Title
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
 *               message: Error message describing the validation error
 *       401:
 *         description: Unauthorized - API key missing or invalid
 *       404:
 *         description: Task with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The task with the given ID was not found
 */
app.put("/task/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task) res.status(404).send("the task with given ID was not found");
  const { error } = validateTodo(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  task.title = req.body.title;
  res.send(task);
});

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Delete an existing task item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task item to delete
 *         schema:
 *           type: integer
 *       - in: header
 *         name: api_key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful deletion of the task
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
 *               title: Deleted Task
 *       401:
 *         description: Unauthorized - API key missing or invalid
 *       404:
 *         description: Task with the given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: The task with the given ID was not found
 */
app.delete("/task/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task) res.status(404).send("the task with given ID was not found");

  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  res.send(task);
});

function validateTodo(body) {
  const schema = {
    title: Joi.string().required(),
  };
  return Joi.validate(body, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port..."));
module.exports = app;
