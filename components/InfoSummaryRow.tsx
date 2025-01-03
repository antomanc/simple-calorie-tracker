import React, { ComponentProps, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"

type InfoSummaryRowProps = {
	style?: ComponentProps<typeof View>["style"]
	calories: number
	carbs: number
	proteins: number
	fats: number
}

const formatNumber = (num: number) => {
	return num % 1 === 0 ? Math.floor(num) : num.toFixed(1)
}

export function InfoSummaryRow({
	style,
	calories,
	carbs,
	fats,
	proteins,
}: InfoSummaryRowProps) {
	const styles = useMemo(
		() =>
			StyleSheet.create({
				summaryRow: {
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				},
				summaryItem: {
					width: "25%",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				},
			}),
		[]
	)

	return (
		<View style={[styles.summaryRow, style]}>
			<View style={styles.summaryItem}>
				<ThemedText centered type="default">
					{calories.toFixed(0)} Cal
				</ThemedText>
				<ThemedText type="subtitleBold">Calories</ThemedText>
			</View>
			<View style={styles.summaryItem}>
				<ThemedText centered type="default">
					{formatNumber(carbs)} g
				</ThemedText>
				<ThemedText type="subtitleBold">Carbs</ThemedText>
			</View>
			<View style={styles.summaryItem}>
				<ThemedText centered type="default">
					{formatNumber(proteins)} g
				</ThemedText>
				<ThemedText type="subtitleBold">Protein</ThemedText>
			</View>
			<View style={styles.summaryItem}>
				<ThemedText centered type="default">
					{formatNumber(fats)} g
				</ThemedText>
				<ThemedText type="subtitleBold">Fat</ThemedText>
			</View>
		</View>
	)
}
