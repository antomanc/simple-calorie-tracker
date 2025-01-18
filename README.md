# Simple Calorie Tracker

[<img src="https://github.com/machiav3lli/oandbackupx/blob/034b226cea5c1b30eb4f6a6f313e4dadcbb0ece4/badge_github.png" alt="Get it on GitHub" height="80">](https://github.com/antomanc/simple-calorie-tracker/releases/latest)

This is a free and open source **React Native** application that helps you track your daily calories, macros, and meals. The design is inspired by Yazio.

## Features

- Search or scan foods with [OpenFoodFacts](https://openfoodfacts.org/) or [USDA](https://fdc.nal.usda.gov/) api integration
- Track calories, protein, fat, and carbohydrates in a daily diary
- Customize your daily targets

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
