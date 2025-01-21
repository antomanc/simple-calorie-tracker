interface UniqueIdMapping {
	id: number | string
	source: "USDA" | "OPENFOODFACTS" | "CUSTOM"
}

export const generateDatabaseId = ({ source, id }: UniqueIdMapping) => {
	return `${source}_${id}`
}

export const idFromDatabaseId = (databaseId: string) => {
	return databaseId.split("_")[1]
}
