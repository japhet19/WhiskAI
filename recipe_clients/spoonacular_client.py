# recipe_clients/spoonacular_client.py
"""Client for interacting with the Spoonacular API."""

import os
import requests
import logging
from typing import List, Optional, Dict, Any

from .spoonacular_models import (
    SpoonacularSearchResponse,
    SpoonacularRecipe,
    SpoonacularIngredient,
    SpoonacularErrorResponse
)

# Configure logging
logger = logging.getLogger(__name__)
# Configure basic logging if no handlers are already configured
if not logger.hasHandlers():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class SpoonacularClient:
    """A client to fetch recipe data from the Spoonacular API."""
    BASE_URL = "https://api.spoonacular.com/"
    TIMEOUT = 15  # Default request timeout in seconds
    
    def __init__(self, api_key: Optional[str] = None, timeout: int = TIMEOUT):
        """
        Initialize the Spoonacular API client.
        
        Args:
            api_key: The Spoonacular API key. If not provided, will look for 
                    SPOONTACULAR_API_KEY in environment variables.
            timeout: Request timeout in seconds.
        
        Raises:
            ValueError: If API key is not provided or found in environment variables.
        """
        # Try to get API key from params, then environment variables
        self.api_key = api_key or os.environ.get("SPOONACULAR_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Spoonacular API key not provided or found in environment variables (SPOONACULAR_API_KEY)."
            )
        self.timeout = timeout
        logger.info(f"SpoonacularClient initialized with base URL: {self.BASE_URL}")
    
    def _make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Make a GET request to the Spoonacular API.
        
        Args:
            endpoint: The API endpoint to call (without the base URL).
            params: Optional query parameters.
            
        Returns:
            The JSON response as a dictionary.
            
        Raises:
            requests.exceptions.RequestException: For network-related errors.
            ValueError: For JSON decoding errors.
        """
        if params is None:
            params = {}
        
        # Include API key in all requests
        params['apiKey'] = self.api_key
        
        url = f"{self.BASE_URL}{endpoint}"
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            
            # Handle Spoonacular-specific error codes
            if response.status_code == 401:
                logger.error("Error: Invalid Spoonacular API Key.")
                raise ValueError("Invalid Spoonacular API Key")
            elif response.status_code == 402:
                logger.error("Error: Spoonacular API quota exceeded (Payment Required).")
                raise ValueError("API quota exceeded - requires payment")
            elif response.status_code == 429:
                logger.error("Warning: Spoonacular rate limit hit.")
                raise ValueError("Rate limit exceeded - consider implementing rate limiting or caching")
                
            response.raise_for_status()  # Raise exceptions for other bad status codes
            
            return response.json()
            
        except requests.exceptions.Timeout:
            logger.error(f"Request timed out for {url}")
            raise
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.reason}")
            try:
                # Try to parse the error response
                error_data = e.response.json()
                error = SpoonacularErrorResponse(**error_data)
                logger.error(f"Spoonacular API error: {error.message}")
            except (ValueError, TypeError):
                pass  # Can't parse error response
            raise
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {e}")
            raise
        except ValueError as e:  # Includes JSONDecodeError
            logger.error(f"Error decoding JSON response from {url}")
            raise
    
    def search_recipes(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[SpoonacularRecipe]:
        """
        Search for recipes by name/ingredients.
        
        Args:
            query: The search query (can be recipe name, ingredients, etc.)
            filters: Optional filters like cuisine, diet, etc.
            
        Returns:
            List of SpoonacularRecipe objects matching the query.
        """
        endpoint = "recipes/complexSearch"
        params = {
            'query': query,
            'addRecipeInformation': True,  # Get detailed recipe info in one call
            'fillIngredients': True,       # Include ingredient information
            'instructionsRequired': True,  # Only return recipes with instructions
            'number': 20                   # Number of results to return
        }
        
        # Add any additional filters
        if filters:
            params.update(filters)
            
        logger.info(f"Searching Spoonacular for recipes matching: '{query}'")
        
        try:
            raw_data = self._make_request(endpoint, params)
            response = SpoonacularSearchResponse(**raw_data)
            
            # Process ingredients for each recipe
            for recipe in response.results:
                # Parse extended ingredients if available
                if raw_data.get('results'):
                    for result_data in raw_data['results']:
                        if result_data.get('id') == recipe.id and result_data.get('extendedIngredients'):
                            recipe.ingredients = [
                                SpoonacularIngredient.from_spoonacular(ing) 
                                for ing in result_data['extendedIngredients']
                            ]
            
            logger.info(f"Found {len(response.results)} recipe(s) matching '{query}'")
            return response.results
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error during search: {e}")
            return []
        except ValueError as e:
            logger.error(f"Error processing search results: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error during recipe search: {e}")
            return []
    
    def get_recipe_details_by_id(self, recipe_id: str) -> Optional[SpoonacularRecipe]:
        """
        Get detailed information for a specific recipe by ID.
        
        Args:
            recipe_id: The Spoonacular recipe ID.
            
        Returns:
            SpoonacularRecipe object if found, None otherwise.
        """
        endpoint = f"recipes/{recipe_id}/information"
        params = {
            'includeNutrition': False  # Set to True if nutrition info is needed
        }
        
        logger.info(f"Fetching Spoonacular details for recipe ID: {recipe_id}")
        
        try:
            recipe_data = self._make_request(endpoint, params)
            
            # Preprocess instructions if it's a string
            if 'instructions' in recipe_data and isinstance(recipe_data['instructions'], str):
                import re
                instructions_text = recipe_data['instructions']
                steps = re.split(r'\.(?:\s+|\n+)', instructions_text)
                recipe_data['instructions'] = [step.strip() + "." for step in steps if step.strip()]
            
            # Create the recipe object
            recipe = SpoonacularRecipe(**recipe_data)
            
            # Extract ingredients
            if recipe_data.get('extendedIngredients'):
                recipe.ingredients = [
                    SpoonacularIngredient.from_spoonacular(ing) 
                    for ing in recipe_data['extendedIngredients']
                ]
                
            # Handle instructions parsing
            if isinstance(recipe.instructions, str):
                # Split into steps if it's a string
                import re
                steps = re.split(r'\.(?:\s+|\n+)', recipe.instructions)
                recipe.instructions = [
                    step.strip() + "." for step in steps if step.strip()
                ]
                
            logger.info(f"Successfully retrieved details for recipe: {recipe.title}")
            return recipe
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error fetching recipe {recipe_id}: {e}")
            return None
        except ValueError as e:
            logger.error(f"Error processing recipe {recipe_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error retrieving recipe {recipe_id}: {e}")
            return None
