// import { useDiaryContext } from "@/providers/DiaryProvider"
// import { useCallback } from "react"
// import { Food } from "./useDiary"
// import * as Crypto from "expo-crypto"

// interface LocalDbFood {
// 	description: string
// 	readable_name: string
// 	energy_per_100g: number
// 	proteins_per_100g: number
// 	fat_per_100g: number
// 	carbohydrates_per_100g: number
// }

// export function useLocalFood() {
// 	const { localFoodDb } = useDiaryContext()

// 	const searchFoods = useCallback(
// 		async (query: string): Promise<Food[]> => {
// 			if (!query || query.length === 0 || !localFoodDb) {
// 				return []
// 			}

// 			const normalizedQuery = query.toLowerCase()
// 			const tokens = normalizedQuery.split(/\s+/).filter(Boolean)

// 			const conditions = tokens
// 				.map(() => "(readable_name LIKE ? OR description LIKE ?)")
// 				.join(" AND ")
// 			const placeholders = tokens.flatMap((token) => [
// 				`%${token}%`,
// 				`%${token}%`,
// 			])

// 			const queryResults = (await localFoodDb
// 				.getAllAsync(
// 					`SELECT * FROM usda_sr_food WHERE ${conditions}`,
// 					placeholders
// 				)
// 				.catch((error) => {
// 					console.error(
// 						"Error fetching foods from local database:",
// 						error
// 					)
// 					return []
// 				})) as LocalDbFood[]

// 			const scoredFoods = queryResults
// 				.map((food) => {
// 					const readableName = food.readable_name.toLowerCase()
// 					const description = food.description.toLowerCase()
// 					let score = 0

// 					if (tokens.every((token) => readableName.includes(token))) {
// 						score += 200
// 					}

// 					if (readableName === normalizedQuery) {
// 						score += 300
// 					} else {
// 						if (readableName.startsWith(normalizedQuery)) {
// 							score += 150
// 						}
// 						if (readableName.includes(normalizedQuery)) {
// 							score += 50
// 						}
// 					}

// 					if (description.includes(normalizedQuery)) {
// 						score += 30
// 					}

// 					const wordCountDiff = Math.abs(
// 						readableName.split(" ").length - query.split(" ").length
// 					)
// 					score -= wordCountDiff * 10

// 					const lengthDiff = Math.abs(
// 						readableName.length - normalizedQuery.length
// 					)
// 					score -= lengthDiff * 0.5

// 					return { ...food, score }
// 				})
// 				.filter((food) => food.score && food.score > 0)
// 				.sort(
// 					(a, b) =>
// 						b.score! - a.score! ||
// 						a.readable_name.localeCompare(b.readable_name)
// 				)

// 			return scoredFoods.slice(0, 10).map((food) => {
// 				return {
// 					id: Crypto.randomUUID(),
// 					product_name: food.readable_name,
// 					energy_100g: food.energy_per_100g,
// 					protein_100g: food.proteins_per_100g,
// 					fat_100g: food.fat_per_100g,
// 					carbs_100g: food.carbohydrates_per_100g,
// 					brand: "Generic",
// 					serving_quantity: 100,
// 				}
// 			})
// 		},
// 		[localFoodDb]
// 	)

// 	return { searchFoods }
// }
