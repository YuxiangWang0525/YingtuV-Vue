import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import Charts from '../components/Charts.vue'
// import Ban from '../components/Ban.vue'
//import About from '../components/About.vue'


const routes = [
    { path: '/', component: MainPage },
    { path: '/charts', component: Charts }
  //   ,
  //   { path: '/ban', component: Ban }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
