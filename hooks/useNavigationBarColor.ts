import * as NavigationBar from "expo-navigation-bar"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"

const useNavigationBarColor = (color: string) => {
	useFocusEffect(
		useCallback(() => {
			NavigationBar.setBackgroundColorAsync(color)
		}, [color])
	)
}

export default useNavigationBarColor
