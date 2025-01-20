import { useDiaryContext } from "../providers/DiaryProvider"
import { useCallback } from "react"
import { MealsDistribution } from "@/interfaces/Meals"
import { totalMacrosFromEntry } from "@/utils/Calories"

export type ISODateString = string & { __brand: "ISODateString" }

export function isISODateString(date: string): date is ISODateString {
	const regex = /^\d{4}-\d{2}-\d{2}$/
	return regex.test(date)
}

export function toISODateString(date: Date): ISODateString {
	const dateString = date.toISOString().split("T")[0]
	if (!isISODateString(dateString)) {
		throw new Error("Failed to convert Date to ISODateString")
	}
	return dateString
}

export function parseISODateString(dateString: ISODateString): Date {
	const date = new Date(dateString)
	if (isNaN(date.getTime())) {
		throw new Error("Invalid ISODateString")
	}
	return date
}

export type DiaryEntryId = number
export type FoodId = string

export type DbDiaryEntry = {
	id: DiaryEntryId
	quantity: number
	is_servings: boolean
	date: ISODateString
	meal_type: number
	kcal_total: number
	protein_total: number
	carbs_total: number
	fat_total: number
	food_id: FoodId
	food_name: string
	food_brand: string | null
	food_serving_quantity: number
	food_energy_100g: number
	food_protein_100g: number
	food_carbs_100g: number
	food_fat_100g: number
	is_favorite: number
}

export type DiaryEntry = {
	id: DiaryEntryId
	quantity: number
	isServings: boolean
	date: ISODateString
	mealType: number
	kcalTotal: number
	proteinTotal: number
	carbsTotal: number
	fatTotal: number
	food: Food
}

export type DbFood = {
	id: FoodId
	name: string
	brand: string
	serving_quantity: number
	energy_100g: number
	protein_100g: number
	carbs_100g: number
	fat_100g: number
	isFavorite: number
}

export type Food = {
	id: FoodId
	name: string
	brand: string | null
	servingQuantity: number
	caloriesPer100g: number
	proteinPer100g: number
	carbsPer100g: number
	fatPer100g: number
	isFavorite: boolean | null
}

export type NewDiaryEntry = {
	quantity: number
	isServings: boolean
	date: Date
	mealType: number
	food: Food
}

export type UpdateDiaryEntry = {
	id: DiaryEntryId
	quantity: number
	isServings: boolean
	mealType: number
	food: Food
}

const dbNotInitializedError = new Error("Diary database is not initialized")
export const useDiary = () => {
	const { db } = useDiaryContext()

	// TODO maybe split this into two hooks, one for food and one for diary entries

	const fetchFood = useCallback(
		async (id: FoodId): Promise<Food | null> => {
			if (!db) throw dbNotInitializedError
			const row = (await db.getFirstAsync(
				`SELECT f.id as id,
                    f.name as name,
                    f.brand as brand,
                    f.serving_quantity as servingQuantity,
                    f.energy_100g as caloriesPer100g,
                    f.protein_100g as proteinPer100g,
                    f.carbs_100g as carbsPer100g,
                    f.fat_100g as fatPer100g,
                    CASE WHEN ff.food_id IS NOT NULL THEN 1 ELSE 0 END AS isFavorite
             FROM food f
             LEFT JOIN favorite_food ff ON ff.food_id = f.id
             WHERE f.id = ?`,
				[id]
			)) as DbFood | null
			if (!row) return null

			return {
				id: row.id,
				name: row.name,
				brand: row.brand,
				servingQuantity: row.serving_quantity,
				caloriesPer100g: row.energy_100g,
				proteinPer100g: row.protein_100g,
				carbsPer100g: row.carbs_100g,
				fatPer100g: row.fat_100g,
				isFavorite: row.isFavorite === 1,
			}
		},
		[db]
	)

	const addFood = useCallback(
		async (food: Food): Promise<void> => {
			if (!db) throw dbNotInitializedError
			await db.runAsync(
				`INSERT INTO food (
					id,
					name,
					brand,
					serving_quantity,
					energy_100g,
					protein_100g,
					carbs_100g,
					fat_100g
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					food.id,
					food.name,
					food.brand,
					food.servingQuantity,
					food.caloriesPer100g,
					food.proteinPer100g,
					food.carbsPer100g,
					food.fatPer100g,
				]
			)
		},
		[db]
	)

	const fetchDiaryEntries = useCallback(
		async (date: Date) => {
			if (!db) throw dbNotInitializedError
			const dateString = toISODateString(date)
			const rows = ((await db.getAllAsync(
				`SELECT
                de.id,
                de.quantity,
                de.is_servings,
                de.date,
                de.meal_type,
                de.kcal_total,
                de.protein_total,
                de.carbs_total,
                de.fat_total,
                f.id as food_id,
                f.name as food_name,
                f.brand as food_brand,
                f.serving_quantity as food_serving_quantity,
                f.energy_100g as food_energy_100g,
                f.protein_100g as food_protein_100g,
                f.carbs_100g as food_carbs_100g,
                f.fat_100g as food_fat_100g,
                CASE WHEN ff.food_id IS NOT NULL THEN 1 ELSE 0 END AS isFavorite
            FROM diary_entries de
            JOIN food f ON de.food_id = f.id
            LEFT JOIN favorite_food ff ON ff.food_id = f.id
            WHERE de.date = ?`,
				[dateString]
			)) || []) as DbDiaryEntry[]
			const diaryEntries: DiaryEntry[] = rows.map((row) => ({
				id: row.id,
				quantity: row.quantity,
				isServings: row.is_servings,
				date: row.date,
				mealType: row.meal_type,
				kcalTotal: row.kcal_total,
				carbsTotal: row.carbs_total,
				proteinTotal: row.protein_total,
				fatTotal: row.fat_total,
				food: {
					id: row.food_id,
					name: row.food_name,
					brand: row.food_brand,
					servingQuantity: row.food_serving_quantity,
					caloriesPer100g: row.food_energy_100g,
					proteinPer100g: row.food_protein_100g,
					carbsPer100g: row.food_carbs_100g,
					fatPer100g: row.food_fat_100g,
					isFavorite: row.is_favorite === 1,
				},
			}))
			const meals: MealsDistribution<DiaryEntry[]> = {
				1: [],
				2: [],
				3: [],
				4: [],
				all: diaryEntries,
			}
			diaryEntries.forEach((entry) => {
				const mealType = entry.mealType as keyof MealsDistribution<
					DiaryEntry[]
				>
				meals[mealType].push(entry)
			})
			return meals
		},
		[db]
	)

	const addDiaryEntry = useCallback(
		async (entry: NewDiaryEntry): Promise<void> => {
			if (!db) throw dbNotInitializedError
			const dateStr = toISODateString(entry.date)
			const macros = totalMacrosFromEntry({
				quantity: entry.quantity,
				isServings: entry.isServings,
				food: entry.food,
			})

			const existingFood = await fetchFood(entry.food.id)

			if (!existingFood) {
				await addFood(entry.food)
			}

			await db.runAsync(
				`INSERT INTO diary_entries (
					quantity,
					is_servings,
					date,
					meal_type,
					kcal_total,
					protein_total,
					carbs_total,
					fat_total,
					food_id
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					entry.quantity,
					entry.isServings,
					dateStr,
					entry.mealType,
					macros.calories,
					macros.protein,
					macros.carbs,
					macros.fat,
					entry.food.id,
				]
			)
		},
		[db, fetchFood, addFood]
	)

	const updateDiaryEntry = useCallback(
		async (entry: UpdateDiaryEntry): Promise<void> => {
			if (!db) throw dbNotInitializedError
			const macros = totalMacrosFromEntry({
				quantity: entry.quantity,
				isServings: entry.isServings,
				food: entry.food,
			})

			const existingFood = await fetchFood(entry.food.id)

			if (!existingFood) {
				await addFood(entry.food)
			}

			await db.runAsync(
				`UPDATE diary_entries
					SET
						quantity = ?,
						is_servings = ?,
						meal_type = ?,
						kcal_total = ?,
						protein_total = ?,
						carbs_total = ?,
						fat_total = ?,
						food_id = ?
					WHERE id = ?`,
				[
					entry.quantity,
					entry.isServings,
					entry.mealType,
					macros.calories,
					macros.protein,
					macros.carbs,
					macros.fat,
					entry.food.id,
					entry.id,
				]
			)
		},
		[db, fetchFood, addFood]
	)

	const deleteDiaryEntry = useCallback(
		async (id: DiaryEntryId): Promise<void> => {
			if (!db) throw dbNotInitializedError

			await db.runAsync("DELETE FROM diary_entries WHERE id = ?", [id])
		},
		[db]
	)

	const isFoodFavorite = useCallback(
		async (foodId: FoodId): Promise<boolean> => {
			if (!db) throw dbNotInitializedError
			const row = (await db.getFirstAsync(
				`SELECT food_id FROM favorite_food WHERE food_id = ?`,
				[foodId]
			)) as { food_id: FoodId } | null
			return !!row
		},
		[db]
	)

	const addFavoriteFood = useCallback(
		async (food: Food): Promise<void> => {
			if (!db) throw dbNotInitializedError
			const existingFood = await fetchFood(food.id)
			if (!existingFood) {
				await addFood(food)
			}
			await db
				.runAsync(`INSERT INTO favorite_food (food_id) VALUES (?)`, [
					food.id,
				])
				.then(() => {
					console.log("Added favorite food with id", food.id)
				})
				.catch((error) => {
					console.error("Error adding favorite food:", error)
				})
		},
		[db, fetchFood, addFood]
	)

	const deleteFavoriteFood = useCallback(
		async (foodId: FoodId): Promise<void> => {
			if (!db) throw dbNotInitializedError
			await db
				.runAsync(`DELETE FROM favorite_food WHERE food_id = ?`, [
					foodId,
				])
				.then(() => {
					console.log("Deleted favorite food with id", foodId)
				})
				.catch((error) => {
					console.error("Error deleting favorite food:", error)
				})
		},
		[db]
	)

	return {
		fetchDiaryEntries,
		addDiaryEntry,
		updateDiaryEntry,
		deleteDiaryEntry,
		isFoodFavorite,
		addFavoriteFood,
		deleteFavoriteFood,
	}
}
