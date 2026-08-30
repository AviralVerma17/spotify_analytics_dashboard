require("dotenv").config();

const mysql=require("mysql2");

const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
}).promise();


db.connect((err)=>{
    if(err){
        console.error("connection with mysql failed",err.message);
        return;
    }
    console.log("connection with mysql done");
});
const express=require("express");

const app=express();


app.get("/",(req,res) => {
    res.send("spoti-analytics_bckend_running");
});


app.get("/api/test",(req,res)=>{
    res.json({
        message:"API working"
    });
});


app.get("/api/user-summary",async(req,res)=>{
    const userId=req.query.user_id;
    if(!userId){
        return res.status(400).json({
            error:"user id required"
        });
    }

    const sql=`SELECT
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

try{
    const [results]=await db.query(sql,[userId]);
    if (results.length===0){
        return res.status(404).json({
            error:"user not found"
        });
    }
    res.json(results);

}
catch(err){
    console.error(err);
    res.status(500).json({
        error:"databse query failed"
    });
}
});


app.get("/api/users",(req,res)=>{
    db.query("select * from users",(err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({
                error:"database query failed"
            });
        }
        res.json(results);
    });
});
app.listen(3000,() =>{
    console.log("server running on http://localhost:3000")
});
