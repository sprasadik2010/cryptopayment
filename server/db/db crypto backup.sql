PGDMP                      }            crypto    17.4    17.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16386    crypto    DATABASE     l   CREATE DATABASE crypto WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-IN';
    DROP DATABASE crypto;
                     postgres    false            �            1259    16387    member    TABLE     &  CREATE TABLE public.member (
    id bigint NOT NULL,
    membername text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    parentid bigint NOT NULL,
    side bit(1) NOT NULL,
    is_verified boolean NOT NULL,
    verification_token text NOT NULL
);
    DROP TABLE public.member;
       public         heap r       postgres    false            �            1259    16395    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    is_verified boolean,
    verification_token character varying
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16394    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    219            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    218            %           2604    16398    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            �          0    16387    member 
   TABLE DATA           |   COPY public.member (id, membername, email, username, password, parentid, side, is_verified, verification_token) FROM stdin;
    public               postgres    false    217   �       �          0    16395    users 
   TABLE DATA           U   COPY public.users (id, email, password, is_verified, verification_token) FROM stdin;
    public               postgres    false    219   �       �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public               postgres    false    218            '           2606    16393    member member_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
       public                 postgres    false    217            +           2606    16402    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    219            (           1259    16403    ix_users_email    INDEX     H   CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);
 "   DROP INDEX public.ix_users_email;
       public                 postgres    false    219            )           1259    16404    ix_users_id    INDEX     ;   CREATE INDEX ix_users_id ON public.users USING btree (id);
    DROP INDEX public.ix_users_id;
       public                 postgres    false    219            �      x������ � �      �      x������ � �     