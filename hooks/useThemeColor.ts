/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Theme"
import { useColorScheme } from "react-native"

export function useThemeColor() {
	const colorScheme = useColorScheme()
	return colorScheme === "dark" ? Colors.dark : Colors.light
}
