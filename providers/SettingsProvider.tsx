import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface SettingsContextProps {
	targetCalories: number | undefined
	targetCarbsPercentage: number | undefined
	targetProteinPercentage: number | undefined
	targetFatPercentage: number | undefined
	usdaApiKey: string | undefined
	updateTargetCalories: (value: number) => void
	updateTargetCarbsPercentage: (value: number) => void
	updateTargetProteinPercentage: (value: number) => void
	updateTargetFatPercentage: (value: number) => void
	updateUsdaApiKey: (value: string) => void
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
	undefined
)

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [settings, setSettings] = useState<{
		targetCalories: number | undefined
		targetCarbsPercentage: number | undefined
		targetProteinPercentage: number | undefined
		targetFatPercentage: number | undefined
		usdaApiKey: string | undefined
	}>({
		targetCalories: undefined,
		targetCarbsPercentage: undefined,
		targetProteinPercentage: undefined,
		targetFatPercentage: undefined,
		usdaApiKey: undefined,
	})

	const getStoredSetting = useCallback(
		async <T,>(key: string, defaultValue: T): Promise<T> => {
			const stored = await AsyncStorage.getItem(key)
			return stored ? (JSON.parse(stored) as T) : defaultValue
		},
		[]
	)

	const updateSetting = useCallback(
		async (
			key: string,
			value: number | string,
			field: keyof typeof settings
		) => {
			await AsyncStorage.setItem(key, value.toString())
			setSettings((prev) => ({ ...prev, [field]: value }))
		},
		[]
	)

	useEffect(() => {
		const loadSettings = async () => {
			const targetCalories = await getStoredSetting(
				"TARGET_CALORIES",
				2200
			)
			const targetCarbsPercentage = await getStoredSetting(
				"TARGET_CARBS_PERCENTAGE",
				50
			)
			const targetProteinPercentage = await getStoredSetting(
				"TARGET_PROTEIN_PERCENTAGE",
				25
			)
			const targetFatPercentage = await getStoredSetting(
				"TARGET_FAT_PERCENTAGE",
				25
			)
			const usdaApiKey = await getStoredSetting("USDA_API_KEY", "")
			setSettings({
				targetCalories,
				targetCarbsPercentage,
				targetProteinPercentage,
				targetFatPercentage,
				usdaApiKey,
			})
		}

		loadSettings()
	}, [getStoredSetting])

	const contextValue = useMemo(
		() => ({
			...settings,
			updateTargetCalories: (value: number) =>
				updateSetting("TARGET_CALORIES", value, "targetCalories"),
			updateTargetCarbsPercentage: (value: number) =>
				updateSetting(
					"TARGET_CARBS_PERCENTAGE",
					value,
					"targetCarbsPercentage"
				),
			updateTargetProteinPercentage: (value: number) =>
				updateSetting(
					"TARGET_PROTEIN_PERCENTAGE",
					value,
					"targetProteinPercentage"
				),
			updateTargetFatPercentage: (value: number) =>
				updateSetting(
					"TARGET_FAT_PERCENTAGE",
					value,
					"targetFatPercentage"
				),
			updateUsdaApiKey: (value: string) =>
				updateSetting("USDA_API_KEY", value, "usdaApiKey"),
		}),
		[settings, updateSetting]
	)

	return (
		<SettingsContext.Provider value={contextValue}>
			{children}
		</SettingsContext.Provider>
	)
}

export const useSettings = (): SettingsContextProps => {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider")
	}
	return context
}
