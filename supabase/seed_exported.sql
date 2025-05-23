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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '1d2443bb-9bfa-4b3a-8395-4ec381dd9d45', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.6@gmail.com","user_id":"181587e2-1092-40d6-961f-3bcdddff05a9","user_phone":""}}', '2025-05-17 08:05:42.201124+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cb5108f-4120-44ee-a152-47c4148a688f', '{"action":"login","actor_id":"181587e2-1092-40d6-961f-3bcdddff05a9","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:06:15.062846+00', ''),
	('00000000-0000-0000-0000-000000000000', '6353acdd-0f9d-4738-9043-73630e7d01f4', '{"action":"logout","actor_id":"181587e2-1092-40d6-961f-3bcdddff05a9","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:06:15.590664+00', ''),
	('00000000-0000-0000-0000-000000000000', '782d3cf2-e3fc-4849-881e-31ef9da2426c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.6@gmail.com","user_id":"181587e2-1092-40d6-961f-3bcdddff05a9","user_phone":""}}', '2025-05-17 08:08:41.015833+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd527657a-36e7-4277-9fc8-15e88f728fe5', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.6@gmail.com","user_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","user_phone":""}}', '2025-05-17 08:18:27.10355+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a60d8571-01e0-4b6c-832f-d7435b4bed76', '{"action":"login","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:19:03.489063+00', ''),
	('00000000-0000-0000-0000-000000000000', '13330e44-755c-40c7-be1c-67772bd3daf0', '{"action":"logout","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:19:03.780222+00', ''),
	('00000000-0000-0000-0000-000000000000', '0de834a9-869e-4bd2-88a6-b1316d3d618a', '{"action":"login","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:20:46.766385+00', ''),
	('00000000-0000-0000-0000-000000000000', '18c22ad0-c5a8-45ab-b246-3f1ca53bfd85', '{"action":"logout","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:20:46.957836+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbffdac4-e43a-4f18-81e4-d54096e6abe2', '{"action":"login","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:21:04.508175+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d783515-1342-45a3-b5e6-c719d15062ce', '{"action":"logout","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:21:04.675663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f89eb8f3-17fa-4ca3-9eee-8d35ee15fe23', '{"action":"login","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:21:58.692621+00', ''),
	('00000000-0000-0000-0000-000000000000', '82091356-0ac5-4ce0-91e7-a6edd8b872a1', '{"action":"logout","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:21:59.041896+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d554c2a-4ad2-43ef-97f9-3b65456016b2', '{"action":"login","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:22:57.036007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b26995a6-2283-424b-90f9-4f3b7dfe77ab', '{"action":"logout","actor_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:22:57.69428+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a389341-efd0-42fc-9fe8-16cae6a753ae', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.6@gmail.com","user_id":"03d58cab-530c-4a09-a4ee-07f7a1200fd3","user_phone":""}}', '2025-05-17 08:26:54.528239+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b1e5ba9-bc8c-41a1-b180-570463dac199', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.6@gmail.com","user_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","user_phone":""}}', '2025-05-17 08:28:04.308533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1a176f0-3a33-4e70-803d-07724b5dacff', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:29:18.856872+00', ''),
	('00000000-0000-0000-0000-000000000000', '110471f7-373c-4f2a-b84f-64016b747c76', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:29:19.116006+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa7ef983-334b-4ead-9896-63ab944b5a33', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:30:54.651878+00', ''),
	('00000000-0000-0000-0000-000000000000', '82d6692c-b3ef-4248-8e68-766b23fe5360', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:30:57.52997+00', ''),
	('00000000-0000-0000-0000-000000000000', '123c351c-4215-49d3-8e7c-3b43f1e26a76', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:31:12.50257+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc2cb97d-1f2f-4237-a71a-11f15675d816', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:31:12.79509+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c3562c7-11a0-432b-ae63-51172b770bc0', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:32:17.85529+00', ''),
	('00000000-0000-0000-0000-000000000000', '4660c5a4-0f6e-4802-82d3-33cd414d1813', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:32:18.02244+00', ''),
	('00000000-0000-0000-0000-000000000000', '968a4c71-d709-4c43-b64d-fdb34cad0fc4', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:32:49.37557+00', ''),
	('00000000-0000-0000-0000-000000000000', '88e3f830-84b4-407f-a0ea-12099fa87383', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:32:49.586693+00', ''),
	('00000000-0000-0000-0000-000000000000', '200a6b5e-63a0-4c1c-a0ec-485eb8d57672', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:33:15.086528+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb10edf9-c56b-4caa-95fc-460bd3bbe231', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-17 08:33:15.259235+00', ''),
	('00000000-0000-0000-0000-000000000000', '49ebe040-d6d2-4e06-8326-5fe7dd2fda38', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:46:28.004438+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e56c6396-3021-4a6a-8498-586248b7be3c', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:49:45.168139+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0d15026-5044-43ae-9d17-08c35c8f598d', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:51:28.916144+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c5a563b-e735-4c23-a808-13812b6feb0f', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:51:40.41765+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e63e19e3-0097-4a3b-bf85-4c0c04341c99', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:51:49.184773+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c343f44b-8a8c-46ad-98df-1d01b26674d9', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:58:54.673229+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d75b302-1439-4a3e-910e-6e672b654858', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:59:09.05812+00', ''),
	('00000000-0000-0000-0000-000000000000', '31139ef2-afbb-4ba5-9437-db7d4b2fd3ae', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 08:59:15.846226+00', ''),
	('00000000-0000-0000-0000-000000000000', '04dbfa22-3c03-41cb-87ac-8f219678ce29', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:00:03.074936+00', ''),
	('00000000-0000-0000-0000-000000000000', '63faeee6-2b2b-461d-a144-c30d5158512e', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:00:21.31106+00', ''),
	('00000000-0000-0000-0000-000000000000', '656d5546-3824-44c5-9fdb-a61cfc7b656c', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:00:59.151399+00', ''),
	('00000000-0000-0000-0000-000000000000', '663ce0e1-7a7d-44a0-92e7-c6dbe4c8d228', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:05:22.72916+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9da5b92-1b35-455b-b196-edf1083f04e5', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:06:11.280946+00', ''),
	('00000000-0000-0000-0000-000000000000', '8238b2e1-2f5a-4e91-b15e-7ba3c2f554cf', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:08:07.594374+00', ''),
	('00000000-0000-0000-0000-000000000000', '44898e1c-dd44-4ba4-bb37-2256d0b689a0', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:09:23.941241+00', ''),
	('00000000-0000-0000-0000-000000000000', '932a89d5-d00a-46ba-888c-6133b3fbafcb', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:11:37.612193+00', ''),
	('00000000-0000-0000-0000-000000000000', '98074efe-862d-4e9f-94ea-2f94ee3d160c', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:19:31.38855+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a82dd81-32b2-4ae8-a5cd-e33938b3a2d1', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:20:51.366294+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ffa4502-f9a5-44ef-bf69-c308a1e9ff14', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:23:08.917932+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e59c7439-898d-4526-b4e1-65c426324f7f', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:24:16.555099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c69ce2cb-368e-40c2-a261-78cd6e939e41', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:24:46.924532+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f075a85b-2c4c-4b36-8617-06e43729762c', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:26:13.03365+00', ''),
	('00000000-0000-0000-0000-000000000000', '18a1dbdf-568d-4ff0-817c-a72f9e318a04', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 09:33:30.667828+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b2308c3-456d-48e2-8b96-869b2068e3ce', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-17 15:21:03.582949+00', ''),
	('00000000-0000-0000-0000-000000000000', '23895447-58dc-4da3-9e88-4110ed2e5b51', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiddhanta.9@gmail.com","user_id":"85e68a0f-bd32-424f-9541-b89391edd512","user_phone":""}}', '2025-05-18 07:40:13.51623+00', ''),
	('00000000-0000-0000-0000-000000000000', '198e4279-cc66-49ce-a678-11cfa242b640', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 08:57:08.644038+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfed8afa-05f3-4133-a46b-c246109ab501', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 08:57:23.900831+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bfa8295-7599-43cb-849a-fffc48cfcc88', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:01:32.645454+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d8562b8-07dd-4f4f-9126-c6b1115da8a1', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:09:30.442928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c61f53ef-76b1-4c07-93d2-323bb2cbdebe', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:09:37.714247+00', ''),
	('00000000-0000-0000-0000-000000000000', '811721e0-1f6c-4050-b641-f72d8967a8e0', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:30:53.630364+00', ''),
	('00000000-0000-0000-0000-000000000000', '58348b04-414d-44da-acb5-d71604f1d182', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:30:54.354736+00', ''),
	('00000000-0000-0000-0000-000000000000', '4376bfa2-4fc2-4ff4-bec9-96b6385c5b94', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:30:59.860689+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ee89008-f377-4cc1-9334-751c0025b9ab', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:31:00.17408+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf0a5f79-2d3b-4c3c-80c7-8d792f8b2a69', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:32:26.81605+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ad3623b-a12b-406f-a85f-158b047f500f', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:32:28.64116+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5cdf3f8-d99b-4bde-b1c5-7631eb5c2710', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:33:26.746292+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b93da9a-d5da-47b6-9cd6-8fa82fbb9fa3', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:33:27.81676+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cbd4c6c8-4993-4100-987f-a3c83de554e5', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:33:32.987767+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a00f525c-0b97-4144-94f2-5bf769c71793', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:33:34.600615+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2e5eb8d-b255-45fe-9a64-75e8ce3c90c9', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:33:55.065354+00', ''),
	('00000000-0000-0000-0000-000000000000', '37f0ea26-00bd-429a-acc8-eacd8bd2ad70', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:33:56.265925+00', ''),
	('00000000-0000-0000-0000-000000000000', '97d29b09-f28e-49ab-a4b9-2fe6fd61bde1', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:35:23.397099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5c4a777-a2bb-4c6b-aa28-53096ea693ea', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:35:24.929905+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6c41d35-36a8-47ce-be52-525b75af7476', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:36:58.98546+00', ''),
	('00000000-0000-0000-0000-000000000000', '81dbd432-014e-4870-b74a-e2ddd1bd5334', '{"action":"logout","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:37:00.068311+00', ''),
	('00000000-0000-0000-0000-000000000000', '320811e2-b8a6-448e-acbf-5d925622dbd4', '{"action":"user_confirmation_requested","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-18 09:42:30.614974+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd05ea225-e2e7-4b22-858d-afc2c6c6bd7b', '{"action":"user_signedup","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-05-18 09:43:10.198819+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7483fb3-0079-423d-8bd2-12b685ab13f6', '{"action":"login","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:43:26.717946+00', ''),
	('00000000-0000-0000-0000-000000000000', '77b355a4-5546-4966-a14e-b08ca10dc161', '{"action":"login","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:44:10.984434+00', ''),
	('00000000-0000-0000-0000-000000000000', '41d52dd0-bd77-458b-9771-84fc0d550c16', '{"action":"logout","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:44:17.383048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0e9b478-ce2c-404f-b507-6d008fb92d62', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:44:22.303187+00', ''),
	('00000000-0000-0000-0000-000000000000', '07bad8ec-75bc-4fe2-a239-759a47c59372', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:44:55.443094+00', ''),
	('00000000-0000-0000-0000-000000000000', '82116348-2aca-4bae-938f-9012c8ab6e36', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:45:30.955169+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce549bbe-f29f-4525-ae7a-dda32bce964a', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 09:46:38.645326+00', ''),
	('00000000-0000-0000-0000-000000000000', '252665c9-227a-4740-8d21-de775245b2e0', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 09:56:14.50015+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b37cef9-7f67-4713-9472-957ac493b07c', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:07:49.41526+00', ''),
	('00000000-0000-0000-0000-000000000000', '73363c83-e01a-43e8-a4e0-bb30fdd36134', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:11:44.229786+00', ''),
	('00000000-0000-0000-0000-000000000000', '330b9fdd-a7d7-424a-9607-e059ce2098a4', '{"action":"login","actor_id":"85e68a0f-bd32-424f-9541-b89391edd512","actor_username":"iamsiddhanta.9@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:15:49.713766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b81538cc-39a5-414a-9a78-650b6fc854f1', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:19:12.01216+00', ''),
	('00000000-0000-0000-0000-000000000000', '32a2676b-dafa-4192-91a4-ab5628934c5a', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:21:28.460545+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adbfeb5c-0701-4ac1-9881-fd6a8178e3d4', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:50:27.134881+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed7c115a-0344-4b9e-b7a7-aa0627860a4a', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:08:13.013524+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc48eab5-8250-4785-9934-3eed47cc0e3f', '{"action":"login","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:08:44.90977+00', ''),
	('00000000-0000-0000-0000-000000000000', '6edcab94-5719-41d5-afa8-ac388d2ad8cf', '{"action":"login","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:10:40.621657+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b32d4f07-8d74-403c-b89e-7a720439ae0b', '{"action":"logout","actor_id":"46decef9-4cd8-476d-8967-fff0356c3a59","actor_username":"iamsiddhanta.10@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 12:10:40.971581+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe1d8772-5be9-403c-8847-94e50b59a5b4', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:10:46.139074+00', ''),
	('00000000-0000-0000-0000-000000000000', '1640f2fe-2e36-4cbf-838d-02d3f5e355cb', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 12:13:44.969193+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e3a7852-a628-4048-b11e-2d1a300eb0cc', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:17:21.640735+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdf226d3-3701-4df1-a13e-afb28d9af6b9', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:18:36.476555+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ea0f815-40a3-48ca-835b-17b6984f4d40', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:22:32.127028+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0c3e558-7886-40a5-a068-1362d1ae0867', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:31:01.515649+00', ''),
	('00000000-0000-0000-0000-000000000000', '48a15869-623b-48da-a309-480a98f113c5', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 12:35:52.821915+00', ''),
	('00000000-0000-0000-0000-000000000000', '323a5961-d909-4426-9e28-805b6e0c350e', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 12:36:00.005767+00', ''),
	('00000000-0000-0000-0000-000000000000', '986514df-1c1d-40e8-a9c2-327623ca0469', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 13:34:19.860407+00', ''),
	('00000000-0000-0000-0000-000000000000', '742f89bf-bfd0-41ed-8cd1-26449751c43c', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 13:34:19.862878+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f5eb89c-6959-4ec9-82eb-e0ee05385f41', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 14:12:02.091972+00', ''),
	('00000000-0000-0000-0000-000000000000', '114430aa-77e1-48f7-b8c7-6cd5f4df146e', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:12:07.289748+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd5b8eca-2c18-40f2-b0b9-b7af0746a746', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 14:15:38.553227+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b146108d-d624-4861-a2e1-ede6f8a969f9', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:16:05.982281+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b80a4d7f-4b7e-408f-8e6f-67eaf56db0a3', '{"action":"logout","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 14:18:10.658596+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b29f1fc6-ac4b-492b-8414-a9a7427c8737', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:18:19.220312+00', ''),
	('00000000-0000-0000-0000-000000000000', '8164a819-6cc6-4c4d-a94a-8846887c2ae2', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 15:16:32.688296+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a70bf6bb-876e-4436-9165-bfc5c40edc5a', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 15:16:32.691719+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea4a3ada-28b4-4af4-836d-e08e551f27a1', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 16:14:35.401919+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7b80a17-4c61-4cef-90c9-78ccf9ab69d1', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 16:14:35.410502+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a151782-3800-49e0-8301-66f507538112', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 17:16:04.564902+00', ''),
	('00000000-0000-0000-0000-000000000000', '8942d64f-8ebd-4e5b-8634-4e65a5beaa82', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 17:16:04.568212+00', ''),
	('00000000-0000-0000-0000-000000000000', '13e70baa-4611-4eba-b892-969e846403af', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 18:35:27.15819+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f984f108-4e36-42cc-8824-fad1c16e44fb', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 18:35:27.15906+00', ''),
	('00000000-0000-0000-0000-000000000000', '63ec96de-4e92-4d82-bb22-51869b5e5927', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 19:34:04.836907+00', ''),
	('00000000-0000-0000-0000-000000000000', '31cd25ff-51d1-4296-8c92-1b3ec63955a9', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-18 19:34:04.83864+00', ''),
	('00000000-0000-0000-0000-000000000000', '868cf67c-1544-4ed0-ad3b-459545493a38', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 10:27:00.494746+00', ''),
	('00000000-0000-0000-0000-000000000000', '15785b40-2353-44c0-9c94-ab7cec5df338', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 10:27:00.503355+00', ''),
	('00000000-0000-0000-0000-000000000000', '8db55b60-2a85-4dff-9eb2-ce4f9cd441b2', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-19 10:27:10.178266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccf92ab8-5256-419a-8a00-ece8bf540a97', '{"action":"login","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-19 10:37:15.872238+00', ''),
	('00000000-0000-0000-0000-000000000000', '27697d1d-02ad-4263-bd50-214449cd5fcf', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 11:50:55.376889+00', ''),
	('00000000-0000-0000-0000-000000000000', '8534be33-d5da-4333-bff1-f45579adbc49', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 11:50:55.380858+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8a890f6-1222-4275-a212-8c5a5b1def62', '{"action":"token_refreshed","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 14:51:12.322096+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a128de44-112a-489e-8c3e-9a9e06d73912', '{"action":"token_revoked","actor_id":"21c64a13-eb77-4695-a5f0-c6cd45a78e5f","actor_username":"iamsiddhanta.6@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-19 14:51:12.326073+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('7b4740f8-9b0d-4d00-9282-beb7f42bc496', '46decef9-4cd8-476d-8967-fff0356c3a59', '6a80b89c-d419-4f36-96c8-79e73f59c186', 's256', '4xKIC_H1Dyz_vNwodzYy75a-7omWl3y4SC5j6iytZmE', 'email', '', '', '2025-05-18 09:42:30.617891+00', '2025-05-18 09:43:10.204505+00', 'email/signup', '2025-05-18 09:43:10.20447+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '46decef9-4cd8-476d-8967-fff0356c3a59', 'authenticated', 'authenticated', 'iamsiddhanta.10@gmail.com', '$2a$10$ly4NrKlPKd36cx9DR80c0u2qz4cwYJFF7zIWEAGMU7BF2S8PqDyNG', '2025-05-18 09:43:10.199409+00', NULL, '', '2025-05-18 09:42:30.625885+00', '', NULL, '', '', NULL, '2025-05-18 12:10:40.622611+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "46decef9-4cd8-476d-8967-fff0356c3a59", "email": "iamsiddhanta.10@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-05-18 09:42:30.602982+00', '2025-05-18 12:10:40.627276+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', 'authenticated', 'authenticated', 'iamsiddhanta.6@gmail.com', '$2a$10$dRyqM8yWW4x5hWZbaEllGOLmjsvfIXge2xxxPtyhTJwmoSo61pLuy', '2025-05-17 08:28:04.310119+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-05-19 10:37:15.873257+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-05-17 08:28:04.300147+00', '2025-05-19 14:51:12.33029+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '85e68a0f-bd32-424f-9541-b89391edd512', 'authenticated', 'authenticated', 'iamsiddhanta.9@gmail.com', '$2a$10$aXoafROvDfuQjfqHXDled.GKjdIbvh/yVD4uVoXE2/IzeLyEmFotm', '2025-05-18 07:40:13.527363+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-05-18 10:15:49.715646+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-05-18 07:40:13.484554+00', '2025-05-18 10:15:49.718569+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{"sub": "21c64a13-eb77-4695-a5f0-c6cd45a78e5f", "email": "iamsiddhanta.6@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-17 08:28:04.307503+00', '2025-05-17 08:28:04.307559+00', '2025-05-17 08:28:04.307559+00', '5d9de6fc-3dbb-47b4-8a0a-45e335f7a6e2'),
	('85e68a0f-bd32-424f-9541-b89391edd512', '85e68a0f-bd32-424f-9541-b89391edd512', '{"sub": "85e68a0f-bd32-424f-9541-b89391edd512", "email": "iamsiddhanta.9@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-18 07:40:13.511663+00', '2025-05-18 07:40:13.512785+00', '2025-05-18 07:40:13.512785+00', 'fb23fe8d-dfec-40b1-9bd5-dd5cdf09b6ed'),
	('46decef9-4cd8-476d-8967-fff0356c3a59', '46decef9-4cd8-476d-8967-fff0356c3a59', '{"sub": "46decef9-4cd8-476d-8967-fff0356c3a59", "email": "iamsiddhanta.10@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2025-05-18 09:42:30.611764+00', '2025-05-18 09:42:30.611813+00', '2025-05-18 09:42:30.611813+00', '13ddcc13-6d4e-4320-8eab-42cb7fc12197');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('dddf2763-bd08-4bb7-a368-474b4809898f', '85e68a0f-bd32-424f-9541-b89391edd512', '2025-05-18 10:15:49.715722+00', '2025-05-18 10:15:49.715722+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '49.37.38.79', NULL),
	('ed77974e-c87e-4aae-895a-3be676162dfe', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 14:18:19.221133+00', '2025-05-19 10:27:00.532053+00', NULL, 'aal1', NULL, '2025-05-19 10:27:00.531963', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '49.37.38.79', NULL),
	('15cbb8b1-f032-4146-80ae-8c13c56dbc0c', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-19 10:27:10.181276+00', '2025-05-19 10:27:10.181276+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '49.37.38.79', NULL),
	('9c897b07-7a98-48cb-a507-696a3424632b', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-19 10:37:15.873343+00', '2025-05-19 14:51:12.336258+00', NULL, 'aal1', NULL, '2025-05-19 14:51:12.335707', 'Next.js Middleware', '49.37.38.79', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('dddf2763-bd08-4bb7-a368-474b4809898f', '2025-05-18 10:15:49.719128+00', '2025-05-18 10:15:49.719128+00', 'password', '0952b2b6-ef91-4088-ae69-71223d89306b'),
	('ed77974e-c87e-4aae-895a-3be676162dfe', '2025-05-18 14:18:19.223568+00', '2025-05-18 14:18:19.223568+00', 'password', '3174e28d-07f8-4039-b194-842e67dc8ca7'),
	('15cbb8b1-f032-4146-80ae-8c13c56dbc0c', '2025-05-19 10:27:10.189395+00', '2025-05-19 10:27:10.189395+00', 'password', '9fc17d62-85b5-462c-895c-d04726f86f6b'),
	('9c897b07-7a98-48cb-a507-696a3424632b', '2025-05-19 10:37:15.877718+00', '2025-05-19 10:37:15.877718+00', 'password', '9ef11039-fb25-410a-839e-306ffa99f91b');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 56, 'qs5vxxxp7swe', '85e68a0f-bd32-424f-9541-b89391edd512', false, '2025-05-18 10:15:49.717307+00', '2025-05-18 10:15:49.717307+00', NULL, 'dddf2763-bd08-4bb7-a368-474b4809898f'),
	('00000000-0000-0000-0000-000000000000', 72, 'f4r266qksbjj', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 14:18:19.221977+00', '2025-05-18 15:16:32.692237+00', NULL, 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 73, 'xgirrdztxtsw', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 15:16:32.696343+00', '2025-05-18 16:14:35.411039+00', 'f4r266qksbjj', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 74, 'rxsdi5x3xl7p', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 16:14:35.417559+00', '2025-05-18 17:16:04.56877+00', 'xgirrdztxtsw', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 75, '3sid4ffwyoc2', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 17:16:04.572629+00', '2025-05-18 18:35:27.159605+00', 'rxsdi5x3xl7p', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 76, 'lnsgl7n2ehiz', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 18:35:27.160229+00', '2025-05-18 19:34:04.840821+00', '3sid4ffwyoc2', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 77, 'nnbgkg7bjrpf', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-18 19:34:04.84199+00', '2025-05-19 10:27:00.509463+00', 'lnsgl7n2ehiz', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 78, 'rjymylbrdz72', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', false, '2025-05-19 10:27:00.51966+00', '2025-05-19 10:27:00.51966+00', 'nnbgkg7bjrpf', 'ed77974e-c87e-4aae-895a-3be676162dfe'),
	('00000000-0000-0000-0000-000000000000', 79, '6pl27wrl7jj5', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', false, '2025-05-19 10:27:10.187156+00', '2025-05-19 10:27:10.187156+00', NULL, '15cbb8b1-f032-4146-80ae-8c13c56dbc0c'),
	('00000000-0000-0000-0000-000000000000', 80, 'l5ccaqxf3cxl', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-19 10:37:15.875079+00', '2025-05-19 11:50:55.381368+00', NULL, '9c897b07-7a98-48cb-a507-696a3424632b'),
	('00000000-0000-0000-0000-000000000000', 81, 'plv3fe2wrogk', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', true, '2025-05-19 11:50:55.384178+00', '2025-05-19 14:51:12.327246+00', 'l5ccaqxf3cxl', '9c897b07-7a98-48cb-a507-696a3424632b'),
	('00000000-0000-0000-0000-000000000000', 82, 'nyesyzqimmjp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', false, '2025-05-19 14:51:12.329269+00', '2025-05-19 14:51:12.329269+00', 'plv3fe2wrogk', '9c897b07-7a98-48cb-a507-696a3424632b');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: accessories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: admin_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admin_list" ("id", "email", "created_at") VALUES
	('888bd70b-9f64-461f-bc64-ee3c0dc3c0b4', 'iamsiddhanta.6@gmail.com', '2025-05-18 09:38:47.686904+00'),
	('8295f63f-f553-43f0-8bba-a5c4f7d15cce', 'iamsiddhanta.9@gmail.com', '2025-05-18 09:38:47.686904+00');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "slug", "created_at") VALUES
	('50fad8b9-161b-491e-a18b-f258eb9e8342', 'Pokemon', 'pokemon', '2025-05-18 14:10:48.98675+00'),
	('558c406c-f43a-4297-b082-09ba62c0eb85', 'One Piece', 'one-piece', '2025-05-18 14:10:48.98675+00');


--
-- Data for Name: sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sets" ("id", "name", "slug", "category_id", "created_at") VALUES
	('a157b2f6-18ed-447b-bd91-b41fb8520646', 'Scarlet & Violet', 'sv', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:21:56.682808+00'),
	('a4445a5c-a680-4970-8a62-1d9a9469d3e5', 'Sword & Shield', 'ss', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:24:17.846824+00'),
	('6cfc7790-82b8-40d7-9046-2bf723b02073', 'Sun & Moon', 'sm', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:25:29.983741+00'),
	('bb26e046-300b-4889-8dfe-0cb64664c15a', 'OP Series', 'op', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:19:03.648339+00'),
	('1d8a4fd8-b63a-4e01-a239-3cc7d1ddb1c5', 'Premium Booster', 'prb', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:19:47.681075+00'),
	('0d9d061c-2796-4fa5-8554-e1f5e6def52c', 'Starter Deck', 'st', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:20:45.416357+00');


--
-- Data for Name: subsets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subsets" ("id", "name", "slug", "set_id", "created_at") VALUES
	('dceecc1d-e73d-4951-aab6-3f9996a4bb97', 'Violet ex', 'sv1V', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('87a6af1b-ec5b-4d5a-91eb-da010c947546', 'Triplet Beat', 'sv1a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('0baeee14-7708-47de-9a7f-db3d4046ed1d', 'Snow Hazard', 'sv2P', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('a6e75c9b-587b-422c-8007-7b84154714b5', 'Clay Burst', 'sv2D', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('933d87d8-083c-4f3c-bba8-a1501e5650cf', 'Pokémon Card 151', 'sv2a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('cd359bc4-4436-4ae0-9b59-ff5777aac4d0', 'Ruler of the Black Flame', 'sv3', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('0236f54d-3ad5-49ec-b1db-e8412b7397e7', 'Raging Surf', 'sv3a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('caca6cec-a2de-46f1-be0f-900cbe780aee', 'Ancient Roar', 'sv4K', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('eed4684b-d124-4b8d-9a2c-ce9b187b3882', 'Future Flash', 'sv4M', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('a1dc5fb1-346a-4c7d-b3f2-6a1b7619e2c0', 'Shiny Treasure ex', 'sv4a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('a6f7ea5f-3438-43e5-91c1-d24ec8af82a3', 'Wild Force', 'sv5K', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('28fd9476-2265-46aa-bb6e-195091f94165', 'Cyber Judge', 'sv5M', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('aac2e11a-444d-49a1-80d5-dc0711d9d60e', 'Crimson Haze', 'sv5a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('88ebe322-b0ab-42ed-852c-48a7c99cec24', 'Mask of Change', 'sv6', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('dc759f90-6f35-45e8-801d-27c100e985ef', 'Night Wanderer', 'sv6a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('9b642cb7-a06a-4101-93f9-49079614d831', 'Stellar Miracle', 'sv7', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('4d91797e-8111-44b7-9cb4-59fc16d30882', 'Paradise Dragona', 'sv7a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('d691c569-4932-467f-a522-5f0b1d295020', 'Super Electric Breaker', 'sv8', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('a3631168-bcd3-4d55-915d-ecbce3fa44c2', 'Terastal Festival ex', 'sv8a', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('923effac-f544-4a81-aae2-2ffe01b11630', 'Glory of Team Rocket', 'sv10', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:53:27.812538+00'),
	('c07b2a36-8d7e-40d2-b374-161b81c2b430', 'Scarlet ex', 'sv1S', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '2025-05-18 14:47:43.266383+00'),
	('22a2317c-e20c-478f-8b4d-98be084fa448', 'Sword', 'S1W', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('aeb7e7af-049c-4f7e-a0b6-fdb9f1b8316c', 'Shield', 'S1H', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('3b157260-d69a-473b-adae-327864604c1d', 'VMAX Rising', 'S1a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('b858e6ae-3a10-4a86-b43d-10da1b0a1ebf', 'Rebellion Crash', 'S2', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('8aa3c5fc-913c-4282-8505-4d41e11a768e', 'Explosive Flame Walker', 'S2a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('559d714b-0612-447f-8186-649c1cc10795', 'Infinity Zone', 'S3', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('b2873aaf-fb37-4bb0-90b6-dcba4d487efd', 'Legendary Pulse', 'S3a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('7b3f38f7-4cb0-4447-9627-669c9fbd0ab3', 'Electrifying Tackle', 'S4', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('741500ff-63dd-4ac6-91d6-bd2f5854a128', 'Shiny Star V', 'S4a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('8810300b-40d5-430f-8705-04f8d7d48889', 'Single Strike Master', 'S5I', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('8a3de430-ffd4-4b0b-8de9-3ba5936ccf6b', 'Rapid Strike Master', 'S5R', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('f5b6c1c8-bb44-4e05-845c-618e42bea46c', 'Matchless Fighter', 'S5a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('97f31cc6-00eb-4cb2-bc3c-a336369b2050', 'Silver Lance', 'S6H', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('e1af2bf4-d7c3-41ab-875d-d99480e1da71', 'Jet-Black Spirit', 'S6K', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('73941a4e-2556-40fe-8e61-b910ea36c4b0', 'Eevee Heroes', 'S6a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('4fa32650-b06b-4836-8f2c-a257af71f6a3', 'Towering Perfection', 'S7D', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('6939a840-8be7-4220-964e-809432a1ea46', 'Blue Sky Stream', 'S7R', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('9a2e8646-9e8d-43fe-9036-e3beb7c7da1d', 'Fusion Arts', 'S8', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('704ebea3-1d9d-47df-892d-72fcc6ac9ba0', '25th Anniversary Collection', 'S8a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('a5e63797-942d-4bd0-b522-5fbe0983f28c', 'Start Deck 100', 'SI', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('cb721616-e35c-4a1d-9eb2-d8d47b65e7ae', 'VMAX Climax', 'S8b', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('899d6fa6-6896-4f17-8e10-cf2fd0d8dd4c', 'Star Birth', 'S9', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('a9a582bd-228f-45a8-9a76-1997b77b21f7', 'Battle Region', 'S9a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('dd067603-d4a3-4d6d-85de-a9cede47633f', 'Time Gazer', 'S10D', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('7864bfcb-30b2-4952-a435-6e7a271f96c4', 'Space Juggler', 'S10P', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('e8ef1757-2223-46e6-8cb4-3299ca8a5e6b', 'Dark Phantasma', 'S10a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('936c0df1-7a78-47d2-a163-3e386d339604', 'Pokémon GO', 'S10b', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('8f0a94bb-cb1a-453b-b1fa-c2facecac080', 'Lost Abyss', 'S11', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('f3a529b2-a8bd-4ef7-bc9d-8a88f98336ef', 'Incandescent Arcana', 'S11a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('0db44fd5-a69f-45f7-a7a8-32bfefcc470a', 'Paradigm Trigger', 'S12', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('b801e6fd-0192-448c-bc54-f5f3fe1f4fc6', 'VSTAR Universe', 'S12a', 'a4445a5c-a680-4970-8a62-1d9a9469d3e5', '2025-05-19 10:12:15.801326+00'),
	('8ce03e63-3399-49d4-a7c3-d1c36355d9cb', 'Romance Dawn', 'OP-01', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('228dd334-0de8-46fe-8d02-fd493abdf6a4', 'Summit War', 'OP-02', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('b1099638-1524-48aa-9630-1b0f1d43d9fb', 'Powerful Enemies', 'OP-03', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('e948a55c-5aff-40a5-9a59-7660edd14a3e', 'Kingdoms Of Conspiracy', 'OP-04', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('732dd4fe-022d-412d-983e-51d1f9b6bb8f', 'Hero Of The New Era', 'OP-05', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('790d8063-0e75-401f-99de-3b1b22ef4ce2', 'Twin Champions', 'OP-06', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('416dc4b7-963e-42a1-b625-5fd57454c536', '500 Years In The Future', 'OP-07', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('aada8150-505e-444c-a1a0-5aeec05fcba7', 'Two Legends', 'OP-08', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('44b4240f-fc32-49c7-9876-aebb27bfd7e3', 'The New Emperor', 'OP-09', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('80d86f25-4171-47b1-b5c1-4151be03d62f', 'Royal Bloodline', 'OP-10', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('b4ed551a-52bf-47e3-9dac-04b8f208c206', 'Godspeed Fist', 'OP-11', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('2e7a7dde-dc93-4ba7-9a80-a4d566fc5b11', 'Master Student Bond', 'OP-12', 'bb26e046-300b-4889-8dfe-0cb64664c15a', '2025-05-19 10:26:10.230437+00'),
	('d00a483d-9bb6-4f41-9903-67aa1c14211a', 'Premium Booster', 'PRB-01', '1d8a4fd8-b63a-4e01-a239-3cc7d1ddb1c5', '2025-05-19 10:26:10.230437+00'),
	('9dfa21a9-1742-417e-8c3d-2fc42df7a8e9', 'Sun and Moon', 'sma', '6cfc7790-82b8-40d7-9046-2bf723b02073', '2025-05-19 15:22:08.254177+00');


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cards" ("id", "name", "slug", "image_urls", "thumbnail_url", "category_id", "set_id", "subset_id", "condition", "language", "price", "created_at") VALUES
	('b76e50fc-2030-4010-8dd5-c74b967013e6', 'Test-2', 'test-2-801c1991', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/81020660-21c4-4af2-96e7-299451fb92bf_cropped_IMG20250406191214.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/e041f3af-f214-4c8b-b4f5-3581e6037724_cropped_IMG20250406191037.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/fb5d5562-ac9f-4698-9e7f-ed98660f8d7a_thumbnail_cropped_IMG20250406191214_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 'Mint', 'japanese', 12344.00, '2025-05-18 19:34:52.530458+00'),
	('809a37e4-ccc5-4179-9f26-0ef634b46212', 'Test-3', 'test-3-b6bdb7d1', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/1417444d-2622-4be6-8a92-aab1d436d1d8_cropped_IMG20250406190610.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/4d8312b1-de8b-4dda-87bb-15f182932a36_cropped_IMG20250406190445.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/23f50557-ed1d-4d14-bd54-0d0b21e467f2_thumbnail_cropped_IMG20250406190610_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 'Mint', 'Japanese', 1234.00, '2025-05-18 19:43:35.295913+00'),
	('05670a33-080b-4117-aa71-a5f439ef55dd', 'Test-4', 'test-4-96db49d9', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/d8819074-3595-4bca-8fdd-f011ca41fbb2_cropped_IMG20250406190403.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/9d138298-9614-4367-8ea6-bbbec3af9987_cropped_IMG20250406185929.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/64d03bc6-ecaf-476b-846e-01c4c74dce55_thumbnail_cropped_IMG20250406190403_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 'Mint', 'Japanese', 1245.00, '2025-05-18 19:50:37.617744+00'),
	('2b57d5c8-ddfa-4e8e-8aa9-af0cc23773b2', 'Test-1', 'test-1-769d8d1a', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/144f33e3-667d-4841-bb55-f5ca2d537fa7_cropped_IMG20250406191806.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/5373cfb9-4da8-4a18-937f-7bf2185d1786_cropped_IMG20250406192115.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/d624a4c3-9c02-415a-9b09-43fe7d8b7600_thumbnail_cropped_IMG20250406191806_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 'Mint', 'Japanese', 1232.00, '2025-05-18 19:16:07.967535+00');


--
-- Data for Name: grade_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."grade_companies" ("id", "name", "slug", "created_at", "grades") VALUES
	('80d4ff9f-0e2e-4616-a146-38a90c592cfb', 'PSA', 'psa', '2025-05-18 14:10:48.98675+00', '{10,9,8,7,6,5,4,3,2,1}'),
	('bc342eb1-24dc-4dd5-a69a-44987dd2c144', 'BGS', 'bgs', '2025-05-18 14:10:48.98675+00', '{10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}'),
	('52871507-1d53-4346-96d6-fb6c25b6a578', 'CGC', 'cgc', '2025-05-18 14:10:48.98675+00', '{10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}'),
	('07fd0805-4ef8-4bfc-a3ca-3beb4b5c0edd', 'ARS', 'ars', '2025-05-19 12:33:32.726283+00', '{10+,10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}');


--
-- Data for Name: slabs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('cardimages', 'cardimages', NULL, '2025-05-18 13:05:31.621396+00', '2025-05-18 13:05:31.621396+00', true, false, NULL, NULL, NULL),
	('slabimages', 'slabimages', NULL, '2025-05-19 15:27:14.982067+00', '2025-05-19 15:27:14.982067+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('58b20bf1-85a9-4711-92c4-30f7a8f55571', 'cardimages', 'cards/2025/05/19/d8819074-3595-4bca-8fdd-f011ca41fbb2_cropped_IMG20250406190403.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:50:36.598148+00', '2025-05-18 19:50:36.598148+00', '2025-05-18 19:50:36.598148+00', '{"eTag": "\"7817c200bc79937aca4bb0fe08622d52\"", "size": 235034, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:50:37.000Z", "contentLength": 235034, "httpStatusCode": 200}', '47d02e30-4039-4cf5-87b1-75a3b838e758', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('d636d559-b9bc-4ad1-ba82-4c67f7ebe7fe', 'cardimages', 'cards/2025/05/19/9d138298-9614-4367-8ea6-bbbec3af9987_cropped_IMG20250406185929.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:50:37.28815+00', '2025-05-18 19:50:37.28815+00', '2025-05-18 19:50:37.28815+00', '{"eTag": "\"60a23ca93bcf28df2cd29e40d6ea89e8\"", "size": 298600, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:50:38.000Z", "contentLength": 298600, "httpStatusCode": 200}', '1ccf0239-4d4a-4de9-b702-49ae1933a6d8', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('ff8bf4ce-e0f2-4c00-89c8-182f27b7a96d', 'cardimages', 'cards/2025/05/19/64d03bc6-ecaf-476b-846e-01c4c74dce55_thumbnail_cropped_IMG20250406190403_thumb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:50:37.524057+00', '2025-05-18 19:50:37.524057+00', '2025-05-18 19:50:37.524057+00', '{"eTag": "\"8dd5edc9eafbc8419abb0edeb77d7cb1\"", "size": 106220, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:50:38.000Z", "contentLength": 106220, "httpStatusCode": 200}', '8c2b6b9e-8f62-4ff3-bf4b-91285311f87e', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('db734340-9de5-483a-a1ba-8ee27e6ce68d', 'cardimages', 'cards/2025/05/18/.emptyFolderPlaceholder', NULL, '2025-05-18 17:16:21.68477+00', '2025-05-18 17:16:21.68477+00', '2025-05-18 17:16:21.68477+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T17:16:22.000Z", "contentLength": 0, "httpStatusCode": 200}', '99d7ad8c-79a5-47fe-80bd-9c56124569b9', NULL, '{}'),
	('f8c487c2-24de-4e13-b755-2af060465444', 'cardimages', 'cards/2025/05/19/144f33e3-667d-4841-bb55-f5ca2d537fa7_cropped_IMG20250406191806.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:16:06.809073+00', '2025-05-18 19:16:06.809073+00', '2025-05-18 19:16:06.809073+00', '{"eTag": "\"827a52aeb7e641357873c18a421f160a\"", "size": 448606, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:16:07.000Z", "contentLength": 448606, "httpStatusCode": 200}', '5138d040-1464-4ce7-9ab0-558a3ed45b65', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('9f28d838-e3f1-41e7-877c-14d22a75c6db', 'cardimages', 'cards/2025/05/19/5373cfb9-4da8-4a18-937f-7bf2185d1786_cropped_IMG20250406192115.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:16:07.280412+00', '2025-05-18 19:16:07.280412+00', '2025-05-18 19:16:07.280412+00', '{"eTag": "\"2f2ea4adafbb411a0eacd0b49b0bd7af\"", "size": 456936, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:16:08.000Z", "contentLength": 456936, "httpStatusCode": 200}', 'ccc78b0e-18e4-44ed-84a0-79aa5936ebfb', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('c9864109-b692-4bfa-979d-7269b73a1b6d', 'cardimages', 'cards/2025/05/19/d624a4c3-9c02-415a-9b09-43fe7d8b7600_thumbnail_cropped_IMG20250406191806_thumb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:16:07.741655+00', '2025-05-18 19:16:07.741655+00', '2025-05-18 19:16:07.741655+00', '{"eTag": "\"e58a62c939eb41e7572e9e1e72873993\"", "size": 336120, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:16:08.000Z", "contentLength": 336120, "httpStatusCode": 200}', '38f57942-c986-49d1-9c3c-0ab668c5c209', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('53c2251a-ef7a-4ffb-9e2a-9a76351ff7fc', 'slabimages', 'slabs/2025/05/19/3335492d-e017-440a-bc2d-7f90b2713efb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-19 15:35:27.140226+00', '2025-05-19 15:35:27.140226+00', '2025-05-19 15:35:27.140226+00', '{"eTag": "\"03b752bee695a1a2cd9a85926fca78e5\"", "size": 188092, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-19T15:35:28.000Z", "contentLength": 188092, "httpStatusCode": 200}', 'a8437071-0724-4c6a-bcc8-4e7fa6665df6', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('b074b0fe-8c0a-46a2-a8df-6f1d1463eed8', 'slabimages', 'slabs/2025/05/19/03c556c0-0c7f-447d-8fe6-979547bbdd51.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-19 15:35:27.386227+00', '2025-05-19 15:35:27.386227+00', '2025-05-19 15:35:27.386227+00', '{"eTag": "\"76571f8a9976e43b1d91c6202af14d53\"", "size": 142186, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-19T15:35:28.000Z", "contentLength": 142186, "httpStatusCode": 200}', 'b6cb5ec9-4ad9-4e83-8edd-c634f9e2304c', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('9ae1a6dd-e5ae-43e1-8559-7b943ae0b59a', 'slabimages', 'slabs/2025/05/19/70544c01-f499-4aeb-a9d8-3ea1efd33884_thumb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-19 15:35:27.702314+00', '2025-05-19 15:35:27.702314+00', '2025-05-19 15:35:27.702314+00', '{"eTag": "\"cf7f86bd8feca3ae9c10ac18751c9862\"", "size": 26944, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-19T15:35:28.000Z", "contentLength": 26944, "httpStatusCode": 200}', '9a78c435-baa5-4324-a10b-97ba56b996ca', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('4ffab89d-f6a4-421c-8f65-b4039a55124a', 'cardimages', 'cards/2025/05/19/81020660-21c4-4af2-96e7-299451fb92bf_cropped_IMG20250406191214.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:34:51.504409+00', '2025-05-18 19:34:51.504409+00', '2025-05-18 19:34:51.504409+00', '{"eTag": "\"5bfb4f79f4662472355507406ceee9e8\"", "size": 502536, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:34:52.000Z", "contentLength": 502536, "httpStatusCode": 200}', '4fd9f555-f818-4343-b2d2-383b9a6c175a', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('a47b214a-8565-42b1-89d2-7d78a137570b', 'cardimages', 'cards/2025/05/19/e041f3af-f214-4c8b-b4f5-3581e6037724_cropped_IMG20250406191037.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:34:51.982158+00', '2025-05-18 19:34:51.982158+00', '2025-05-18 19:34:51.982158+00', '{"eTag": "\"291a0055ec3defb6ac60c93f675c9e9a\"", "size": 504014, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:34:52.000Z", "contentLength": 504014, "httpStatusCode": 200}', '9cb6a04b-0592-402c-80f0-2b52381fab7b', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('b0a110fa-1718-4a7b-b050-038a5c2b7812', 'cardimages', 'cards/2025/05/.emptyFolderPlaceholder', NULL, '2025-05-18 16:48:16.292624+00', '2025-05-18 16:48:16.292624+00', '2025-05-18 16:48:16.292624+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T16:48:17.000Z", "contentLength": 0, "httpStatusCode": 200}', '1df638fb-ff2d-4d08-b6dc-6199602f14b2', NULL, '{}'),
	('1e41a8a0-82a3-4c90-a494-f0dcaac19669', 'cardimages', 'cards/2025/05/19/fb5d5562-ac9f-4698-9e7f-ed98660f8d7a_thumbnail_cropped_IMG20250406191214_thumb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:34:52.432469+00', '2025-05-18 19:34:52.432469+00', '2025-05-18 19:34:52.432469+00', '{"eTag": "\"de09c743cba9a0c60c6c3835363e5e58\"", "size": 427510, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:34:53.000Z", "contentLength": 427510, "httpStatusCode": 200}', '02d93680-09bb-40b3-be71-8b155bd0e191', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('9d97205b-081c-44d7-b857-483473ddd989', 'cardimages', 'cards/2025/05/19/1417444d-2622-4be6-8a92-aab1d436d1d8_cropped_IMG20250406190610.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:43:34.563975+00', '2025-05-18 19:43:34.563975+00', '2025-05-18 19:43:34.563975+00', '{"eTag": "\"7de86c20434111e1a813e6f5cbcbba19\"", "size": 331150, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:43:35.000Z", "contentLength": 331150, "httpStatusCode": 200}', '57b061ab-8319-4e5a-89d8-42993a50988e', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('0c626cc3-c924-4e88-a794-ab1ebb30d291', 'cardimages', 'cards/2025/05/19/4d8312b1-de8b-4dda-87bb-15f182932a36_cropped_IMG20250406190445.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:43:34.896136+00', '2025-05-18 19:43:34.896136+00', '2025-05-18 19:43:34.896136+00', '{"eTag": "\"f1d46454f129156a5d8e429d86d43078\"", "size": 338500, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:43:35.000Z", "contentLength": 338500, "httpStatusCode": 200}', '73165086-e34b-49af-a403-8b2a529b8693', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}'),
	('19d4b20a-5c58-444a-9946-5f55fd9d9912', 'cardimages', 'cards/2025/05/19/23f50557-ed1d-4d14-bd54-0d0b21e467f2_thumbnail_cropped_IMG20250406190610_thumb.webp', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '2025-05-18 19:43:35.168224+00', '2025-05-18 19:43:35.168224+00', '2025-05-18 19:43:35.168224+00', '{"eTag": "\"b35a442e957c70cb739c5e49c133aae7\"", "size": 20206, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-05-18T19:43:36.000Z", "contentLength": 20206, "httpStatusCode": 200}', '121c6d5b-b214-4bae-819c-c582c5fee428', '21c64a13-eb77-4695-a5f0-c6cd45a78e5f', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 82, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
