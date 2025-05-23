# recipe_clients/spoonacular_models.py
"""Pydantic models for Spoonacular API responses."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, model_validator


class SpoonacularIngredient(BaseModel):
    """Represents a single ingredient with its measure from Spoonacular API."""
    id: Optional[int] = None
    name: str = "Unknown Ingredient"
    amount: Optional[float] = None
    unit: Optional[str] = None
    original_string: str = ""
    
    class Config:
        populate_by_name = True
        
    @classmethod
    def from_spoonacular(cls, data: Dict[str, Any]) -> 'SpoonacularIngredient':
        """Factory method to create ingredient from Spoonacular API data."""
        return cls(
            id=data.get("id"),
            name=data.get("nameClean") or data.get("name", "Unknown Ingredient"),
            amount=data.get("amount"),
            unit=data.get("unit", ""),
            original_string=data.get("originalString") or data.get("original", "")
        )


class SpoonacularRecipe(BaseModel):
    """Represents a single recipe from Spoonacular API."""
    id: int
    title: str
    image: Optional[str] = None
    image_type: Optional[str] = Field(None, alias='imageType')
    servings: Optional[int] = None
    ready_in_minutes: Optional[int] = Field(None, alias='readyInMinutes')
    source_url: Optional[str] = Field(None, alias='sourceUrl')
    aggregate_likes: Optional[int] = Field(None, alias='aggregateLikes')
    health_score: Optional[float] = Field(None, alias='healthScore')
    source_name: Optional[str] = Field(None, alias='sourceName')
    price_per_serving: Optional[float] = Field(None, alias='pricePerServing')
    
    # Dietary information
    vegetarian: Optional[bool] = False
    vegan: Optional[bool] = False
    gluten_free: Optional[bool] = Field(False, alias='glutenFree')
    dairy_free: Optional[bool] = Field(False, alias='dairyFree')
    very_healthy: Optional[bool] = Field(False, alias='veryHealthy')
    cheap: Optional[bool] = False
    very_popular: Optional[bool] = Field(False, alias='veryPopular')
    sustainable: Optional[bool] = False
    
    # Timing information
    preparation_minutes: Optional[int] = Field(None, alias='preparationMinutes')
    cooking_minutes: Optional[int] = Field(None, alias='cookingMinutes')
    
    # Tags and classifications
    diets: List[str] = []
    cuisines: List[str] = []
    dish_types: List[str] = Field([], alias='dishTypes')
    occasions: List[str] = []
    
    # Extended data populated from detailed view
    ingredients: List[SpoonacularIngredient] = []
    instructions: List[str] = []
    summary: Optional[str] = None
    
    # Standardized fields for internal use
    dietary_tags: List[str] = []
    
    class Config:
        populate_by_name = True
        
    @model_validator(mode='after')
    def extract_dietary_tags(self) -> 'SpoonacularRecipe':
        """Extracts dietary information into a standardized list of tags."""
        tags = self.diets.copy() if self.diets else []
        
        # Add boolean flags as tags if True
        if self.vegetarian:
            tags.append("vegetarian")
        if self.vegan:
            tags.append("vegan")
        if self.gluten_free:
            tags.append("gluten-free")
        if self.dairy_free:
            tags.append("dairy-free")
            
        # Remove duplicates and set the dietary_tags field
        self.dietary_tags = list(set(tags))
        return self
    
    @model_validator(mode='after')
    def extract_instructions(self) -> 'SpoonacularRecipe':
        """Extracts cooking instructions into a standardized list format."""
        instructions = self.instructions
        
        # If instructions is already a list with content, use it
        if isinstance(instructions, list) and instructions:
            return self
            
        # If instructions is a string, try to split it into steps
        if isinstance(instructions, str) and instructions:
            # Split by periods followed by whitespace or newlines
            import re
            steps = re.split(r'\.(?:\s+|\n+)', instructions)
            # Remove empty steps and clean up
            steps = [step.strip() for step in steps if step.strip()]
            if steps:
                self.instructions = steps
                return self
        
        # If we get here, instructions is either empty or not processed yet
        
        # Check for analyzedInstructions structure
        analyzed = getattr(self, 'analyzedInstructions', [])
        if analyzed and isinstance(analyzed, list):
            steps = []
            for section in analyzed:
                for step in section.get("steps", []):
                    text = step.get("step", "").strip()
                    if text:
                        steps.append(text)
            if steps:
                self.instructions = steps
        
        # Ensure we always have a list, even if empty
        if not self.instructions:
            self.instructions = []
                
        return self


class SpoonacularSearchResponse(BaseModel):
    """Response model for Spoonacular's recipes/complexSearch endpoint."""
    results: List[SpoonacularRecipe] = []
    offset: int = 0
    number: int = 10
    total_results: int = Field(0, alias='totalResults')


class SpoonacularErrorResponse(BaseModel):
    """Response model for Spoonacular API errors."""
    status: str
    code: int
    message: str
