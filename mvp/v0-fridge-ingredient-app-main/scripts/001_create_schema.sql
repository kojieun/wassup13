-- 냉부해 (NaengBuHae) Database Schema
-- Fridge management app with AI recipe recommendations

-- User profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  household_size INTEGER DEFAULT 1,
  allergy_info TEXT[] DEFAULT '{}',
  dietary_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Ingredient master list
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  default_shelf_life_days INTEGER DEFAULT 7,
  default_unit TEXT DEFAULT '개',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients_select_all" ON public.ingredients FOR SELECT USING (true);

-- User inventory (fridge contents)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT '개',
  expiry_date DATE NOT NULL,
  storage_type TEXT NOT NULL DEFAULT '냉장', -- 냉장, 냉동, 실온
  status TEXT NOT NULL DEFAULT 'fresh', -- fresh, expiring_soon, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_select_own" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "inventory_insert_own" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inventory_update_own" ON public.inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "inventory_delete_own" ON public.inventory FOR DELETE USING (auth.uid() = user_id);

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT '보통', -- 쉬움, 보통, 어려움
  cook_time_minutes INTEGER NOT NULL DEFAULT 30,
  servings INTEGER DEFAULT 2,
  steps JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipes_select_all" ON public.recipes FOR SELECT USING (true);

-- Recipe ingredients (items needed for each recipe)
CREATE TABLE IF NOT EXISTS public.recipe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT '개',
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recipe_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipe_items_select_all" ON public.recipe_items FOR SELECT USING (true);

-- Cooking history
CREATE TABLE IF NOT EXISTS public.cooking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  cooked_at TIMESTAMPTZ DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  saved_ingredients JSONB DEFAULT '[]', -- [{ingredient_name, quantity, unit}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cooking_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cooking_history_select_own" ON public.cooking_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cooking_history_insert_own" ON public.cooking_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cooking_history_update_own" ON public.cooking_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cooking_history_delete_own" ON public.cooking_history FOR DELETE USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'NOTICE', -- EXPIRY, RECIPE, NOTICE
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nickname', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


  CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data ->> 'nickname',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1), -- 이메일 앞부분
      '사용자_' || substring(new.id::text, 1, 8)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;


