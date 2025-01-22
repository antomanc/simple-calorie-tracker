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

			// if the db is the old version, drop the tables and recreate them
			let columnExists = false
			try {
				await database.execAsync(
					"SELECT kcal_total FROM diary_entries LIMIT 1;"
				)
				columnExists = true
			} catch {
				columnExists = false
			}
			if (!columnExists) {
				try {
					await database.execAsync("DROP TABLE diary_entries;")
					await database.execAsync("DROP TABLE food;")
					await database.execAsync("DROP TABLE favorite_food;")
				} catch {
					console.error("Error dropping tables")
				}
			}

			try {
				await database.execAsync(
					`CREATE TABLE IF NOT EXISTS diary_entries (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						quantity REAL NOT NULL,
						is_servings BOOLEAN NOT NULL,
						date TEXT NOT NULL,
						meal_type INTEGER NOT NULL,
						kcal_total REAL NOT NULL,
						protein_total REAL NOT NULL,
						carbs_total REAL NOT NULL,
						fat_total REAL NOT NULL,
						food_id TEXT NOT NULL,
						FOREIGN KEY (food_id) REFERENCES food (id)
					);`
				)

				await database.execAsync(
					`CREATE INDEX IF NOT EXISTS diary_entries_date ON diary_entries(date);`
				)

				await database.execAsync(
					`CREATE TABLE IF NOT EXISTS food (
						id TEXT PRIMARY KEY,
						name TEXT NOT NULL,
						brand TEXT,
						serving_quantity REAL NOT NULL,
						energy_100g REAL NOT NULL,
						protein_100g REAL,
						carbs_100g REAL,
						fat_100g REAL
					);`
				)

				await database.execAsync(
					`CREATE TABLE IF NOT EXISTS favorite_food (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						food_id TEXT NOT NULL,
						FOREIGN KEY (food_id) REFERENCES food (id)
					);`
				)

				await database.execAsync(
					`CREATE INDEX IF NOT EXISTS favorite_food_food_id ON favorite_food(food_id);`
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
