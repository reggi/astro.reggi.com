import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
// import { viteStaticCopy } from 'vite-plugin-static-copy'

import { ViteDevServer } from 'vite';

export function pluginWatchNodeModules(modules) {
	// Merge module into pipe separated string for RegExp() below.
	let pattern = `/node_modules\\/(?!${modules.join('|')}).*/`;
	return {
		name: 'watch-node-modules',
		configureServer: (server) => {
			server.watcher.options = {
				...server.watcher.options,
				ignored: [
					new RegExp(pattern),
					'**/.git/**',
				]
			}
		}
	}
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), mdx()],
  vite: {
    plugins: [pluginWatchNodeModules(['astro-cache-embed'])]
  }
  // plugins: [
  //   viteStaticCopy({
  //     targets: [
  //       {
  //         src: 'node_modules/@shoelace-style/shoelace/dist/assets/**/*',
  //         dest: './shoelace/assets'
  //       }
  //     ]
  //   })
  // ]
  // }
});
