import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RecipeForm } from './components/RecipeForm';
import { RecipeList } from './components/RecipeList';
import { MealPlanner } from './components/MealPlanner';
import type { Recipe, Category, DietaryTag, MealPlan } from './types';
import { UtensilsCrossed } from 'lucide-react';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : {
      id: uuidv4(),
      weekStartDate: new Date().toISOString(),
      meals: {}
    };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>([]);
  const [activeTab, setActiveTab] = useState<'recipes' | 'planner'>('recipes');

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const handleAddRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const recipeWithId: Recipe = {
      ...newRecipe,
      id: uuidv4()
    };
    setRecipes([...recipes, recipeWithId]);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
  };

  const handleExport = () => {
    const data = {
      recipes,
      mealPlan
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipe-planner-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.recipes && Array.isArray(data.recipes)) {
            setRecipes(data.recipes);
          }
          if (data.mealPlan) {
            setMealPlan(data.mealPlan);
          }
        } catch (error) {
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UtensilsCrossed className="w-8 h-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Recipe Planner</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Export Data
              </button>
              <label className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'recipes'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recipes
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'planner'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Meal Planner
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'recipes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <RecipeForm
                onSubmit={handleAddRecipe}
                existingRecipes={recipes}
              />
            </div>
            <div className="lg:col-span-2">
              <RecipeList
                recipes={recipes}
                onDeleteRecipe={handleDeleteRecipe}
                onEditRecipe={handleEditRecipe}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedTags={selectedTags}
                onTagChange={setSelectedTags}
              />
            </div>
          </div>
        ) : (
          <MealPlanner
            recipes={recipes}
            mealPlan={mealPlan}
            onUpdateMealPlan={setMealPlan}
          />
        )}
      </main>
    </div>
  );
}

export default App;
