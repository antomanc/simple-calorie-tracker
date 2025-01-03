import { DiaryEntry } from "./useDiary"
import { useCallback } from "react"

export interface Summary {
	calories: number
	carbs: number
	protein: number
	fat: number
	foodsStrings: string[]
}

export const useSummary = () => {
	const calculateTotal = useCallback((diaryEntries: DiaryEntry[]) => {
		const total = diaryEntries.reduce(
			(acc, entry) => {
				const servingAdjustedQuantity = entry.is_servings
					? entry.quantity * entry.food.serving_quantity
					: entry.quantity
				acc.calories += entry.kcal
				acc.carbs +=
					(entry.food.carbs_100g * servingAdjustedQuantity) / 100
				acc.protein +=
					(entry.food.protein_100g * servingAdjustedQuantity) / 100
				acc.fat += (entry.food.fat_100g * servingAdjustedQuantity) / 100
				acc.foodsStrings.push(entry.food.name)
				return acc
			},
			{
				calories: 0,
				carbs: 0,
				protein: 0,
				fat: 0,
				foodsStrings: [],
			} as Summary
		)
		return total
	}, [])

	return {
		calculateTotal,
	}
}
