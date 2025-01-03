import { useMemo } from "react"

const useTruncate = (text: string, maxLength: number) => {
	return useMemo(
		() =>
			text.length > maxLength ? `${text.slice(0, maxLength)}...` : text,
		[text, maxLength]
	)
}

export default useTruncate
