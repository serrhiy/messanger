
drop database if exists messanger;
drop user if exists trajan;
create user trajan with password '1111';
create database messanger owner trajan;
