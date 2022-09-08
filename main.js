import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

import { Quasar, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/ja'
import quasarIconSet from 'quasar/icon-set/material-icons-round'

// Import icon libraries
import '@quasar/extras/material-icons-round/material-icons-round.css'

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
    iconSet: quasarIconSet,
})

app.mount('#app')