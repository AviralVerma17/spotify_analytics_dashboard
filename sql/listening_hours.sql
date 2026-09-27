
-- Hourly listening trends for a specific user
select
hour(listening_history.played_at) as listening_hour,
count(*) as total_plays
from listening_history
where listening_history.user_id=1
group by hour(listening_history.played_at)
order by total_plays desc, listening_hour asc;

select
case
when hour(listening_history.played_at) between 6 and 12 then 'Morning'
when hour(listening_history.played_at) between 12 and 15 then 'Afternoon'
when hour(listening_history.played_at) between 16 and 19 then 'Evening'
else 'Night'
end as time_of_day,
count(*) as total_plays
from listening_history
where listening_history.user_id=1
group by time_of_day
order by total_plays desc, time_of_day asc;