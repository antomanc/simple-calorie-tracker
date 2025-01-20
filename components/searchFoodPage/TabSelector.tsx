import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { CustomPressable } from "../CustomPressable"
import { ThemedText } from "../ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useCallback, useMemo } from "react"
import { capitalizeFirstLetter } from "@/utils/Strings"

interface TabSelectorProps<T extends string> {
	tabs: readonly T[] | T[]
	selectedTab?: T
	onTabChange: (tab: T) => void
	containerStyle?: StyleProp<ViewStyle>
	inactiveTabStyle?: StyleProp<ViewStyle>
	activeTabStyle?: StyleProp<ViewStyle>
}

export const TabSelector = <T extends string>({
	tabs,
	selectedTab = tabs[0],
	containerStyle,
	inactiveTabStyle,
	activeTabStyle,
	onTabChange,
}: TabSelectorProps<T>) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				tabsContainer: {
					flexDirection: "row",
					marginTop: 8,
				},
				tab: {
					width: `${100 / tabs.length}%`,
				},
				activeTab: {
					borderBottomWidth: 2,
					borderBottomColor: theme.primary,
				},
				inactiveTab: {
					borderBottomWidth: 2,
					borderBottomColor: "transparent",
				},
				tabButton: {
					padding: 16,
					width: "100%",
					alignItems: "center",
				},
			}),
		[theme.primary, theme.surface, tabs]
	)

	const handleTapTab = useCallback(
		(tab: T) => {
			onTabChange(tab)
		},
		[onTabChange]
	)

	return (
		<View style={[styles.tabsContainer, containerStyle]}>
			{tabs.map((tab) => {
				const isActive = tab === selectedTab
				return (
					<View
						key={tab}
						style={[
							styles.tab,
							isActive
								? [styles.activeTab, activeTabStyle]
								: [styles.inactiveTab, inactiveTabStyle],
						]}
					>
						<CustomPressable
							style={styles.tabButton}
							android_ripple={{ color: theme.text }}
							onPress={() => handleTapTab(tab)}
						>
							<ThemedText type="default">
								{capitalizeFirstLetter(tab)}
							</ThemedText>
						</CustomPressable>
					</View>
				)
			})}
		</View>
	)
}
