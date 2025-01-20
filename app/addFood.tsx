import { BottomButton } from "@/components/BottomButton"
import { DismissKeyboard } from "@/components/DismissKeyboard"
import { GenericListItem } from "@/components/GenericListItem"
import { Header } from "@/components/Header"
import { TabSelector } from "@/components/searchFoodPage/TabSelector"
import { ThemedText } from "@/components/ThemedText"
import { borderRadius } from "@/constants/Theme"
import { Food } from "@/hooks/useDatabase"
import { useFood } from "@/hooks/useFoods"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { useNutritionData } from "@/hooks/useNutritionData"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { getMealTypeLabel } from "@/utils/Meals"
import { capitalizeFirstLetter } from "@/utils/Strings"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useCallback, useContext, useEffect, useMemo } from "react"
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

export default function AddFood() {
	const theme = useThemeColor()
	const { meal, setFood } = useContext(SelectionContext)
	const { favoriteFoods } = useFood()

	useNavigationBarColor(theme.background)
	const windowWidth = useMemo(() => Dimensions.get("window").width, [])

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
				},
				searchRow: {
					width: "100%",
					padding: 16,
				},
				searchBox: {
					height: 52,
					borderRadius: borderRadius,
					padding: 8,
					color: theme.background,
					backgroundColor: theme.text,
					flexDirection: "row",
					alignItems: "center",
					paddingLeft: 16,
					gap: 16,
					justifyContent: "space-between",
				},
				qrButton: {
					height: 48,
					width: 48,
					justifyContent: "center",
					alignItems: "center",
				},
				foodTypeRow: {
					width: "100%",
					flexDirection: "row",
				},
				scrollViewPage: {
					width: windowWidth + 1,
					justifyContent: "flex-start",
					alignItems: "center",
				},
			}),
		[theme.background, theme.text, theme.secondary, windowWidth]
	)

	const handleTextInputPress = useCallback(() => {
		router.push({ pathname: "/searchFood" })
	}, [])

	const handleDonePress = useCallback(() => {
		router.back()
	}, [])

	useEffect(() => {
		if (!meal) {
			router.replace({ pathname: "/diary" })
		}
	}, [meal])

	const today = useMemo(() => new Date(), [])
	const { mealDiaryEntries } = useNutritionData({ date: today })

	const handleQrPress = useCallback(() => {
		router.push({ pathname: "/barcodeScanner" })
	}, [])

	const [selectedType, setSelectedType] = React.useState<
		"favorite" | "frequent"
	>("favorite")

	const scrollViewRef = React.useRef<ScrollView>(null)

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollTo({
				x: selectedType === "favorite" ? 0 : windowWidth,
				animated: true,
			})
		}
	}, [selectedType])

	const handleFoodPress = useCallback((food: Food) => {
		setFood(food)
		router.push({ pathname: "/foodInfo" })
	}, [])

	return (
		<DismissKeyboard>
			<View style={styles.mainContainer}>
				{meal && (
					<Header
						title={capitalizeFirstLetter(
							getMealTypeLabel(meal) ?? ""
						)}
						rightComponent={
							<View
								style={{
									width: 32,
									height: 32,
									borderRadius: "50%",
									backgroundColor: "transparent",
									alignItems: "center",
									justifyContent: "center",
									borderWidth: 1,
									borderColor: theme.text,
								}}
							>
								<ThemedText
									centered
									style={{
										fontSize: 15,
									}}
								>
									{mealDiaryEntries?.[meal]?.length ?? 0}
								</ThemedText>
							</View>
						}
					/>
				)}
				<View style={styles.contentContainer}>
					<View style={styles.searchRow}>
						<TouchableOpacity
							style={styles.searchBox}
							activeOpacity={0.6}
							onPress={handleTextInputPress}
						>
							<Ionicons
								name="search"
								size={28}
								color={theme.background}
							/>
							<ThemedText
								style={{
									fontWeight: "500",
									fontSize: 16,
								}}
								color={theme.background}
							>
								What are you looking for?
							</ThemedText>
							<TouchableOpacity
								style={styles.qrButton}
								onPress={handleQrPress}
							>
								<Ionicons
									name="qr-code"
									size={24}
									color={theme.background}
								/>
							</TouchableOpacity>
						</TouchableOpacity>
					</View>
					<View style={styles.foodTypeRow}>
						<TabSelector
							tabs={["favorite", "frequent"]}
							onTabChange={setSelectedType}
							selectedTab={selectedType}
						/>
					</View>
					<ScrollView
						ref={scrollViewRef}
						contentContainerStyle={{
							flexGrow: 1,
						}}
						horizontal
						showsHorizontalScrollIndicator={false}
						pagingEnabled
						scrollEnabled={false}
					>
						<View style={styles.scrollViewPage}>
							{favoriteFoods.map((food) => (
								<GenericListItem
									key={food.id}
									title={food.name}
									subtitle={`${food.brand}, ${food.servingQuantity} g`}
									onPress={() => handleFoodPress(food)}
									rightComponent={
										<ThemedText>
											{food.servingQuantity
												? Math.round(
														(food.servingQuantity *
															food.caloriesPer100g) /
															100
													)
												: food.caloriesPer100g}{" "}
											Cal
										</ThemedText>
									}
								/>
							))}
						</View>
						<View style={styles.scrollViewPage}>
							<ThemedText
								style={{
									marginTop: 16,
								}}
							>
								Feature coming soon
							</ThemedText>
						</View>
					</ScrollView>

					<BottomButton text="Done" onPress={handleDonePress} />
				</View>
			</View>
		</DismissKeyboard>
	)
}
