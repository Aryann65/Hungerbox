import React, { useState } from 'react';
import { Calendar, ShoppingCart } from 'lucide-react';
import type { Recipe, MealPlan, DayOfWeek } from '../types';

interface MealPlannerProps {
  recipes: Recipe[];
  mealPlan: MealPlan;
  onUpdateMealPlan: (mealPlan: MealPlan) => void;
}

export function MealPlanner({ recipes, mealPlan, onUpdateMealPlan }: MealPlannerProps) {
  const [showShoppingList, setShowShoppingList] = useState(false);
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  const getShoppingList = () => {
    const ingredients: { [key: string]: { quantity: number; unit: string } } = {};

    days.forEach(day => {
      mealTypes.forEach(mealType => {
        const recipeId = mealPlan.meals[day]?.[mealType];
        if (recipeId) {
          const recipe = recipes.find(r => r.id === recipeId);
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              if (ingredients[ing.name]) {
                if (ingredients[ing.name].unit === ing.unit) {
                  ingredients[ing.name].quantity += ing.quantity;
                } else {
                  ingredients[`${ing.name} (${ing.unit})`] = {
                    quantity: ing.quantity,
                    unit: ing.unit
                  };
                }
              } else {
                ingredients[ing.name] = {
                  quantity: ing.quantity,
                  unit: ing.unit
                };
              }
            });
          }
        }
      });
    });

    return ingredients;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Meal Plan</h2>
        </div>
        <button
          onClick={() => setShowShoppingList(!showShoppingList)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Shopping List
        </button>
      </div>

      {showShoppingList && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Shopping List</h3>
          <ul className="space-y-2">
            {Object.entries(getShoppingList()).map(([name, { quantity, unit }]) => (
              <li key={name} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  {quantity} {unit} {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
            {mealTypes.map(mealType => (
              <div key={mealType} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {mealType}
                </label>
                <select
                  value={mealPlan.meals[day]?.[mealType] || ''}
                  onChange={(e) => {
                    const newMealPlan = { ...mealPlan };
                    if (!newMealPlan.meals[day]) {
                      newMealPlan.meals[day] = {};
                    }
                    newMealPlan.meals[day][mealType] = e.target.value || undefined;
                    onUpdateMealPlan(newMealPlan);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select a recipe</option>
                  {recipes
                    .filter(recipe => recipe.category.toLowerCase() === mealType)
                    .map(recipe => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}