let currentUserId = null;


async function loadSpotifyUser() {

    try {

        const user =
            await getLinkedSqlUser();

        currentUserId =
            user.user_id;

        const syncStatus =
            document.getElementById("syncStatus");

        if (syncStatus) {

            syncStatus.textContent =
                "⟳ Syncing Spotify data...";

        }

        const syncResult =
            await syncRecentlyPlayed(
                currentUserId
            );

        if (syncStatus) {

            syncStatus.textContent =
                `✓ Spotify synced · ${syncResult.inserted} new plays`;

        }

        localStorage.setItem(
            "selectedUser",
            currentUserId
        );

        window.dispatchEvent(
            new CustomEvent("userSelected", {
                detail: currentUserId
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