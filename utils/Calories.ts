export const caloriesFromMacros = (
	protein: number,
	carbs: number,
	fat: number
) => {
	return protein * 4 + carbs * 4 + fat * 9
}
