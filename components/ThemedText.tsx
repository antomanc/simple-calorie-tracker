import { Text, type TextProps, StyleSheet } from "react-native"

import { useThemeColor } from "@/hooks/useThemeColor"

export type ThemedTextProps = TextProps & {
	type?:
		| "default"
		| "title"
		| "defaultSemiBold"
		| "defaultLight"
		| "subtitle"
		| "subtitleLight"
		| "subtitleBold"
		| "subtitleBoldLight"
	color?: string
	centered?: boolean
}

export function ThemedText({
	style,
	type = "default",
	color,
	centered,
	...rest
}: ThemedTextProps) {
	const theme = useThemeColor()

	return (
		<Text
			style={[
				{ color: color || theme.text },
				type === "default" ? [styles.default, styles.bold] : undefined,
				type === "defaultLight"
					? [styles.default, styles.light]
					: undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultSemiBold"
					? [styles.default, styles.semiBold]
					: undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "subtitleLight"
					? [styles.subtitle, styles.light]
					: undefined,
				type === "subtitleBold"
					? [styles.subtitle, styles.bold]
					: undefined,
				type === "subtitleBoldLight"
					? [styles.subtitle, styles.bold, styles.light]
					: undefined,
				centered ? { textAlign: "center" } : undefined,
				style,
			]}
			{...rest}
		/>
	)
}

const styles = StyleSheet.create({
	default: {
		fontSize: 18,
		lineHeight: 24,
	},

	semiBold: {
		fontWeight: "600",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		lineHeight: 32,
	},
	subtitle: {
		fontSize: 12,
	},
	light: {
		opacity: 0.6,
	},
	bold: {
		fontWeight: "bold",
	},
})
