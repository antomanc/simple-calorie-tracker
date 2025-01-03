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
	ActivityIndicator,
	StyleSheet,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useThemeColor } from "@/hooks/useThemeColor"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { ThemedText } from "@/components/ThemedText"
import { FoodSearchCard } from "@/components/FoodSearchCard"
import { useSearchFood } from "@/hooks/useSearchFood"
import { Food } from "@/hooks/useDiary"
import { borderRadius } from "@/constants/Theme"
import { TabSelector } from "@/components/searchFoodPage/TabSelector"
import { SearchBar } from "@/components/searchFoodPage/SearchBar"

export default function SearchFood() {
	const theme = useThemeColor()
	const { brandedState, genericState, handleSearch } = useSearchFood()

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
					flex:
						brandedState.loading || genericState.loading
							? 1
							: undefined,
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
		[theme, brandedState, genericState]
	)

	const textInputRef = useRef<TextInput>(null)
	const { goBack } = useLocalSearchParams()
	const { setFood } = useContext(SelectionContext)
	const [tab, setTab] = useState<"generic" | "branded">("generic")
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
		if (tab === "generic" && genericState.lastQuery === trimmedQuery) {
			return
		}
		if (tab === "branded" && brandedState.lastQuery === trimmedQuery) {
			return
		}
		handleSearch(tab, trimmedQuery)
	}, [handleSearch, tab, searchQuery, genericState, brandedState])

	useEffect(() => {
		handleSearchType()
	}, [tab])

	const handleTapFood = useCallback(
		(food: Food) => {
			setFood(food)
			router.push({ pathname: "/foodInfo" })
		},
		[setFood]
	)

	const renderEmptyList = useCallback(
		() => (
			<View style={styles.foodListContainer}>
				{(tab === "generic" &&
					genericState.searchResults.length === 0 &&
					!genericState.loading &&
					genericState.lastQuery) ||
				(tab === "branded" &&
					brandedState.searchResults.length === 0 &&
					!brandedState.loading &&
					brandedState.lastQuery) ? (
					<ThemedText type="default">No results found</ThemedText>
				) : null}
				{(tab === "generic" && genericState.loading) ||
				(tab === "branded" && brandedState.loading) ? (
					<ActivityIndicator
						size="large"
						color={theme.text}
						style={styles.loading}
					/>
				) : null}
				{(tab === "generic" && genericState.error) ||
					(tab === "branded" && brandedState.error && (
						<ThemedText type="default" style={{ color: "red" }}>
							{brandedState.error}
						</ThemedText>
					))}
			</View>
		),
		[
			genericState.loading,
			brandedState.loading,
			brandedState.error,
			genericState.error,
			genericState.lastQuery,
			brandedState.lastQuery,
			genericState.searchResults,
			brandedState.searchResults,
			tab,
			theme.text,
		]
	)

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
				<TabSelector tab={tab} onTabChange={setTab} />
			</View>

			<FlatList
				contentContainerStyle={styles.foodListContainer}
				showsVerticalScrollIndicator={false}
				data={
					tab === "generic"
						? genericState.searchResults
						: brandedState.searchResults
				}
				keyExtractor={(item) => item.id!.toString()}
				renderItem={({ item }) => (
					<FoodSearchCard
						food={item}
						onTap={() => handleTapFood(item)}
					/>
				)}
				ListEmptyComponent={renderEmptyList}
			/>
		</View>
	)
}
