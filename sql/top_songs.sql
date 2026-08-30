with song_plays as(
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
order by username, song_rank;