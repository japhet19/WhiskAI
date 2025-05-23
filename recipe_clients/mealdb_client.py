# recipe_clients/mealdb_client.py
"""Client for interacting with TheMealDB API."""

import requests
import logging
from typing import List, Optional
from pydantic import ValidationError

# Use relative import within the package
from .models import MealSearchResponse, MealDetailResponse, MealSummary, MealDetail

# Configure logging
logger = logging.getLogger(__name__)
# Configure basic logging if no handlers are already configured
if not logger.hasHandlers():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class MealDBClient:
    """A client to fetch recipe data from TheMealDB API."""
    BASE_URL = "https://www.themealdb.com/api/json/v1/1/"
    API_KEY = "1" # Test API key provided by TheMealDB
    TIMEOUT = 10 # Default request timeout in seconds

    def __init__(self, api_key: str = API_KEY, timeout: int = TIMEOUT):
        """Initializes the MealDBClient."""
        # Although the test key is '1', allow overriding if needed
        self.api_key = api_key
        # Ensure the URL ends with a slash before appending endpoint
        self.base_url = self.BASE_URL.replace('/v1/1/', f'/v1/{self.api_key}/').rstrip('/') + '/'
        self.timeout = timeout
        logger.info(f"MealDBClient initialized for base URL: {self.base_url.replace(self.api_key,'{api_key}')}")

    def _make_request(self, endpoint: str, params: Optional[dict] = None) -> Optional[dict]:
        """Makes a GET request to a specified TheMealDB endpoint."""
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            return response.json()
        except requests.exceptions.Timeout:
            logger.error(f"Request timed out for {url}")
            return None
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error occurred for {url}: {e.response.status_code} - {e.response.reason}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Error during request to {url}: {e}")
            return None
        except ValueError: # Includes JSONDecodeError
            logger.error(f"Error decoding JSON response from {url}")
            return None

    def search_recipes_by_name(self, query: str) -> List[MealSummary]:
        """Searches for recipes by name/keyword.

        Args:
            query: The keyword or phrase to search for.

        Returns:
            A list of MealSummary objects, or an empty list if no results or error.
        """
        endpoint = "search.php"
        params = {'s': query}
        logger.info(f"Searching TheMealDB for recipes matching: '{query}'")
        raw_data = self._make_request(endpoint, params)

        if not raw_data:
            return []
        
        try:
            # Validate the overall structure
            response_model = MealSearchResponse.model_validate(raw_data)
            # API returns {'meals': null} if no results
            results = response_model.meals if response_model.meals else [] 
            logger.info(f"Found {len(results)} recipe summary(s) matching '{query}'.")
            return results
        except ValidationError as e:
            logger.error(f"Failed to validate search response for '{query}': {e}")
            return []

    def get_recipe_details_by_id(self, meal_id: str) -> Optional[MealDetail]:
        """Looks up the full details of a recipe by its ID.

        Args:
            meal_id: The ID of the meal (e.g., '52772').

        Returns:
            A MealDetail object if found, otherwise None.
        """
        endpoint = "lookup.php"
        params = {'i': meal_id}
        logger.info(f"Fetching TheMealDB details for meal ID: {meal_id}")
        raw_data = self._make_request(endpoint, params)

        if not raw_data:
            return None

        try:
            # The API returns {'meals': [ {meal_details_dict} ]} or {'meals': null}
            response_model = MealDetailResponse.model_validate(raw_data) 
            
            if response_model.meals and len(response_model.meals) == 1:
                # Now validate the inner meal dictionary using MealDetail model
                # Pass the raw dictionary from the list to MealDetail for validation
                # including the ingredient parsing logic
                meal_data_dict = response_model.meals[0]
                # Add the raw dict to 'raw_fields' for the validator
                meal_data_dict['raw_fields'] = meal_data_dict 
                meal_detail = MealDetail.model_validate(meal_data_dict)
                logger.info(f"Successfully fetched and validated details for meal ID: {meal_id}")
                return meal_detail
            else:
                logger.warning(f"No meal found or unexpected format returned for ID: {meal_id}. Raw response: {raw_data}")
                return None
        except ValidationError as e:
            logger.error(f"Failed to validate lookup response for meal ID '{meal_id}': {e}")
            return None

    def search_recipes_by_ingredient(self, ingredient: str) -> List[MealSummary]:
        """Searches for recipes by main ingredient.

        Args:
            ingredient: The ingredient name to filter by (e.g., 'chicken_breast').

        Returns:
            A list of MealSummary objects, or an empty list if no results or error.
            Note: Filter results only include name, thumbnail, and ID.
        """
        endpoint = "filter.php"
        params = {'i': ingredient}
        logger.info(f"Searching TheMealDB for recipes containing ingredient: '{ingredient}'")
        raw_data = self._make_request(endpoint, params)

        if not raw_data:
            return []
        
        try:
            # Validate the overall structure - uses the same MealSearchResponse model
            response_model = MealSearchResponse.model_validate(raw_data)
            # API returns {'meals': null} if no results
            results = response_model.meals if response_model.meals else [] 
            logger.info(f"Found {len(results)} recipe summary(s) for ingredient '{ingredient}'.")
            return results
        except ValidationError as e:
            logger.error(f"Failed to validate ingredient filter response for '{ingredient}': {e}")
            return []

    def search_recipes_by_category(self, category: str) -> List[MealSummary]:
        """Searches for recipes by category.

        Args:
            category: The category name to filter by (e.g., 'Seafood').

        Returns:
            A list of MealSummary objects, or an empty list if no results or error.
            Note: Filter results only include name, thumbnail, and ID.
        """
        endpoint = "filter.php"
        params = {'c': category}
        logger.info(f"Searching TheMealDB for recipes in category: '{category}'")
        raw_data = self._make_request(endpoint, params)

        if not raw_data:
            return []
        
        try:
            # Validate the overall structure - uses the same MealSearchResponse model
            response_model = MealSearchResponse.model_validate(raw_data)
            # API returns {'meals': null} if no results
            results = response_model.meals if response_model.meals else [] 
            logger.info(f"Found {len(results)} recipe summary(s) for category '{category}'.")
            return results
        except ValidationError as e:
            logger.error(f"Failed to validate category filter response for '{category}': {e}")
            return []

# Example Usage (for testing - can be run directly)
if __name__ == '__main__':
    # Simple test setup
    logging.basicConfig(level=logging.DEBUG) # Show detailed logs for testing
    logger.info("Running MealDBClient direct test...")
    client = MealDBClient()

    # Test Search
    print("\n--- Testing Search ---")
    search_term = "Arrabiata"
    search_results = client.search_recipes_by_name(search_term)
    if search_results:
        print(f"Search results for '{search_term}':")
        for meal in search_results:
            # Use .model_dump() or .dict() for Pydantic v1
            print(f"  - ID: {meal.id_meal}, Name: {meal.meal_name}, Category: {meal.category}") 
        
        # Get details for the first result
        first_id = search_results[0].id_meal
        print(f"\n--- Testing Lookup (First Search Result ID: {first_id}) ---")
        details = client.get_recipe_details_by_id(first_id)
        if details:
            print(f"Name: {details.meal_name}")
            print(f"Category: {details.category}")
            print(f"Area: {details.area}")
            print("Ingredients:")
            if details.ingredients:
                for ingredient in details.ingredients:
                    print(f"  - {ingredient.measure} {ingredient.name}")
            else:
                print("  No ingredients parsed.")
            print("Instructions (first 100 chars):")
            print(f"  {details.instructions[:100]}...") 
        else:
            print(f"Could not retrieve details for ID: {first_id}")
    else:
        print(f"No search results found for '{search_term}'.")

    # Test Lookup directly
    print("\n--- Testing Direct Lookup (ID: 52771 - Spaghetti Carbonara) ---")
    carbonara_details = client.get_recipe_details_by_id("52771")
    if carbonara_details:
         print(f"Name: {carbonara_details.meal_name}")
         print("Ingredients:")
         if carbonara_details.ingredients:
             for ingredient in carbonara_details.ingredients:
                 print(f"  - {ingredient.measure} {ingredient.name}")
         else:
            print("  No ingredients parsed.")
    else:
         print("Could not retrieve details for ID 52771.")

    # Test Non-existent ID
    print("\n--- Testing Non-existent Lookup (ID: 00000) ---")
    non_existent = client.get_recipe_details_by_id("00000")
    if not non_existent:
        print("Correctly returned None for non-existent ID.")
    else:
        print(f"Error: Should have returned details for non-existent ID: {non_existent}")

     # Test Search No Results
    print("\n--- Testing Search No Results ---")
    no_results_term = "xyzabc123nonexistentterm"
    no_results_search = client.search_recipes_by_name(no_results_term)
    if not no_results_search:
        print(f"Correctly returned empty list for search term '{no_results_term}'.")
    else:
        print(f"Error: Should have returned empty list for search term '{no_results_term}'. Got: {no_results_search}")
