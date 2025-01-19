import { borderRadius } from "@/constants/Theme"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo } from "react"
import { View, StyleSheet } from "react-native"
import { ThemedText } from "./ThemedText"
import { Food } from "@/hooks/useDiary"
import { CustomPressable } from "./CustomPressable"
import useTruncate from "@/hooks/useTruncate"
import { capitalizeFirstLetter } from "@/utils/Strings"

interface FoodSearchCardProps {
	food: Food
	onTap: () => void
}
export const FoodSearchCard = ({ food, onTap }: FoodSearchCardProps) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				card: {
					width: "100%",
					height: 100,
					backgroundColor: theme.surface,
					borderRadius: borderRadius,
					marginVertical: 8,
					padding: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 48,
				},
				textContainer: {
					flex: 1,
					justifyContent: "center",
					alignItems: "flex-start",
					flexDirection: "column",
					gap: 6,
				},
				rightContainer: {
					justifyContent: "flex-end",
					alignItems: "flex-end",
					flexDirection: "column",
					height: "100%",
				},
				addButton: {
					height: 48,
					width: 48,
					marginRight: -12,
				},
			}),
		[theme.surface, theme.text]
	)

	const caloriesPerServing = useMemo(
		() => (food.servingQuantity * food.caloriesPer100g) / 100,
		[food.servingQuantity, food.caloriesPer100g]
	)

	const capitilizedProductName = useMemo(
		() => capitalizeFirstLetter(food.name),
		[food.name]
	)

	const capitalizedBrand = useMemo(
		() => capitalizeFirstLetter(food.brand || ""),
		[food.brand]
	)

	const truncatedProductName = useTruncate(capitilizedProductName, 40)

	const truncatedBrand = useTruncate(capitalizedBrand, 20)

	return (
		<CustomPressable
			borderRadius={borderRadius}
			style={styles.card}
			android_ripple={{
				color: theme.text,
			}}
			onPress={onTap}
		>
			<View style={styles.textContainer}>
				<ThemedText type={"default"} numberOfLines={2}>
					{truncatedProductName}
				</ThemedText>
				<ThemedText type={"subtitleBoldLight"} numberOfLines={1}>
					{truncatedBrand}
					{food.brand ? "," : null} {food.servingQuantity} g
				</ThemedText>
			</View>
			<View style={styles.rightContainer}>
				<ThemedText type={"subtitleBoldLight"}>
					{caloriesPerServing.toFixed(0)} Cal
				</ThemedText>
			</View>
		</CustomPressable>
	)
}
