# recipe_clients/mealdb_adapter.py
"""Adapter for MealDB client to follow the standard recipe client interface."""

import logging
from typing import List, Optional, Dict, Any

from .recipe_client_abc import RecipeClient, Recipe, RecipeIngredient
from .mealdb_client import MealDBClient, MealDetail

# Configure logging
logger = logging.getLogger(__name__)


class MealDBAdapter(RecipeClient):
    """Adapter for MealDBClient to conform to the RecipeClient interface."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with optional API key for MealDB."""
        self.client = MealDBClient(api_key=api_key) if api_key else MealDBClient()
    
    def search_recipes(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Recipe]:
        """
        Search for recipes by name.
        
        Args:
            query: The search query (recipe name).
            filters: Optional filters (not supported by free MealDB).
            
        Returns:
            Standardized Recipe objects matching the query.
        """
        # MealDB free API doesn't support filters, so we ignore them
        meal_summaries = self.client.search_recipes_by_name(query)
        
        # Convert to standardized Recipe objects
        recipes = []
        for summary in meal_summaries:
            # For each summary, we need to get the full details to get ingredients
            detail = self.client.get_recipe_details_by_id(summary.id_meal)
            if detail:
                recipes.append(self._convert_meal_detail_to_recipe(detail))
        
        return recipes
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        """
        Get recipe details by ID.
        
        Args:
            recipe_id: The MealDB recipe ID.
            
        Returns:
            Standardized Recipe object if found, None otherwise.
        """
        # Strip any prefix if this is a standardized ID
        if recipe_id.startswith("themealdb_"):
            recipe_id = recipe_id[9:]  # Remove "themealdb_" prefix
        
        detail = self.client.get_recipe_details_by_id(recipe_id)
        if not detail:
            return None
        
        return self._convert_meal_detail_to_recipe(detail)
    
    def _convert_meal_detail_to_recipe(self, meal: MealDetail) -> Recipe:
        """Convert MealDB detail object to standardized Recipe."""
        # Convert ingredients
        ingredients = []
        for ing in meal.ingredients:
            ingredients.append(
                RecipeIngredient(
                    name=ing.name,
                    original_text=f"{ing.name} - {ing.measure}" if ing.measure else ing.name,
                    # Amount and unit are difficult to parse from the string measure
                    # We'd need additional parsing logic to extract these reliably
                )
            )
        
        # Split instructions into steps if it's a single string
        instructions = []
        if meal.instructions:
            # Split by periods followed by whitespace or newlines
            import re
            steps = re.split(r'\.(?:\s+|\n+)', meal.instructions)
            instructions = [step.strip() + "." for step in steps if step.strip()]
        
        # Extract tags
        tags = []
        if meal.tags:
            tags = [tag.strip() for tag in meal.tags.split(",")]
        
        # Create standardized recipe
        return Recipe(
            id=f"themealdb_{meal.id_meal}",
            source_api="themealdb",
            source_id=meal.id_meal,
            name=meal.meal_name,
            ingredients=ingredients,
            instructions=instructions,
            image_url=meal.meal_thumb,
            source_url=meal.source_url,
            # MealDB doesn't provide timing information
            cuisine_tags=[meal.area] if meal.area else [],
            dietary_tags=tags
        )
