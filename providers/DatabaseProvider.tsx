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
			let database = await SQLite.openDatabaseAsync("diary.db")

			// if the db is the old version, drop the tables and recreate them
			let columnExists = false
			try {
				await database.execAsync(
					"SELECT kcal_total FROM diary_entries LIMIT 1;"
				)
				await database.execAsync(
					"SELECT is_custom_food FROM food LIMIT 1;"
				)
				columnExists = true
			} catch {
				columnExists = false
			}
			if (!columnExists) {
				try {
					await database.closeAsync()
					await SQLite.deleteDatabaseAsync("diary.db")
					database = await SQLite.openDatabaseAsync("diary.db")
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
					`CREATE VIEW IF NOT EXISTS diary_entries_view AS
						SELECT
							de.id,
							de.quantity,
							de.is_servings,
							de.date,
							de.meal_type,
							de.kcal_total,
							de.protein_total,
							de.carbs_total,
							de.fat_total,
							de.food_id,
							fv.name AS food_name,
							fv.brand AS food_brand,
							fv.is_custom_entry AS food_is_custom_entry,
							fv.is_custom_food AS food_is_custom_food,
							fv.serving_quantity AS food_serving_quantity,
							fv.energy_100g AS food_energy_100g,
							fv.protein_100g AS food_protein_100g,
							fv.carbs_100g AS food_carbs_100g,
							fv.fat_100g AS food_fat_100g,
							fv.is_favorite
						FROM diary_entries de
						JOIN food_view fv ON de.food_id = fv.id;`
				)

				await database.execAsync(
					`CREATE INDEX IF NOT EXISTS diary_entries_date ON diary_entries(date);`
				)

				await database.execAsync(
					`CREATE TABLE IF NOT EXISTS food (
						id TEXT PRIMARY KEY,
						name TEXT NOT NULL,
						brand TEXT,
						is_custom_entry BOOLEAN NOT NULL,
						is_custom_food BOOLEAN NOT NULL,
						serving_quantity REAL NOT NULL,
						energy_100g REAL NOT NULL,
						protein_100g REAL,
						carbs_100g REAL,
						fat_100g REAL
					);`
				)

				await database.execAsync(
					`CREATE VIEW IF NOT EXISTS food_view AS
						SELECT
							f.id,
							f.name,
							f.brand,
							f.is_custom_entry,
							f.is_custom_food,
							f.serving_quantity,
							f.energy_100g,
							f.protein_100g,
							f.carbs_100g,
							f.fat_100g,
							CASE WHEN ff.food_id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite
						FROM food f
						LEFT JOIN favorite_food ff ON f.id = ff.food_id;`
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
