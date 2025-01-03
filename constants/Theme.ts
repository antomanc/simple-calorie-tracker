/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DefaultTheme, Theme } from "@react-navigation/native"

export const Colors = {
	light: {
		text: "#364750",
		icon: "#364750",
		background: "#F8FAFC",
		surface: "#FFFFFF",
		onSurface: "#F0F3F5",
		primary: "#5BBEF9",
		secondary: "#0889D6",
		bottomNav: "#FFFEFE",
	},
	dark: {
		text: "#E1E3E1",
		icon: "#E1E3E1",
		background: "#111928",
		surface: "#1B2232",
		onSurface: "#343846",
		primary: "#5BBFF8",
		secondary: "#0989D8",
		bottomNav: "#202B38",
	},
}

export const borderRadius = 8

export const paddingTopForHeader = 44

export const CustomDarkTheme: Theme = {
	dark: true,
	fonts: DefaultTheme.fonts,
	colors: {
		background: Colors.dark.background,
		primary: Colors.dark.primary,
		text: Colors.dark.text,
		card: Colors.dark.surface,
		border: Colors.dark.surface,
		notification: Colors.dark.primary,
	},
}

export const CustomLightTheme: Theme = {
	dark: false,
	fonts: DefaultTheme.fonts,
	colors: {
		background: Colors.light.background,
		primary: Colors.light.primary,
		text: Colors.light.text,
		card: Colors.light.surface,
		border: Colors.light.surface,
		notification: Colors.light.primary,
	},
}
