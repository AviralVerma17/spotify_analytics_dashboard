
let monthlyTrendsChart = null;
let timeOfDayPatternsChart = null;
let listeningHoursChart = null;


window.addEventListener("userSelected", async (event) => {

    const userId = event.detail;


    if (!userId) {
        return;
    }

    console.log("Listening Patterns loading for user:", userId);
    const trendsResponse = await fetch(
        `/api/monthly-trends?user_id=${userId}`
    );

    if (!trendsResponse.ok) {
        console.error("Failed to load monthly trends");
        return;
    }

    const monthlyTrends = await trendsResponse.json();
    const trendsCanvas =
        document.getElementById("monthlyTrendsChart");

    if (monthlyTrendsChart) {
        monthlyTrendsChart.destroy();
    }

    monthlyTrendsChart = new Chart(trendsCanvas, {
        type: "line",

        data: {
            labels: monthlyTrends.map(item =>
                `${item.year}-${String(item.month).padStart(2, "0")}`
            ),

            datasets: [{
                label: "Total Plays",

                data: monthlyTrends.map(
                    item => item.total_plays
                ),

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
        `/api/time-of-day?user_id=${userId}`
    );

    if (!timeResponse.ok) {
        console.error("Failed to load time of day");
        return;
    }

    const timeOfDay = await timeResponse.json();
    if (timeOfDay.length > 0) {

        const peakTime = timeOfDay[0];

        document.getElementById("peakTime").textContent =
            peakTime.time_of_day;

    }

    const timeCanvas =
        document.getElementById("timeOfDayPatternsChart");

    if (timeOfDayPatternsChart) {
        timeOfDayPatternsChart.destroy();
    }

    timeOfDayPatternsChart = new Chart(timeCanvas, {
        type: "bar",

        data: {
            labels: timeOfDay.map(item => item.time_of_day),

            datasets: [{
                label: "Total Plays",

                data: timeOfDay.map(
                    item => item.total_plays
                ),

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
    const hoursResponse = await fetch(
        `/api/listening-hours?user_id=${userId}`
    );

    if (!hoursResponse.ok) {
        console.error("Failed to load listening hours");
        return;
    }

    const listeningHours = await hoursResponse.json();
    if (listeningHours.length > 0) {

        const peakHour = listeningHours[0];

        document.getElementById("peakHour").textContent =
            `${peakHour.listening_hour}:00`;

    }

    const hoursCanvas =
        document.getElementById("listeningHoursChart");

    if (listeningHoursChart) {
        listeningHoursChart.destroy();
    }

    listeningHoursChart = new Chart(hoursCanvas, {
        type: "bar",

        data: {
            labels: listeningHours.map(item =>
                `${item.listening_hour}:00`
            ),

            datasets: [{
                label: "Total Plays",

                data: listeningHours.map(
                    item => item.total_plays
                ),

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
        `/api/listening-repetition?user_id=${userId}`
    );

    if (!repetitionResponse.ok) {
        console.error("Failed to load listening repetition");
        return;
    }

    const repetition = await repetitionResponse.json();

    if (repetition.length > 0) {
        document.getElementById("avgPlays").textContent =
            Number(repetition[0].avg_plays).toFixed(2);
    }
    const concentrationResponse = await fetch(
        `/api/listening-concentration?user_id=${userId}`
    );

    if (!concentrationResponse.ok) {
        console.error("Failed to load listening concentration");
        return;
    }

    const concentration = await concentrationResponse.json();

    if (concentration.length > 0) {

        const concentrationData = concentration[0];

        document.getElementById("concentrationPercent").textContent =
            concentrationData.percent_top_song + "%";
    }

    const insightsContainer =
        document.getElementById("listeningInsights");

    if (
        listeningHours.length > 0 &&
        timeOfDay.length > 0 &&
        concentration.length > 0
    ) {

        const peakHour = listeningHours.reduce(
            (max, hour) =>
                Number(hour.total_plays) > Number(max.total_plays)
                    ? hour
                    : max,
            listeningHours[0]
        );
        const peakTime = timeOfDay[0];
        const concentrationData = concentration[0];

        insightsContainer.innerHTML = `
    <div class="insight-row">
        <span class="insight-icon">◷</span>

        <strong>Peak listening period</strong>

        <span>
            You listen most during the
            ${peakTime.time_of_day.toLowerCase()}.
        </span>
    </div>

    <div class="insight-row">
        <span class="insight-icon">◉</span>

        <strong>Most active hour</strong>

        <span>
            Your most active listening hour is
            ${peakHour.listening_hour}:00.
        </span>
    </div>

    <div class="insight-row">
        <span class="insight-icon">♫</span>

        <strong>Most repeated song</strong>

        <span>
            ${concentrationData.top_song}
            accounts for
            ${concentrationData.percent_top_song}%
            of your total plays.
        </span>
    </div>
`;
    }

});