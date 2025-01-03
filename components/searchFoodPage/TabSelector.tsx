import { StyleSheet, View } from "react-native"
import { CustomPressable } from "../CustomPressable"
import { ThemedText } from "../ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useCallback, useMemo } from "react"

interface TabSelectorProps {
	tab: "generic" | "branded"
	onTabChange: (tab: "generic" | "branded") => void
}

export const TabSelector = ({ tab, onTabChange }: TabSelectorProps) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				tabsContainer: {
					flexDirection: "row",
					marginTop: 8,
				},
				tab: {
					width: "50%",
					backgroundColor: theme.surface,
				},
				activeTab: {
					borderBottomWidth: 2,
					borderBottomColor: theme.primary,
				},
				inactiveTab: {
					borderBottomWidth: 2,
					borderBottomColor: theme.surface,
				},
				tabButton: {
					padding: 16,
					width: "100%",
					alignItems: "center",
				},
			}),
		[theme.primary, theme.surface]
	)

	const handleTapTab = useCallback(
		(tab: "generic" | "branded") => {
			onTabChange(tab)
		},
		[onTabChange]
	)

	return (
		<View style={styles.tabsContainer}>
			<View
				style={[
					styles.tab,
					tab === "generic" ? styles.activeTab : styles.inactiveTab,
				]}
			>
				<CustomPressable
					style={styles.tabButton}
					android_ripple={{ color: theme.text }}
					onPress={() => handleTapTab("generic")}
				>
					<ThemedText type="default">Generic foods</ThemedText>
				</CustomPressable>
			</View>
			<View
				style={[
					styles.tab,
					tab === "branded" ? styles.activeTab : styles.inactiveTab,
				]}
			>
				<CustomPressable
					style={styles.tabButton}
					android_ripple={{ color: theme.text }}
					onPress={() => handleTapTab("branded")}
				>
					<ThemedText type="default">Branded foods</ThemedText>
				</CustomPressable>
			</View>
		</View>
	)
}
