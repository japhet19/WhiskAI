# recipe_clients/recipe_client_abc.py
"""Abstract base class for recipe clients to ensure consistent interface."""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field


@dataclass
class RecipeIngredient:
    """Standardized ingredient representation across different recipe providers."""
    name: str
    amount: Optional[float] = None
    unit: Optional[str] = None
    original_text: str = ""


@dataclass
class Recipe:
    """Standardized recipe representation across different recipe providers."""
    id: str
    source_api: str  # e.g., 'spoonacular', 'themealdb'
    source_id: str
    name: str
    ingredients: List[RecipeIngredient] = field(default_factory=list)
    instructions: List[str] = field(default_factory=list)
    image_url: Optional[str] = None
    source_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    total_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    cuisine_tags: List[str] = field(default_factory=list)
    dietary_tags: List[str] = field(default_factory=list)


class RecipeClient(ABC):
    """Abstract base class for recipe clients to ensure consistent interface."""
    
    @abstractmethod
    def search_recipes(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Recipe]:
        """
        Search for recipes by query string.
        
        Args:
            query: The search query (recipe name, ingredients, etc.)
            filters: Optional filters like cuisine, diet, etc.
            
        Returns:
            List of standardized Recipe objects matching the query.
        """
        pass
    
    @abstractmethod
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        """
        Get detailed information for a specific recipe by ID.
        
        Args:
            recipe_id: The recipe ID in the source API format.
            
        Returns:
            Standardized Recipe object if found, None otherwise.
        """
        pass
