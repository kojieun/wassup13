-- Seed data for 냉부해 (NaengBuHae) app

-- Insert ingredient categories and items
INSERT INTO public.ingredients (name, category, default_shelf_life_days, default_unit) VALUES
-- 채소 (Vegetables)
('시금치', '채소', 5, 'g'),
('양배추', '채소', 14, '개'),
('당근', '채소', 21, '개'),
('양파', '채소', 30, '개'),
('대파', '채소', 14, '대'),
('마늘', '채소', 60, '쪽'),
('감자', '채소', 21, '개'),
('고구마', '채소', 30, '개'),
('브로콜리', '채소', 7, '개'),
('파프리카', '채소', 10, '개'),
('토마토', '채소', 7, '개'),
('오이', '채소', 7, '개'),
('상추', '채소', 5, 'g'),
('깻잎', '채소', 7, '장'),
('콩나물', '채소', 3, 'g'),
('숙주', '채소', 3, 'g'),
('버섯', '채소', 7, 'g'),
('애호박', '채소', 7, '개'),
('무', '채소', 21, '개'),
('배추', '채소', 14, '포기'),

-- 과일 (Fruits)
('사과', '과일', 14, '개'),
('바나나', '과일', 5, '개'),
('오렌지', '과일', 14, '개'),
('레몬', '과일', 21, '개'),
('포도', '과일', 7, '송이'),
('딸기', '과일', 5, 'g'),
('블루베리', '과일', 7, 'g'),
('키위', '과일', 14, '개'),
('배', '과일', 14, '개'),
('귤', '과일', 14, '개'),

-- 육류 (Meat)
('소고기', '육류', 3, 'g'),
('돼지고기', '육류', 3, 'g'),
('닭고기', '육류', 2, 'g'),
('삼겹살', '육류', 3, 'g'),
('목살', '육류', 3, 'g'),
('닭가슴살', '육류', 2, 'g'),
('베이컨', '육류', 7, 'g'),
('소시지', '육류', 14, '개'),

-- 해산물 (Seafood)
('연어', '해산물', 2, 'g'),
('새우', '해산물', 2, 'g'),
('오징어', '해산물', 2, '마리'),
('조개', '해산물', 1, 'g'),
('참치캔', '해산물', 365, '캔'),
('고등어', '해산물', 2, '마리'),
('멸치', '해산물', 180, 'g'),

-- 유제품 (Dairy)
('우유', '유제품', 7, 'ml'),
('계란', '유제품', 21, '개'),
('치즈', '유제품', 30, '장'),
('버터', '유제품', 60, 'g'),
('요거트', '유제품', 14, '개'),
('크림치즈', '유제품', 14, 'g'),

-- 면/곡물 (Grains)
('쌀', '곡물', 180, 'g'),
('라면', '곡물', 180, '개'),
('파스타면', '곡물', 365, 'g'),
('우동면', '곡물', 7, '인분'),
('식빵', '곡물', 5, '장'),
('밀가루', '곡물', 180, 'g'),

-- 양념/소스 (Condiments)
('간장', '양념', 365, 'ml'),
('고추장', '양념', 180, 'g'),
('된장', '양념', 180, 'g'),
('식용유', '양념', 365, 'ml'),
('참기름', '양념', 180, 'ml'),
('소금', '양념', 730, 'g'),
('설탕', '양념', 730, 'g'),
('고춧가루', '양념', 180, 'g'),
('후추', '양념', 365, 'g'),

-- 두부/콩류 (Tofu/Beans)
('두부', '두부/콩류', 5, '모'),
('순두부', '두부/콩류', 3, '봉'),
('콩', '두부/콩류', 365, 'g')
ON CONFLICT DO NOTHING;

-- Insert sample recipes
INSERT INTO public.recipes (title, description, difficulty, cook_time_minutes, servings, steps) VALUES
(
  '시금치 된장국',
  '영양 만점 시금치 된장국으로 건강한 한 끼를 완성하세요',
  '쉬움',
  20,
  2,
  '[
    {"step": 1, "description": "시금치를 깨끗이 씻어 먹기 좋은 크기로 썹니다"},
    {"step": 2, "description": "물을 끓이고 된장을 풀어줍니다"},
    {"step": 3, "description": "두부를 깍둑썰기하여 넣습니다"},
    {"step": 4, "description": "시금치를 넣고 1-2분 더 끓입니다"},
    {"step": 5, "description": "대파를 송송 썰어 마무리합니다"}
  ]'::jsonb
),
(
  '계란말이',
  '부드럽고 촉촉한 계란말이',
  '보통',
  15,
  2,
  '[
    {"step": 1, "description": "계란을 풀고 소금으로 간합니다"},
    {"step": 2, "description": "대파를 송송 썰어 계란물에 넣습니다"},
    {"step": 3, "description": "약불에서 계란물을 조금씩 부어가며 말아줍니다"},
    {"step": 4, "description": "먹기 좋은 크기로 썰어 접시에 담습니다"}
  ]'::jsonb
),
(
  '삼겹살 김치볶음',
  '바삭한 삼겹살과 새콤한 김치의 완벽한 조합',
  '쉬움',
  25,
  2,
  '[
    {"step": 1, "description": "삼겹살을 먹기 좋은 크기로 썹니다"},
    {"step": 2, "description": "팬에 삼겹살을 노릇하게 굽습니다"},
    {"step": 3, "description": "김치를 넣고 함께 볶습니다"},
    {"step": 4, "description": "설탕과 참기름으로 간을 맞춥니다"}
  ]'::jsonb
),
(
  '토마토 파스타',
  '간단하지만 맛있는 토마토 파스타',
  '보통',
  30,
  2,
  '[
    {"step": 1, "description": "파스타면을 삶습니다"},
    {"step": 2, "description": "토마토를 잘게 썰어 팬에 볶습니다"},
    {"step": 3, "description": "마늘을 넣고 향을 냅니다"},
    {"step": 4, "description": "삶은 파스타를 넣고 함께 볶습니다"},
    {"step": 5, "description": "소금, 후추로 간을 맞춥니다"}
  ]'::jsonb
),
(
  '닭가슴살 샐러드',
  '건강한 다이어트 식단을 위한 닭가슴살 샐러드',
  '쉬움',
  20,
  1,
  '[
    {"step": 1, "description": "닭가슴살을 삶거나 굽습니다"},
    {"step": 2, "description": "상추, 토마토, 오이를 씻어 먹기 좋게 썹니다"},
    {"step": 3, "description": "닭가슴살을 슬라이스하여 야채 위에 올립니다"},
    {"step": 4, "description": "원하는 드레싱을 뿌려 완성합니다"}
  ]'::jsonb
),
(
  '된장찌개',
  '구수한 된장찌개로 따뜻한 한 끼를',
  '보통',
  30,
  3,
  '[
    {"step": 1, "description": "감자, 양파, 애호박을 깍둑썰기합니다"},
    {"step": 2, "description": "물을 끓이고 된장을 풀어줍니다"},
    {"step": 3, "description": "야채와 두부를 넣고 끓입니다"},
    {"step": 4, "description": "고추와 대파를 넣어 마무리합니다"}
  ]'::jsonb
),
(
  '볶음밥',
  '간단하고 빠른 볶음밥',
  '쉬움',
  15,
  2,
  '[
    {"step": 1, "description": "야채를 잘게 다집니다"},
    {"step": 2, "description": "계란을 스크램블합니다"},
    {"step": 3, "description": "밥과 야채를 함께 볶습니다"},
    {"step": 4, "description": "간장으로 간을 맞추고 참기름을 둘러 완성합니다"}
  ]'::jsonb
),
(
  '오이무침',
  '아삭아삭 상큼한 오이무침',
  '쉬움',
  10,
  2,
  '[
    {"step": 1, "description": "오이를 얇게 썰어 소금에 절입니다"},
    {"step": 2, "description": "물기를 꼭 짜줍니다"},
    {"step": 3, "description": "고춧가루, 참기름, 마늘로 양념합니다"},
    {"step": 4, "description": "깨를 뿌려 완성합니다"}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Link recipes to ingredients
-- 시금치 된장국
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 100, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '시금치 된장국' AND i.name = '시금치';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 1, '큰술'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '시금치 된장국' AND i.name = '된장';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '모'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '시금치 된장국' AND i.name = '두부';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 1, '대'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '시금치 된장국' AND i.name = '대파';

-- 계란말이
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 3, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '계란말이' AND i.name = '계란';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '대'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '계란말이' AND i.name = '대파';

-- 삼겹살 김치볶음
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 200, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '삼겹살 김치볶음' AND i.name = '삼겹살';

-- 토마토 파스타
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 200, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '토마토 파스타' AND i.name = '파스타면';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 2, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '토마토 파스타' AND i.name = '토마토';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 3, '쪽'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '토마토 파스타' AND i.name = '마늘';

-- 닭가슴살 샐러드
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 150, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '닭가슴살 샐러드' AND i.name = '닭가슴살';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 50, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '닭가슴살 샐러드' AND i.name = '상추';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 1, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '닭가슴살 샐러드' AND i.name = '토마토';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '닭가슴살 샐러드' AND i.name = '오이';

-- 된장찌개
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 2, '큰술'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '된장찌개' AND i.name = '된장';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 1, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '된장찌개' AND i.name = '감자';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '된장찌개' AND i.name = '양파';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '된장찌개' AND i.name = '애호박';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '모'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '된장찌개' AND i.name = '두부';

-- 볶음밥
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 200, 'g'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '볶음밥' AND i.name = '쌀';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 2, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '볶음밥' AND i.name = '계란';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '볶음밥' AND i.name = '양파';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 0.5, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '볶음밥' AND i.name = '당근';

-- 오이무침
INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 2, '개'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '오이무침' AND i.name = '오이';

INSERT INTO public.recipe_items (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, 2, '쪽'
FROM public.recipes r, public.ingredients i 
WHERE r.title = '오이무침' AND i.name = '마늘';
