function getSpotifyAccessToken() {

    return localStorage.getItem(
        "spotify_access_token"
    );
}


async function spotifyFetch(endpoint) {

    const token =
        getSpotifyAccessToken();

    if (!token) {
        throw new Error(
            "Spotify access token not found"
        );
    }

    const response =
        await fetch(
            `https://api.spotify.com/v1${endpoint}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {

        const errorData =
            await response.text();

        console.error(
            "Spotify API error:",
            errorData
        );

        throw new Error(
            `Spotify API request failed: ${response.status}`
        );
    }

    return response.json();
}
async function getSpotifyProfile() {

    const profile =
        await spotifyFetch("/me");

    return profile;
}
async function getLinkedSqlUser() {

    const profile =
        await getSpotifyProfile();

    const response =
        await fetch(
            `/api/user-by-spotify?spotify_id=${encodeURIComponent(profile.account_id)}`
        );

    if (!response.ok) {

        throw new Error(
            "Could not find linked SQL user"
        );
    }

    return response.json();
}
async function getRecentlyPlayed() {

    const data =
        await spotifyFetch(
            "/me/player/recently-played?limit=50"
        );

    return data;
}

async function syncRecentlyPlayed(userId) {

    const data =
        await getRecentlyPlayed();

    const response =
        await fetch(
            "/api/sync-recently-played",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId,
                    items: data.items
                })
            }
        );

    if (!response.ok) {

        const errorData =
            await response.text();

        console.error(
            "Sync error:",
            errorData
        );

        throw new Error(
            `Recently played sync failed: ${response.status}`
        );
    }

    return response.json();
}