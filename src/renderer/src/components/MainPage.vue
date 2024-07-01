<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import axios from 'axios';
import { computed, watch, Ref, toRefs } from 'vue';

import { useKeyStore } from './store.js';
let status = 1;
console.log("应图主页加载开始");
export default defineComponent({
  setup() {
    const keyStore = useKeyStore();
    const file = ref(null);
    const return_value = ref<string[]>([]);
    const index_value = ref<string[]>([]);
    const value_value = ref<string[]>([]);
    const ignore_value = ref<string[]>([]);
    const availableOptions = computed(() => {
      const usedOptions = [
        ...index_value.value,
        ...value_value.value,
        ...ignore_value.value
      ];
      return return_value.value.filter((option) => !usedOptions.includes(option));
    });

    // 监听器，当选择的值变化时，更新availableOptions
    watch([index_value, value_value, ignore_value], () => {
      // 更新return_value的值
      return_value.value = availableOptions.value;
    }, {
      deep: true
    });

    return {
      loading: ref(false),
      disable_upload: ref(false),
      upload: ref(true),
      choose: ref(false),
      file: ref(null), // 添加文件数据属性
      return_value,
      button_text: ref("下一步 →"),
      index_value,
      value_value,
      ignore_value,
      key: ref(null),
      keyStore,
      availableOptions,
    };
  },
  methods: {
    async doact(){
      this.loading = true;
      if(status == 1){
        await this.uploadFile()
      }else if(status == 2){
        await this.set_value();
      }
    },
    async set_value(){
      this.disable_upload = true;
      if(this.index_value.length == 0 || this.value_value.length == 0){
        alert("请选择列");
        this.disable_upload = false;
      }else {
        this.keyStore.setvalues(this.index_value, this.value_value, this.ignore_value);
        this.$router.push('/charts')
      }
    },
    async uploadFile() {
      this.disable_upload = true;
      try {
        // 创建 FormData 对象
        const formData = new FormData();
        // 将文件添加到 FormData 对象
        // @ts-ignore
        formData.append('file', this.file);

        // 发送 POST 请求
        const response = await axios.post('http://127.0.0.1:6060/processor', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 处理响应
        if (response.data.status === 200) {
          // 如果 status 为 200，则保存密钥到 Store
          this.keyStore.setKey(response.data.data.key);


          this.key=response.data.data.key;
          this.return_value = response.data.data.columns;
          // 进行下一步操作，例如路由跳转
          this.upload=false;
          this.choose=true;
          status=2;
          this.button_text='开始分析';
        } else {
          // 如果 status 不为 200，则显示 message
          alert(response.data.message);
        }
      } catch (error) {
        alert("上传失败，请检查文件格式和内容。");
        console.error(error);
      } finally {
        this.loading = false;
        this.disable_upload = false;

      }
    }
  }
});
</script>

<template>

  <br><br>
  <v-card
    class="mx-auto"
    width="500"
    outlined
    elevation="24"
  >
    <v-card-title class="text-h5 font-weight-bold pa-4">
      欢迎使用应图
    </v-card-title>

   <div v-if="upload">
     <v-card-text class="text-body-1 px-8 py-4">
       请上传一个格式为 .csv/.xlsx/.xls 的二维表格，确保带有列名。
     </v-card-text>

     <v-card-text>
       <v-file-input
         clearable
         label="上传表格"
         prepend-icon="mdi-paperclip"
         accept=".xlsx,.xls,.csv"
         class="px-8"
         :disabled="disable_upload"
         v-model="file"
       ></v-file-input>
     </v-card-text>
   </div>
    <div v-if="choose">
      <v-card-text class="text-body-1 px-8 py-4">
        请选择需要分类的列名
      </v-card-text>
      <v-select
        clearable
        label="选择作为索引的列"
        v-model="index_value"
        :items="return_value"
        :disabled="disable_upload"
        chips
        multiple
      ></v-select>
      <v-select
        clearable
        label="选择作为数据的列"
        v-model="value_value"
        :items="return_value"
        :disabled="disable_upload"
        chips
        multiple
      ></v-select>
      <v-select
        clearable
        label="选择忽略的列"
        v-model="ignore_value"
        :items="return_value"
        :disabled="disable_upload"
        chips
        multiple
      ></v-select>
    </div>
    <v-divider></v-divider>

    <v-card-actions class="justify-end px-8 py-4">
      <v-btn
        :loading="loading"
        color="primary"
        depressed
        @click="doact"
      >
        {{ button_text }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/* 在这里可以添加一些自定义样式 */
</style>
