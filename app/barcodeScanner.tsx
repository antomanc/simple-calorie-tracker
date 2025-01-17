import { searchByBarcode } from "@/api/OpenFoodFactsAPI"
import { CustomPressable } from "@/components/CustomPressable"
import { Header } from "@/components/Header"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { useSettings } from "@/providers/SettingsProvider"
import { Ionicons } from "@expo/vector-icons"
import {
	BarcodeScanningResult,
	CameraView,
	useCameraPermissions,
} from "expo-camera"
import { router, useLocalSearchParams } from "expo-router"
import { useContext, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

export default function BarcodeScanner() {
	const theme = useThemeColor()
	const { setFood } = useContext(SelectionContext)
	const [permission, requestPermissions] = useCameraPermissions()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const styles = useMemo(
		() =>
			StyleSheet.create({
				container: {
					flex: 1,
					justifyContent: "center",
					backgroundColor: theme.background,
				},
				cameraContainer: {
					flex: 1,
					marginHorizontal: 16,
					marginTop: 32,
					marginBottom: 16,
					borderRadius: 16,
				},
				camera: {
					flex: 1,
					borderRadius: 16,
				},
				buttonContainer: {
					flexDirection: "row",
					justifyContent: "flex-end",
					padding: 24,
				},
				loading: {
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				},
			}),
		[theme]
	)

	const { goBack } = useLocalSearchParams()

	useEffect(() => {
		if (goBack === "true") {
			router.back()
		}
	}, [goBack])

	const [torch, setFlash] = useState(false)

	const handleFlash = () => {
		setFlash(!torch)
	}

	const { userUuid } = useSettings()

	const handleBarcodeScanned = (barcode: BarcodeScanningResult) => {
		if (isLoading) return
		if (!userUuid) return
		setIsLoading(true)
		searchByBarcode(barcode.data, userUuid)
			.then((response) => {
				setIsLoading(false)
				if (!response) {
					setError("No food found")
					return
				}
				setFood(response)
				router.push({
					pathname: "/foodInfo",
				})
			})
			.catch((e) => {
				setIsLoading(false)
				setError("An error occurred: " + e.message)
			})
	}

	useEffect(() => {
		if (!permission) {
			requestPermissions()
		}
	}, [permission])

	return (
		<View style={styles.container}>
			<Header
				title="Scan a barcode"
				leftComponent={
					<CustomPressable onPress={() => router.back()} hitSlop={32}>
						<Ionicons name="close" size={28} color={theme.text} />
					</CustomPressable>
				}
			/>
			<View style={styles.cameraContainer}>
				{!permission ||
					(isLoading && (
						<ActivityIndicator
							size="large"
							color={theme.text}
							style={styles.loading}
						/>
					))}
				{permission && !permission.granted && (
					<ThemedText centered type="default">
						Allow the app to use the camera to scan barcodes
					</ThemedText>
				)}
				{error && (
					<ThemedText
						centered
						type="default"
						color="red"
						style={{ marginBottom: 16, marginTop: -16 }}
					>
						{error}
					</ThemedText>
				)}
				{!isLoading && permission && permission.granted && (
					<CameraView
						style={styles.camera}
						enableTorch={torch}
						onBarcodeScanned={handleBarcodeScanned}
						autofocus="on"
						barcodeScannerSettings={{
							barcodeTypes: ["ean13", "upc_a", "upc_e", "ean8"],
						}}
					>
						<View style={styles.buttonContainer}>
							<CustomPressable onPress={handleFlash}>
								<Ionicons
									name={torch ? "flash-off" : "flash"}
									size={28}
									color={theme.text}
								/>
							</CustomPressable>
						</View>
					</CameraView>
				)}
			</View>
		</View>
	)
}
