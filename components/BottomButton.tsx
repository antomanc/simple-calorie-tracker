import { useThemeColor } from "@/hooks/useThemeColor"
import { Ionicons } from "@expo/vector-icons"
import React, { useMemo, useState } from "react"
import {
	TouchableOpacity,
	StyleSheet,
	View,
	ActivityIndicator,
} from "react-native"
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated"
import * as Haptics from "expo-haptics"

type BottomButtonProps = {
	text: string
	icon?: React.ComponentProps<typeof Ionicons>["name"]
	hapticFeedback?: boolean
} & (
	| {
			onPressWithAnimation: () => Promise<boolean>
			onAnimationEnd?: () => void
			onPress?: never
	  }
	| {
			onPress: () => void
			onPressWithAnimation?: never
			onAnimationEnd?: never
	  }
)
export const BottomButton: React.FC<BottomButtonProps> = ({
	onPressWithAnimation,
	onAnimationEnd,
	onPress,
	hapticFeedback,
	text,
	icon,
}) => {
	const theme = useThemeColor()
	const [isLoading, setIsLoading] = useState(false)
	const [status, setStatus] = useState<"idle" | "success" | "failed">("idle")

	const styles = useMemo(
		() =>
			StyleSheet.create({
				buttonContainer: {
					width: "100%",
					alignItems: "center",
					marginBottom: 20,
					position: "absolute",
					bottom: 0,
					alignSelf: "center",
				},
				buttonIdle: {
					backgroundColor: theme.secondary,
				},
				button: {
					minWidth: 100,
					paddingHorizontal: 22,
					height: 46,
					backgroundColor: theme.secondary,
					borderRadius: 30,
					flexDirection: "row",
					justifyContent: "center",
					gap: 12,
					alignItems: "center",
				},
				text: {
					color: theme.text,
					fontSize: 16,
					fontWeight: "bold",
				},
				icon: {
					color: theme.text,
				},
				aimatedIcon: {
					color: theme.text,
					position: "absolute",
					opacity: 0,
				},
				failed: {
					color: "red",
				},
			}),
		[theme.secondary, theme.text]
	)

	const scale = useSharedValue(1)
	const checkOpacity = useSharedValue(0)
	const crossOpacity = useSharedValue(0)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		}
	})

	const successStyle = useAnimatedStyle(() => {
		return {
			opacity: checkOpacity.value,
		}
	})

	const failedStyle = useAnimatedStyle(() => {
		return {
			opacity: crossOpacity.value,
		}
	})

	const handlePress = async () => {
		if (onPress) {
			onPress()
			if (hapticFeedback) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
			}
			return
		}
		setIsLoading(true)
		setStatus("idle")
		try {
			const result = await onPressWithAnimation()
			setIsLoading(false)
			setStatus(result ? "success" : "failed")

			if (result) {
				scale.value = withSpring(1.2, { damping: 6 }, () => {
					scale.value = withTiming(1)
				})
				checkOpacity.value = withTiming(1)
			} else {
				scale.value = withSpring(1.2, { damping: 6 }, () => {
					scale.value = withTiming(1)
				})
				crossOpacity.value = withTiming(1)
			}
			if (hapticFeedback) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
			}

			setTimeout(() => {
				setStatus("idle")
				checkOpacity.value = 0
				crossOpacity.value = 0
				onAnimationEnd?.()
			}, 1000)
		} catch {
			if (hapticFeedback) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
			}
			setIsLoading(false)
			setStatus("failed")
			crossOpacity.value = withTiming(1)
		}
	}

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity
				onPress={handlePress}
				style={[
					styles.button,
					status === "idle" && !isLoading && styles.buttonIdle,
				]}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator color="white" />
				) : (
					<>
						{status === "idle" && (
							<>
								{icon && (
									<Ionicons
										name={icon}
										size={24}
										style={styles.icon}
									/>
								)}

								<Animated.Text
									style={[styles.text, animatedStyle]}
								>
									{text}
								</Animated.Text>
							</>
						)}
						<Animated.Text
							style={[styles.aimatedIcon, successStyle]}
						>
							<Ionicons name="checkmark" size={24} />
						</Animated.Text>
						<Animated.Text
							style={[
								styles.failed,
								styles.aimatedIcon,
								failedStyle,
							]}
						>
							<Ionicons name="close" size={24} />
						</Animated.Text>
					</>
				)}
			</TouchableOpacity>
		</View>
	)
}
