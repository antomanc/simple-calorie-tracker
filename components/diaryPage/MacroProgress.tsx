import { borderRadius } from "@/constants/Theme"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo } from "react"
import { StyleSheet, View } from "react-native"

interface MacroProgressProps {
	progress: number
}

/**
 * A progress bar for the macronutrient summary.
 * @param progress - The percentage of the progress bar to fill (0-100).
 */
export const MacroProgress = ({ progress }: MacroProgressProps) => {
	const theme = useThemeColor()

	const cappedProgress = useMemo(
		() => Math.min(100, Math.max(0, progress)),
		[progress]
	)

	const styles = useMemo(
		() =>
			StyleSheet.create({
				progressContainer: {
					height: 6,
					marginVertical: 6,
					width: 70,
					backgroundColor: theme.onSurface,
					borderRadius: borderRadius,
				},
				progressBar: {
					width: `${cappedProgress}%`,
					height: 6,
					backgroundColor: theme.primary,
					borderRadius: borderRadius,
				},
			}),
		[theme, borderRadius, progress]
	)
	return (
		<View style={styles.progressContainer}>
			<View style={styles.progressBar} />
		</View>
	)
}
