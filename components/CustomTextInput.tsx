import { borderRadius } from "@/constants/Theme"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo, useState } from "react"
import { TextInput, StyleSheet } from "react-native"

type CustomTextInputProps = React.PropsWithChildren &
	React.ComponentProps<typeof TextInput>

export const CustomTextInput = ({ ...props }: CustomTextInputProps) => {
	const theme = useThemeColor()
	const [isFocused, setIsFocused] = useState(false)

	const styles = useMemo(
		() =>
			StyleSheet.create({
				textInput: {
					borderRadius: borderRadius,
					borderColor: isFocused ? theme.primary : `${theme.text}80`,
					borderWidth: 1.5,
					color: theme.text,
					width: "100%",
					paddingHorizontal: 16,
					height: 52,
				},
			}),
		[
			theme.background,
			theme.text,
			theme.secondary,
			theme.primary,
			isFocused,
		]
	)

	return (
		<TextInput
			placeholderTextColor={`${theme.text}80`}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			{...props}
			style={[styles.textInput, props.style]}
		/>
	)
}
