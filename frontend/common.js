let currentUserId = null;
let currentTimeRange =
    localStorage.getItem("timeRange") || "all";
const timeRangeSelect =
    document.getElementById("timeRangeSelect");

if (timeRangeSelect) {

    timeRangeSelect.value =
        currentTimeRange;

   timeRangeSelect.addEventListener(
    "change",
    () => {

        currentTimeRange =
            timeRangeSelect.value;

        localStorage.setItem(
            "timeRange",
            currentTimeRange
        );

        window.dispatchEvent(
            new CustomEvent("timeRangeChanged", {
                detail: currentTimeRange
            })
        );

        if (currentUserId) {

            window.dispatchEvent(
                new CustomEvent("userSelected", {
                    detail: currentUserId
                })
            );
        }
    }
);
}

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