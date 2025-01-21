import { useCallback, useEffect, useState } from "react"
import { DiaryEntry, useDatabase } from "./useDatabase"
import { MealsDistribution } from "@/interfaces/Meals"
import { useFocusEffect } from "expo-router"

interface UseNutritionDataProps {
	date: Date
}

export const useNutritionData = ({ date }: UseNutritionDataProps) => {
	const [mealDiaryEntries, setMealDiaryEntries] =
		useState<MealsDistribution<DiaryEntry[]>>()
	const { fetchDiaryEntries } = useDatabase()

	const refetchDiaryEntries = useCallback(() => {
		fetchDiaryEntries(date).then(setMealDiaryEntries)
	}, [fetchDiaryEntries, date])

	useEffect(() => {
		refetchDiaryEntries()
	}, [date, refetchDiaryEntries])

	useFocusEffect(refetchDiaryEntries)

	return {
		refetchDiaryEntries,
		mealDiaryEntries,
	}
}
