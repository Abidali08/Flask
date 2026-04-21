const URL = 'https://refactored-sniffle-4wp7px575x4f7756-3000.app.github.dev';

let editUserId = null;

// CREATE or UPDATE
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (editUserId) {
        // UPDATE
        await fetch(`${URL}/users/${editUserId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        editUserId = null;
    } else {
        // CREATE
        await fetch(`${URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
    }

    document.getElementById("userForm").reset();
    getUsers();
});

// READ
async function getUsers() {
    const response = await fetch(`${URL}/users`);
    const users = await response.json();

    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// DELETE
async function deleteUser(id) {
    if (!confirm("Are you sure to delete?")) return;

    await fetch(`${URL}/users/${id}`, {
        method: "DELETE"
    });

    getUsers();
}

// SET FORM FOR UPDATE
function editUser(id, name, email) {
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    editUserId = id;
}

// Load users on start
window.onload = getUsers;