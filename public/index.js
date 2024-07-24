document.addEventListener('DOMContentLoaded', () => {
    const ul = document.getElementById('todo-list');
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');

    const fetchTodos = async () => {
        const response = await fetch('http://localhost:3000/todos');
        const todos = await response.json();
        renderTodos(todos);
    };

    const addTodo = async (todo) => {
        const response = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        const todos = await response.json();
        renderTodos(todos);
    };

    const deleteTodo = async (id) => {
        const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'DELETE',
        });
        const todos = await response.json();
        renderTodos(todos);
    };

    const toggleComplete = async (id) => {
        const response = await fetch(`http://localhost:3000/todos/${id}/toggle`, {
            method: 'PATCH',
        });
        const todos = await response.json();
        renderTodos(todos);
    };

    const editTodo = async (id, newText) => {
        const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newText }),
        });
        const todos = await response.json();
        renderTodos(todos);
    };

    const renderTodos = (todos) => {
        ul.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerText = todo.text;
            if (todo.completed) {
                li.classList.add('completed');
            }

            const toggleButton = document.createElement('button');
            toggleButton.innerText = todo.completed ? 'Undo' : 'Complete';
            toggleButton.addEventListener('click', () => {
                toggleComplete(index);
            });

            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.addEventListener('click', () => {
                const newText = prompt('Edit your task', todo.text);
                if (newText) {
                    editTodo(index, newText);
                }
            });

            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', () => {
                deleteTodo(index);
            });

            li.appendChild(toggleButton);
            li.appendChild(editButton);
            li.appendChild(removeButton);
            ul.appendChild(li);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodo = input.value.trim();
        if (newTodo) {
            addTodo({
                text: newTodo,
                completed: false
            });
            input.value = '';
        }
    });

    fetchTodos();
});
