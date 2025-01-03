import { MealType } from "@/interfaces/Meals"

export const mealsStrings = ["breakfast", "lunch", "dinner", "snacks"] as const

export const mealTypes = [1, 2, 3, 4] as const

export const mealsToIcons: Record<MealType, string> = {
	1: "☕",
	2: "🍲",
	3: "🥗",
	4: "🍎",
} as const
