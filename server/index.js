const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");
const { reset } = require('nodemon');
// middleware //
app.use(cors());
app.use(express.json()) // req.body


// Routes ///

// CREATE A TODO
app.post("/todos", async(req, res) => {
    try{
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]);
        res.json(newTodo.rows[0])
    } catch(err) {
        console.error(err.message)
    }
})

// READ ALL TODOS
app.get("/todos", async(req, res)=>{
    try {
        const todos = await pool.query("SELECT * FROM todo");
        res.json(todos.rows)
    } catch (error) {
         console.error(error.message)
    }
})

// READ AN INDIVIDUAL TODO
app.get("/todos/:id", async(req, res)=> {
    try {
        const { id } = req.params
        const todo = await pool.query(
            'SELECT * FROM todo WHERE todo_id=($1)',
            [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})

// UPDATE A TODO
app.put("/todos/:id", async(req, res)=> {
    try {
        const {id} = req.params
        const {description} = req.body
        const updateTodo = await pool.query(
            "UPDATE todo SET description=($1) WHERE todo_id=($2)",
            [description, id]
        );
        res.redirect('/todos')
    } catch (err) {
        console.error(err.message)
    }
})

// DELETE A TODO
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params
        await pool.query(
            "DELETE FROM todo WHERE todo_id=($1)",
            [id]
        );
        res.json("success")
    } catch (err) {
        console.error(err.message)
    }
})

const port = 5000
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});