import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

import { Quasar, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/ja'

// Import Quasar css
import 'quasar/dist/quasar.css'

import '@/assets/sass/main.sass'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
    plugins: {
        Dialog
    }, // import Quasar plugins and add here
    lang: quasarLang,
})

app.mount('#app')