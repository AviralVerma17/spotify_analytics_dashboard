const db = require("./db");
const path = require("path");
const express = require("express");
const asyncHandler = require("./asyncHandler");
const errorHandler = require("./errorHandler");
const app = express();

app.use(express.json({limit:"1mb"}));


app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/auth/callback", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/callback.html")
    );
});


app.get("/api/test", (req, res) => {
    res.json({
        message: "API working"
    });
});


app.get("/api/user-summary", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }

    const sql = `SELECT
users.username,
count(*) as total_plays,
count(distinct listening_history.track_id) as total_songs,
count(distinct tracks.artist_id) as total_artists,
min(listening_history.played_at) as first_played,
max(listening_history.played_at) as last_played
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=?
group by 
users.user_id, users.username
order by total_plays desc;`;

    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));


app.get("/api/users", asyncHandler(async (req, res) => {

    const [results] = await db.query("SELECT * FROM users");

    res.json(results);

}));
app.get("/api/user-by-spotify", asyncHandler(async (req, res) => {

    const spotifyId = req.query.spotify_id;
    const username = req.query.username;

    if (!spotifyId) {
        return res.status(400).json({
            error: "spotify_id is required"
        });
    }

    const [results] = await db.query(
        `SELECT user_id, username
         FROM users
         WHERE spotify_account_id = ?`,
        [spotifyId]
    );

    if (results.length > 0) {
        return res.json(results[0]);
    }

    if (!username) {
        return res.status(400).json({
            error: "username is required for new Spotify users"
        });
    }

    await db.query(
        `INSERT INTO users
            (username, spotify_account_id)
         VALUES (?, ?)`,
        [username, spotifyId]
    );

    const [newUser] = await db.query(
        `SELECT user_id, username
         FROM users
         WHERE spotify_account_id = ?`,
        [spotifyId]
    );

    res.json(newUser[0]);
}));

app.get("/api/top-songs", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }
    const sql = `with song_plays as(
    select
    users.user_id,
    users.username,
    tracks.track_id,
    tracks.track_name,
    artists.artist_name,
    count(*) as total_plays
    from listening_history
    join users
    on listening_history.user_id=users.user_id
    join tracks
    on listening_history.track_id=tracks.track_id
    join artists
    on tracks.artist_id=artists.artist_id
    WHERE users.user_id = ?
    group by
    users.user_id,
    users.username,
    tracks.track_id,
    tracks.track_name,
    artists.artist_name
),

ranked_songs as (
    select
    username,
    track_name,
    artist_name,
    total_plays,
    row_number() over(
        partition by user_id
        order by total_plays desc
    ) as song_rank
    from song_plays
)

select
username,
track_name,
artist_name,
total_plays,
song_rank
from ranked_songs
where song_rank<=3
order by username, song_rank;`;

    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));

app.get("/api/db-check", asyncHandler(async (req, res) => {

    const [results] = await db.query(`
        SELECT
            DATABASE() AS database_name,
            @@hostname AS hostname,
            @@port AS port,
            COUNT(*) AS listening_rows
        FROM listening_history
        WHERE user_id = 1
    `);

    res.json(results[0]);
}));

app.get("/api/all-top-songs", asyncHandler(async (req, res) => {

    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }

    const sql = `
        SELECT
            tracks.track_name,
            artists.artist_name,
            COUNT(*) AS total_plays
        FROM listening_history
        JOIN tracks
            ON listening_history.track_id = tracks.track_id
        JOIN artists
            ON tracks.artist_id = artists.artist_id
        WHERE listening_history.user_id = ?
        GROUP BY
            tracks.track_id,
            tracks.track_name,
            artists.artist_id,
            artists.artist_name
        ORDER BY total_plays DESC;
    `;

    const [results] = await db.query(sql, [userId]);

    res.json(results);
}));

app.get("/api/top-artists", asyncHandler(async (req, res) => {

    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }

    const sql = `SELECT
    artists.artist_name,
    COUNT(*) AS total_plays
    FROM listening_history
    JOIN users
        ON listening_history.user_id = users.user_id
    JOIN tracks
        ON listening_history.track_id = tracks.track_id
    JOIN artists
        ON tracks.artist_id = artists.artist_id
    WHERE users.user_id = ?
    GROUP BY artists.artist_id, artists.artist_name
    ORDER BY total_plays DESC;`;

    const [user] = await db.query(
        "SELECT user_id FROM users WHERE user_id = ?",
        [userId]
    );

    if (user.length === 0) {
        return res.status(404).json({
            error: "user not found"
        });
    }

    const [results] = await db.query(sql, [userId]);

    res.json(results);
}));


app.get("/api/listening-hours", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }
    const sql = `select
    hour(listening_history.played_at) as listening_hour,
    count(*) as total_plays
    from listening_history
    where listening_history.user_id=?
    group by hour(listening_history.played_at)
    order by listening_hour asc;`;

    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));

app.get("/api/monthly-trends", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }
    const sql = `select
    year(listening_history.played_at) as year,
    month(listening_history.played_at) as month,
    count(*) as total_plays
    from listening_history
    where listening_history.user_id=?
    group by year(listening_history.played_at), month(listening_history.played_at)
    order by year, month;`

    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));

app.get("/api/listening-concentration", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user id is required"
        });
    }
    const sql = `WITH song_plays AS (
        SELECT
            tracks.track_id,
            tracks.track_name,
            COUNT(*) AS total_plays
        FROM listening_history
        JOIN tracks
            ON listening_history.track_id = tracks.track_id
        WHERE listening_history.user_id = ?
        GROUP BY
            tracks.track_id,
            tracks.track_name
    ),

    ranked_songs AS (
        SELECT
            track_name,
            total_plays,
            ROW_NUMBER() OVER (
                ORDER BY total_plays DESC
            ) AS song_rank
        FROM song_plays
    ),

    user_total AS (
        SELECT
            COUNT(*) AS user_total_plays
        FROM listening_history
        WHERE user_id = ?
    )

    SELECT
        ranked_songs.track_name AS top_song,
        ranked_songs.total_plays AS top_song_plays,
        user_total.user_total_plays,
        ROUND(
            ranked_songs.total_plays * 100.0 / user_total.user_total_plays,2
        ) AS percent_top_song
    FROM ranked_songs
    JOIN user_total
    WHERE ranked_songs.song_rank = 1;`;
    const [results] = await db.query(sql, [userId, userId]);
    res.json(results);
}));

app.get("/api/listening-repetition", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }
    const sql = `SELECT
        users.username,
        COUNT(*) AS total_plays,
        COUNT(DISTINCT listening_history.track_id) AS unique_songs,
        ROUND(
            COUNT(*) * 1.0 / COUNT(DISTINCT listening_history.track_id),2
        ) AS avg_plays
    FROM listening_history
    JOIN users
        ON users.user_id = listening_history.user_id
    WHERE users.user_id = ?
    GROUP BY users.username, users.user_id;`;
    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));

app.get("/api/time-of-day", asyncHandler(async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({
            error: "user  id is required"
        });
    }
    const sql =
        `SELECT
        CASE
            WHEN HOUR(listening_history.played_at) BETWEEN 5 AND 11
                THEN 'Morning'
            WHEN HOUR(listening_history.played_at) BETWEEN 12 AND 16
                THEN 'Afternoon'
            WHEN HOUR(listening_history.played_at) BETWEEN 17 AND 20
                THEN 'Evening'
            ELSE 'Night'
        END AS time_of_day,
        COUNT(*) AS total_plays
    FROM listening_history
    WHERE listening_history.user_id = ?
    GROUP BY time_of_day
    ORDER BY total_plays DESC, time_of_day ASC;`;
    const [results] = await db.query(sql, [userId]);
    res.json(results);
}));

app.get("/api/last-listening", asyncHandler(async (req, res) => {

    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({
            error: "user_id is required"
        });
    }

    const [results] = await db.query(
        `SELECT MAX(played_at) AS last_played_at
         FROM listening_history
         WHERE user_id = ?`,
        [userId]
    );

    res.json({
        last_played_at: results[0].last_played_at
    });

}));

app.post("/api/sync-recently-played", asyncHandler(async (req, res) => {

    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items)) {
        return res.status(400).json({
            error: "user_id and items are required"
        });
    }

    const connection = db;

    try {

        await connection.beginTransaction();

        let inserted = 0;
        let skipped = 0;

        for (const item of items) {

            const track = item.track;
            const playedAt = item.played_at;

            if (!track || !playedAt || !track.id) {
                skipped++;
                continue;
            }

            const artist = track.artists?.[0];

            if (!artist || !artist.id) {
                skipped++;
                continue;
            }

            // Insert artist if it does not already exist
            await connection.query(
                `INSERT INTO artists
                    (artist_name, spotify_artist_id)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE
                    artist_id = LAST_INSERT_ID(artist_id)`,
                [
                    artist.name,
                    artist.id
                ]
            );

            const [artistRows] = await connection.query(
                `SELECT artist_id
                 FROM artists
                 WHERE spotify_artist_id = ?`,
                [artist.id]
            );

            const artistId = artistRows[0].artist_id;

            // Insert track if it does not already exist
            await connection.query(
                `INSERT INTO tracks
                    (track_name, artist_id, spotify_track_id)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    track_id = LAST_INSERT_ID(track_id),
                    artist_id = VALUES(artist_id)`,
                [
                    track.name,
                    artistId,
                    track.id
                ]
            );

            const [trackRows] = await connection.query(
                `SELECT track_id
                 FROM tracks
                 WHERE spotify_track_id = ?`,
                [track.id]
            );

            const trackId = trackRows[0].track_id;

            // Insert listening event
            const [result] = await connection.query(
                `INSERT IGNORE INTO listening_history
                    (user_id, track_id, played_at)
                 VALUES (?, ?, ?)`,
                [
                    user_id,
                    trackId,
                    new Date(playedAt)
                ]
            );

            if (result.affectedRows === 1) {
                inserted++;
            } else {
                skipped++;
            }
        }

        await connection.commit();

        res.json({
            message: "Recently played data synced",
            inserted,
            skipped
        });

    } catch (error) {

        await connection.rollback();
        throw error;

    }
}));

app.use(errorHandler);
app.listen(3000, () => {
    console.log("server running on http://localhost:3000")
});