import { Food } from "@/hooks/useDatabase"
import { generateDatabaseId } from "@/utils/Ids"
import { capitalizeFirstLetter } from "@/utils/Strings"
import axios from "axios"

interface UsdaFoodItem {
	fdcId: number
	description: string
	brandOwner?: string
	foodNutrients: {
		nutrientId: number
		nutrientName: string
		unitName: string
		value: number
	}[]
}

const usdaFoodToFood = (item: UsdaFoodItem): Food => {
	const brand = "Generic"
	const energy = item.foodNutrients.find(
		(nutrient) =>
			(nutrient.nutrientName.toLowerCase() === "energy" ||
				nutrient.nutrientName.toLowerCase() ===
					"energy (atwater specific factors)") &&
			nutrient.unitName.toLowerCase() === "kcal"
	)?.value
	const nutrients = item.foodNutrients.reduce(
		(acc, nutrient) => {
			acc[nutrient.nutrientName.toLowerCase()] = nutrient.value
			return acc
		},
		{} as Record<string, number>
	)
	return {
		id: generateDatabaseId({ source: "USDA", id: item.fdcId }),
		name: capitalizeFirstLetter(item.description),
		brand,
		caloriesPer100g: Math.round(energy || 0),
		proteinPer100g: nutrients["protein"] || 0,
		fatPer100g: nutrients["total lipid (fat)"] || 0,
		carbsPer100g: nutrients["carbohydrate, by difference"] || 0,
		servingQuantity: 100,
		isFavorite: null,
	}
}

export const USDA_API_KEY_DEFAULT = "DEMO_KEY"

const dataType = ["Foundation", "SR Legacy"]

export const searchByName = async (
	query: string,
	apiKey = USDA_API_KEY_DEFAULT
): Promise<Food[]> => {
	const baseUrl = "https://api.nal.usda.gov/fdc/v1/foods/search"
	const url = new URL(baseUrl)
	// if the API key is empty, use the default one
	if (apiKey.trim() === "") {
		apiKey = USDA_API_KEY_DEFAULT
	}
	url.searchParams.append("api_key", apiKey)
	url.searchParams.append("query", query.trim())
	url.searchParams.append("dataType", dataType.join(","))
	const response = await axios.get(url.href)
	const items = response.data.foods as UsdaFoodItem[]
	return items.map(usdaFoodToFood)
}
