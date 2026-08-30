-- User Play Counts
select
users.username,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
group by users.user_id,users.username
order by total_plays desc;


-- User Play Counts by Artist
select 
users.username,
artists.artist_name,
count(*) as total_plays
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
group by 
users.user_id,
users.username,
artists.artist_id,
artists.artist_name
order by users.username, total_plays desc;


with artist_plays as (
    SELECT
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name,
    count(*) as total_plays
    from listening_history
    join users
    on listening_history.user_id=users.user_id
    join tracks
    on listening_history.track_id=tracks.track_id
    join artists
    on tracks.artist_id=artists.artist_id
    group by
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name
)
select
username,
artist_name,
total_plays,
row_number() over(
    partition by user_id
    order by total_plays desc
) as artist_rank
from artist_plays
order by username,artist_rank;


with artist_plays as (
    SELECT
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name,
    count(*) as total_plays
    from listening_history
    join users
    on listening_history.user_id=users.user_id
    join tracks
    on listening_history.track_id=tracks.track_id
    join artists
    on tracks.artist_id=artists.artist_id
    group by
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name
)
select
username,
artist_name,
total_plays,
rank() over(
    partition by user_id
    order by total_plays desc
) as artist_rank
from artist_plays
order by username,artist_rank;

with artist_plays as (
    SELECT
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name,
    count(*) as total_plays
    from listening_history
    join users
    on listening_history.user_id=users.user_id
    join tracks
    on listening_history.track_id=tracks.track_id
    join artists
    on tracks.artist_id=artists.artist_id
    group by
    users.user_id,
    users.username,
    artists.artist_id,
    artists.artist_name
)
select
username,
artist_name,
total_plays,
dense_rank() over(
    partition by user_id
    order by total_plays desc
) as artist_rank
from artist_plays
order by username,artist_rank;