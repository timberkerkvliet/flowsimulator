import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        flowsim: 'src/flowsim/flowsim.html'
      },
    },
    assetsDir: 'assets',
  },
});
