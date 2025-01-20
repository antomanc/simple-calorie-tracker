import { useState, useRef, useCallback } from "react"
import { Food } from "@/hooks/useDiary"
import { searchByName as searchByNameUsda } from "@/api/UsdaApi"
import { searchByName as searchByNameOpenFoodFacts } from "@/api/OpenFoodFactsAPI"
import { useSettings } from "@/providers/SettingsProvider"

export type SearchType = "generic" | "branded"

interface SearchState {
	searchQuery: string
	searchResults: Food[]
	loading: boolean
	error: string | null
	lastQuery: string | null
}

export const useSearchFood = () => {
	const initialSearchState: SearchState = {
		searchQuery: "",
		searchResults: [],
		loading: false,
		error: null,
		lastQuery: null,
	}

	const [searchState, setSearchState] = useState<
		Record<SearchType, SearchState>
	>({
		generic: { ...initialSearchState },
		branded: { ...initialSearchState },
	})

	const requestIdRefGeneric = useRef(0)
	const requestIdRefBranded = useRef(0)

	const { usdaApiKey, userUuid } = useSettings()

	const handleSearch = useCallback(
		async (type: SearchType, searchQuery?: string) => {
			if (!userUuid) return

			const currentState = searchState[type]
			const trimmedQuery = searchQuery?.trim() ?? currentState.searchQuery

			if (!trimmedQuery) {
				setSearchState((prev) => ({
					...prev,
					[type]: { ...prev[type], searchResults: [], error: null },
				}))
				return
			}

			console.log("Searching for:", trimmedQuery, "type:", type)

			if (type === "generic") {
				requestIdRefGeneric.current++
			} else {
				requestIdRefBranded.current++
			}
			const currentRequestId =
				type === "generic"
					? requestIdRefGeneric.current
					: requestIdRefBranded.current

			setSearchState((prev) => ({
				...prev,
				[type]: {
					...prev[type],
					searchResults: [],
					loading: true,
					error: null,
					lastQuery: trimmedQuery,
				},
			}))

			try {
				const results = await (type === "generic"
					? searchByNameUsda(trimmedQuery, usdaApiKey)
					: searchByNameOpenFoodFacts(trimmedQuery, userUuid))

				if (
					(type === "generic" &&
						currentRequestId === requestIdRefGeneric.current) ||
					(type === "branded" &&
						currentRequestId === requestIdRefBranded.current)
				) {
					setSearchState((prev) => ({
						...prev,
						[type]: {
							...prev[type],
							searchResults: results,
							loading: false,
						},
					}))
				}
			} catch (err) {
				if (
					(type === "generic" &&
						currentRequestId === requestIdRefGeneric.current) ||
					(type === "branded" &&
						currentRequestId === requestIdRefBranded.current)
				) {
					setSearchState((prev) => ({
						...prev,
						[type]: {
							...prev[type],
							error:
								err instanceof Error
									? err.message
									: "Unknown error",
							loading: false,
						},
					}))
				}
			}
		},
		[searchState, usdaApiKey, userUuid]
	)

	return {
		genericState: searchState.generic,
		brandedState: searchState.branded,
		handleSearch,
	}
}
