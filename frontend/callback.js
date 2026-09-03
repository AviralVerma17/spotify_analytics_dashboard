const params = new URLSearchParams(window.location.search);

const code = params.get("code");
const returnedState = params.get("state");
const error = params.get("error");


async function exchangeCodeForToken() {

    if (error) {
        document.body.innerHTML =
            `<h2>Spotify login failed: ${error}</h2>`;
        return;
    }


    const savedState =
        localStorage.getItem("spotify_state");



    if (!returnedState || returnedState !== savedState) {

        document.body.innerHTML =
            "<h2>Invalid state. Login rejected.</h2>";

        return;
    }


    const codeVerifier =
        localStorage.getItem("spotify_code_verifier");


    if (!codeVerifier) {

        document.body.innerHTML =
            "<h2>Code verifier missing.</h2>";

        return;
    }


    const response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({

                client_id:
                    "2d84409a946e4cc58816d4f567aaa774",

                grant_type:
                    "authorization_code",

                code:
                    code,

                redirect_uri:
                    "http://127.0.0.1:3000/auth/callback",

                code_verifier:
                    codeVerifier
            })
        }
    );


    if (!response.ok) {

        const errorData =
            await response.text();

        console.error(errorData);

        document.body.innerHTML =
            "<h2>Failed to get Spotify access token.</h2>";

        return;
    }


    const tokenData =
        await response.json();


    console.log("Token received!");
    console.log("Token type:", tokenData.token_type);
    console.log("Expires in:", tokenData.expires_in);


    localStorage.setItem(
        "spotify_access_token",
        tokenData.access_token
    );


    if (tokenData.refresh_token) {

        localStorage.setItem(
            "spotify_refresh_token",
            tokenData.refresh_token
        );
    }


    localStorage.setItem(
        "spotify_token_expires_in",
        tokenData.expires_in
    );


    localStorage.removeItem(
        "spotify_code_verifier"
    );

    localStorage.removeItem(
        "spotify_state"
    );


    window.location.href = "/";
}


exchangeCodeForToken();