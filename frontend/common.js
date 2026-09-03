const userSelect = document.getElementById("userSelect");


async function loadSpotifyUser() {

    try {

        const user =
            await getLinkedSqlUser();

        console.log(
            "Logged in SQL user:",
            user
        );


        userSelect.innerHTML = "";


        const option =
            document.createElement("option");

        option.value = user.user_id;
        option.textContent = user.username;

        userSelect.appendChild(option);


        userSelect.value =
            user.user_id;


        localStorage.setItem(
            "selectedUser",
            user.user_id
        );


        window.dispatchEvent(
            new CustomEvent("userSelected", {
                detail: user.user_id
            })
        );

    } catch (error) {

        console.error(
            "Could not load Spotify user:",
            error
        );

    }
}


loadSpotifyUser();