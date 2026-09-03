const clientId = "2d84409a946e4cc58816d4f567aaa774";

const redirectUri =
    "http://127.0.0.1:3000/auth/callback";

const scope =
    "user-read-private user-read-email user-top-read";


function generateRandomString(length) {

    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const values =
        crypto.getRandomValues(
            new Uint8Array(length)
        );

    return values.reduce(
        (acc, x) =>
            acc + possible[x % possible.length],
        ""
    );
}


async function generateCodeChallenge(codeVerifier) {

    const encoder = new TextEncoder();

    const data =
        encoder.encode(codeVerifier);

    const digest =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return btoa(
        String.fromCharCode(
            ...new Uint8Array(digest)
        )
    )
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}


async function loginWithSpotify() {

    const codeVerifier =
        generateRandomString(64);

    const codeChallenge =
        await generateCodeChallenge(
            codeVerifier
        );

    const state =
        generateRandomString(16);


    localStorage.setItem(
        "spotify_code_verifier",
        codeVerifier
    );

    localStorage.setItem(
        "spotify_state",
        state
    );
    console.log("State saved:", localStorage.getItem("spotify_state"));


    const authUrl =
        new URL(
            "https://accounts.spotify.com/authorize"
        );


    const params = {

        response_type: "code",

        client_id: clientId,

        scope: scope,

        code_challenge_method: "S256",

        code_challenge: codeChallenge,

        redirect_uri: redirectUri,

        state: state
    };


    authUrl.search =
        new URLSearchParams(params).toString();


    window.location.href =
        authUrl.toString();
}


document
    .getElementById("spotifyLoginButton")
    .addEventListener(
        "click",
        loginWithSpotify
    );