import { defineConfig } from 'vite';

export default defineConfig({
  base: '/flowsimulator/',
  build: {
    rollupOptions: {
      input: {
        teamsim: 'flowsimulator/teamsim/index.html'
      },
    },
    assetsDir: 'assets',
  },
});
