import { useCallback, useState } from "react"
import { CustomModal } from "./CustomModal"
import { CustomTextInput } from "./CustomTextInput"

export interface CustomEntry {
	name: string
	calories: number
	fat: number
	carbs: number
	protein: number
}

interface CustomEntryModalProps {
	modalVisible: boolean
	handleDismiss: () => void
	handleSubmit: (entry: CustomEntry) => void
}

export const CustomEntryModal = ({
	modalVisible,
	handleDismiss: superHandleDismiss,
	handleSubmit,
}: CustomEntryModalProps) => {
	const [entryName, setEntryName] = useState("")
	const [entryCalories, setEntryCalories] = useState("")
	const [entryFat, setEntryFat] = useState("")
	const [entryCarbs, setEntryCarbs] = useState("")
	const [entryProtein, setEntryProtein] = useState("")

	const handleSubmitEntry = useCallback(() => {
		if (!entryName.trim() || !entryCalories.trim()) {
			return
		}
		if (!Number(entryCalories)) {
			return
		}
		const entry: CustomEntry = {
			name: entryName,
			calories: Number(entryCalories),
			fat: Number(entryFat) || 0,
			carbs: Number(entryCarbs) || 0,
			protein: Number(entryProtein) || 0,
		}
		handleSubmit(entry)
	}, [
		entryName,
		entryCalories,
		entryFat,
		entryCarbs,
		entryProtein,
		handleSubmit,
	])

	const handleDismiss = useCallback(() => {
		setEntryName("")
		setEntryCalories("")
		setEntryFat("")
		setEntryCarbs("")
		setEntryProtein("")
		superHandleDismiss()
	}, [superHandleDismiss])

	return (
		<CustomModal
			visible={modalVisible}
			onDismiss={handleDismiss}
			onSubmit={handleSubmitEntry}
			title={"Add a custom entry"}
		>
			<CustomTextInput
				placeholder="Entry Name *"
				value={entryName}
				onChangeText={setEntryName}
			/>
			<CustomTextInput
				placeholder="Calories *"
				value={entryCalories}
				onChangeText={setEntryCalories}
				keyboardType="numeric"
			/>
			<CustomTextInput
				placeholder="Fat"
				value={entryFat}
				onChangeText={setEntryFat}
				keyboardType="numeric"
			/>
			<CustomTextInput
				placeholder="Carbs"
				value={entryCarbs}
				onChangeText={setEntryCarbs}
				keyboardType="numeric"
			/>
			<CustomTextInput
				placeholder="Protein"
				value={entryProtein}
				onChangeText={setEntryProtein}
				keyboardType="numeric"
			/>
		</CustomModal>
	)
}
