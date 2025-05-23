# recipe_clients/recipe_service.py
"""Unified service for accessing recipe data from different providers."""

import logging
import os
from typing import List, Optional, Dict, Any

from .recipe_client_abc import RecipeClient, Recipe
from .spoonacular_adapter import SpoonacularAdapter

# Configure logging
logger = logging.getLogger(__name__)


class RecipeService:
    """
    Service for accessing recipe data from different providers.
    Manages one or more recipe clients and combines results.
    """
    
    def __init__(self, clients: Optional[List[RecipeClient]] = None):
        """
        Initialize with list of recipe clients.
        If none provided, defaults to SpoonacularAdapter only.
        
        Args:
            clients: List of RecipeClient implementations to use.
        """
        self.clients = clients or []
        
        # If no clients specified, create default client (Spoonacular only)
        if not self.clients:
            # Check for Spoonacular API key
            if os.environ.get("SPOONACULAR_API_KEY"):
                logger.info("Using Spoonacular as the recipe provider")
                self.clients.append(SpoonacularAdapter())
            else:
                # Require Spoonacular API key - no fallback
                raise ValueError(
                    "Spoonacular API key is required but missing. "
                    "Please add SPOONACULAR_API_KEY to your .env file."
                )
    
    def search_recipes(self, query: str, filters: Optional[Dict[str, Any]] = None,
                       limit: int = 20) -> List[Recipe]:
        """
        Search for recipes across all available clients.
        
        Args:
            query: The search query (recipe name, ingredients, etc.)
            filters: Optional filters like cuisine, diet, etc.
            limit: Maximum number of results to return (per provider)
            
        Returns:
            Combined list of standardized Recipe objects from all providers.
        """
        all_results = []
        
        for client in self.clients:
            try:
                client_name = client.__class__.__name__
                logger.info(f"Searching for recipes with {client_name}: '{query}'")
                results = client.search_recipes(query, filters)
                logger.info(f"Found {len(results)} results from {client_name}")
                all_results.extend(results)
            except Exception as e:
                logger.error(f"Error searching with {client.__class__.__name__}: {e}")
        
        # Sort by name (could add other sorting options)
        all_results.sort(key=lambda r: r.name)
        
        # Limit results if needed
        return all_results[:limit]
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        """
        Get recipe details by ID from the appropriate client.
        Recipe IDs should be prefixed with the provider name (e.g., 'spoonacular_123').
        
        Args:
            recipe_id: The recipe ID with provider prefix.
            
        Returns:
            Standardized Recipe object if found, None otherwise.
        """
        # Determine which client to use based on ID prefix
        if recipe_id.startswith("spoonacular_"):
            for client in self.clients:
                if isinstance(client, SpoonacularAdapter):
                    return client.get_recipe_by_id(recipe_id)
        elif recipe_id.startswith("themealdb_"):
            for client in self.clients:
                if isinstance(client, MealDBAdapter):
                    return client.get_recipe_by_id(recipe_id)
        
        # If no provider prefix or no matching client, try all clients
        logger.warning(f"No provider prefix in recipe ID '{recipe_id}' or no matching client, trying all clients")
        for client in self.clients:
            try:
                recipe = client.get_recipe_by_id(recipe_id)
                if recipe:
                    return recipe
            except Exception as e:
                logger.error(f"Error getting recipe with {client.__class__.__name__}: {e}")
        
        return None
