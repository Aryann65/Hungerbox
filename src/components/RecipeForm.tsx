import React, { useState } from 'react';
import { Plus, Minus, ChefHat } from 'lucide-react';
import type { Recipe, Category, DietaryTag, Ingredient } from '../types';

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id'>) => void;
  existingRecipes: Recipe[];
}

export function RecipeForm({ onSubmit, existingRecipes }: RecipeFormProps) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: 1, unit: '' }]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [category, setCategory] = useState<Category>('Dinner');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const categories: Category[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  const tags: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Recipe name is required');
      return;
    }

    const isDuplicate = existingRecipes.some(recipe => 
      recipe.name.toLowerCase() === name.toLowerCase() &&
      JSON.stringify(recipe.ingredients) === JSON.stringify(ingredients)
    );

    if (isDuplicate) {
      setError('A recipe with this name and ingredients already exists');
      return;
    }

    if (ingredients.some(ing => !ing.name.trim() || ing.quantity <= 0)) {
      setError('All ingredients must have a name and valid quantity');
      return;
    }

    if (steps.some(step => !step.trim())) {
      setError('All steps must have content');
      return;
    }

    onSubmit({
      name,
      ingredients,
      steps: steps.filter(step => step.trim()),
      category,
      dietaryTags,
      imageUrl: imageUrl || undefined
    });

    // Reset form
    setName('');
    setIngredients([{ name: '', quantity: 1, unit: '' }]);
    setSteps(['']);
    setCategory('Dinner');
    setDietaryTags([]);
    setImageUrl('');
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    const parsedValue = parseFloat(value);
    // Only update if the value is a valid number and greater than 0
    if (!isNaN(parsedValue) && parsedValue > 0) {
      newIngredients[index].quantity = parsedValue;
      setIngredients(newIngredients);
    } else if (value === '') {
      // Allow empty string for user typing
      newIngredients[index].quantity = 1;
      setIngredients(newIngredients);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <ChefHat className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Add New Recipe</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ingredients</label>
        {ingredients.map((ing, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.name}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index].name = e.target.value;
                setIngredients(newIngredients);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={ing.quantity.toString()}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index].unit = e.target.value;
                setIngredients(newIngredients);
              }}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
              className="p-2 text-red-600 hover:text-red-800"
              disabled={ingredients.length === 1}
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIngredients([...ingredients, { name: '', quantity: 1, unit: '' }])}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Steps</label>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <span className="text-gray-500">{index + 1}.</span>
            <input
              type="text"
              value={step}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[index] = e.target.value;
                setSteps(newSteps);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setSteps(steps.filter((_, i) => i !== index))}
              className="p-2 text-red-600 hover:text-red-800"
              disabled={steps.length === 1}
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSteps([...steps, ''])}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Step
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dietary Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={dietaryTags.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDietaryTags([...dietaryTags, tag]);
                  } else {
                    setDietaryTags(dietaryTags.filter(t => t !== tag));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Recipe
      </button>
    </form>
  );
}