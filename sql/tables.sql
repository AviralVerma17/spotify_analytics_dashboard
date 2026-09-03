create table artists(
    artist_id int primary key AUTO_INCREMENT,
    artist_name varchar(50) not null
);
create table tracks(
    track_id int primary key auto_increment,
    track_name varchar(75) not null,
    artist_id int not NULL, 
    foreign key (artist_id) 
    references artists(artist_id)
);
create table users(
    user_id int primary key AUTO_INCREMENT,
    username varchar(100) not null
);
create table listening_history(
    listening_id int primary key auto_increment,
    user_id int not null,
    track_id int not null,
    played_at datetime not null,
    foreign key(user_id)
    references users(user_id),
    foreign key(track_id)
    references tracks(track_id)
);