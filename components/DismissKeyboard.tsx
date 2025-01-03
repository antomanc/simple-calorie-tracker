import { Keyboard, TouchableWithoutFeedback } from "react-native"

type DismissKeyboardProps = React.PropsWithChildren

export const DismissKeyboard = ({ children }: DismissKeyboardProps) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
)
