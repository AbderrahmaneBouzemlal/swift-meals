import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',  // Important for Capacitor!
      precompress: false,
      strict: false  // Turn off for Capacitor compatibility
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '' : ''
    }
  }
};

export default config;
