import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	View,
	TextInput,
	Keyboard,
	FlatList,
	StyleSheet,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useThemeColor } from "@/hooks/useThemeColor"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { FoodSearchCard } from "@/components/FoodSearchCard"
import { useSearchFood } from "@/hooks/useSearchFood"
import { Food } from "@/hooks/useDatabase"
import { borderRadius } from "@/constants/Theme"
import { TabSelector } from "@/components/searchFoodPage/TabSelector"
import { SearchBar } from "@/components/searchFoodPage/SearchBar"
import { ThemedText } from "@/components/ThemedText"

const foodCategoryTabs = ["generic", "branded"] as const
type FoodCategoryTab = (typeof foodCategoryTabs)[number]

export default function SearchFood() {
	const theme = useThemeColor()
	const { brandedState, genericState, handleSearch } = useSearchFood()
	const windowWidth = useMemo(() => Dimensions.get("window").width, [])

	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainContainer: {
					flex: 1,
					backgroundColor: theme.background,
					alignItems: "center",
					justifyContent: "flex-start",
				},
				topContainer: {
					width: "100%",
					flexDirection: "column",
					backgroundColor: theme.surface,
					paddingTop: 16,
				},
				searchBox: {
					height: 56,
					borderRadius: borderRadius,
					padding: 8,
					color: theme.text,
					backgroundColor: theme.onSurface,
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 16,
					marginHorizontal: 16,
					gap: 16,
					justifyContent: "flex-start",
				},
				textInput: {
					flex: 1,
					fontSize: 16,
					fontWeight: "600",
					backgroundColor: theme.onSurface,
					color: theme.text,
					paddingVertical: 0,
				},
				foodListContainer: {
					width: windowWidth + 1,
					marginTop: 16,
					paddingHorizontal: 16,
					paddingBottom: 32,
				},
				loading: {
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				},
			}),
		[theme, brandedState, genericState, windowWidth]
	)

	const textInputRef = useRef<TextInput>(null)
	const { goBack } = useLocalSearchParams()
	const { setFood } = useContext(SelectionContext)
	const [selectedTab, setSelectedTab] = useState<FoodCategoryTab>("generic")
	const [searchQuery, setSearchQuery] = useState("")

	useNavigationBarColor(theme.background)

	useEffect(() => {
		const subscription = Keyboard.addListener("keyboardDidHide", () => {
			textInputRef.current?.blur()
		})
		return () => subscription.remove()
	}, [])

	useEffect(() => {
		if (goBack === "true") {
			router.back()
		}
	}, [goBack])

	const handleSearchType = useCallback(() => {
		const trimmedQuery = searchQuery.trim()
		if (
			selectedTab === "generic" &&
			genericState.lastQuery === trimmedQuery
		) {
			return
		}
		if (
			selectedTab === "branded" &&
			brandedState.lastQuery === trimmedQuery
		) {
			return
		}
		handleSearch(selectedTab, trimmedQuery)
	}, [handleSearch, selectedTab, searchQuery, genericState, brandedState])

	useEffect(() => {
		handleSearchType()
	}, [selectedTab])

	const handleTapFood = useCallback(
		(food: Food) => {
			setFood(food)
			router.push({ pathname: "/foodInfo" })
		},
		[setFood]
	)

	const scrollViewRef = useRef<ScrollView>(null)

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollTo({
				x: selectedTab === "generic" ? 0 : windowWidth,
				animated: true,
			})
		}
	}, [selectedTab, windowWidth, scrollViewRef])

	const handleRequestFocus = useCallback(() => {
		textInputRef.current?.focus()
	}, [textInputRef])

	return (
		<View style={styles.mainContainer}>
			<View style={styles.topContainer}>
				<SearchBar
					ref={textInputRef}
					value={searchQuery}
					onRequestFocus={handleRequestFocus}
					onChangeText={setSearchQuery}
					onSubmit={handleSearchType}
					onClear={() => {
						textInputRef.current?.clear()
						setSearchQuery("")
					}}
				/>
				<TabSelector
					tabs={foodCategoryTabs}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
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
				{foodCategoryTabs.map((tab) => (
					<View key={tab} style={styles.foodListContainer}>
						{(tab === "generic" ? genericState : brandedState)
							.loading ? (
							<View style={styles.loading}>
								<ActivityIndicator
									color={theme.primary}
									size="large"
								/>
							</View>
						) : (tab === "generic" ? genericState : brandedState)
								.error ? (
							<ThemedText>
								{
									(tab === "generic"
										? genericState
										: brandedState
									).error
								}
							</ThemedText>
						) : (tab === "generic" ? genericState : brandedState)
								.lastQuery ? (
							<FlatList
								showsVerticalScrollIndicator={false}
								data={
									(tab === "generic"
										? genericState
										: brandedState
									).searchResults
								}
								keyExtractor={(item) => item.id!.toString()}
								renderItem={({ item }) => (
									<FoodSearchCard
										food={item}
										onTap={() => handleTapFood(item)}
									/>
								)}
							/>
						) : null}
					</View>
				))}
			</ScrollView>
		</View>
	)
}
