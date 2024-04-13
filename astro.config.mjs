import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";

import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [tailwind(), svelte(), react()],
  output: "server",
  adapter: cloudflare(),
  site: 'https://CODE-G-ROOT.github.io',
});