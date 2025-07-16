import { defineConfig } from 'vite';

export default defineConfig({
  base: '/flowsimulator/',
  build: {
    rollupOptions: {
      input: {
        teamsim: 'teamsim/index.html'
      },
    },
    assetsDir: 'assets',
  },
});
