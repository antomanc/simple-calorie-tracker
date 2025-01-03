import { MealType, MealTypeLabel } from "@/interfaces/Meals"

export const getMealTypeLabel = (mealType: MealType): MealTypeLabel => {
	switch (mealType) {
		case 1:
			return "breakfast"
		case 2:
			return "lunch"
		case 3:
			return "dinner"
		default:
			return "snacks"
	}
}
