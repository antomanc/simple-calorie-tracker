import { useFocusEffect } from "expo-router"
import { Food, useDatabase } from "./useDatabase"
import { useCallback, useEffect, useState } from "react"

export const useFood = () => {
	const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([])
	const [mostUsedFoods, setMostUsedFoods] = useState<Food[]>([])

	const { fetchMostUsedFoods, fetchFavoriteFoods } = useDatabase()

	const retrieveFavoriteFoods = useCallback(async () => {
		const foods = await fetchFavoriteFoods()
		setFavoriteFoods(foods)
	}, [fetchFavoriteFoods])

	const retrieveMostUsedFoods = useCallback(async () => {
		const foods = await fetchMostUsedFoods()
		setMostUsedFoods(foods)
	}, [fetchMostUsedFoods])

	useEffect(() => {
		retrieveFavoriteFoods()
	}, [retrieveFavoriteFoods, fetchMostUsedFoods])

	useFocusEffect(
		useCallback(() => {
			retrieveFavoriteFoods()
			retrieveMostUsedFoods()
		}, [retrieveFavoriteFoods, retrieveMostUsedFoods])
	)

	return {
		favoriteFoods,
		retrieveFavoriteFoods,
		mostUsedFoods,
		retrieveMostUsedFoods,
	}
}
