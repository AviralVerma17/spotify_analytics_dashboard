let listeningTrendChart = null;
let timeOfDayChart = null;


window.addEventListener("userSelected", async (event) => {
    const userId = event.detail;

    if (!userId) {
        return;
    }

    const response = await fetch(
        `http://localhost:3000/api/user-summary?user_id=${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load user summary");
    }

    const data = await response.json();

    if (data.length === 0) {
        console.log("No data found for this user.");
        return;
    }

    const user = data[0];

    document.getElementById("totalPlays").textContent = user.total_plays;
    document.getElementById("uniqueSongs").textContent = user.total_songs;
    document.getElementById("uniqueArtists").textContent = user.total_artists;

    const topSongsResponse = await fetch(
        `http://localhost:3000/api/top-songs?user_id=${userId}`
    );

    if (!topSongsResponse.ok) {
        console.error("Failed to load top songs");
        return;
    }

    const topSongs = await topSongsResponse.json();

    if (topSongs.length > 0) {
        document.getElementById("topSong").textContent = topSongs[0].track_name;
    }
    const topSongsContainer = document.getElementById("topSongs");

    topSongsContainer.innerHTML = "";

    topSongs.forEach(song => {
        const songElement = document.createElement("div");

        songElement.className = "song-row";

        songElement.innerHTML = `
        <span class="song-rank">${song.song_rank}</span>

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
    const topArtistsResponse = await fetch(
        `http://localhost:3000/api/top-artists?user_id=${userId}`
    );

    if (!topArtistsResponse.ok) {
        console.error("Failed to load top artists");
        return;
    }

    const topArtists = await topArtistsResponse.json();

    const topArtistsContainer = document.getElementById("topArtists");

    topArtistsContainer.innerHTML = "";

    topArtists.slice(0, 5).forEach((artist, index) => {
        const artistElement = document.createElement("div");

        artistElement.className = "artist-row";

        artistElement.innerHTML = `
        <span class="artist-rank">${index + 1}</span>

        <div class="artist-info">
            <strong>${artist.artist_name}</strong>
            <span>${artist.total_plays} ${Number(artist.total_plays) === 1 ? "play" : "plays"}</span>
        </div>
    `;

        topArtistsContainer.appendChild(artistElement);
    });
    const trendsResponse = await fetch(
        `http://localhost:3000/api/monthly-trends?user_id=${userId}`
    );

    if (!trendsResponse.ok) {
        console.error("Failed to load monthly trends");
        return;
    }

    const monthlyTrends = await trendsResponse.json();
    const chartCanvas = document.getElementById("listeningTrendChart");

    if (listeningTrendChart) {
        listeningTrendChart.destroy();
    }

    listeningTrendChart = new Chart(chartCanvas, {
        type: "line",

        data: {
            labels: monthlyTrends.map(item =>
                `${item.year}-${String(item.month).padStart(2, "0")}`
            ),

            datasets: [{
                label: "Total Plays",
                data: monthlyTrends.map(item => item.total_plays),
                borderColor: "#35d07f",
                backgroundColor: "rgba(53, 208, 127, 0.08)",
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.35,
                fill: true
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
    const timeResponse = await fetch(
        `http://localhost:3000/api/time-of-day?user_id=${userId}`
    );

    if (!timeResponse.ok) {
        console.error("Failed to load time of day");
        return;
    }

    const timeOfDay = await timeResponse.json();
    const timeCanvas = document.getElementById("timeOfDayChart");

    if (timeOfDayChart) {
        timeOfDayChart.destroy();
    }

    timeOfDayChart = new Chart(timeCanvas, {
        type: "bar",

        data: {
            labels: timeOfDay.map(item => item.time_of_day),

            datasets: [{
                label: "Total Plays",
                data: timeOfDay.map(item => item.total_plays),
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
    const repetitionResponse = await fetch(
        `http://localhost:3000/api/listening-repetition?user_id=${userId}`
    );

    if (!repetitionResponse.ok) {
        console.error("Failed to load listening repetition");
        return;
    }

    const repetition = await repetitionResponse.json();

    if (repetition.length === 0) {
        console.log("No repetition data found");
        return;
    }

    const repetitionData = repetition[0];

    document.getElementById("avgPlays").textContent =
        repetitionData.avg_plays;

    const concentrationResponse = await fetch(
        `http://localhost:3000/api/listening-concentration?user_id=${userId}`
    );

    if (!concentrationResponse.ok) {
        console.error("Failed to load listening concentration");
        return;
    }

    const concentration = await concentrationResponse.json();

    if (concentration.length === 0) {
        console.log("No concentration data found");
        return;
    }

    const concentrationData = concentration[0];

    document.getElementById("concentrationPercent").textContent =
        concentrationData.percent_top_song + "%";
    document.getElementById("concentrationFill").style.width =
        concentrationData.percent_top_song + "%";

    document.getElementById("concentrationText").textContent =
        `${concentrationData.top_song} accounts for ${concentrationData.percent_top_song}% of your plays`;
});