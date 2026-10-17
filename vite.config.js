import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            { name: 'three-core', test: /node_modules[\\/]three[\\/]/, priority: 20, includeDependenciesRecursively: false },
            { name: 'react-three-fiber', test: /node_modules[\\/]@react-three[\\/]fiber[\\/]/, priority: 10, includeDependenciesRecursively: false },
          ],
        },
      },
    },
  },
})
