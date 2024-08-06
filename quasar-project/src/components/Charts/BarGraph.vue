<template>
  <q-page>
    <q-card style="border: 0.1em solid #001e79; width: 700px; height: 450px;">
      <ApexCharts
        :type="chartOptions.chart.type"
        :options="chartOptions"
        :series="series"
      />
    </q-card>
  </q-page>
</template>

<script>
import ApexCharts from "vue3-apexcharts";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BarGraph",
  props: {
    series: {
      type: Array,
      required: true,
    },
    data: {
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
          type: "bar",
          stacked: true
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top",
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },

        xaxis: {
          labels: {
            rotate: -75,
          },
          categories: [
            "SN01", "SN02", "SN03", "SN04", "SN05",
            "SN06", "SN07", "SN08", "SN09", "SN10",
            "SN11", "SN12", "SN13", "SN14"
          ],
          tickPlacement: 'on',
          position: "bottom",
          title: {
            text: "SUBJECT OF INCIDENT",
            align: "center",
          },
          tooltip: {
            enabled: true,
          },
        },

        yaxis: {
          axisBorder: {
            show: true,
          },
          axisTicks: {
            show: true,
          },
          labels: {
            enabled: true,
            formatter: function (val) {
            return val;
          },
          },
        },
      },
    };
  },
});
</script>
