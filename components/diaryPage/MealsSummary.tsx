import { useCallback, useContext, useMemo } from "react"
import { ThemedText } from "../ThemedText"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import { borderRadius } from "@/constants/Theme"
import { mealsStrings, mealsToIcons, mealTypes } from "@/constants/Meals"
import { capitalizeFirstLetter } from "@/utils/Strings"
import { Divider } from "../Divider"
import { Ionicons } from "@expo/vector-icons"
import { CalorieMealProgress } from "./CalorieMealProgress"
import { router } from "expo-router"
import { SelectionContext } from "@/providers/SelectionProvider"
import { CustomPressable } from "../CustomPressable"
import { MealType } from "@/interfaces/Meals"
import { getMealTypeLabel } from "@/utils/Meals"

interface MealProps {
	eatenCalories: number
	totalCalories: number
	foods: string
}

interface MealsSummaryProps {
	meals: [MealProps, MealProps, MealProps, MealProps]
}

export const MealsSummary = ({ meals }: MealsSummaryProps) => {
	const theme = useThemeColor()
	const { setMeal } = useContext(SelectionContext)
	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainContainer: {
					width: "100%",
				},
				headerRow: {
					width: "100%",
					flexDirection: "row",
					justifyContent: "flex-start",
					alignItems: "flex-start",
				},
				card: {
					width: "100%",
					backgroundColor: theme.surface,
					borderRadius: borderRadius,
					marginVertical: 8,
				},
				itemsRow: {
					flexDirection: "row",
					justifyContent: "space-between",
					gap: 16,
					alignItems: "center",
					padding: 16,
				},
				itemCaption: {
					flex: 1,
					flexDirection: "column",
					alignItems: "flex-start",
				},
				icon: {
					fontSize: 22,
				},
				button: {
					backgroundColor: theme.secondary,
					borderRadius: "50%",
					width: 46,
					height: 46,
					justifyContent: "center",
					alignItems: "center",
				},
				dividerContainer: {
					alignItems: "center",
				},
			}),
		[theme, borderRadius]
	)

	const handleAddFood = useCallback(({ meal }: { meal: MealType }) => {
		setMeal(meal)
		router.push(`/addFood`)
	}, [])

	const handlePressCard = useCallback((meal: MealType) => {
		setMeal(meal)
		router.push(`/meal`)
	}, [])

	return (
		<View style={styles.mainContainer}>
			<View style={styles.headerRow}>
				<ThemedText type="default">Meals</ThemedText>
			</View>
			<View style={styles.card}>
				{mealTypes.map((meal, index) => {
					const { eatenCalories, totalCalories, foods } = meals[index]
					return (
						<View key={meal}>
							<CustomPressable
								borderRadius={borderRadius}
								android_ripple={{ color: theme.text }}
								onPress={() => handlePressCard(meal)}
								hitSlop={24}
							>
								<View style={styles.itemsRow}>
									<CalorieMealProgress
										progress={
											(eatenCalories / totalCalories) *
											100
										}
									>
										<Text style={styles.icon}>
											{mealsToIcons[meal]}
										</Text>
									</CalorieMealProgress>
									<View style={styles.itemCaption}>
										<ThemedText type="default">
											{capitalizeFirstLetter(
												getMealTypeLabel(meal)
											)}
										</ThemedText>
										<ThemedText type="subtitleLight">
											{Math.round(eatenCalories)} /{" "}
											{totalCalories} Cal
										</ThemedText>
										<ThemedText
											numberOfLines={1}
											type="subtitleLight"
										>
											{foods}
										</ThemedText>
									</View>
									<TouchableOpacity
										style={styles.button}
										onPress={() => handleAddFood({ meal })}
									>
										<Ionicons
											name="add"
											size={32}
											color={theme.text}
										/>
									</TouchableOpacity>
								</View>
							</CustomPressable>
							{index !== mealsStrings.length - 1 && (
								<View style={styles.dividerContainer}>
									<Divider
										color={theme.onSurface}
										height={2}
										width={"90%"}
									/>
								</View>
							)}
						</View>
					)
				})}
			</View>
		</View>
	)
}
