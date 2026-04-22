# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn` — install dependencies.
- `yarn start` — start the Expo development server.
- `yarn test` — run the Jest test suite.
- `yarn test --watch` — run tests in watch mode during development.
- `yarn test src/features/counter/store/useCounterStore.test.ts` — run a single test file.
- `yarn test --watch src/features/settings/store/useThemeStore.test.ts` — watch a single test file.

## Architecture

- This is an Expo Router app. `package.json` uses `expo-router/entry`, and file-based routes live under `src/app` instead of the default root `app` directory.
- `src/app/_layout.tsx` is the composition root for navigation and theming. It reads the persisted theme preference from the settings feature store, resolves system dark mode, sets the system background color with `expo-system-ui`, and wraps the router stack with both React Navigation and React Native Paper theme providers.
- The router currently has two screens: `src/app/index.tsx` maps to the counter feature home screen, and `src/app/settings.tsx` presents the settings screen as a modal.
- Feature code is organized by domain under `src/features/<feature>`. Each feature keeps its UI screen and Zustand store together, so route files stay thin and mostly delegate to feature screens.
- State is kept in small local Zustand stores rather than a single global store. `useCounterStore` owns counter mutations, while `useThemeStore` owns the app theme mode (`system | light | dark`). Existing tests exercise stores directly via `getState()`/`setState()` instead of rendering components.
- The theme layer lives under `src/theme`. `colors.ts` derives a color palette from `@snapbox/pkg-ui`, and `themes.ts` merges that palette into both React Navigation and React Native Paper MD3 themes so both libraries stay visually aligned.
- UI uses React Native Paper components, while navigation chrome comes from `@snapbox/pkg-ui` (`CustomNavigationBar`). Metro is also standardized through `@snapbox/metro-config`, so prefer existing Snapbox packages when adjusting shared app shell behavior.

## Project notes

- TypeScript path alias `@/*` resolves to `src/*`.
- Jest uses the `jest-expo` preset with no extra custom configuration, so new tests should fit Expo/Jest defaults unless there is a clear need to extend config.
- Expo config is minimal in `app.json`; the only registered plugin today is `expo-router`.

## Snapbox packages

- @snapbox/pkg-computer-vision - 提供计算视觉功能，模版匹配、相识度计算
- @snapbox/pkg-floating-menu - 提供悬浮菜单功能
- @snapbox/pkg-screen-clicker - 提供屏幕点击功能
- @snapbox/pkg-screen-recorder - 提供屏幕录制功能，支持截图
