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
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function AddFood() {
	const theme = useThemeColor()
	const { meal, setFood } = useContext(SelectionContext)
	const { favoriteFoods, mostUsedFoods } = useFood()

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
				headerRightComponentContainer: {
					flexDirection: "row",
					gap: 16,
					justifyContent: "center",
					alignItems: "center",
				},
				foodQuantityContainer: {
					width: 32,
					height: 32,
					borderRadius: "50%",
					backgroundColor: "transparent",
					alignItems: "center",
					justifyContent: "center",
					borderWidth: 1,
					borderColor: theme.text,
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
					flex: 1,
					justifyContent: "flex-start",
					alignItems: "center",
				},
			}),
		[theme, windowWidth]
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
	}, [selectedType, windowWidth, scrollViewRef])

	const handleFoodPress = useCallback(
		(food: Food) => {
			setFood(food)
			router.push({ pathname: "/foodInfo" })
		},
		[setFood]
	)

	return (
		<DismissKeyboard>
			<View style={styles.mainContainer}>
				{meal && (
					<Header
						title={capitalizeFirstLetter(
							getMealTypeLabel(meal) ?? ""
						)}
						rightComponent={
							<View style={styles.headerRightComponentContainer}>
								<View style={styles.foodQuantityContainer}>
									<ThemedText
										centered
										style={{
											fontSize: 15,
										}}
									>
										{mealDiaryEntries?.[meal]?.length ?? 0}
									</ThemedText>
								</View>
								<TouchableOpacity onPress={() => {}}>
									<Ionicons
										name="ellipsis-vertical"
										size={24}
										color={theme.text}
									/>
								</TouchableOpacity>
							</View>
						}
					/>
				)}
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
				<GestureHandlerRootView>
					<ScrollView
						ref={scrollViewRef}
						horizontal
						showsHorizontalScrollIndicator={false}
						pagingEnabled
						scrollEnabled={false}
						contentContainerStyle={{
							flexGrow: 1,
						}}
					>
						{["favorite", "frequent"].map((type) => {
							const foods =
								type === "favorite"
									? favoriteFoods
									: mostUsedFoods
							const noFoodsText =
								type === "favorite"
									? "No favorite foods yet \n Time to add some!"
									: "No frequent foods yet \n Time to log some!"

							return (
								<View key={type} style={styles.scrollViewPage}>
									{foods.length === 0 ? (
										<ThemedText
											style={{
												fontSize: 16,
												marginTop: 32,
												textAlign: "center",
											}}
										>
											{noFoodsText}
										</ThemedText>
									) : (
										foods.map((food) => (
											<GenericListItem
												key={food.id}
												title={food.name}
												subtitle={`${food.brand}, ${food.servingQuantity} g`}
												onPress={() =>
													handleFoodPress(food)
												}
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
										))
									)}
								</View>
							)
						})}
					</ScrollView>
				</GestureHandlerRootView>
				<BottomButton text="Done" onPress={handleDonePress} />
			</View>
		</DismissKeyboard>
	)
}
