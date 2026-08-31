const userSelect = document.getElementById("userSelect");


async function loadUsers() {

    const response = await fetch("http://localhost:3000/api/users");
    const users = await response.json();

    users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.user_id;
        option.textContent = user.username;

        userSelect.appendChild(option);
    });


    const savedUser = localStorage.getItem("selectedUser");

    if (savedUser) {
        userSelect.value = savedUser;

        window.dispatchEvent(
            new CustomEvent("userSelected", {
                detail: savedUser
            })
        );
    }
}


userSelect.addEventListener("change", () => {

    const userId = userSelect.value;

    if (userId) {

        localStorage.setItem("selectedUser", userId);

        window.dispatchEvent(
            new CustomEvent("userSelected", {
                detail: userId
            })
        );

    } else {

        localStorage.removeItem("selectedUser");
    }

});


loadUsers();