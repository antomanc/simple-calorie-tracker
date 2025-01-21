import React, { useMemo } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { ThemedText } from "./ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"

export interface GenericListItemProps {
	title: string
	subtitle?: string
	rightComponent?: React.ReactNode
	onPress?: () => void
}

export const GenericListItem = ({
	title,
	subtitle,
	rightComponent,
	onPress,
}: GenericListItemProps) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				itemBackground: {
					height: 60,
					width: "100%",
					backgroundColor: "red",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					overflow: "hidden",
				},
				itemContainer: {
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingHorizontal: 16,
					paddingVertical: 12,
					backgroundColor: theme.background,
				},
				leftText: {
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					flex: 1,
					marginRight: 32,
				},
				rightSide: {
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				},
			}),
		[theme]
	)

	return (
		<Pressable
			onPress={onPress}
			style={styles.itemContainer}
			android_ripple={{ color: theme.text }}
		>
			<View style={styles.leftText}>
				<ThemedText
					style={{ color: theme.text, fontSize: 16 }}
					numberOfLines={1}
				>
					{title}
				</ThemedText>
				{subtitle && (
					<ThemedText type="subtitleBold" numberOfLines={1}>
						{subtitle}
					</ThemedText>
				)}
			</View>
			<View style={styles.rightSide} pointerEvents="none">
				{rightComponent}
			</View>
		</Pressable>
	)
}
