<template>
  <q-page>
    <q-card style="border: 0.1em solid #001e79;width: 415px; height: 380px;">
      <div class="text-h5" style="text-align-last:center; padding: 10px;">DEPARTMENT INVOLMENT STATUS</div>
      <ApexCharts
        :type="chartOptions.chart.type"
        :options="chartOptions"
        :series="series"
        :labels="labels"
        style="width: 370px; height: 200px; margin-left: 15px;"
      />
      <div class="text-caption" style="text-align-last:center;">Description Goes Here</div>
    </q-card>
  </q-page>
</template>

<script>
import ApexCharts from "vue3-apexcharts";
import { defineComponent } from "vue";

export default defineComponent({
  name: "RadialBar",
  props: {
    series: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
  },
  components: {
    ApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '25%',
              background: 'transparent',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: true,
                fontSize: '25px',
              }
            },
            barLabels: {
              enabled: true,
              useSeriesColors: true,
              margin: 8,
              fontSize: '16px',
              formatter: function(seriesName){
                return seriesName + ":  "
              }
            },
            track: {
              background: '#d5d7da', // color for border
              strokeWidth: '100%', // width of the border
            },
          }
        },
        colors: ['#0F4D91', '#FFC619'],
        labels: ['Match Department', 'NoMatch Department'],
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }]
      }
    }
  }
});
</script>
