import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages path (https://<user>.github.io/<repo>/);
// override with an empty string for a custom domain or a user/org root page.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/cafe-fausse-web-application/',
})
