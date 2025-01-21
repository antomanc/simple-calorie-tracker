import { useState, useRef, useCallback } from "react"
import { Food } from "@/hooks/useDatabase"
import {
	searchByName as searchByNameUsda,
	USDA_API_KEY_DEFAULT,
} from "@/api/UsdaApi"
import { searchByName as searchByNameOpenFoodFacts } from "@/api/OpenFoodFactsAPI"
import { useSettings } from "@/providers/SettingsProvider"

export type SearchType = "generic" | "branded"

interface SearchState {
	searchQuery: string
	data: Food[]
	isLoading: boolean
	error: string | null
	lastQuery: string | null
}

interface UseSearchResult {
	data: Food[]
	isLoading: boolean
	isError: boolean
	error: string | null
	lastQuery: string | null
	search: (query?: string) => Promise<void>
}

const useSearch = (
	searchFn: (query: string, key: string) => Promise<Food[]>,
	apiKey: string
): UseSearchResult => {
	const [state, setState] = useState<SearchState>({
		searchQuery: "",
		data: [],
		isLoading: false,
		error: null,
		lastQuery: null,
	})

	const requestIdRef = useRef(0)

	const search = useCallback(
		async (searchQuery?: string) => {
			const trimmedQuery = searchQuery?.trim() ?? state.searchQuery

			if (!trimmedQuery) {
				setState((prev) => ({ ...prev, data: [], error: null }))
				return
			}

			requestIdRef.current++
			const currentRequestId = requestIdRef.current

			setState((prev) => ({
				...prev,
				isLoading: true,
				error: null,
				lastQuery: trimmedQuery,
			}))

			try {
				const results = await searchFn(trimmedQuery, apiKey)

				if (currentRequestId === requestIdRef.current) {
					setState((prev) => ({
						...prev,
						data: results,
						isLoading: false,
					}))
				}
			} catch (err) {
				if (currentRequestId === requestIdRef.current) {
					setState((prev) => ({
						...prev,
						error:
							err instanceof Error
								? err.message
								: "Unknown error",
						isLoading: false,
					}))
				}
			}
		},
		[searchFn, apiKey, state.searchQuery]
	)

	return {
		data: state.data,
		isLoading: state.isLoading,
		isError: !!state.error,
		error: state.error,
		lastQuery: state.lastQuery,
		search,
	}
}

const useGenericSearch = () => {
	const { usdaApiKey } = useSettings()
	return useSearch(searchByNameUsda, usdaApiKey ?? USDA_API_KEY_DEFAULT)
}

const useBrandedSearch = () => {
	const { userUuid } = useSettings()
	return useSearch(searchByNameOpenFoodFacts, userUuid ?? "")
}

export const useSearchFood = () => {
	const generic = useGenericSearch()
	const branded = useBrandedSearch()

	const handleSearch = useCallback(
		async (type: SearchType, query?: string) => {
			if (type === "generic") {
				await generic.search(query)
			} else {
				await branded.search(query)
			}
		},
		[generic, branded]
	)

	return {
		generic,
		branded,
		handleSearch,
	}
}
