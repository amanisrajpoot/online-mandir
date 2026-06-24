UPDATE public.pujas 
SET 
  base_price = 201,
  sale_price = 101,
  packages = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid(),
    'name', 'अकेले के लिए*',
    'members_text', 'For 1 Member',
    'max_members', 1,
    'base_price', 201,
    'sale_price', 101
  ),
  jsonb_build_object(
    'id', gen_random_uuid(),
    'name', 'जोड़े के लिए*',
    'members_text', 'For 2 Members',
    'max_members', 2,
    'base_price', 701,
    'sale_price', 501
  ),
  jsonb_build_object(
    'id', gen_random_uuid(),
    'name', 'परिवार के लिए*',
    'members_text', 'For 6 Members',
    'max_members', 6,
    'base_price', 1501,
    'sale_price', 1001
  ),
  jsonb_build_object(
    'id', gen_random_uuid(),
    'name', 'VIP पूजा',
    'members_text', 'For 6 Members',
    'max_members', 6,
    'base_price', 15001,
    'sale_price', 11001
  )
);

-- Notify PostgREST to reload the schema cache so the API instantly sees the changes
NOTIFY pgrst, 'reload schema';
