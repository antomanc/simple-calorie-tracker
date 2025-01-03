import React from "react"
import { StyleSheet, View } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"

type TitleContainerProps = {
	children: React.ReactNode
}

export function TitleContainer({ children }: TitleContainerProps) {
	const theme = useThemeColor()

	const styles = StyleSheet.create({
		container: {
			width: "100%",
			height: 145,
			backgroundColor: theme.surface,
			paddingHorizontal: 32,
			justifyContent: "center",
		},
	})

	return <View style={styles.container}>{children}</View>
}
