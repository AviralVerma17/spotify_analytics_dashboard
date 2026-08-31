console.log("topSongs.js loaded");
const topSongsContainer = document.getElementById("topSongs");
let topSongsChart = null;


window.addEventListener("userSelected", async (event) => {

    const userId = event.detail;
    
    if (!userId) {
        topSongsContainer.innerHTML =
            "Select a user to view your top songs.";
        return;
    }

    const response = await fetch(
        `/api/all-top-songs?user_id=${userId}`
    );

    const topSongs = await response.json();
    document.getElementById("totalSongs").textContent =
        topSongs.length;

    document.getElementById("mostPlayedSong").textContent =
        topSongs.length > 0 ? topSongs[0].track_name : "--";

    document.getElementById("highestPlays").textContent =
        topSongs.length > 0 ? topSongs[0].total_plays : "--";

    if (topSongs.length > 0) {

        const totalPlays = topSongs.reduce(
            (sum, song) => sum + Number(song.total_plays),
            0
        );

        const average =
            totalPlays / topSongs.length;

        document.getElementById("averagePlays").textContent =
            average.toFixed(2);

    } else {

        document.getElementById("averagePlays").textContent =
            "--";
    }

    topSongsContainer.innerHTML = "";

    topSongs.forEach((song, index) => {
        const songElement = document.createElement("div");

        songElement.className = "song-row";

        songElement.innerHTML = `
        <span class="song-rank">${index + 1}</span>

        <div class="song-info">
            <strong>${song.track_name}</strong>
            <span>${song.artist_name}</span>
        </div>

        <span class="song-plays">
            ${song.total_plays} ${Number(song.total_plays) === 1 ? "play" : "plays"}
        </span>
        `;

        topSongsContainer.appendChild(songElement);
    });
    const chartSongs = topSongs.slice(0, 10);

    const chartCanvas = document.getElementById("topSongsChart");

    if (topSongsChart) {
        topSongsChart.destroy();
    }

    topSongsChart = new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: chartSongs.map(song => song.track_name),

            datasets: [{
                label: "Plays",
                data: chartSongs.map(song => song.total_plays),
                backgroundColor: "rgba(53, 208, 127, 0.55)",
                borderColor: "#35d07f",
                borderWidth: 1,
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,

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
                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#7f8b87",
                        font: {
                            size: 11
                        }
                    }
                },

                y: {
                    beginAtZero: true,

                    grid: {
                        color: "#202a2d"
                    },

                    ticks: {
                        color: "#7f8b87",
                        precision: 0,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
});
