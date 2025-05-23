# recipe_clients/spoonacular_adapter.py
"""Adapter for Spoonacular client to follow the standard recipe client interface."""

import logging
from typing import List, Optional, Dict, Any

from .recipe_client_abc import RecipeClient, Recipe, RecipeIngredient
from .spoonacular_client import SpoonacularClient
from .spoonacular_models import SpoonacularRecipe

# Configure logging
logger = logging.getLogger(__name__)


class SpoonacularAdapter(RecipeClient):
    """Adapter for SpoonacularClient to conform to the RecipeClient interface."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize with optional API key for Spoonacular.
        If not provided, looks for SPOONTACULAR_API_KEY in environment.
        """
        self.client = SpoonacularClient(api_key=api_key)
    
    def search_recipes(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Recipe]:
        """
        Search for recipes by query string.
        
        Args:
            query: The search query (recipe name, ingredients, etc.)
            filters: Optional filters like cuisine, diet, etc.
            
        Returns:
            Standardized Recipe objects matching the query.
        """
        spoonacular_recipes = self.client.search_recipes(query, filters)
        return [self._convert_spoonacular_to_recipe(recipe) for recipe in spoonacular_recipes]
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        """
        Get recipe details by ID.
        
        Args:
            recipe_id: The Spoonacular recipe ID, possibly with prefix.
            
        Returns:
            Standardized Recipe object if found, None otherwise.
        """
        # Strip any prefix if this is a standardized ID
        if recipe_id.startswith("spoonacular_"):
            recipe_id = recipe_id[12:]  # Remove "spoonacular_" prefix
        
        spoonacular_recipe = self.client.get_recipe_details_by_id(recipe_id)
        if not spoonacular_recipe:
            return None
        
        return self._convert_spoonacular_to_recipe(spoonacular_recipe)
    
    def _convert_spoonacular_to_recipe(self, sp_recipe: SpoonacularRecipe) -> Recipe:
        """Convert Spoonacular recipe to standardized Recipe model."""
        # Convert ingredients
        ingredients = []
        for ing in sp_recipe.ingredients:
            ingredients.append(
                RecipeIngredient(
                    name=ing.name,
                    amount=ing.amount,
                    unit=ing.unit,
                    original_text=ing.original_string
                )
            )
        
        # Create standardized recipe
        return Recipe(
            id=f"spoonacular_{sp_recipe.id}",
            source_api="spoonacular",
            source_id=str(sp_recipe.id),
            name=sp_recipe.title,
            ingredients=ingredients,
            instructions=sp_recipe.instructions,
            image_url=sp_recipe.image,
            source_url=sp_recipe.source_url,
            prep_time_minutes=sp_recipe.preparation_minutes,
            cook_time_minutes=sp_recipe.cooking_minutes,
            total_time_minutes=sp_recipe.ready_in_minutes,
            servings=sp_recipe.servings,
            cuisine_tags=sp_recipe.cuisines,
            dietary_tags=sp_recipe.dietary_tags
        )
