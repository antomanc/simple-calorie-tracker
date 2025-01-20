import { BottomButton } from "@/components/BottomButton"
import { CustomTextInput } from "@/components/CustomTextInput"
import { Header } from "@/components/Header"
import { InfoSummaryRow } from "@/components/InfoSummaryRow"
import { ThemedText } from "@/components/ThemedText"
import { TitleContainer } from "@/components/TitleContainer"
import { borderRadius } from "@/constants/Theme"
import { useDiary } from "@/hooks/useDiary"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { useThemeColor } from "@/hooks/useThemeColor"
import useTruncate from "@/hooks/useTruncate"
import { SelectionContext } from "@/providers/SelectionProvider"
import { getMealTypeLabel } from "@/utils/Meals"
import { capitalizeFirstLetter } from "@/utils/Strings"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"

export default function FoodInfo() {
	const theme = useThemeColor()
	const { meal, food, setFood, diaryEntry, setDiaryEntry } =
		useContext(SelectionContext)
	const {
		addDiaryEntry,
		updateDiaryEntry,
		addFavoriteFood,
		deleteFavoriteFood,
		isFoodFavorite,
	} = useDiary()

	useNavigationBarColor(theme.surface)

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
					paddingHorizontal: 16,
					flex: 1,
					justifyContent: "flex-start",
					alignItems: "center",
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
				quantityInputText: {
					height: 45,
					width: 65,

					color: theme.text,
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
					minHeight: 45,
					paddingVertical: 8,
					backgroundColor: theme.surface,
					alignItems: "center",
					justifyContent: "center",
				},
				switchButtonActive: {
					backgroundColor: theme.secondary,
				},
			}),
		[theme.background, theme.text, theme.secondary, theme.surface]
	)

	useEffect(() => {
		if (!food || !meal) {
			router.replace({ pathname: "/diary" })
		}
	}, [food, meal])

	const truncatedTitle = useTruncate(food?.name ?? "", 60)

	const truncatedBrand = useTruncate(food?.brand ?? "", 40)

	const [isServings, setIsServings] = useState(false)
	const [grams, setGrams] = useState<string>("100")
	const [servings, setServings] = useState<string>("1")

	const inputDisplayValue = useMemo(
		() => (isServings ? servings : grams),
		[isServings, grams, servings]
	)

	const quantityInGrams = useMemo(() => {
		return isServings
			? Number(servings) * Number(food?.servingQuantity)
			: Number(grams)
	}, [isServings, grams, servings, food])

	const caloriesCalculated = useMemo(() => {
		return (Number(food?.caloriesPer100g) * quantityInGrams) / 100
	}, [quantityInGrams, food])

	const carbohydratesCalculated = useMemo(() => {
		return (Number(food?.carbsPer100g) * quantityInGrams) / 100
	}, [quantityInGrams, food])

	const proteinsCalculated = useMemo(() => {
		return (Number(food?.proteinPer100g) * quantityInGrams) / 100
	}, [quantityInGrams, food])

	const fatCalculated = useMemo(() => {
		return (Number(food?.fatPer100g) * quantityInGrams) / 100
	}, [quantityInGrams, food])

	const handleChangeText = useCallback(
		(text: string) => {
			if (!text.match(/^[0-9]*$/)) return
			if (isServings) {
				setServings(text)
				return
			}
			setGrams(text)
		},
		[isServings]
	)

	const handleAddPress = useCallback(async (): Promise<boolean> => {
		if (!food || !meal) return false
		if (diaryEntry) {
			await updateDiaryEntry({
				id: diaryEntry.id,
				quantity: Number(inputDisplayValue),
				isServings: isServings,
				mealType: meal,
				food: diaryEntry.food,
			})
		} else {
			const today = new Date()
			await addDiaryEntry({
				date: today,
				isServings: isServings,
				quantity: Number(inputDisplayValue),
				mealType: meal,
				food: food,
			}).catch((error) => {
				console.error("Error adding diary entry:", error)
				return false
			})
		}
		// little animation :)
		await new Promise<void>((resolve) => setTimeout(resolve, 375))
		return true
	}, [food, meal, isServings, inputDisplayValue])

	const onAddAnimationEnd = useCallback(() => {
		setFood(null)
		setDiaryEntry(null)
		router.back()
		router.setParams({ goBack: "true" })
	}, [setFood])

	useEffect(() => {
		if (!diaryEntry) return
		setIsServings(diaryEntry.isServings)
		setServings(diaryEntry.quantity.toString())
		setGrams(diaryEntry.quantity.toString())
	}, [diaryEntry])

	const [optimisticIsFavorite, setOptimisticIsFavorite] = useState(
		food?.isFavorite ?? false
	)

	const toggleFavorite = useCallback(() => {
		if (!food) return
		if (optimisticIsFavorite) {
			deleteFavoriteFood(food.id)
			setOptimisticIsFavorite(false)
		} else {
			addFavoriteFood(food)
			setOptimisticIsFavorite(true)
		}
	}, [food, deleteFavoriteFood, addFavoriteFood, optimisticIsFavorite])

	useEffect(() => {
		if (!food) return
		if (food.isFavorite === null) {
			isFoodFavorite(food.id).then((isFavorite) => {
				setOptimisticIsFavorite(isFavorite)
			})
		}
	}, [food])

	// TODO add a nice animation for the values changing
	return (
		<View style={styles.mainContainer}>
			{meal && (
				<Header
					title={capitalizeFirstLetter(getMealTypeLabel(meal) ?? "")}
					leftComponent={
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons
								name="close"
								size={26}
								color={theme.text}
							/>
						</TouchableOpacity>
					}
					rightComponent={
						<TouchableOpacity
							onPress={toggleFavorite}
							style={{
								padding: 8,
								borderRadius: 100,
							}}
						>
							<Ionicons
								name={
									optimisticIsFavorite
										? "heart"
										: "heart-outline"
								}
								size={26}
								color={
									optimisticIsFavorite
										? theme.secondary
										: theme.text
								}
							/>
						</TouchableOpacity>
					}
				/>
			)}
			<TitleContainer>
				<ThemedText centered type="title" numberOfLines={2}>
					{truncatedTitle}
				</ThemedText>
				<ThemedText
					numberOfLines={1}
					centered
					type="default"
					style={{
						marginTop: 10,
					}}
				>
					{truncatedBrand}
				</ThemedText>
			</TitleContainer>
			<ScrollView
				contentContainerStyle={styles.contentContainer}
				automaticallyAdjustKeyboardInsets={true}
				keyboardShouldPersistTaps="handled"
			>
				<InfoSummaryRow
					style={styles.infoSummaryRow}
					calories={caloriesCalculated}
					carbs={carbohydratesCalculated}
					fats={fatCalculated}
					proteins={proteinsCalculated}
				/>
				<BottomButton
					text={diaryEntry ? "Save" : "Add"}
					icon={"add-circle-outline"}
					onPressWithAnimation={handleAddPress}
					onAnimationEnd={onAddAnimationEnd}
				/>
			</ScrollView>
			<View style={styles.bottomInput}>
				<CustomTextInput
					keyboardType="number-pad"
					selectTextOnFocus
					maxLength={4}
					style={styles.quantityInputText}
					value={inputDisplayValue}
					onChangeText={handleChangeText}
				/>
				<View style={styles.servingInput}>
					<TouchableOpacity
						onPress={() => setIsServings(false)}
						style={{
							...styles.switchButton,
							...(!isServings && styles.switchButtonActive),
						}}
					>
						<ThemedText
							style={{
								fontSize: 16,
							}}
						>
							Grams
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							...styles.switchButton,
							...(isServings && styles.switchButtonActive),
						}}
						onPress={() => setIsServings(true)}
					>
						<ThemedText
							style={{
								fontSize: 16,
							}}
						>
							Servings
						</ThemedText>
						<ThemedText centered type="subtitleBold">
							({food?.servingQuantity}g)
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}
