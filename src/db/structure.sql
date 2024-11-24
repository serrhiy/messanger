
create table "users" (
  "id"         bigint generated always as identity,
  "createdAt"  timestamptz default current_timestamp,
  "username"   varchar(64) not null check (length("username") >= 3),
  "firstName"  varchar(64),
  "secondName" varchar(64),
  "avatar"     varchar(256),
  "password"   varchar(256),
  "token"      varchar(36) NOT NULL
);

alter table "users" add constraint "pkUsers" primary key ("id");
create unique index "akUserUsername" on "users" ("username");
create index "akUserFirstName" on "users" ("firstName");
create index "akUserSecondName" on "users" ("secondName");
create unique index "akUserToken" on "users" ("token");

create table "chats" (
  "id"        bigint generated always as identity,
  "name"      varchar(64) check (length("name") >= 1),
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

create table "messages" (
  "id"        bigint not null,
  "message"   text not null check (length("message") >= 1),
  "chatId"    bigint not null,
  "userId"    bigint not null,
  "createdAt" timestamptz default current_timestamp
);

alter table "messages" add constraint "pkMessages" primary key ("id");
alter table "messages" add constraint "fkMessagesChatIdChats"
  foreign key ("chatId") references "chats" ("id");
alter table "messages" add constraint "fkMessagesUserIdUsers"
  foreign key ("userId") references "users" ("id");
create index "akMessageChatId" on "messages" ("chatId");
create index "akMessageUserId" on "messages" ("userId");
