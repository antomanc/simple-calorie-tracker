import { StyleSheet } from "react-native"
import { ThemedText } from "./ThemedText"
import { useMemo, useState } from "react"
import { useThemeColor } from "@/hooks/useThemeColor"
import { CustomPressable } from "./CustomPressable"
import { CustomModal } from "./CustomModal"

type SettingItemProps = {
	title: string
	value: string
	onSubmit: () => void
} & React.PropsWithChildren

export const SettingItem = ({
	title,
	value,
	onSubmit,
	children,
}: SettingItemProps) => {
	const theme = useThemeColor()

	const [modalVisible, setModalVisible] = useState(false)

	const styles = useMemo(
		() =>
			StyleSheet.create({
				inputContainer: {
					flexDirection: "column",
					alignItems: "flex-start",
					paddingHorizontal: 16,
					paddingVertical: 8,
				},
				label: {
					fontSize: 16,
				},
				modalContent: {
					padding: 16,
				},
			}),
		[theme]
	)

	const handlePress = () => {
		setModalVisible(true)
	}

	const handleDismiss = () => {
		setModalVisible(false)
	}

	const handleSubmit = () => {
		onSubmit()
		setModalVisible(false)
	}

	return (
		<>
			<CustomPressable
				style={styles.inputContainer}
				onPress={handlePress}
			>
				<ThemedText style={styles.label}>{title}</ThemedText>
				<ThemedText type="subtitleBold">{value}</ThemedText>
			</CustomPressable>
			<CustomModal
				visible={modalVisible}
				onDismiss={handleDismiss}
				onSubmit={handleSubmit}
				title={title}
			>
				{children}
			</CustomModal>
		</>
	)
}
