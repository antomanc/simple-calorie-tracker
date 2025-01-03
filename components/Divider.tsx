import { DimensionValue, StyleSheet, View } from "react-native"

interface DividerProps {
	color: string
	width?: DimensionValue
	height?: number
}

export const Divider = ({ color, width, height }: DividerProps) => {
	const styles = StyleSheet.create({
		divider: {
			width: width || "100%",
			height: height || 1,
			backgroundColor: color,
			borderRadius: 1,
		},
	})

	return <View style={styles.divider} />
}
