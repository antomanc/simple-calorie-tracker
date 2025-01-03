import React, { createContext, useState, ReactNode } from "react"
import { DiaryEntry, Food } from "@/hooks/useDiary"
import { MealType } from "@/interfaces/Meals"

type SelectionContext = {
	meal: MealType | null
	setMeal: (meal: MealType | null) => void
	food: Food | null
	setFood: (food: Food | null) => void
	diaryEntry: DiaryEntry | null
	setDiaryEntry: (diaryEntry: DiaryEntry | null) => void
}

export const SelectionContext = createContext<SelectionContext>(
	{} as SelectionContext
)

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
	const [meal, setMeal] = useState<MealType | null>(null)
	const [food, setFood] = useState<Food | null>(null)
	const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null)

	return (
		<SelectionContext.Provider
			value={{
				meal,
				setMeal,
				food,
				setFood,
				diaryEntry,
				setDiaryEntry,
			}}
		>
			{children}
		</SelectionContext.Provider>
	)
}
