import { borderRadius } from "@/constants/Theme"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMemo } from "react"
import { Modal, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { CustomPressable } from "./CustomPressable"

type CustomModalProps = {
	visible: boolean
	title?: string
	onDismiss?: () => void
	onSubmit?: () => void
} & React.PropsWithChildren

export const CustomModal = ({
	visible,
	onDismiss,
	children,
	title,
	onSubmit,
}: CustomModalProps) => {
	const theme = useThemeColor()
	const styles = useMemo(
		() =>
			StyleSheet.create({
				mainView: {
					position: "absolute",
					justifyContent: "center",
					alignItems: "center",
				},
				centeredView: {
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "rgba(0,0,0,0.6)",
				},
				modal: {
					borderRadius: borderRadius,
					padding: 20,
					width: "80%",
					backgroundColor: theme.onSurface,
					justifyContent: "center",
					alignItems: "flex-start",
					gap: 20,
				},
				title: {},
				buttons: {
					flexDirection: "row",
					justifyContent: "flex-end",
					gap: 32,
					width: "100%",
					marginTop: 16,
				},
			}),
		[theme]
	)
	return (
		<View style={styles.mainView}>
			<Modal
				visible={visible}
				onRequestClose={onDismiss}
				animationType="fade"
				transparent={true}
			>
				<View style={styles.centeredView}>
					<View style={styles.modal}>
						<ThemedText type="title" style={styles.title}>
							{title}
						</ThemedText>
						{children}
						<View style={styles.buttons}>
							<CustomPressable onPress={onDismiss} hitSlop={24}>
								<ThemedText
									style={{
										fontSize: 16,
									}}
									color={theme.primary}
								>
									CANCEL
								</ThemedText>
							</CustomPressable>
							<CustomPressable onPress={onSubmit} hitSlop={24}>
								<ThemedText
									style={{
										fontSize: 16,
									}}
									color={theme.primary}
								>
									SAVE
								</ThemedText>
							</CustomPressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}
