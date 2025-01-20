import React, { useMemo } from "react"
import {
	Pressable,
	View,
	StyleSheet,
	PressableProps,
	ViewStyle,
} from "react-native"

type CustomPressableProps = PressableProps &
	React.PropsWithChildren & {
		borderRadius?: number
		style?: ViewStyle
	}

export const CustomPressable = ({
	children,
	borderRadius,
	style,
	...props
}: CustomPressableProps) => {
	const {
		margin,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		marginHorizontal,
		marginVertical,
		...pressableStyle
	} = StyleSheet.flatten(style || {})

	const styles = useMemo(
		() =>
			StyleSheet.create({
				wrapper: {
					borderRadius,
					overflow: "hidden",
					margin,
					marginTop,
					marginBottom,
					marginLeft,
					marginRight,
					marginHorizontal,
					marginVertical,
				},
			}),
		[
			borderRadius,
			margin,
			marginTop,
			marginBottom,
			marginLeft,
			marginRight,
			marginHorizontal,
			marginVertical,
		]
	)

	return (
		<View style={styles.wrapper}>
			<Pressable style={pressableStyle} {...props}>
				{children}
			</Pressable>
		</View>
	)
}
