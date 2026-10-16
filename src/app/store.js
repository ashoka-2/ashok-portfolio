import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/preferences/themeSlice.js'

export const store = configureStore({ reducer: { theme: themeReducer } })
