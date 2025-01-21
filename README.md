# Simple Calorie Tracker

<img src="https://github.com/user-attachments/assets/31b11fdb-5bb3-4e45-9eb4-36a74bd438de" alt="app screenshot" height="400">
<img src="https://github.com/user-attachments/assets/e50f6aea-4b3b-44b5-aab4-a8ef274b509a" alt="app screenshot" height="400">

[<img src="https://github.com/machiav3lli/oandbackupx/blob/034b226cea5c1b30eb4f6a6f313e4dadcbb0ece4/badge_github.png" alt="Get it on GitHub" height="80">](https://github.com/antomanc/simple-calorie-tracker/releases/latest)

This is a free and open source **React Native** application that helps you track your daily calories, macros, and meals. The design is inspired by Yazio.

## Features

- Search foods by name or barcode with [OpenFoodFacts](https://openfoodfacts.org/) and [USDA](https://fdc.nal.usda.gov/) api integration
- Track calories, protein, fat, and carbohydrates in a daily diary
- Add custom entries with your own nutritional values
- Save your favorite foods for quick access
- Customize your daily targets

## TODOs

- [ ] Cache for USDA searches. Since the USDA databases changes very rarely, a cache for queries can be implemented without worries, with a very long invalidation time.
- [x] Recents and frequently used foods. This could be a very handy feature for people that eat some food very ofted, like cereals, milk, eggs or this kind of food.
- [ ] Internationalization. I developed this app without multi languages support in mind, but since there is a small set of pages and components, it's not an hard to implement feature.
- [ ] Changing the day in the diary. At the moment the diary page supports only showing the current day, but having the possibility to change the day could be useful.

## Installation

You can install the app from the latest [GitHub release](https://github.com/antomanc/simple-calorie-tracker/releases/latest) or build it yourself:

1. Clone the repository:
    ```bash
    git clone https://github.com/antomanc/simple-calorie-tracker.git
    cd simple-calorie-tracker
    ```
2. Install dependencies with bun
    ```bash
    bun install
    ```
3. Prebuild for native platforms (Android/iOS):
    ```bash
    bun run expo prebuild
    ```
4. Build the APK:
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
    The release APK will be located in `android/app/build/outputs/apk/release/` as `app-release.apk`.

Feel free to open issues or suggest features!
