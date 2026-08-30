-- Song rankings based on listening frequency

select
tracks.track_id,
tracks.track_name,
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks 
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
group by tracks.track_id,tracks.track_name,artists.artist_name
order by total_plays desc;


-- Song rankings for a specific user based on listening frequency
select
tracks.track_id,
tracks.track_name,
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks 
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where listening_history.user_id=1
group by tracks.track_id,tracks.track_name,artists.artist_name
order by total_plays desc;


select
tracks.track_name,
artists.artist_name,
count(*) as total_plays
from listening_history
join tracks
on listening_history.track_id=tracks.track_id
join artists
on tracks.artist_id=artists.artist_id
where listening_history.user_id=1
and listening_history.played_at>=current_date-interval 6 month
group by tracks.track_name,artists.artist_name,tracks.track_id
order by total_plays desc;