export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  category: Category;
  dietaryTags: DietaryTag[];
  imageUrl?: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface MealPlan {
  id: string;
  weekStartDate: string;
  meals: {
    [key in DayOfWeek]: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
  };
}

export type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free' | 'Keto' | 'Paleo';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';