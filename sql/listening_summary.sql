SELECT
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
group by 
users.user_id, users.username
order by total_plays desc;