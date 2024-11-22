insert into "users" ("username", "firstName", "secondName", "avatar", "password") values ('marcus', 'Marcus', 'Aurelius', 'images/avatars/avatar1.jpg', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$UhySSCwT0mpQnrsPrfZ9h4nCP395BIf8PlLvhm4jnWI$OPR2ge8IxUuAAafJZ/V2LbzbfPSxWrENb7pSwa6kZq+MeO6W081TaP4dxxyS5oW+kSqApMqKTHJvkfI+K9TIaQ');
insert into "users" ("username", "firstName", "secondName", "avatar", "password") values ('serhii', 'Serhii', 'Lytvynenko', 'images/avatars/avatar2.jpg', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$KD/di0Bq5z+EDSKQlBwjLA0vsQwfktUM2qCS/PJ9Cy4$KVigazCW9ahuSTeghnGilCVyyi/Qp23B7hjp1IrWFxkxevdSFW4m1y1xGP4BUOXxa5ra7Ul5kqhNvLIiptFwEw');

insert into "sessions" ("token", "userId") values ('ce084e83-114a-4f2c-b978-ff1b85c5047d', 1);
insert into "sessions" ("token", "userId") values ('f3090992-d3e8-4309-bada-ecd230e86684', 2);
