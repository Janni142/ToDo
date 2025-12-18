const input = document.getElementById("todo-input");
const colorInput = document.getElementById("color-input");
const prioInput = document.getElementById("prio-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const themeBtn = document.getElementById("theme-toggle");

// -------- THEME --------
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    themeBtn.textContent = dark ? "☀️" : "🌙";
});

// -------- TODOS --------
let todos = JSON.parse(localStorage.getItem("todos")) || [];
renderTodos();

addBtn.addEventListener("click", addTodo);
input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    if (!input.value.trim()) return;

    todos.push({
        text: input.value,
        completed: false,
        color: colorInput.value,
        prio: prioInput.value
    });

    save();
    renderTodos();
    input.value = "";
}

function renderTodos() {
    list.innerHTML = "";

    todos.forEach((todo, i) => {
        const li = document.createElement("li");
        li.style.borderLeftColor = todo.color;
        if (todo.completed) li.classList.add("completed");

        const top = document.createElement("div");
        top.className = "todo-top";

        const text = document.createElement("span");
        text.textContent = todo.text;
        text.onclick = () => toggleDone(i);

        const actions = document.createElement("div");
        actions.className = "todo-actions";

        const edit = document.createElement("button");
        edit.textContent = "✏️";
        edit.onclick = () => editTodo(i);

        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.onclick = () => deleteTodo(i);

        actions.append(edit, del);
        top.append(text, actions);

        const prio = document.createElement("div");
        prio.className = `prio ${todo.prio}`;
        prio.textContent = todo.prio.toUpperCase();

        li.append(top, prio);
        list.appendChild(li);
    });
}

function toggleDone(i) {
    todos[i].completed = !todos[i].completed;
    save();
    renderTodos();
}

function editTodo(i) {
    const newText = prompt("Aufgabe bearbeiten:", todos[i].text);
    if (newText !== null && newText.trim()) {
        todos[i].text = newText;
        save();
        renderTodos();
    }
}

function deleteTodo(i) {
    if (confirm("Eintrag löschen?")) {
        todos.splice(i, 1);
        save();
        renderTodos();
    }
}

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}
