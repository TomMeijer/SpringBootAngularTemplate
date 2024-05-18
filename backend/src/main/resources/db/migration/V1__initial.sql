create table file (
    id int auto_increment primary key,
    content longblob not null,
    name varchar(255) null,
    type varchar(255) null
);

create table user (
    id int auto_increment primary key,
    created_on datetime(6) not null,
    email varchar(255) not null,
    first_name varchar(255) null,
    last_name varchar(255) null,
    password varchar(255) not null,
    profile_pic_id int null,
    constraint user_email_uk unique (email),
    constraint user_profile_pic_id_fk foreign key (profile_pic_id) references file (id)
);



