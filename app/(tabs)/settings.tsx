import { Header } from "@/components/Header"
import { View, StyleSheet } from "react-native"
import { useSettings } from "@/providers/SettingsProvider"
import { useMemo, useCallback, useState, useEffect } from "react"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SettingItem } from "@/components/SettingItem"
import { CustomTextInput } from "@/components/CustomTextInput"
import { ThemedText } from "@/components/ThemedText"
import { USDA_API_KEY_DEFAULT } from "@/api/UsdaApi"

export default function Index() {
	const theme = useThemeColor()
	const {
		targetCalories,
		targetCarbsPercentage,
		targetFatPercentage,
		targetProteinPercentage,
		usdaApiKey,
		updateTargetCalories,
		updateTargetCarbsPercentage,
		updateTargetFatPercentage,
		updateTargetProteinPercentage,
		updateUsdaApiKey,
	} = useSettings()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainContainer: {
					flex: 1,
				},
				contentContainer: {
					flex: 1,
					paddingHorizontal: 16,
				},
			}),
		[theme]
	)

	const allSettingsLoaded = useMemo(
		() =>
			targetCalories !== undefined &&
			targetCarbsPercentage !== undefined &&
			targetProteinPercentage !== undefined &&
			targetFatPercentage !== undefined,
		[
			targetCalories,
			targetCarbsPercentage,
			targetProteinPercentage,
			targetFatPercentage,
		]
	)

	const handleNumericChange = useCallback(
		(value?: string, setter?: (value: number) => void) => {
			if (!value || !setter) {
				return
			}
			const numericValue = Number(value)
			if (numericValue) {
				setter(numericValue)
			}
		},
		[]
	)

	const handleTextChange = useCallback(
		(value?: string, setter?: (value?: string) => void) => {
			if (!setter) {
				return
			}
			setter(value)
		},
		[]
	)

	const [targetCaloriesInput, setTargetCaloriesInput] = useState<string>()
	const [targetProteinInput, setTargetProteinInput] = useState<string>()
	const [targetFatInput, setTargetFatInput] = useState<string>()
	const [targetCarbsInput, setTargetCarbsInput] = useState<string>()
	const [usdaApiKeyInput, setUsdaApiKeyInput] = useState<string>()

	useEffect(() => {
		if (targetCalories) {
			setTargetCaloriesInput(targetCalories.toString())
		}
		if (targetProteinPercentage) {
			setTargetProteinInput(targetProteinPercentage.toString())
		}
		if (targetFatPercentage) {
			setTargetFatInput(targetFatPercentage.toString())
		}
		if (targetCarbsPercentage) {
			setTargetCarbsInput(targetCarbsPercentage.toString())
		}
	}, [
		targetCalories,
		targetProteinPercentage,
		targetFatPercentage,
		targetCarbsPercentage,
	])

	const totalPercentage = useMemo(
		() =>
			(targetCarbsPercentage ?? 0) +
			(targetProteinPercentage ?? 0) +
			(targetFatPercentage ?? 0),
		[targetCarbsPercentage, targetProteinPercentage, targetFatPercentage]
	)

	return (
		<View style={styles.mainContainer}>
			<Header title="Settings" />
			<View style={styles.contentContainer}>
				{allSettingsLoaded ? (
					<>
						<SettingItem
							title="Target Calories"
							value={
								(targetCalories
									? targetCalories.toString()
									: "") + " Cal"
							}
							onSubmit={() =>
								handleNumericChange(
									targetCaloriesInput,
									updateTargetCalories
								)
							}
						>
							<CustomTextInput
								value={targetCaloriesInput}
								onChangeText={(text) =>
									setTargetCaloriesInput(text)
								}
							/>
						</SettingItem>
						<SettingItem
							title="Target Carbs"
							value={
								(targetCarbsPercentage
									? targetCarbsPercentage.toString()
									: "") + " %"
							}
							onSubmit={() =>
								handleNumericChange(
									targetCarbsInput,
									updateTargetCarbsPercentage
								)
							}
						>
							<CustomTextInput
								value={targetCarbsInput}
								onChangeText={(text) =>
									setTargetCarbsInput(text)
								}
							/>
						</SettingItem>
						<SettingItem
							title="Target Protein"
							value={
								(targetProteinPercentage
									? targetProteinPercentage.toString()
									: "") + " %"
							}
							onSubmit={() =>
								handleNumericChange(
									targetProteinInput,
									updateTargetProteinPercentage
								)
							}
						>
							<CustomTextInput
								value={targetProteinInput}
								onChangeText={(text) =>
									setTargetProteinInput(text)
								}
							/>
						</SettingItem>
						<SettingItem
							title="Target Fat"
							value={
								(targetFatPercentage
									? targetFatPercentage.toString()
									: "") + " %"
							}
							onSubmit={() =>
								handleNumericChange(
									targetFatInput,
									updateTargetFatPercentage
								)
							}
						>
							<CustomTextInput
								value={targetFatInput}
								onChangeText={(text) => setTargetFatInput(text)}
							/>
						</SettingItem>
						<ThemedText
							style={{ marginTop: 16 }}
							color={totalPercentage === 100 ? theme.text : "red"}
							type="subtitleBold"
						>
							Total percentage adds up to {totalPercentage}%
						</ThemedText>
						<SettingItem
							title="USDA api key"
							value={
								usdaApiKey?.length
									? usdaApiKey
									: USDA_API_KEY_DEFAULT
							}
							onSubmit={() =>
								handleTextChange(
									usdaApiKeyInput,
									updateUsdaApiKey
								)
							}
						>
							<CustomTextInput
								value={usdaApiKeyInput}
								onChangeText={(text) =>
									setUsdaApiKeyInput(text)
								}
							/>
						</SettingItem>
					</>
				) : null}
			</View>
		</View>
	)
}
