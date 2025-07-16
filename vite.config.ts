import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        teamsim: 'src/teamsim/index.html'
      },
    },
    assetsDir: 'assets',
  },
});
