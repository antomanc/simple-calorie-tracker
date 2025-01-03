import { Tabs } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import * as Haptics from "expo-haptics"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo } from "react"
import { StyleSheet } from "react-native"

const handleTabPress = () => {
	// TODO add a setting to enable/disable haptics
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

export default function TabLayout() {
	const theme = useThemeColor()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				label: {
					fontSize: 12,
					fontWeight: "bold",
				},
			}),
		[theme]
	)

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.primary,
				tabBarStyle: {
					backgroundColor: theme.bottomNav,
				},
			}}
		>
			<Tabs.Screen
				name="diary"
				listeners={{
					tabPress: handleTabPress,
				}}
				options={{
					title: "Diary",
					headerShown: false,
					tabBarLabelStyle: styles.label,
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "book" : "book-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				listeners={{
					tabPress: handleTabPress,
				}}
				options={{
					title: "Settings",
					headerShown: false,
					tabBarLabelStyle: styles.label,
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "settings" : "settings-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
