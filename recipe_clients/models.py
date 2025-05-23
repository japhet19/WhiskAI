# recipe_clients/models.py
"""Pydantic models for TheMealDB API responses."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator, root_validator


class Ingredient(BaseModel):
    """Represents a single ingredient with its measure."""
    name: str
    measure: str


class MealDetail(BaseModel):
    """Represents the detailed information for a single meal from lookup.php."""
    id_meal: str = Field(..., alias='idMeal')
    meal_name: str = Field(..., alias='strMeal')
    drink_alternate: Optional[str] = Field(None, alias='strDrinkAlternate')
    category: Optional[str] = Field(None, alias='strCategory')
    area: Optional[str] = Field(None, alias='strArea')
    instructions: Optional[str] = Field(None, alias='strInstructions')
    meal_thumb: Optional[str] = Field(None, alias='strMealThumb')
    tags: Optional[str] = Field(None, alias='strTags') # Comma-separated string
    youtube_url: Optional[str] = Field(None, alias='strYoutube')
    source_url: Optional[str] = Field(None, alias='strSource')
    image_source: Optional[str] = Field(None, alias='strImageSource')
    creative_commons_confirmed: Optional[str] = Field(None, alias='strCreativeCommonsConfirmed')
    date_modified: Optional[str] = Field(None, alias='dateModified')
    
    # Store the raw ingredient/measure fields temporarily
    raw_fields: Dict[str, Any] = Field({}, exclude=True) 
    # Parsed ingredients list
    ingredients: List[Ingredient] = [] 

    # Use root_validator to access all fields after initial validation
    @root_validator(pre=False, skip_on_failure=True)
    def assemble_ingredients(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Parses strIngredientN and strMeasureN fields into a list of Ingredient objects."""
        ingredients_list = []
        raw_data = values.get('raw_fields', values) # Use raw_fields if populated, else use values directly

        # The API seems to use 1 to 20 for ingredients/measures
        for i in range(1, 21):
            ingredient_key = f'strIngredient{i}'
            measure_key = f'strMeasure{i}'
            
            ingredient_name = raw_data.get(ingredient_key)
            measure = raw_data.get(measure_key)
            
            # Add ingredient only if the name is not null or empty
            if ingredient_name and ingredient_name.strip():
                ingredients_list.append(Ingredient(name=ingredient_name.strip(), measure=measure.strip() if measure else ""))
        
        values['ingredients'] = ingredients_list
        # Optionally clean up raw fields if not needed
        # for i in range(1, 21):
        #     values.pop(f'strIngredient{i}', None)
        #     values.pop(f'strMeasure{i}', None)
        return values
    
    class Config:
        # Allow extra fields during initial parsing to catch strIngredient/strMeasure
        # Pydantic v2: extra = 'allow' might be needed if fields aren't explicitly defined
        pass


class MealDetailResponse(BaseModel):
    """Represents the top-level response from the lookup.php endpoint."""
    # API returns list under 'meals' key, which can be null if no meal found
    meals: Optional[List[Dict[str, Any]]] = None # Parse inner dict to MealDetail later


class MealSummary(BaseModel):
    """Represents a summary of a meal from search.php."""
    id_meal: str = Field(..., alias='idMeal')
    meal_name: str = Field(..., alias='strMeal')
    drink_alternate: Optional[str] = Field(None, alias='strDrinkAlternate')
    category: Optional[str] = Field(None, alias='strCategory')
    area: Optional[str] = Field(None, alias='strArea')
    instructions: Optional[str] = Field(None, alias='strInstructions')
    meal_thumb: Optional[str] = Field(None, alias='strMealThumb')
    tags: Optional[str] = Field(None, alias='strTags')
    youtube_url: Optional[str] = Field(None, alias='strYoutube')
    source_url: Optional[str] = Field(None, alias='strSource')
    image_source: Optional[str] = Field(None, alias='strImageSource')
    creative_commons_confirmed: Optional[str] = Field(None, alias='strCreativeCommonsConfirmed')
    date_modified: Optional[str] = Field(None, alias='dateModified')

    # Note: Search results also contain ingredients/measures, 
    # but we'll typically use the lookup endpoint for full details.
    # If needed, the assemble_ingredients logic could be reused here.

class MealSearchResponse(BaseModel):
    """Represents the top-level response from the search.php endpoint."""
    # API returns list under 'meals' key, which can be null if no results
    meals: Optional[List[MealSummary]] = None
