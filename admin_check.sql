SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: accessories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: admin_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admin_list" ("id", "email", "created_at") VALUES
	('dbf2b60f-476b-45d5-a6cb-8e53a2285172', 'iamsiddhanta.6@gmail.com', '2025-05-24 16:50:35.353575+00'),
	('6059eb3c-32ae-45e0-8536-65b7f73b6d86', 'iamsiddhanta.9@gmail.com', '2025-05-24 17:34:39.209357+00');


--
-- Data for Name: sets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subsets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grade_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: slabs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('15d01093-e918-4081-a4fc-025df7e4867f', '154bd2d7-35b7-4da2-b1e5-e0b06c90ea83', 'admin', '2025-05-24 16:49:11.250668+00');


--
-- PostgreSQL database dump complete
--

RESET ALL;
