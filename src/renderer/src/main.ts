import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from "./router/index.js";
// Components
import App from './App.vue'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})
createApp(App).use(vuetify).use(pinia).use(router).mount('#app')
