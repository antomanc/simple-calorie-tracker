import { useThemeColor } from "@/hooks/useThemeColor"
import { forwardRef, useCallback, useMemo } from "react"
import { TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { borderRadius } from "@/constants/Theme"
import { router } from "expo-router"

interface SearchBarProps {
	value: string
	onRequestFocus: () => void
	onChangeText: (text: string) => void
	onSubmit: () => void
	onClear: () => void
}
const SearchBarComponent = forwardRef<
	TextInput,
	React.PropsWithChildren<SearchBarProps>
>(
	(
		{
			value,
			onRequestFocus,
			onChangeText,
			onSubmit,
			onClear,
		}: SearchBarProps,
		ref
	) => {
		const theme = useThemeColor()
		const styles = useMemo(
			() =>
				StyleSheet.create({
					searchBox: {
						height: 56,
						borderRadius: borderRadius,
						padding: 8,
						color: theme.text,
						backgroundColor: theme.onSurface,
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 16,
						marginHorizontal: 16,
						gap: 16,
						justifyContent: "flex-start",
					},
					textInput: {
						flex: 1,
						fontSize: 16,
						fontWeight: "600",
						backgroundColor: theme.onSurface,
						color: theme.text,
						paddingVertical: 0,
					},
				}),
			[theme.text, theme.onSurface]
		)

		const handleBack = useCallback(() => {
			router.back()
		}, [])

		return (
			<TouchableOpacity
				activeOpacity={1}
				style={styles.searchBox}
				onPress={onRequestFocus}
			>
				<TouchableOpacity onPress={handleBack} hitSlop={10}>
					<Ionicons name="arrow-back" size={28} color={theme.text} />
				</TouchableOpacity>
				<TextInput
					ref={ref}
					clearButtonMode="never"
					value={value}
					onChangeText={onChangeText}
					onSubmitEditing={onSubmit}
					maxLength={100}
					autoFocus
					placeholder="What are you looking for?"
					placeholderTextColor={`${theme.text}99`}
					returnKeyType="search"
					style={styles.textInput}
				/>
				<TouchableOpacity onPress={onClear} hitSlop={10}>
					<Ionicons name="close" size={28} color={theme.text} />
				</TouchableOpacity>
			</TouchableOpacity>
		)
	}
)

SearchBarComponent.displayName = "SearchBar"

export const SearchBar = SearchBarComponent
