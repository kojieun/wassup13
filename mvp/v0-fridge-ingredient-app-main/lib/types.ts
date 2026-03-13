export interface Profile {
  id: string
  nickname: string | null
  household_size: number
  allergy_info: string[]
  dietary_preference: string | null
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id: string
  name: string
  category: string
  image_url: string | null
  default_shelf_life_days: number
  default_unit: string
  created_at: string
}

export interface InventoryItem {
  id: string
  user_id: string
  ingredient_id: string
  quantity: number
  unit: string
  expiry_date: string
  storage_type: '냉장' | '냉동' | '실온'
  status: 'fresh' | 'expiring_soon' | 'expired'
  created_at: string
  updated_at: string
  ingredient?: Ingredient
}

export interface RecipeStep {
  step: number
  instruction: string
}

export interface Recipe {
  id: string
  title: string
  description: string | null
  difficulty: '쉬움' | '보통' | '어려움'
  cook_time_minutes: number
  servings: number
  steps: RecipeStep[]
  image_url: string | null
  created_at: string
}

export interface RecipeItem {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  unit: string
  is_optional: boolean
  created_at: string
  ingredient?: Ingredient
}

export interface RecipeWithIngredients extends Recipe {
  recipe_items: RecipeItem[]
  match_percentage?: number
  missing_ingredients?: Ingredient[]
}

export interface CookingHistory {
  id: string
  user_id: string
  recipe_id: string
  cooked_at: string
  rating: number | null
  saved_ingredients: { ingredient_id: string; quantity: number }[]
  created_at: string
  recipe?: Recipe
}

export interface Notification {
  id: string
  user_id: string
  type: 'EXPIRY' | 'TIP' | 'NOTICE'
  title: string
  content: string | null
  is_read: boolean
  sent_at: string
  created_at: string
}

export type IngredientCategory = '채소' | '육류' | '해산물' | '유제품' | '양념' | '곡류' | '과일'
