SELECT
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks
on listening_history.track_id=tracks.track_id
join artists
on artists.artist_id=tracks.artist_id
group by artists.artist_id
order by total_plays desc;

SELECT
    artists.artist_name,
    COUNT(*) AS total_plays
FROM listening_history
JOIN users
    ON listening_history.user_id = users.user_id
JOIN tracks
    ON listening_history.track_id = tracks.track_id
JOIN artists
    ON tracks.artist_id = artists.artist_id
WHERE users.user_id = 1
GROUP BY artists.artist_id, artists.artist_name
ORDER BY total_plays DESC;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= '2026-07-28'
group by artists.artist_id, artists.artist_name
order by total_plays desc;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= '2026-02-28'
group by artists.artist_id, artists.artist_name
order by total_plays desc;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= '2025-07-28'
group by artists.artist_id, artists.artist_name
order by total_plays desc;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= current_date - interval 1 month
group by artists.artist_id, artists.artist_name
order by total_plays desc;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= current_date - interval 6 month
group by artists.artist_id, artists.artist_name
order by total_plays desc;

select
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where users.user_id=1
and listening_history.played_at >= current_date - interval 12 month
group by artists.artist_id, artists.artist_name
order by total_plays desc;


select
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
group by 
artists.artist_id,
artists.artist_name
having count(*)>7
order by total_plays desc;
