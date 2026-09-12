const userSelect = document.getElementById("userSelect");


async function loadSpotifyUser() {

    try {

        const user =
            await getLinkedSqlUser();

        

        const syncStatus =
            document.getElementById("syncStatus");

        syncStatus.textContent =
            "⟳ Syncing Spotify data...";

        const syncResult =
            await syncRecentlyPlayed(user.user_id);

        syncStatus.textContent =
            `✓ Spotify synced · ${syncResult.inserted} new plays`;
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

        const syncStatus =
            document.getElementById("syncStatus");

        if (syncStatus) {
            syncStatus.textContent =
                "⚠ Spotify sync failed";
        }

        console.error(
            "Could not load Spotify user:",
            error
        );

    }
}

loadSpotifyUser();