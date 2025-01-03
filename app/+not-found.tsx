import { router } from "expo-router"
import { useEffect } from "react"
import { View } from "react-native"

export default function NotFoundScreen() {
	// automatically navigate to the diary screen
	useEffect(() => {
		setTimeout(() => {
			router.replace("/diary")
		}, 1)
	}, [])

	return <View></View>
}
