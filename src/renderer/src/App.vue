<template>
  <v-app id="inspire">
<!--    <v-navigation-drawer v-model="drawer">-->
<!--      &lt;!&ndash;  &ndash;&gt;-->
<!--    </v-navigation-drawer>-->

    <v-app-bar>
<!--      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>-->
      <v-app-bar-title>应图·Visualization - 成绩可视化分析系统</v-app-bar-title>
      <v-spacer></v-spacer>
<!--      <v-btn icon="mdi-refresh" @click="reload">-->
<!--        <p>重置</p>-->

<!--      </v-btn>-->
    </v-app-bar>

    <v-main>
      <div class="main">
        <router-view></router-view>
      </div>
      <br>
      <div id="footer" class="footer" align="center">
        <p>应图 YingTu 版权所有 © 2024 Wang Yuxiang(Frontend) and Cui Chengjun(Backend)</p>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import {onMounted, ref} from 'vue'
onMounted(async () => {
  console.log("应图欢迎页面成功加载");
})
const drawer = ref(null)

</script>

<script>
// import defineComponent from "vue";
export default {
  data: () => ({ drawer: null }),
}
// export default defineComponent({
//   methods:{
//     reload(){
//       window.electronAPI.reload_all()
//     }
//   }
// })
</script>
