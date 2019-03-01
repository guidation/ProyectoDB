CREATE DATABASE GUACAMAYAAA;
USE GUACAMAYAAA;
CREATE TABLE users (
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
);

CREATE TABLE links1 (
id INT(11) NOT NULL,
title VARCHAR (150) NOT NULL,
url VARCHAR (255) NOT NULL,
description TEXT,
user_id INT(11),
created_at TIMESTAMP DEFAULT current_timestamp,
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER TABLE links1
    ADD PRIMARY KEY (id);

