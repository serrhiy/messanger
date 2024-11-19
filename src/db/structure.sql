
create table "users" (
  "id"         bigint generated always as identity,
  "createdAt"  timestamptz default current_timestamp,
  "username"   varchar(64) not null check (length("username") >= 3),
  "firstName"  varchar(64),
  "secondName" varchar(64),
  "password"   varchar(256)
);

alter table "users" add constraint "pkUsers" primary key ("id");
create index "akUserUsername" on "users" ("username");

create table chats (
  "id"        bigint generated always as identity,
  "name"      varchar(64) not null check (length("name") >= 1),
  "createdAt" timestamptz default current_timestamp
);

alter table "chats" add constraint "pkChats" primary key ("id");
create index "akChatId" on "chats" ("id");

create table "usersChats" (
  "userId" bigint not null,
  "chatId" bigint not null
);

alter table "usersChats" add constraint "pkUsersChats" primary key ("userId", "chatId");
alter table "usersChats" add constraint "fkUsersChatsUserId" 
  foreign key ("userId") references "users" ("id");
alter table "usersChats" add constraint "fkUsersChatsChatId" 
  foreign key ("chatId") references "chats" ("id");

create table "sessions" (
  "token" varchar(36) NOT NULL,
  "userId" integer NOT NULL
);

ALTER TABLE "sessions" ADD CONSTRAINT "pkSessions" PRIMARY KEY ("token");
CREATE UNIQUE INDEX "akSession" ON "sessions" ("token");
ALTER TABLE "sessions" ADD CONSTRAINT "fkSessionsUserId" FOREIGN KEY ("userId")
  REFERENCES "users" ("id") ON DELETE CASCADE;
