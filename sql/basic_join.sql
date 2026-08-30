select 
users.username,
tracks.track_name,
artists.artist_id,
artists.artist_name,
listening_history.played_at
from listening_history
join users
on listening_history.user_id=users.user_id
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id;

