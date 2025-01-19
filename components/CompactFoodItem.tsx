import { Ionicons } from "@expo/vector-icons"
import { useMemo, useState } from "react"
import { Animated, View, StyleSheet } from "react-native"
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { CustomPressable } from "./CustomPressable"
import { ThemedText } from "./ThemedText"
import { DiaryEntry } from "@/hooks/useDiary"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useSummary } from "@/hooks/useSummary"

type CompactFoodItemProps = {
	diaryEntry: DiaryEntry
	onEntryTap: (entry: DiaryEntry) => void
	onEntryDelete: (entry: DiaryEntry, animatedValue: Animated.Value) => void
} & (
	| {
			addIcon: boolean
			onAddPress: () => void
	  }
	| {
			addIcon?: false
			onAddPress?: never
	  }
)

export const CompactFoodItem = ({
	diaryEntry,
	onEntryTap,
	onEntryDelete,
	addIcon,
	onAddPress,
}: CompactFoodItemProps) => {
	const animatedHeight = useMemo(() => new Animated.Value(1), [])
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

	const [isHidden, setIsHidden] = useState(false)

	const { calculateTotal } = useSummary()

	const entrySummary = useMemo(
		() => calculateTotal([diaryEntry]),
		[diaryEntry, calculateTotal]
	)

	return (
		<Animated.View
			style={[
				styles.itemBackground,
				{
					height: animatedHeight.interpolate({
						inputRange: [0, 1],
						outputRange: [0, 60],
					}),
				},
			]}
		>
			<Ionicons
				name="trash"
				size={28}
				color={theme.text}
				style={{ position: "absolute", right: 16 }}
			/>
			<Swipeable
				onSwipeableOpen={() => {
					setIsHidden(true)
					onEntryDelete(diaryEntry, animatedHeight)
				}}
				friction={1}
			>
				{!isHidden && (
					<CustomPressable
						onPress={() => onEntryTap(diaryEntry)}
						style={styles.itemContainer}
						android_ripple={{ color: theme.text }}
					>
						<View style={styles.leftText}>
							<ThemedText
								style={{
									color: theme.text,
									fontSize: 16,
								}}
								numberOfLines={1}
							>
								{diaryEntry.food.name}
							</ThemedText>
							<ThemedText type="subtitleBold" numberOfLines={1}>
								{diaryEntry.food.brand}, {diaryEntry.quantity}{" "}
								{diaryEntry.isServings ? "serving/s" : "g"}
							</ThemedText>
						</View>
						<View style={styles.rightSide}>
							<ThemedText>
								{Math.round(entrySummary.calories)} Cal
							</ThemedText>
							{addIcon && (
								<CustomPressable onPress={onAddPress}>
									<Ionicons
										name="add-circle-outline"
										size={24}
										color={theme.text}
									/>
								</CustomPressable>
							)}
						</View>
					</CustomPressable>
				)}
			</Swipeable>
		</Animated.View>
	)
}
