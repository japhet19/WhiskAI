# MVP Phase 2: Core Flow Implementation

## Overview
This phase implements the core user journey from onboarding through recipe generation to meal planning. Expected timeline: 2-3 weeks for a solo developer.

## 1. Landing Page Implementation

### 1.1 Landing Page Component

Create `/client/src/pages/Landing/index.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { FadeSlideUp } from '../../components/animations/FadeSlideUp';
import { ScalePop } from '../../components/animations/ScalePop';

const TYPING_MESSAGES = [
  "What's for dinner tonight?",
  "Let me help you plan your meals",
  "Cooking made simple and fun",
  "Your AI-powered kitchen companion"
];

export function LandingPage() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const message = TYPING_MESSAGES[messageIndex];
    let currentIndex = 0;

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (currentIndex <= message.length) {
          setDisplayedText(message.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setMessageIndex((prev) => (prev + 1) % TYPING_MESSAGES.length);
            setIsTyping(true);
          }, 2000);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [messageIndex, isTyping]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-light via-white to-melon-light">
      {/* Sticky Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="WhiskAI" className="h-8 w-8" />
              <span className="font-bold text-xl text-teal">WhiskAI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-teal transition-colors hover:underline">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-teal transition-colors hover:underline">
                Pricing
              </a>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-teal font-medium hover:underline"
              >
                Sign in
              </button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <FadeSlideUp className="text-center">
          <div className="relative inline-block mb-8">
            <img
              src="/curie-avatar.png"
              alt="Curie"
              className="w-14 h-14 rounded-full shadow-lg"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-16 top-0 bg-white rounded-2xl shadow-lg px-4 py-2 min-w-[200px]"
              >
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
                <p className="text-gray-800 text-sm font-medium">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            What's for dinner tonight?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            WhiskAI helps you plan delicious meals within your budget. 
            Get personalized recipes, create meal plans, and generate shopping lists—all powered by AI.
          </p>

          <ScalePop>
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center px-8 py-4 bg-teal text-white font-semibold rounded-full hover:bg-teal-dark transition-colors group"
            >
              Get Started
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </ScalePop>
        </FadeSlideUp>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: '🍳',
              title: 'Smart Recipe Suggestions',
              description: 'AI-powered recommendations based on your preferences and budget'
            },
            {
              icon: '📅',
              title: 'Meal Planning Made Easy',
              description: 'Drag and drop to create your perfect weekly meal plan'
            },
            {
              icon: '🛒',
              title: 'Instant Shopping Lists',
              description: 'Generate grocery lists and send them straight to your cart'
            }
          ].map((feature, index) => (
            <FadeSlideUp key={index} delay={index * 0.1}>
              <div className="bg-white rounded-3xl p-6 shadow-card hover:shadow-cardHover transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </FadeSlideUp>
          ))}
        </div>
      </main>
    </div>
  );
}
```

## 2. Onboarding Flow

### 2.1 Onboarding Container

Create `/client/src/pages/Onboarding/index.tsx`:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DietaryPreferences } from './DietaryPreferences';
import { TimeAndServings } from './TimeAndServings';
import { BudgetSetup } from './BudgetSetup';

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [, setHasOnboarded] = useLocalStorage('whiskai_onboarded', false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleComplete = () => {
    setHasOnboarded(true);
    navigate('/recipes');
  };

  const steps = [
    { component: DietaryPreferences, title: 'Dietary Preferences' },
    { component: TimeAndServings, title: 'Time & Servings' },
    { component: BudgetSetup, title: 'Budget' }
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-light via-white to-melon-light">
      {/* Curie Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/curie-avatar.png" alt="Curie" className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-lg">Curie</span>
          </div>
          <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              onNext={() => {
                if (currentStep < steps.length) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleComplete();
                }
              }}
              onBack={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                }
              }}
              isLastStep={currentStep === steps.length}
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex justify-center mt-12 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentStep ? 'bg-teal' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Dietary Preferences Step

Create `/client/src/pages/Onboarding/DietaryPreferences.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeSlideUp } from '../../components/animations/FadeSlideUp';

interface Props {
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

const DEFAULT_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Nut-Free'
];

export function DietaryPreferences({ onNext }: Props) {
  const { state, actions } = useApp();
  const [selected, setSelected] = useState<string[]>(state.preferences.dietary);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    actions.updatePreferences({ dietary: selected });
  }, [selected, actions]);

  const toggleOption = (option: string) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const addCustomOption = () => {
    if (customInput.trim() && !selected.includes(customInput.trim())) {
      setSelected(prev => [...prev, customInput.trim()]);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prompt Bubble */}
      <div className="relative">
        <div className="bg-white rounded-3xl shadow-card p-6 relative">
          <div className="absolute -top-2 left-12 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-white border-r-8 border-r-transparent" />
          <p className="text-lg text-gray-800">
            Do you have any dietary preferences or restrictions I should know about?
          </p>
        </div>
      </div>

      {/* Pill Chips */}
      <div className="flex flex-wrap gap-3">
        {DEFAULT_OPTIONS.map((option, index) => (
          <FadeSlideUp key={option} delay={index * 0.04}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleOption(option)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selected.includes(option)
                  ? 'bg-teal text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal'
              }`}
            >
              {option}
            </motion.button>
          </FadeSlideUp>
        ))}

        {/* Custom Options */}
        {selected
          .filter(opt => !DEFAULT_OPTIONS.includes(opt))
          .map((option) => (
            <motion.button
              key={option}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => toggleOption(option)}
              className="px-6 py-3 rounded-full font-medium bg-teal text-white flex items-center space-x-2"
            >
              <span>{option}</span>
              <X className="w-4 h-4" />
            </motion.button>
          ))}

        {/* Add Custom Button */}
        {!showCustomInput && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCustomInput(true)}
            className="px-6 py-3 rounded-full font-medium bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-teal hover:text-teal flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </motion.button>
        )}

        {/* Custom Input */}
        {showCustomInput && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomOption()}
              placeholder="Type preference..."
              className="px-4 py-2 rounded-full border-2 border-gray-300 focus:border-teal focus:outline-none"
              autoFocus
            />
            <button
              onClick={addCustomOption}
              className="p-2 rounded-full bg-teal text-white hover:bg-teal-dark"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomInput('');
              }}
              className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onNext}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Skip
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            selected.length > 0
              ? 'bg-teal text-white hover:bg-teal-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 2.3 Time and Servings Step

Create `/client/src/pages/Onboarding/TimeAndServings.tsx`:

```typescript
import React, { useState } from 'react';
import { Clock, Users, Minus, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeSlideUp } from '../../components/animations/FadeSlideUp';

interface Props {
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function TimeAndServings({ onNext, onBack }: Props) {
  const { state, actions } = useApp();
  const [cookingTime, setCookingTime] = useState(state.preferences.cookingTime);
  const [servings, setServings] = useState(state.preferences.servings);

  const handleNext = () => {
    actions.updatePreferences({ cookingTime, servings });
    onNext();
  };

  const adjustServings = (delta: number) => {
    const newValue = Math.max(1, Math.min(12, servings + delta));
    setServings(newValue);
  };

  return (
    <div className="space-y-8">
      {/* Prompt Bubble */}
      <div className="relative">
        <div className="bg-white rounded-3xl shadow-card p-6 relative">
          <div className="absolute -top-2 left-12 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-white border-r-8 border-r-transparent" />
          <p className="text-lg text-gray-800">
            How much time do you typically have for cooking, and how many people are you cooking for?
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cooking Time */}
        <FadeSlideUp>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <label className="flex items-center space-x-3 text-gray-700 font-medium mb-4">
              <Clock className="w-5 h-5 text-teal" />
              <span>Typical cooking time</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(Math.max(5, parseInt(e.target.value) || 0))}
                className="w-24 px-4 py-2 text-center text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-teal focus:outline-none"
                inputMode="numeric"
              />
              <span className="text-gray-600">minutes</span>
            </div>
            <div className="mt-4 flex gap-2">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setCookingTime(time)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    cookingTime === time
                      ? 'bg-teal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {time} min
                </button>
              ))}
            </div>
          </div>
        </FadeSlideUp>

        {/* Number of Servings */}
        <FadeSlideUp delay={0.1}>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <label className="flex items-center space-x-3 text-gray-700 font-medium mb-4">
              <Users className="w-5 h-5 text-teal" />
              <span>Number of servings</span>
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => adjustServings(-1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-20 text-center">
                <span className="text-2xl font-bold text-gray-800">{servings}</span>
              </div>
              <button
                onClick={() => adjustServings(1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center">
              {servings === 1 ? 'Just for me' : `Cooking for ${servings} people`}
            </p>
          </div>
        </FadeSlideUp>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full font-semibold bg-teal text-white hover:bg-teal-dark"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 2.4 Budget Setup Step

Create `/client/src/pages/Onboarding/BudgetSetup.tsx`:

```typescript
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeSlideUp } from '../../components/animations/FadeSlideUp';

interface Props {
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function BudgetSetup({ onNext, onBack, isLastStep }: Props) {
  const { state, actions } = useApp();
  const [budget, setBudget] = useState(state.preferences.weeklyBudget);

  const handleNext = () => {
    actions.updatePreferences({ weeklyBudget: budget });
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Prompt Bubble */}
      <div className="relative">
        <div className="bg-white rounded-3xl shadow-card p-6 relative">
          <div className="absolute -top-2 left-12 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-white border-r-8 border-r-transparent" />
          <p className="text-lg text-gray-800">
            What's your weekly grocery budget? I'll help you create delicious meals within your means.
          </p>
        </div>
      </div>

      <FadeSlideUp>
        <div className="bg-white rounded-2xl shadow-card p-8">
          <label className="flex items-center space-x-3 text-gray-700 font-medium mb-6">
            <DollarSign className="w-5 h-5 text-teal" />
            <span>Weekly grocery budget</span>
          </label>

          {/* Budget Display */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              ${budget}
            </div>
            <p className="text-gray-500">per week</p>
          </div>

          {/* Slider */}
          <div className="relative mb-8">
            <input
              type="range"
              min="25"
              max="250"
              step="5"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #FF9B21 0%, #FF9B21 ${((budget - 25) / (250 - 25)) * 100}%, #E5E7EB ${((budget - 25) / (250 - 25)) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="absolute -bottom-6 left-0 text-sm text-gray-500">$25</div>
            <div className="absolute -bottom-6 right-0 text-sm text-gray-500">$250</div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex justify-center gap-3 mt-10">
            {[50, 100, 150, 200].map((amount) => (
              <button
                key={amount}
                onClick={() => setBudget(amount)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  budget === amount
                    ? 'bg-teal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </FadeSlideUp>

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full font-semibold bg-melon text-white hover:bg-melon-dark animate-pulse"
        >
          {isLastStep ? 'Start Cooking!' : 'Next'}
        </button>
      </div>
    </div>
  );
}
```

## 3. Recipe Generation & Display

### 3.1 Recipe Service Enhancement

Create `/client/src/services/recipeService.ts`:

```typescript
import geminiService from './geminiService';
import { Recipe } from '../types';

interface RecipeGenerationParams {
  dietary: string[];
  cookingTime: number;
  servings: number;
  weeklyBudget: number;
  excludeRecipes?: string[]; // IDs to exclude when refreshing
}

const RECIPE_GENERATION_PROMPT = (params: RecipeGenerationParams) => `
You are Curie, the AI chef for WhiskAI. Generate exactly 7 recipes for a weekly meal plan.

User preferences:
- Dietary restrictions: ${params.dietary.length > 0 ? params.dietary.join(', ') : 'None'}
- Maximum cooking time: ${params.cookingTime} minutes
- Servings needed: ${params.servings}
- Weekly budget: $${params.weeklyBudget} (approximately $${Math.floor(params.weeklyBudget / 7)} per recipe)

${params.excludeRecipes?.length ? `Exclude these recipe titles: ${params.excludeRecipes.join(', ')}` : ''}

Return a JSON array with exactly 7 recipes. Each recipe should have:
{
  "id": "unique_id",
  "title": "Recipe Name",
  "imageUrl": "https://source.unsplash.com/800x600/?[food-keyword]",
  "cookTime": number (in minutes),
  "calories": number (per serving),
  "cost": number (total cost in dollars),
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "quantity",
      "unit": "measurement unit",
      "price": number (in dollars)
    }
  ],
  "tags": ["tag1", "tag2"] (include dietary tags, cuisine type, meal type),
  "instructions": ["step 1", "step 2", ...] (clear, numbered steps)
}

Important:
- Ensure total weekly cost stays within budget
- Mix different cuisines and flavors for variety
- Include a balance of proteins, vegetables, and grains
- Make recipes achievable within the cooking time limit
- Use realistic prices based on average grocery costs
- Generate appetizing, home-cook friendly recipes

Return ONLY the JSON array, no additional text.
`;

export class RecipeService {
  static async generateWeeklyRecipes(params: RecipeGenerationParams): Promise<Recipe[]> {
    try {
      const prompt = RECIPE_GENERATION_PROMPT(params);
      const response = await geminiService.sendMessage(prompt);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const recipes = JSON.parse(jsonMatch[0]);
      
      // Add unique IDs if not present
      return recipes.map((recipe: any, index: number) => ({
        ...recipe,
        id: recipe.id || `recipe_${Date.now()}_${index}`,
        imageUrl: recipe.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(recipe.title)},food`
      }));
    } catch (error) {
      console.error('Error generating recipes:', error);
      throw error;
    }
  }

  static async refreshSingleRecipe(
    currentRecipe: Recipe,
    params: RecipeGenerationParams
  ): Promise<Recipe> {
    try {
      const prompt = `
        Generate ONE new recipe to replace "${currentRecipe.title}".
        It should fit the same preferences but be completely different.
        
        ${RECIPE_GENERATION_PROMPT({ ...params, excludeRecipes: [currentRecipe.title] })}
        
        Return a single recipe object, not an array.
      `;
      
      const response = await geminiService.sendMessage(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const newRecipe = JSON.parse(jsonMatch[0]);
      return {
        ...newRecipe,
        id: `recipe_${Date.now()}`,
        imageUrl: newRecipe.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(newRecipe.title)},food`
      };
    } catch (error) {
      console.error('Error refreshing recipe:', error);
      throw error;
    }
  }
}
```

### 3.2 Recipe Card Component

Create `/client/src/components/RecipeCard/index.tsx`:

```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, RefreshCw, Clock, Flame, DollarSign } from 'lucide-react';
import { Recipe } from '../../types';
import { ScalePop } from '../animations/ScalePop';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: () => void;
  onToggleLock: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function RecipeCard({
  recipe,
  onToggleFavorite,
  onToggleLock,
  onRefresh,
  isRefreshing = false
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <ScalePop>
      <motion.div
        layout
        className={`bg-white rounded-3xl shadow-card hover:shadow-cardHover transition-shadow overflow-hidden ${
          recipe.isLocked ? 'ring-2 ring-teal' : ''
        }`}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-light to-melon-light flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <ActionButton
              onClick={onToggleFavorite}
              active={recipe.isFavorite}
              activeColor="text-red-500"
              icon={<Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />}
            />
            <ActionButton
              onClick={onToggleLock}
              active={recipe.isLocked}
              activeColor="text-teal"
              icon={<Lock className={`w-5 h-5 ${recipe.isLocked ? 'fill-current' : ''}`} />}
            />
            <ActionButton
              onClick={onRefresh}
              disabled={isRefreshing}
              icon={
                <RefreshCw 
                  className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              }
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Info Chips */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4" />
              <span>{recipe.calories} cal</span>
            </div>
            <div className="flex items-center space-x-1 font-semibold text-teal">
              <DollarSign className="w-4 h-4" />
              <span>{recipe.cost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </ScalePop>
  );
}

function ActionButton({
  onClick,
  active = false,
  activeColor = 'text-gray-700',
  disabled = false,
  icon
}: {
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  disabled?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-colors ${
        active ? activeColor : 'text-gray-600 hover:text-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
    </motion.button>
  );
}
```

### 3.3 Recipes Page

Create `/client/src/pages/Recipes/index.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { RecipeCard } from '../../components/RecipeCard';
import { RecipeService } from '../../services/recipeService';
import { SkeletonCard } from '../../components/SkeletonCard';
import { BudgetWarning } from '../../components/BudgetWarning';
import { MacroProgress } from '../../components/MacroProgress';

export function RecipesPage() {
  const { state, actions } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingRecipeId, setRefreshingRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (state.recipes.length === 0) {
      loadRecipes();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const recipes = await RecipeService.generateWeeklyRecipes({
        dietary: state.preferences.dietary,
        cookingTime: state.preferences.cookingTime,
        servings: state.preferences.servings,
        weeklyBudget: state.preferences.weeklyBudget,
      });
      actions.setRecipes(recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshRecipe = async (recipeId: string) => {
    setRefreshingRecipeId(recipeId);
    try {
      const currentRecipe = state.recipes.find(r => r.id === recipeId);
      if (!currentRecipe) return;

      const newRecipe = await RecipeService.refreshSingleRecipe(currentRecipe, {
        dietary: state.preferences.dietary,
        cookingTime: state.preferences.cookingTime,
        servings: state.preferences.servings,
        weeklyBudget: state.preferences.weeklyBudget,
      });

      actions.setRecipes(
        state.recipes.map(r => r.id === recipeId ? newRecipe : r)
      );
    } catch (error) {
      console.error('Error refreshing recipe:', error);
      // Show error toast
    } finally {
      setRefreshingRecipeId(null);
    }
  };

  const totalCost = state.recipes.reduce((sum, recipe) => sum + recipe.cost, 0);
  const isOverBudget = totalCost > state.preferences.weeklyBudget;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curie's Suggestions</h1>
          <p className="text-gray-600 mt-1">
            Your personalized meal plan for the week
          </p>
        </div>
        <MacroProgress recipes={state.recipes} />
      </div>

      {/* Budget Warning */}
      <AnimatePresence>
        {isOverBudget && (
          <BudgetWarning
            currentTotal={totalCost}
            budget={state.preferences.weeklyBudget}
            onAdjustBudget={() => window.location.hash = '#budget'}
          />
        )}
      </AnimatePresence>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          // Recipe Cards
          state.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={() => actions.toggleRecipeFavorite(recipe.id)}
              onToggleLock={() => actions.toggleRecipeLock(recipe.id)}
              onRefresh={() => handleRefreshRecipe(recipe.id)}
              isRefreshing={refreshingRecipeId === recipe.id}
            />
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && state.recipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <img
            src="/curie-avatar.png"
            alt="Curie"
            className="w-20 h-20 mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No recipes yet!
          </h3>
          <p className="text-gray-500 mb-6">
            Let me help you discover some delicious meals.
          </p>
          <button
            onClick={loadRecipes}
            className="px-6 py-3 bg-teal text-white font-semibold rounded-full hover:bg-teal-dark"
          >
            Generate Recipes
          </button>
        </motion.div>
      )}
    </div>
  );
}
```

### 3.4 Supporting Components

Create `/client/src/components/SkeletonCard/index.tsx`:

```typescript
import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
        <div className="flex gap-3">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
```

Create `/client/src/components/BudgetWarning/index.tsx`:

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  currentTotal: number;
  budget: number;
  onAdjustBudget: () => void;
}

export function BudgetWarning({ currentTotal, budget, onAdjustBudget }: Props) {
  const overageAmount = currentTotal - budget;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-melon-light border border-melon rounded-2xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-melon-dark" />
        <div>
          <p className="font-medium text-gray-800">
            Over budget by ${overageAmount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Current total: ${currentTotal.toFixed(2)} | Budget: ${budget.toFixed(2)}
          </p>
        </div>
      </div>
      <button
        onClick={onAdjustBudget}
        className="px-4 py-2 bg-melon text-white font-medium rounded-full hover:bg-melon-dark transition-colors"
      >
        Adjust Budget
      </button>
    </motion.div>
  );
}
```

## 4. Budget Modal

Create `/client/src/components/BudgetModal/index.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BudgetModal({ isOpen, onClose }: Props) {
  const { state, actions } = useApp();
  const [budget, setBudget] = useState(state.preferences.weeklyBudget);
  
  const lockedRecipesCost = state.recipes
    .filter(r => r.isLocked)
    .reduce((sum, r) => sum + r.cost, 0);
  
  const hasConflict = lockedRecipesCost > budget;

  useEffect(() => {
    setBudget(state.preferences.weeklyBudget);
  }, [state.preferences.weeklyBudget]);

  const handleConfirm = () => {
    actions.updatePreferences({ weeklyBudget: budget });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-modal max-w-md w-full p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Adjust Weekly Budget
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Warning Banner */}
              <AnimatePresence>
                {hasConflict && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-melon-light border border-melon rounded-xl p-4 mb-6 flex items-start space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-melon-dark flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-800 mb-1">
                        Budget conflict detected
                      </p>
                      <p className="text-gray-600">
                        Your locked recipes cost ${lockedRecipesCost.toFixed(2)}, 
                        which exceeds the new budget. Unlock some recipes or increase your budget.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Budget Display */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  ${budget}
                </div>
                <p className="text-gray-500">per week</p>
              </div>

              {/* Slider */}
              <div className="relative mb-8">
                <input
                  type="range"
                  min="25"
                  max="250"
                  step="5"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00837B 0%, #00837B ${((budget - 25) / (250 - 25)) * 100}%, #E5E7EB ${((budget - 25) / (250 - 25)) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="absolute -bottom-6 left-0 text-sm text-gray-500">$25</div>
                <div className="absolute -bottom-6 right-0 text-sm text-gray-500">$250</div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-10">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-6 py-3 font-medium rounded-full transition-all ${
                    hasConflict
                      ? 'bg-melon text-white hover:bg-melon-dark animate-pulse'
                      : 'bg-teal text-white hover:bg-teal-dark'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## 5. Type Definitions

Create `/client/src/types/index.ts`:

```typescript
export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  cookTime: number;
  calories: number;
  cost: number;
  ingredients: Ingredient[];
  tags: string[];
  instructions: string[];
  isLocked?: boolean;
  isFavorite?: boolean;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  price: number;
}

export interface UserPreferences {
  dietary: string[];
  cookingTime: number;
  servings: number;
  weeklyBudget: number;
}

export interface MealPlan {
  [date: string]: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  recipeIds: string[];
}
```

## 6. Integration Steps

### 6.1 Update Gemini Service

Update `/client/src/services/geminiService.ts` to ensure it's initialized when needed:

```typescript
// Add to the existing service
export const ensureInitialized = async () => {
  if (!chatSession) {
    await initChat();
  }
};
```

### 6.2 Update Package.json

Add required dependencies:

```json
{
  "dependencies": {
    "lucide-react": "^0.263.1",
    "react-beautiful-dnd": "^13.1.1",
    "@types/react-beautiful-dnd": "^13.1.4"
  }
}
```

## Testing Checklist

1. **Onboarding Flow**
   - [ ] All three steps navigate correctly
   - [ ] Preferences are saved to localStorage
   - [ ] Skip buttons work as expected
   - [ ] Animations are smooth

2. **Recipe Generation**
   - [ ] Recipes load on first visit after onboarding
   - [ ] All recipe cards display correctly
   - [ ] Refresh button generates new recipes
   - [ ] Lock/favorite toggles work
   - [ ] Budget calculations are accurate

3. **Budget Modal**
   - [ ] Opens from budget pill click
   - [ ] Shows warning for conflicts
   - [ ] Updates affect recipe suggestions
   - [ ] Animations work correctly

4. **Responsive Design**
   - [ ] Mobile layout works properly
   - [ ] Tablet layout is optimal
   - [ ] Desktop uses space efficiently

5. **Performance**
   - [ ] Skeleton loaders show during API calls
   - [ ] Images lazy load properly
   - [ ] No layout shifts during loading

## Next Steps

After Phase 2 completion:
1. Implement the Meal Planner page with drag-and-drop
2. Add Shopping List drawer functionality
3. Create Recipe Detail pages
4. Implement Walmart price scraping
5. Add cook feedback system
6. Implement memory/privacy features

This completes the core MVP flow from onboarding through recipe generation!