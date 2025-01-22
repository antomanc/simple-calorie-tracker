import { BottomButton } from "@/components/BottomButton"
import { CustomEntry, CustomEntryModal } from "@/components/CustomEntryModal"
import { CustomPressable } from "@/components/CustomPressable"
import { DismissKeyboard } from "@/components/DismissKeyboard"
import { GenericListItem } from "@/components/GenericListItem"
import { Header } from "@/components/Header"
import { TabSelector } from "@/components/searchFoodPage/TabSelector"
import { ThemedText } from "@/components/ThemedText"
import { borderRadius } from "@/constants/Theme"
import { Food, useDatabase } from "@/hooks/useDatabase"
import { useFood } from "@/hooks/useFoods"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { useNutritionData } from "@/hooks/useNutritionData"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { generateDatabaseId } from "@/utils/Ids"
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
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	Modal,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Crypto from "expo-crypto"

export default function AddFood() {
	const theme = useThemeColor()
	const { meal, setFood } = useContext(SelectionContext)
	const { favoriteFoods, mostUsedFoods } = useFood()
	const { addDiaryEntry } = useDatabase()
	const [isMenuVisible, setMenuVisible] = useState(false)

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
				modalOverlay: {
					flex: 1,
					justifyContent: "flex-start",
					alignItems: "flex-end",
				},
				popupMenu: {
					backgroundColor: theme.surface,
					borderRadius: borderRadius,
					marginTop: 40,
					marginRight: 20,
					elevation: 5,
					overflow: "hidden",
					paddingVertical: 8,
				},
				menuItem: {
					paddingVertical: 8,
					paddingHorizontal: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
					gap: 8,
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
	const { mealDiaryEntries, refetchDiaryEntries } = useNutritionData({
		date: today,
	})

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

	const toggleMenu = useCallback(() => {
		setMenuVisible(!isMenuVisible)
	}, [isMenuVisible])

	const handleCustomEntryPress = useCallback(() => {
		setMenuVisible(false)
		setModalVisible(true)
	}, [])

	const [modalVisible, setModalVisible] = useState(false)

	const handleDismiss = useCallback(() => {
		setModalVisible(false)
	}, [])

	const handleSubmit = useCallback(async (customEntry: CustomEntry) => {
		if (!meal) return
		await addDiaryEntry({
			food: {
				id: generateDatabaseId({
					source: "CUSTOM",
					id: Crypto.randomUUID(),
				}),
				name: customEntry.name,
				brand: "Custom entry",
				isCustomEntry: true,
				servingQuantity: 0,
				caloriesPer100g: 0,
				fatPer100g: 0,
				carbsPer100g: 0,
				proteinPer100g: 0,
				isFavorite: false,
			},
			quantity: 0,
			date: today,
			isServings: false,
			mealType: meal,
			overrideCalories: customEntry.calories,
			overrideFat: customEntry.fat,
			overrideCarbs: customEntry.carbs,
			overrideProtein: customEntry.protein,
		})
		refetchDiaryEntries()
		setModalVisible(false)
	}, [])

	return (
		<DismissKeyboard>
			<>
				<CustomEntryModal
					modalVisible={modalVisible}
					handleDismiss={handleDismiss}
					handleSubmit={handleSubmit}
				/>
				<View style={styles.mainContainer}>
					{meal && (
						<Header
							title={capitalizeFirstLetter(
								getMealTypeLabel(meal) ?? ""
							)}
							rightComponent={
								<View
									style={styles.headerRightComponentContainer}
								>
									<View style={styles.foodQuantityContainer}>
										<ThemedText
											centered
											style={{
												fontSize: 15,
											}}
										>
											{mealDiaryEntries?.[meal]?.length ??
												0}
										</ThemedText>
									</View>
									<TouchableOpacity
										hitSlop={16}
										onPress={toggleMenu}
									>
										<Ionicons
											name="ellipsis-vertical"
											size={24}
											color={theme.text}
										/>
									</TouchableOpacity>
									{isMenuVisible && (
										<Modal
											transparent
											animationType="fade"
											visible={isMenuVisible}
											onRequestClose={() =>
												setMenuVisible(false)
											}
										>
											<TouchableOpacity
												style={styles.modalOverlay}
												activeOpacity={1}
												onPress={() =>
													setMenuVisible(false)
												}
											>
												<View style={styles.popupMenu}>
													<CustomPressable
														onPress={
															handleCustomEntryPress
														}
													>
														<View
															style={
																styles.menuItem
															}
														>
															<Ionicons
																name="flame-outline"
																size={24}
																color={
																	theme.text
																}
															/>
															<ThemedText
																style={{
																	fontSize: 16,
																}}
															>
																Custom entry
															</ThemedText>
														</View>
													</CustomPressable>
												</View>
											</TouchableOpacity>
										</Modal>
									)}
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
								hitSlop={16}
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
									<View
										key={type}
										style={styles.scrollViewPage}
									>
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
			</>
		</DismissKeyboard>
	)
}
