const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const filePath = './todos.json';

const readTodosFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
};

const writeTodosToFile = (todos) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(todos), (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

app.get('/todos', async (req, res) => {
    try {
        const todos = await readTodosFromFile();
        res.json(todos);
    } catch (err) {
        res.status(500).send('Error reading todos');
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { text, completed } = req.body;
        const todos = await readTodosFromFile();
        todos.push({ text, completed });
        await writeTodosToFile(todos);
        res.json(todos);
    } catch (err) {
        res.status(500).send('Error adding todo');
    }
});

app.delete('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const todos = await readTodosFromFile();
        todos.splice(id, 1);
        await writeTodosToFile(todos);
        res.json(todos);
    } catch (err) {
        res.status(500).send('Error deleting todo');
    }
});

app.patch('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { text } = req.body;
    try {
        const todos = await readTodosFromFile();
        if (text !== undefined) {
            todos[id].text = text;
        }
        await writeTodosToFile(todos);
        res.json(todos);
    } catch (err) {
        res.status(500).send('Error updating todo');
    }
});

app.patch('/todos/:id/toggle', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const todos = await readTodosFromFile();
        todos[id].completed = !todos[id].completed;
        await writeTodosToFile(todos);
        res.json(todos);
    } catch (err) {
        res.status(500).send('Error toggling todo');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
