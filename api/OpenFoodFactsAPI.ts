import { Food } from "@/hooks/useDiary"
import { capitalizeFirstLetter } from "@/utils/Strings"
import axios from "axios"

export interface OpenFoodFactsProduct {
	id?: number
	product_name?: string
	brands?: string
	energy_100g?: number
	proteins_100g?: number
	fat_100g?: number
	carbohydrates_100g?: number
	serving_quantity?: number
	serving_quantity_unit?: string
}

interface ValidOpenFoodFactsProduct extends OpenFoodFactsProduct {
	id: number
	product_name: string
	energy_100g: number
	proteins_100g: number
	fat_100g: number
	carbohydrates_100g: number
}

const filterProduct = (
	product: OpenFoodFactsProduct
): product is ValidOpenFoodFactsProduct => {
	return (
		product.id !== undefined &&
		product.id.toString().trim() !== "" &&
		product.product_name !== undefined &&
		product.product_name.trim() !== "" &&
		product.energy_100g !== undefined &&
		product.proteins_100g !== undefined &&
		product.fat_100g !== undefined &&
		product.carbohydrates_100g !== undefined
	)
}

const OpenFoodFactsProductToFood = (
	product: ValidOpenFoodFactsProduct
): Food => {
	const serving_quantity =
		product.serving_quantity_unit === "g"
			? (product.serving_quantity ?? 100)
			: 100
	const brand =
		product.brands
			?.split(",")
			.find(
				(brand) =>
					brand.toLowerCase() !== product.product_name.toLowerCase()
			) ?? "Generic"
	const energy_100g = product.energy_100g / 4.184

	return {
		id: product.id.toString(),
		name: capitalizeFirstLetter(product.product_name),
		brand: capitalizeFirstLetter(brand),
		// Convert kJ to kcal and round to nearest integer
		energy_100g: Math.round(energy_100g),
		protein_100g: Math.round(product.proteins_100g * 10) / 10,
		fat_100g: Math.round(product.fat_100g * 10) / 10,
		carbs_100g: Math.round(product.carbohydrates_100g * 10) / 10,
		serving_quantity: serving_quantity,
	}
}

const headers = {
	app_name: "simple-calorie-tracker",
	app_version: "1.0",
}

const fields = [
	"id",
	"product_name",
	"brands",
	"energy_100g",
	"proteins_100g",
	"fat_100g",
	"carbohydrates_100g",
	"serving_quantity",
	"serving_quantity_unit",
]
const params: { [key: string]: string | number } = {
	fields: fields.join(","),
	json: 1,
	page_size: 10,
}
export const searchByBarcode = async (
	barcode: string,
	uuid: string
): Promise<Food | null> => {
	const url = new URL(
		`https://world.openfoodfacts.org/api/v2/product/${barcode}`
	)
	Object.keys(params).forEach((key) =>
		url.searchParams.append(key, params[key] as string)
	)
	const requestHeaders = {
		...headers,
		app_uuid: uuid,
	}
	console.log("Searching by barcode:", barcode, "uuid:", uuid)
	const response = await axios.get(url.href, { headers: requestHeaders })
	const product = response.data.product as OpenFoodFactsProduct
	if (!filterProduct(product)) return null
	return OpenFoodFactsProductToFood(product)
}

export const searchByName = async (
	query: string,
	uuid: string
): Promise<Food[]> => {
	// TODO setting to change the domain from world to another country
	const url = new URL("https://world.openfoodfacts.org/cgi/search.pl")
	url.searchParams.append("search_terms", query.trim())
	Object.keys(params).forEach((key) =>
		url.searchParams.append(key, params[key] as string)
	)
	const requestHeaders = {
		...headers,
		app_uuid: uuid,
	}
	const response = await axios.get(url.href, { headers: requestHeaders })
	const products = response.data.products as OpenFoodFactsProduct[]
	return products.filter(filterProduct).map(OpenFoodFactsProductToFood)
}
