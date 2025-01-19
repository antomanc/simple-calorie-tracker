import { Food } from "@/hooks/useDiary"

export const caloriesFromMacros = (
	protein: number,
	carbs: number,
	fat: number
) => {
	return protein * 4 + carbs * 4 + fat * 9
}

interface totalMacrosFromEntrySignature {
	quantity: number
	isServings: boolean
	food: Food
}

interface Macros {
	calories: number
	protein: number
	carbs: number
	fat: number
}

export const totalMacrosFromEntry = ({
	quantity,
	isServings,
	food,
}: totalMacrosFromEntrySignature) => {
	const multiplier = isServings
		? (quantity * food.servingQuantity) / 100
		: quantity / 100
	const macros: Macros = {
		calories: food.caloriesPer100g * multiplier,
		protein: food.proteinPer100g * multiplier,
		carbs: food.carbsPer100g * multiplier,
		fat: food.fatPer100g * multiplier,
	}

	return macros
}
