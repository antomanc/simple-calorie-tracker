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
				acc.calories += entry.kcalTotal
				acc.carbs += entry.carbsTotal
				acc.protein += entry.proteinTotal
				acc.fat += entry.fatTotal
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
