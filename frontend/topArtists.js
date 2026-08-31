const topArtistsContainer = document.getElementById("topArtists");
let topArtistsChart = null;


window.addEventListener("userSelected", async (event) => {

    const userId = event.detail;

    if (!userId) {
        topArtistsContainer.innerHTML =
            "Select a user to view your top artists.";
        return;
    }


    const response = await fetch(
        `/api/top-artists?user_id=${userId}`
    );

    const topArtists = await response.json();

    document.getElementById("totalArtists").textContent =
        topArtists.length;

    document.getElementById("mostPlayedArtist").textContent =
        topArtists.length > 0
            ? topArtists[0].artist_name
            : "--";

    document.getElementById("highestArtistPlays").textContent =
        topArtists.length > 0
            ? topArtists[0].total_plays
            : "--";

    if (topArtists.length > 0) {

        const totalPlays = topArtists.reduce(
            (sum, artist) => sum + Number(artist.total_plays),
            0
        );

        const average =
            totalPlays / topArtists.length;

        document.getElementById("averageArtistPlays").textContent =
            average.toFixed(2);

    } else {

        document.getElementById("averageArtistPlays").textContent =
            "--";
    }


    topArtistsContainer.innerHTML = "";


    topArtists.forEach((artist, index) => {

        const artistElement = document.createElement("div");

        artistElement.className = "artist-row";

        artistElement.innerHTML = `
            <span class="artist-rank">${index + 1}</span>

            <div class="artist-info">
                <strong>${artist.artist_name}</strong>
                <span>${artist.total_plays} ${Number(artist.total_plays) === 1
                ? "play"
                : "plays"
            }</span>
            </div>
        `;

        topArtistsContainer.appendChild(artistElement);
    });
    const chartArtists = topArtists.slice(0, 10);

    const chartCanvas = document.getElementById("topArtistsChart");

    if (topArtistsChart) {
        topArtistsChart.destroy();
    }

    topArtistsChart = new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: chartArtists.map(artist => artist.artist_name),

            datasets: [{
                label: "Plays",
                data: chartArtists.map(artist => artist.total_plays),
                backgroundColor: "rgba(53, 208, 127, 0.55)",
                borderColor: "#35d07f",
                borderWidth: 1,
                borderRadius: 6
            }]
        },

        options: {
            indexAxis: "y",
            responsive: true,

            animations: {
                x: {
                    duration: 1500,
                    from: 0
                }
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#121a18",
                    titleColor: "#f1f5f3",
                    bodyColor: "#b8c1be",
                    borderColor: "#2d4a3d",
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    beginAtZero: true,

                    grid: {
                        color: "#202a2d"
                    },

                    ticks: {
                        color: "#7f8b87",
                        precision: 0
                    }
                },

                y: {
                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#7f8b87",
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });

});