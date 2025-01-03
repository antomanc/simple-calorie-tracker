import { useDiaryContext } from "../providers/DiaryProvider"
import { useCallback } from "react"
import { MealsDistribution } from "@/interfaces/Meals"

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

export type DbDiaryEntry = {
	id: DiaryEntryId
	quantity: number
	is_servings: boolean
	date: ISODateString
	meal_type: number
	kcal: number
	food_name: string
	food_brand?: string
	food_serving_quantity: number
	food_energy_100g: number
	food_protein_100g: number
	food_carbs_100g: number
	food_fat_100g: number
}

export type DiaryEntry = {
	id: DiaryEntryId
	quantity: number
	is_servings: boolean
	date: ISODateString
	meal_type: number
	kcal: number
	food: Food
}

export type Food = {
	id?: number | string
	name: string
	brand?: string
	serving_quantity: number
	energy_100g: number
	protein_100g: number
	carbs_100g: number
	fat_100g: number
}

export type NewDiaryEntry = Omit<DiaryEntry, "id" | "kcal" | "date"> & {
	date: Date
}

export type UpdateDiaryEntry = Omit<DiaryEntry, "date" | "kcal">

const dbNotInitializedError = new Error("Diary database is not initialized")
export const useDiary = () => {
	const { db } = useDiaryContext()

	const fetchDiaryEntries = useCallback(
		async (date: Date) => {
			if (!db) throw dbNotInitializedError
			const dateString = toISODateString(date)
			const rows = ((await db.getAllAsync(
				`SELECT
				id,
				quantity,
				is_servings,
				date,
				meal_type,
				kcal,
				food_name,
				food_brand,
				food_serving_quantity,
				food_energy_100g,
				food_protein_100g,
				food_carbs_100g,
				food_fat_100g
			FROM diary_entries
			WHERE date = ?`,
				[dateString]
			)) || []) as DbDiaryEntry[]
			const diaryEntries: DiaryEntry[] = rows.map((row) => ({
				id: row.id,
				quantity: row.quantity,
				is_servings: row.is_servings,
				date: row.date,
				meal_type: row.meal_type,
				kcal: row.kcal,
				food: {
					name: row.food_name,
					brand: row.food_brand,
					serving_quantity: row.food_serving_quantity,
					energy_100g: row.food_energy_100g,
					protein_100g: row.food_protein_100g,
					carbs_100g: row.food_carbs_100g,
					fat_100g: row.food_fat_100g,
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
				const mealType = entry.meal_type as keyof MealsDistribution<
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
			const kcal =
				entry.food.energy_100g *
				(entry.is_servings
					? entry.quantity * entry.food.serving_quantity
					: entry.quantity / 100)
			await db
				.runAsync(
					`INSERT INTO diary_entries (
				quantity,
				is_servings,
				date,
				meal_type,
				kcal,
				food_name,
				food_brand,
				food_serving_quantity,
				food_energy_100g,
				food_protein_100g,
				food_carbs_100g,
				food_fat_100g
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						entry.quantity,
						entry.is_servings,
						dateStr,
						entry.meal_type,
						kcal,
						entry.food.name,
						entry.food.brand ?? null,
						entry.food.serving_quantity ?? 100,
						entry.food.energy_100g,
						entry.food.protein_100g,
						entry.food.carbs_100g,
						entry.food.fat_100g,
					]
				)
				.catch((error) => {
					console.error("Error adding diary entry:", error)
				})
		},
		[db]
	)

	const updateDiaryEntry = useCallback(
		async (entry: UpdateDiaryEntry): Promise<void> => {
			if (!db) throw dbNotInitializedError
			const kcal =
				entry.food.energy_100g *
				(entry.is_servings
					? entry.quantity * entry.food.serving_quantity
					: entry.quantity / 100)
			await db.runAsync(
				`UPDATE diary_entries
			SET
				quantity = ?,
				is_servings = ?,
				meal_type = ?,
				kcal = ?
			WHERE id = ?`,
				[
					entry.quantity,
					entry.is_servings,
					entry.meal_type,
					kcal,
					entry.id,
				]
			)
		},
		[db]
	)

	const deleteDiaryEntry = useCallback(
		async (id: DiaryEntryId): Promise<void> => {
			if (!db) throw dbNotInitializedError

			await db.runAsync("DELETE FROM diary_entries WHERE id = ?", [id])
		},
		[db]
	)

	return {
		fetchDiaryEntries,
		addDiaryEntry,
		updateDiaryEntry,
		deleteDiaryEntry,
	}
}
