import React, { createContext, useContext, useEffect } from "react"
import * as SQLite from "expo-sqlite"

type DiaryContextType = {
	db: SQLite.SQLiteDatabase | null
}

export const DiaryContext = createContext<DiaryContextType>({
	db: null,
})

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [db, setDb] = React.useState<SQLite.SQLiteDatabase | null>(null)

	useEffect(() => {
		const initDB = async () => {
			const database = await SQLite.openDatabaseAsync("diary.db")

			try {
				await database.execAsync(
					`CREATE TABLE IF NOT EXISTS diary_entries (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              quantity REAL NOT NULL,
              is_servings BOOLEAN NOT NULL,
              date TEXT NOT NULL,
              meal_type INTEGER NOT NULL,
			  kcal REAL NOT NULL,
			  food_name TEXT NOT NULL,
			  food_brand TEXT,
			  food_serving_quantity REAL NOT NULL,
			  food_energy_100g REAL NOT NULL,
			  food_protein_100g REAL,
			  food_carbs_100g REAL,
			  food_fat_100g REAL
			);`
				)

				await database.execAsync(
					`CREATE INDEX IF NOT EXISTS diary_entries_date ON diary_entries(date);`
				)

				console.log("Database initialized successfully")
				setDb(database)
			} catch (error) {
				console.error("Error initializing database:", error)
			}
		}

		// const initLocalFoodDB = async () => {
		// 	const dbName = "usda_sr_food.db"
		// 	const dbUri = FileSystem.documentDirectory + dbName

		// 	const dbExists = await FileSystem.getInfoAsync(dbUri)
		// 	if (!dbExists.exists) {
		// 		const asset = Asset.fromModule(
		// 			require("../assets/databases/usda_sr_food.db")
		// 		)
		// 		await asset.downloadAsync()
		// 		await FileSystem.copyAsync({
		// 			from: asset.localUri!,
		// 			to: dbUri,
		// 		})
		// 		console.log("Database copied successfully")
		// 	} else {
		// 		console.log("Database already exists")
		// 	}

		// 	const database = await SQLite.openDatabaseAsync(dbUri, {
		// 		useNewConnection: true,
		// 	})

		// 	setLocalFoodDb(database)
		// }

		initDB()
	}, [])

	return (
		<DiaryContext.Provider value={{ db }}>{children}</DiaryContext.Provider>
	)
}

export const useDiaryContext = () => useContext(DiaryContext)
