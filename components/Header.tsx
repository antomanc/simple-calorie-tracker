import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo } from "react"

interface HeaderProps {
	title: string
	sticky?: boolean
	backgroundColor?: string
	leftComponent?: React.ReactNode
	rightComponent?: React.ReactNode
}

export const Header = ({
	title,
	sticky = false,
	backgroundColor,
	leftComponent,
	rightComponent,
}: HeaderProps) => {
	const theme = useThemeColor()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				headerRow: {
					flexDirection: "row",
					alignItems: "center",
					width: "100%",
				},
				titleContainer: {
					flexDirection: "row",
					alignItems: "center",
				},
				title: {
					marginLeft: leftComponent ? 16 : 0,
				},
				leftAccessory: {
					marginRight: 8,
				},
				rightAccessory: {
					position: "absolute",
					right: 20,
				},
			}),
		[leftComponent]
	)

	return (
		<View
			style={{
				...styles.headerRow,
				position: sticky ? "absolute" : "relative",
				top: 0,
				paddingHorizontal: 20,
				paddingBottom: 18,
				paddingTop: 18,
				backgroundColor: backgroundColor || theme.background,
				zIndex: 1,
			}}
		>
			<View style={styles.titleContainer}>
				{leftComponent && (
					<View style={styles.leftAccessory}>{leftComponent}</View>
				)}
				<ThemedText type="title" style={styles.title}>
					{title}
				</ThemedText>
			</View>
			{rightComponent && (
				<View style={styles.rightAccessory}>{rightComponent}</View>
			)}
		</View>
	)
}
