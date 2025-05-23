-- Initial seed data for Tsuki CMS
-- Generated from database export on 2025-05-19

-- admin_list data
INSERT INTO "public"."admin_list" ("id", "email", "created_at") VALUES
	('888bd70b-9f64-461f-bc64-ee3c0dc3c0b4', 'iamsiddhanta.6@gmail.com', '2025-05-18 09:38:47.686904+00'),
	('8295f63f-f553-43f0-8bba-a5c4f7d15cce', 'iamsiddhanta.9@gmail.com', '2025-05-18 09:38:47.686904+00');

-- No data found for user_roles

-- categories data
INSERT INTO "public"."categories" ("id", "name", "slug", "created_at") VALUES
	('50fad8b9-161b-491e-a18b-f258eb9e8342', 'Pokemon', 'pokemon', '2025-05-18 14:10:48.98675+00'),
	('558c406c-f43a-4297-b082-09ba62c0eb85', 'One Piece', 'one-piece', '2025-05-18 14:10:48.98675+00');

-- grade_companies data
INSERT INTO "public"."grade_companies" ("id", "name", "slug", "created_at", "grades") VALUES
	('80d4ff9f-0e2e-4616-a146-38a90c592cfb', 'PSA', 'psa', '2025-05-18 14:10:48.98675+00', '{10,9,8,7,6,5,4,3,2,1}'),
	('bc342eb1-24dc-4dd5-a69a-44987dd2c144', 'BGS', 'bgs', '2025-05-18 14:10:48.98675+00', '{10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}'),
	('52871507-1d53-4346-96d6-fb6c25b6a578', 'CGC', 'cgc', '2025-05-18 14:10:48.98675+00', '{10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}'),
	('07fd0805-4ef8-4bfc-a3ca-3beb4b5c0edd', 'ARS', 'ars', '2025-05-19 12:33:32.726283+00', '{10+,10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1}');

-- sets data
INSERT INTO "public"."sets" ("id", "name", "slug", "category_id", "created_at") VALUES
	('a157b2f6-18ed-447b-bd91-b41fb8520646', 'Scarlet & Violet', 'sv', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:21:56.682808+00'),
	('a4445a5c-a680-4970-8a62-1d9a9469d3e5', 'Sword & Shield', 'ss', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:24:17.846824+00'),
	('6cfc7790-82b8-40d7-9046-2bf723b02073', 'Sun & Moon', 'sm', '50fad8b9-161b-491e-a18b-f258eb9e8342', '2025-05-18 14:25:29.983741+00'),
	('bb26e046-300b-4889-8dfe-0cb64664c15a', 'OP Series', 'op', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:19:03.648339+00'),
	('1d8a4fd8-b63a-4e01-a239-3cc7d1ddb1c5', 'Premium Booster', 'prb', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:19:47.681075+00'),
	('0d9d061c-2796-4fa5-8554-e1f5e6def52c', 'Starter Deck', 'st', '558c406c-f43a-4297-b082-09ba62c0eb85', '2025-05-19 10:20:45.416357+00');

-- subsets data
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

-- cards data
INSERT INTO "public"."cards" ("id", "name", "slug", "image_urls", "thumbnail_url", "category_id", "set_id", "subset_id", "condition", "language", "price", "created_at") VALUES
	('b76e50fc-2030-4010-8dd5-c74b967013e6', 'Test-2', 'test-2-801c1991', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/81020660-21c4-4af2-96e7-299451fb92bf_cropped_IMG20250406191214.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/e041f3af-f214-4c8b-b4f5-3581e6037724_cropped_IMG20250406191037.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/fb5d5562-ac9f-4698-9e7f-ed98660f8d7a_thumbnail_cropped_IMG20250406191214_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 9, 'japanese', 12344.00, '2025-05-18 19:34:52.530458+00'),
	('809a37e4-ccc5-4179-9f26-0ef634b46212', 'Test-3', 'test-3-b6bdb7d1', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/1417444d-2622-4be6-8a92-aab1d436d1d8_cropped_IMG20250406190610.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/4d8312b1-de8b-4dda-87bb-15f182932a36_cropped_IMG20250406190445.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/23f50557-ed1d-4d14-bd54-0d0b21e467f2_thumbnail_cropped_IMG20250406190610_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 9, 'Japanese', 1234.00, '2025-05-18 19:43:35.295913+00'),
	('05670a33-080b-4117-aa71-a5f439ef55dd', 'Test-4', 'test-4-96db49d9', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/d8819074-3595-4bca-8fdd-f011ca41fbb2_cropped_IMG20250406190403.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/9d138298-9614-4367-8ea6-bbbec3af9987_cropped_IMG20250406185929.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/64d03bc6-ecaf-476b-846e-01c4c74dce55_thumbnail_cropped_IMG20250406190403_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 9, 'Japanese', 1245.00, '2025-05-18 19:50:37.617744+00'),
	('2b57d5c8-ddfa-4e8e-8aa9-af0cc23773b2', 'Test-1', 'test-1-769d8d1a', '{https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/144f33e3-667d-4841-bb55-f5ca2d537fa7_cropped_IMG20250406191806.webp,https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/5373cfb9-4da8-4a18-937f-7bf2185d1786_cropped_IMG20250406192115.webp}', 'https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/19/d624a4c3-9c02-415a-9b09-43fe7d8b7600_thumbnail_cropped_IMG20250406191806_thumb.webp', '50fad8b9-161b-491e-a18b-f258eb9e8342', 'a157b2f6-18ed-447b-bd91-b41fb8520646', '933d87d8-083c-4f3c-bba8-a1501e5650cf', 9, 'Japanese', 1232.00, '2025-05-18 19:16:07.967535+00');

-- slabs data
INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('cardimages', 'cardimages', NULL, '2025-05-18 13:05:31.621396+00', '2025-05-18 13:05:31.621396+00', true, false, NULL, NULL, NULL),
	('slabimages', 'slabimages', NULL, '2025-05-19 15:27:14.982067+00', '2025-05-19 15:27:14.982067+00', true, false, NULL, NULL, NULL);

-- accessories data
