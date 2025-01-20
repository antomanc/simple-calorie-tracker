import { DiaryEntry } from "@/hooks/useDatabase"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useCallback, useEffect, useMemo, useState } from "react"
import { View, StyleSheet, FlatList, Animated } from "react-native"
import { CompactFoodItem } from "./CompactFoodItem"

type CompactFoodListProps = {
	diaryEntries: DiaryEntry[]
	onEntryTap: (entry: DiaryEntry) => void
	addIcon?: boolean
	onAddPress?: () => void
	onEntryDelete: (entry: DiaryEntry) => void
}

export const CompactFoodList = ({
	diaryEntries,
	onEntryTap,
	addIcon,
	onAddPress,
	onEntryDelete,
}: CompactFoodListProps) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainContainer: {
					flex: 1,
					backgroundColor: theme.background,
				},
				scrollContainer: {
					alignItems: "center",
					justifyContent: "flex-start",
					paddingTop: 16,
					paddingBottom: 32,
				},
			}),
		[theme]
	)

	const [filteredEntries, setFilteredEntries] = useState(diaryEntries)

	useEffect(() => {
		setFilteredEntries(diaryEntries)
	}, [diaryEntries])

	const handleEntryDelete = useCallback(
		(entry: DiaryEntry, animatedValue: Animated.Value) => {
			Animated.timing(animatedValue, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false,
			}).start(() => {
				onEntryDelete(entry)
			})
		},
		[onEntryDelete, setFilteredEntries]
	)

	const renderItem = useCallback(
		({ item: diaryEntry }: { item: DiaryEntry }) => (
			<CompactFoodItem
				key={diaryEntry.id}
				diaryEntry={diaryEntry}
				onEntryTap={onEntryTap}
				onEntryDelete={handleEntryDelete}
				addIcon={addIcon ?? false}
				onAddPress={onAddPress ?? (() => {})}
			/>
		),
		[addIcon, handleEntryDelete, onEntryTap, onAddPress, theme.text, styles]
	)

	return (
		<View style={styles.mainContainer}>
			<FlatList
				contentContainerStyle={styles.scrollContainer}
				data={filteredEntries}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
			/>
		</View>
	)
}
