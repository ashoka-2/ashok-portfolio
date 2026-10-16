import { createSlice } from '@reduxjs/toolkit'

function readTheme() {
  try { return localStorage.getItem('ak-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: readTheme() },
  reducers: {
    toggleTheme(state) { state.mode = state.mode === 'dark' ? 'light' : 'dark' },
    setTheme(state, action) { state.mode = action.payload === 'light' ? 'light' : 'dark' },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
