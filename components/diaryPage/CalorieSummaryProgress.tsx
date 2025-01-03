import React, { useMemo } from "react"
import { useThemeColor } from "@/hooks/useThemeColor"
import { View, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"

type CalorieSummaryProgressProps = {
	progress: number
} & React.PropsWithChildren

export const CalorieSummaryProgress = ({
	progress,
	children,
}: CalorieSummaryProgressProps) => {
	const theme = useThemeColor()
	const size = 130
	const radius = size / 2
	const strokeWidth = 8
	const normalizedRadius = radius - strokeWidth / 2
	const circumference = 2 * Math.PI * normalizedRadius

	const strokeDashoffset = useMemo(() => {
		const cappedProgress = Math.min(progress, 100)
		return circumference - (cappedProgress / 100) * circumference * 0.75
	}, [progress, circumference])

	return (
		<View style={styles.container}>
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<Circle
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					stroke={theme.onSurface}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeLinecap="round"
					strokeDashoffset={circumference * 0.25}
					transform={`rotate(135 ${radius} ${radius})`}
				/>
				<Circle
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					stroke="#72D2BE"
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(135 ${radius} ${radius})`}
				/>
			</Svg>
			<View style={styles.children}>{children}</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
	children: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
})
