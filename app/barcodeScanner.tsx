import { searchByBarcode } from "@/api/OpenFoodFactsAPI"
import { CustomPressable } from "@/components/CustomPressable"
import { Header } from "@/components/Header"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SelectionContext } from "@/providers/SelectionProvider"
import { useSettings } from "@/providers/SettingsProvider"
import { Ionicons } from "@expo/vector-icons"
import {
	Camera,
	Code,
	useCameraDevice,
	useCameraPermission,
	useCodeScanner,
} from "react-native-vision-camera"
import { router, useLocalSearchParams, useFocusEffect } from "expo-router"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

export default function BarcodeScanner() {
	const theme = useThemeColor()
	const { setFood } = useContext(SelectionContext)
	const { hasPermission, requestPermission } = useCameraPermission()
	const device = useCameraDevice("back")
	const [cameraActive, setCameraActive] = useState(false)
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
					overflow: "hidden",
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

	const [torch, setFlash] = useState<"off" | "on">("off")

	const handleFlash = () => {
		setFlash((prev) => (prev === "off" ? "on" : "off"))
	}

	const { userUuid } = useSettings()

	useFocusEffect(
		useCallback(() => {
			setCameraActive(true)
			return () => {
				setCameraActive(false)
			}
		}, [setCameraActive])
	)

	const handleBarcodeScanned = useCallback(
		(barcode: Code) => {
			if (isLoading) return
			if (!userUuid) return
			if (!barcode.value) return
			setIsLoading(true)
			searchByBarcode(barcode.value, userUuid)
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
		},
		[isLoading, userUuid, setFood]
	)

	const codeScanner = useCodeScanner({
		codeTypes: ["upc-e", "upc-a", "ean-13", "ean-8"],
		onCodeScanned: (codes) => {
			if (codes.length > 0) {
				handleBarcodeScanned(codes[0])
			}
		},
	})

	useEffect(() => {
		if (!hasPermission) {
			requestPermission()
		}
	}, [hasPermission])

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
				{isLoading ? (
					<ActivityIndicator
						size="large"
						color={theme.text}
						style={styles.loading}
					/>
				) : !hasPermission ? (
					<ThemedText centered type="default">
						Allow the app to use the camera to scan barcodes
					</ThemedText>
				) : !device ? (
					<ThemedText centered type="default">
						No camera found
					</ThemedText>
				) : (
					<>
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
						<View style={styles.camera}>
							<Camera
								style={styles.camera}
								device={device}
								torch={torch}
								codeScanner={codeScanner}
								isActive={cameraActive}
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
							</Camera>
						</View>
					</>
				)}
			</View>
		</View>
	)
}
