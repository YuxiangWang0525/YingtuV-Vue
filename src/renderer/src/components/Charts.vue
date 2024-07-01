<template>
    <v-card>
      <v-tabs
        v-model="tab"
        align-tabs="center"
      >
        <v-tab value="one">班级成绩</v-tab>
        <v-tab value="two">个人成绩</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <v-row>
              <v-col cols="6">
                <div id="stuck_charts_p_ID"></div>
              </v-col>
              <v-col cols="6">
              <div id="chart_point_p_ID"></div>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-select
              @change="selected_student"
              clearable
              v-model="pcode"
              label="选择学生"
              item-title="text"
              item-value="value"
              :items="singleslistmaped"
              variant="outlined"
              return-object
            ></v-select>
            <v-row>
              <v-col cols="6">
                  <div id="pie_charts_s_ID"></div>
              </v-col>
              <v-col cols="6">
                <div id="radar_charts_s_ID"></div>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
</template>

<style scoped>

</style>

<script lang="ts">
import {Chart} from '@antv/g2';
import {defineComponent, nextTick, ref} from "vue";
import axios from 'axios';
import {useKeyStore} from './store.js';

export default defineComponent({
  setup() {
    let singleslist = [];
    let singleslistmaped = ref<any[]>([]);
    const stuck_charts_p_ID = ref(null);
    try{
      // @ts-ignore
    window.electronAPI.maximize_window()
    }catch (error){
      console.log(error)
    }

    const keyStore = useKeyStore();



    // 监听响应
    return {
      tab: ref(null),
      file: ref(null), // 添加文件数据属性
      keyStore,
      stuck_charts_p_ID,
      singleslist,
      singleslistmaped,
      pcode: ref(null)
    };
  },
  async mounted(){
    console.log('应图准备完毕');
    const keyStore = useKeyStore();
    const values = keyStore.getvalues()
    const key = keyStore.getKey()
    console.log(values)
    const data = {
      'name': key,
      'index': values[0],
      'value': values[1],
      'ignore': values[2]
    }
    console.log(JSON.stringify(data))
    // 发送 POST 请求
    let resdata = await axios.post('http://127.0.0.1:6060/processor/group', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(resdata.data);
    console.log(resdata.data.data.Cartesian.stack.column[0]+' '+resdata.data.data.Cartesian.stack.column[2]+' '+resdata.data.data.Cartesian.stack.column[1]);
    const stuck_charts_p = new Chart({
      container: 'stuck_charts_p_ID',
      autoFit: true,
    });
    //0 为user_name 1为cate 2为value
    stuck_charts_p
      .interval()
      .data(resdata.data.data.Cartesian.stack.data)
      .encode('x', resdata.data.data.Cartesian.stack.column[0])
      .encode('y', resdata.data.data.Cartesian.stack.column[2])
      .encode('color', resdata.data.data.Cartesian.stack.column[1])
      .transform({ type: 'stackY' })
      .interaction('elementHighlight', { background: true });
    await nextTick();
    await stuck_charts_p.render();
    const chart_point_p = new Chart({
      container: 'chart_point_p_ID',
      autoFit: true,
    });
    //0 为user_name 1为cate 2为value
    chart_point_p
      .line()
      .data(resdata.data.data.Cartesian.stack.data)
      .encode('x', resdata.data.data.Cartesian.stack.column[0])
      .encode('y', resdata.data.data.Cartesian.stack.column[2])
      .encode('series', resdata.data.data.Cartesian.stack.column[1])
      .encode('color', resdata.data.data.Cartesian.stack.column[1])
    //chart_point_p.interaction('tooltip', { filter: (d, i) => i < 10 });
    await chart_point_p.render();

    // 个人开始
    const data_ps = {
      'name': key,
      'index': values[0],
    }
    let listof = await axios.post('http://127.0.0.1:6060/singles', JSON.stringify(data_ps), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.singleslist = listof.data.data.index;
    this.singleslistmaped = Object.keys(this.singleslist).map((key) => {
      return {
        value: key,
        text: this.singleslist[key]
      };
    });
    console.log(this.singleslistmaped.map(item => item.text).join(', '));
  },
  methods:{
    async selected_student(){
      console.log(this.pcode);
      const keyStore = useKeyStore();
      const values = keyStore.getvalues()
      const key = keyStore.getKey()
      const data_psl = {
        'name': key,
        // @ts-ignore
        'single': [Number(this.pcode["value"])],
        'index': values[0],
        'value': values[1],
        'ignore': values[2]
      }
      console.log(data_psl)
      let psl = await axios.post('http://127.0.0.1:6060/processor/single', JSON.stringify(data_psl), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(psl);
      const piechart = new Chart({
        container: 'pie_charts_s_ID',
        autoFit: true,
      });

      piechart.coordinate({ type: 'theta', outerRadius: 0.8 });

      piechart
        .interval()
        .data(psl.data.data.polar.data)
        .transform({ type: 'stackY' })
        .encode('y', psl.data.data.polar.column[1])
        .encode('color', psl.data.data.polar.column[2])
        .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })
        .label({
          position: 'outside',
          text: (data) => `${data.item}:${(data['value%'] * 100).toFixed(2)}%`

        })
        .tooltip((data) => ({
          name: data.item,
          value: `${(data['value%'] * 100).toFixed(2)}%`,
        }));

      await piechart.render();

      const raderchart = new Chart({
        container: 'radar_charts_s_ID',
        autoFit: true,
      });

      raderchart.coordinate({ type: 'polar' });

      raderchart
        .data(psl.data.data.polar.data)
        .scale('x', { padding: 0.5, align: 0 })
        .scale('y', { tickCount: 5, domainMax: 80 })
        .axis('x', {
          grid: true,
          gridLineWidth: 1,
          tick: false,
          gridLineDash: [0, 0],
        })
        .axis('y', {
          zIndex: 1,
          title: false,
          gridConnect: 'line',
          gridLineWidth: 1,
          gridLineDash: [0, 0],
        });

      raderchart
        .area()
        .encode('x', psl.data.data.polar.column[2])
        .encode('y', psl.data.data.polar.column[0])
        .style('fillOpacity', 0.5);

      raderchart
        .line()
        .encode('x', psl.data.data.polar.column[2])
        .encode('y', psl.data.data.polar.column[0])
        .style('lineWidth', 2);

      raderchart
        .point()
        .encode('x', psl.data.data.polar.column[2])
        .encode('y', psl.data.data.polar.column[0])
        .encode('shape', 'point')
        .encode('size', 3)
        .tooltip(null);

      raderchart.interaction('tooltip', { crosshairsLineDash: [4, 4] });

      await raderchart.render();




    }
  },
  watch: {
    pcode() {
      this.selected_student()
    }
  }
});
</script>
