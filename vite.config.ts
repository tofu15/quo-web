import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://quo.litiangang.com:9876',
                changeOrigin: true
            }
        }
    },
    plugins: [
        vue({
            template: {transformAssetUrls}
        }),
        quasar()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@modules': fileURLToPath(new URL('./node_modules', import.meta.url))
        }
    }
})
