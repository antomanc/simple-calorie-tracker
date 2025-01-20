import { useFocusEffect } from "expo-router"
import { Food, useDatabase } from "./useDatabase"
import { useCallback, useEffect, useState } from "react"

export const useFood = () => {
	const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([])

	const { fetchFavoriteFoods } = useDatabase()

	const fetchFoods = useCallback(async () => {
		const foods = await fetchFavoriteFoods()
		setFavoriteFoods(foods)
	}, [fetchFavoriteFoods])

	useEffect(() => {
		fetchFoods()
	}, [fetchFoods])

	useFocusEffect(
		useCallback(() => {
			fetchFoods()
		}, [fetchFoods])
	)

	return {
		favoriteFoods,
		fetchFoods,
	}
}
