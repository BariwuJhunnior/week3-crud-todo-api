require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(cors("*"));

app.use(express.json());

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false },
];

//GET Home
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Todo API!",
    endpoints: {
      GET: ["/todos", "/todos/active", "/todos/completed", "/todos/:id"],
      POST: ["/todos"],
      PATCH: ["/todos/:id"],
      DELETE: ["/todos/:id"],
    },
  });
});

// GET All – Read
app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

//GET Active todos list: Not Completed
app.get("/todos/active", (req, res) => {
  const active = todos.filter((t) => !t.completed);

  res.json(active);
});

//GET Completed todos list
app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

//GET Single Todo with ID
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((t) => t.id === id);
  if (!todo)
    return res.status(404).json({
      message: "Todo Not Found.",
    });

  res.status(200).json(todo);
});

// POST New – Create
app.post("/todos", (req, res) => {
  const { task, completed } = req.body;

  if (!task)
    return res.status(400).json({
      Error: "Required Field Failure!",
      Fields: ["task", "completed:(True/False)"],
    });

  const newTodo = { id: todos.length + 1, ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send(); // Silent success
});

//Error Handler Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error!" });
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
