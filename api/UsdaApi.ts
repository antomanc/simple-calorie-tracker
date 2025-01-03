import { Food } from "@/hooks/useDiary"
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
		id: item.fdcId.toString(),
		name: capitalizeFirstLetter(item.description),
		brand,
		energy_100g: Math.round(energy || 0),
		protein_100g: nutrients["protein"] || 0,
		fat_100g: nutrients["total lipid (fat)"] || 0,
		carbs_100g: nutrients["carbohydrate, by difference"] || 0,
		serving_quantity: 100,
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
	url.searchParams.append("api_key", apiKey)
	url.searchParams.append("query", query.trim())
	url.searchParams.append("dataType", dataType.join(","))
	const response = await axios.get(url.href)
	const items = response.data.foods as UsdaFoodItem[]
	return items.map(usdaFoodToFood)
}
