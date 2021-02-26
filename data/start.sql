
CREATE DATABASE "ProMan"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE public.users
(
    id integer NOT NULL,
    "userName" character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(30) COLLATE pg_catalog."default" NOT NULL,
    password character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE public.statuses
(
    id integer NOT NULL,
    title character varying(25) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT statuses_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.statuses
    OWNER to postgres;

CREATE TABLE public.boards
(
    id integer NOT NULL,
    title character varying(25) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    type character varying COLLATE pg_catalog."default",
    CONSTRAINT boards_pkey PRIMARY KEY (id),
    CONSTRAINT f_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.boards
    OWNER to postgres;

CREATE TABLE public.cards
(
    id integer NOT NULL,
    board_id integer NOT NULL,
    title character varying(150) COLLATE pg_catalog."default" NOT NULL,
    status_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT p_id PRIMARY KEY (id),
    CONSTRAINT f_board_id FOREIGN KEY (board_id)
        REFERENCES public.boards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT f_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.cards
    OWNER to postgres;