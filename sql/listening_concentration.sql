with song_plays as (
    select
    users.username,
    users.user_id,
    tracks.track_id,
    tracks.track_name,
    count(*) as total_plays
    from listening_history
    join users
    on listening_history.user_id=users.user_id
    join tracks
    on listening_history.track_id=tracks.track_id
    group by 
    users.username,
    users.user_id,
    tracks.track_id,
    tracks.track_name
),
ranked_songs as (
    select
    user_id,
    username,
    track_name,
    total_plays,
    row_number() over(
        partition by user_id
        order by total_plays desc
    ) as song_rank
from song_plays
),

user_total as(
    SELECT
    user_id,
    count(*) as user_total_pays
    from listening_history
    group by user_id
)

SELECT
ranked_songs.user_id,
ranked_songs.track_name as top_song,
ranked_songs.total_plays as  top_song_plays,
user_total.user_total_pays, 
round(
    ranked_songs.total_plays*100.0/user_total.user_total_pays,2
)as percent_top_song
from ranked_songs
join user_total
on user_total.user_id=ranked_songs.user_id
where ranked_songs.song_rank=1
order by percent_top_song desc;

select
tracks.track_name,
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
group by
tracks.track_id,
tracks.track_name,
artists.artist_name
having count(*)>=3
order by total_plays desc;

SELECT
artists.artist_id,
artists.artist_name,
count(distinct listening_history.user_id) as unique_listeners
from listening_history
join tracks
on tracks.track_id=listening_history.track_id
join users
on listening_history.user_id=users.user_id
join artists
on artists.artist_id=tracks.artist_id
group by artist_name,artist_id
order by unique_listeners desc;



with artist_plays as (
    SELECT
    users.user_id,
    artists.artist_id,
    artists.artist_name,
    count(*) as total_plays
    from listening_history
    join tracks
    on tracks.track_id=listening_history.track_id
    join artists
    on artists.artist_id=tracks.artist_id
    join users
    on users.user_id=listening_history.user_id
    group by user_id,artist_id
),

ranked_artists as(
    SELECT
    user_id,
    artist_name,
    total_plays,
    ROW_NUMBER() over(
        partition by user_id
        order by total_plays desc
    ) as artist_rank
from artist_plays
)
SELECT *
from ranked_artists
where artist_rank=1;

select 
users.username,
count(*) as total_plays,
count(distinct listening_history.track_id) as unique_songs,
round(count(*)*1.0/count(distinct listening_history.track_id),2) as avg_plays
from listening_history
join tracks
on listening_history.track_id=tracks.track_id
join users
on users.user_id=listening_history.user_id
group by users.username,users.user_id
order by avg_plays;
