

CREATE TABLE public.users
(
    id serial NOT NULL,
    userName text NOT NULL,
    login text NOT NULL UNIQUE,
    passwordhash text NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE public.boards
(
    id serial NOT NULL,
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

CREATE TABLE public.statuses
(
    id serial NOT NULL,
    title character varying(25) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    board_id integer NOT NULL,
    CONSTRAINT statuses_pkey PRIMARY KEY (id),
    CONSTRAINT f_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT f_board_id FOREIGN KEY (board_id)
        REFERENCES public.boards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.statuses
    OWNER to postgres;

CREATE TABLE public.cards
(
    id serial NOT NULL,
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
        ON DELETE CASCADE,
    CONSTRAINT f_status_id FOREIGN KEY (status_id)
        REFERENCES public.statuses (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.cards
    OWNER to postgres;
