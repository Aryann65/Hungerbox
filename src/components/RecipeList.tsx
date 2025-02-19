import React from 'react';
import { Search, Tag, Clock } from 'lucide-react';
import type { Recipe, Category, DietaryTag } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  onDeleteRecipe: (id: string) => void;
  onEditRecipe: (recipe: Recipe) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
  selectedTags: DietaryTag[];
  onTagChange: (tags: DietaryTag[]) => void;
}

export function RecipeList({
  recipes,
  onDeleteRecipe,
  onEditRecipe,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagChange
}: RecipeListProps) {
  const categories: (Category | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  const tags: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => recipe.dietaryTags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search recipes or ingredients..."
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <label key={tag} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={(e) => {
                if (e.target.checked) {
                  onTagChange([...selectedTags, tag]);
                } else {
                  onTagChange(selectedTags.filter(t => t !== tag));
                }
              }}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">{tag}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{recipe.category}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.dietaryTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <details className="text-sm text-gray-600">
                  <summary className="cursor-pointer font-medium">Ingredients</summary>
                  <ul className="mt-2 list-disc list-inside">
                    {recipe.ingredients.map((ing, index) => (
                      <li key={index}>
                        {ing.quantity} {ing.unit} {ing.name}
                      </li>
                    ))}
                  </ul>
                </details>

                <details className="text-sm text-gray-600">
                  <summary className="cursor-pointer font-medium">Steps</summary>
                  <ol className="mt-2 list-decimal list-inside">
                    {recipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </details>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => onEditRecipe(recipe)}
                  className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteRecipe(recipe.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}