-- Monthly listening trends for a specific user
select
year(listening_history.played_at) as year,
month(listening_history.played_at) as month,
count(*) as total_plays
from listening_history
where listening_history.user_id=1
group by year(listening_history.played_at), month(listening_history.played_at)
order by year, month;


-- Month with the most listens
SELECT
    DATE_FORMAT(min(listening_history.played_at), '%M %Y') AS month,
    COUNT(*) AS total_plays
FROM listening_history
WHERE listening_history.user_id = 1
GROUP BY
    YEAR(listening_history.played_at),
    MONTH(listening_history.played_at)
ORDER BY
    YEAR(listening_history.played_at),
    MONTH(listening_history.played_at);

-- Month with the most listens
SELECT
    DATE_FORMAT(min(listening_history.played_at), '%M %Y') AS month,
    COUNT(*) AS total_plays
FROM listening_history
WHERE listening_history.user_id = 1
GROUP BY
    YEAR(listening_history.played_at),
    MONTH(listening_history.played_at)
ORDER BY
    total_plays desc
limit 1;