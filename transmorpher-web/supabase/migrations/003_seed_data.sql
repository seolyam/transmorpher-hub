-- Seed a default community profile and initial loadout items

-- 1. Insert auth user (with trigger creating the public.profile)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES (
  'd3b07384-d113-43cf-a53c-a9a35e4d2bfd',
  'community@transmorpher.com',
  NULL,
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Community","user_name":"community"}',
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert initial loadouts linked to the community user
INSERT INTO public.loadouts (id, author_id, title, description, class_id, import_string, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'Relentless Gladiator Warlock', 'A dark PvP set for Warlocks.', 9, 'Transmorpher:WarlockPvP:xyz123', 'https://lh3.googleusercontent.com/aida/ADBb0ui-7IITkmOaYPzN_AxP6t4_JALh54Xf93TDnyNKE5ytyNNUtJQeBu7ZoGmTLKkX9wCTFgwDlKCsUJnr5-z7Ei_EmOSTdyi5YrJh_Lri84r8Y6hu058n_GqnfriILZ2v_xv2QX7cnkK8XXjh-tdNxU67dBgRszl1_E4rxJIQbu6ewzJGHYSfej_sgV9aWBgEq2cYqlJRD8pt9TzJV1DCxUwE5jBjtYKL-JXR4VP31OV7sqWM-568019Q_g'),
  ('22222222-2222-2222-2222-222222222222', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'Death Knight Tier 10 Heroic', 'Icecrown Citadel heroic set.', 6, 'Transmorpher:DK_T10:xyz123', 'https://lh3.googleusercontent.com/aida/ADBb0uhhwHlaLoezlOBVh4SBfTZ1idsMu9C0WS0pEONlSdnmJ6Z12uK_mjn1AyTgfU3M7wiIUfZoiyMuxsW-XOEAm3ZXqTJG9JL5WQVQP9PPqJaD2slRyItFAZNNGtyKnHz4AzxptSucEUQYgzL9Oo1sKRTp8HAsIgsew2vwYeHpw1Msw6uzrQNsgrQQLJo-0P5kCKmAq4W_yqjMu_l3FAWqLcG0kULOvgQWV0h1ZssIWVJKyctFzPk8zseqmQ'),
  ('33333333-3333-3333-3333-333333333333', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'Sunwell Plateau Priest', 'Golden Priest robes from Sunwell.', 5, 'Transmorpher:PriestSunwell:xyz123', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'),
  ('44444444-4444-4444-4444-444444444444', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'T6 Warrior Classic Look', 'Onslaught Armor Set.', 1, 'Transmorpher:WarriorT6:xyz123', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'),
  ('55555555-5555-5555-5555-555555555555', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'Ulduar Rogue T8', 'Terrorblade Battlegear.', 4, 'Transmorpher:RogueUlduar:xyz123', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=80'),
  ('66666666-6666-6666-6666-666666666666', 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd', 'Val''anyr Shaman Set', 'Ulduar tier Shaman set with mace.', 7, 'Transmorpher:ShamanValanyr:xyz123', 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;
