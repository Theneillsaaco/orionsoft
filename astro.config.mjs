// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://Theneillsaaco.github.io',
  base: '/orionsoft',
  
  server:{
    host: true,
    allowedHosts: true
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte()]
});