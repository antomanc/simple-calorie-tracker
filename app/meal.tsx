import { BottomButton } from "@/components/BottomButton"
import { CompactFoodList } from "@/components/CompactFoodList"
import { Header } from "@/components/Header"
import { InfoSummaryRow } from "@/components/InfoSummaryRow"
import { TitleContainer } from "@/components/TitleContainer"
import { mealsToIcons } from "@/constants/Meals"
import { borderRadius } from "@/constants/Theme"
import { DiaryEntry, useDatabase } from "@/hooks/useDatabase"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { useNutritionData } from "@/hooks/useNutritionData"
import { useSummary } from "@/hooks/useSummary"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { getMealTypeLabel } from "@/utils/Meals"
import { capitalizeFirstLetter } from "@/utils/Strings"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useCallback, useContext, useEffect, useMemo } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"

export default function FoodInfo() {
	const theme = useThemeColor()
	const { meal, setDiaryEntry, setFood } = useContext(SelectionContext)

	useNavigationBarColor(theme.background)

	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainContainer: {
					backgroundColor: theme.background,
					alignItems: "center",
					justifyContent: "flex-start",
					flex: 1,
				},
				contentContainer: {
					width: "100%",
					flex: 1,
					justifyContent: "flex-start",
					alignItems: "center",
				},
				paddingContainer: {
					width: "100%",
					paddingHorizontal: 16,
				},
				titleContainer: {
					width: "100%",
					height: 140,
					backgroundColor: theme.surface,
					padding: 32,
					justifyContent: "center",
				},
				infoSummaryRow: {
					marginTop: 32,
				},
				bottomInput: {
					width: "100%",
					height: 80,
					paddingHorizontal: 24,
					backgroundColor: theme.surface,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				},
				quantityInput: {
					width: 65,
					borderRadius: borderRadius,
					borderColor: `${theme.text}80`,
					borderWidth: 1.5,
				},
				quantityInputText: {
					height: 50,
					color: theme.text,
					width: "100%",
					fontWeight: "bold",
					textAlign: "center",
				},
				servingInput: {
					flexDirection: "row",
					flex: 1,
					marginLeft: 16,
					borderRadius: borderRadius,
					borderColor: `${theme.text}80`,
					borderWidth: 1.5,
					overflow: "hidden",
				},
				switchButton: {
					flex: 1,
					height: 50,
					backgroundColor: theme.surface,
					alignItems: "center",
					justifyContent: "center",
				},
				switchButtonActive: {
					backgroundColor: theme.secondary,
				},
				icon: {
					fontSize: 64,
					textAlign: "center",
				},
			}),
		[theme.background, theme.text, theme.secondary, theme.surface]
	)

	useEffect(() => {
		if (!meal) {
			router.replace({ pathname: "/diary" })
		}
	}, [meal])

	const today = useMemo(() => new Date(), [])
	const { mealDiaryEntries, refetchDiaryEntries } = useNutritionData({
		date: today,
	})

	const { calculateTotal } = useSummary()

	const selectedMealDiaryEntries = useMemo(() => {
		if (!meal) return []
		return mealDiaryEntries?.[meal] || []
	}, [mealDiaryEntries, meal])

	const mealSummary = useMemo(() => {
		if (!meal) return null
		return calculateTotal(selectedMealDiaryEntries)
	}, [mealDiaryEntries, calculateTotal])
	const handleAddPress = useCallback(() => {
		router.push({
			pathname: "/addFood",
		})
	}, [])

	const { deleteDiaryEntry } = useDatabase()

	const handleEntryDelete = useCallback((entry: DiaryEntry) => {
		deleteDiaryEntry(entry.id).then(() => {
			refetchDiaryEntries()
		})
	}, [])

	const handleOnEntryTap = useCallback((diaryEntry: DiaryEntry) => {
		if (diaryEntry.food.servingQuantity === 0) {
			return
		}
		setDiaryEntry(diaryEntry)
		setFood(diaryEntry.food)
		router.push({ pathname: "/foodInfo" })
	}, [])

	return (
		<View style={styles.mainContainer}>
			{meal ? (
				<>
					<Header
						title={capitalizeFirstLetter(
							getMealTypeLabel(meal) ?? ""
						)}
						leftComponent={
							<TouchableOpacity onPress={() => router.back()}>
								<Ionicons
									name="close"
									size={26}
									color={theme.text}
								/>
							</TouchableOpacity>
						}
					/>
					<TitleContainer>
						<Text style={styles.icon}>{mealsToIcons[meal]}</Text>
					</TitleContainer>
					<View style={styles.contentContainer}>
						{mealSummary && (
							<>
								<View style={styles.paddingContainer}>
									<InfoSummaryRow
										style={styles.infoSummaryRow}
										calories={mealSummary.calories}
										carbs={mealSummary.carbs}
										fats={mealSummary.fat}
										proteins={mealSummary.protein}
									/>
								</View>

								{selectedMealDiaryEntries.length > 0 && (
									<CompactFoodList
										diaryEntries={selectedMealDiaryEntries}
										onEntryTap={handleOnEntryTap}
										onEntryDelete={handleEntryDelete}
									/>
								)}
							</>
						)}
						<BottomButton
							text="Add more"
							icon="add-circle-outline"
							onPress={handleAddPress}
						/>
					</View>
				</>
			) : null}
		</View>
	)
}
