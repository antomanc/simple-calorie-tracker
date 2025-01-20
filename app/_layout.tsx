import { ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import * as NavigationBar from "expo-navigation-bar"
import { useColorScheme, View } from "react-native"
import { CustomDarkTheme, CustomLightTheme } from "@/constants/Theme"
import { useThemeColor } from "@/hooks/useThemeColor"
import { SafeAreaView } from "react-native-safe-area-context"
import { SelectionProvider } from "@/providers/SelectionProvider"
import * as SystemUI from "expo-system-ui"
import useNavigationBarColor from "@/hooks/useNavigationBarColor"
import { DiaryProvider } from "@/providers/DatabaseProvider"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SettingsProvider } from "@/providers/SettingsProvider"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const theme = useThemeColor()
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	})

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	useEffect(() => {
		NavigationBar.setPositionAsync("relative")
		SystemUI.setBackgroundColorAsync(theme.background)
	}, [theme])

	useNavigationBarColor(theme.background)

	if (!loaded) {
		return null
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
		>
			<SettingsProvider>
				<GestureHandlerRootView>
					<DiaryProvider>
						<SelectionProvider>
							<SafeAreaView
								style={{
									flex: 1,
									backgroundColor: theme.background,
								}}
							>
								<View
									style={{
										flex: 1,
										backgroundColor: theme.background,
									}}
								>
									<Stack
										screenOptions={{
											// TODO add a setting to change the animation
											animation: "ios_from_right",
											animationDuration: 150,
										}}
									>
										<Stack.Screen
											name="(tabs)"
											options={{ headerShown: false }}
										/>
										<Stack.Screen
											name="+not-found"
											options={{ headerShown: false }}
										/>
										<Stack.Screen
											name="addFood"
											options={{ headerShown: false }}
										/>
										<Stack.Screen
											name="foodInfo"
											options={{
												headerShown: false,
											}}
										/>
										<Stack.Screen
											name="searchFood"
											options={{
												headerShown: false,
												animation: "slide_from_bottom",
											}}
										/>
										<Stack.Screen
											name="barcodeScanner"
											options={{
												headerShown: false,
											}}
										/>
										<Stack.Screen
											name="meal"
											options={{
												headerShown: false,
											}}
										/>
									</Stack>
									<StatusBar style="auto" />
								</View>
							</SafeAreaView>
						</SelectionProvider>
					</DiaryProvider>
				</GestureHandlerRootView>
			</SettingsProvider>
		</ThemeProvider>
	)
}
