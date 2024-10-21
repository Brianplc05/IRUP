<template>
  <div id="q-app" style="min-height: 100vh; position: relative; z-index: 1">
    <div class="q-pa-sm row items-start q-gutter-xs">
      <div class="my-card">
        <div
          style="
            height: 385px;
            display: flex;
            justify-content: flex-start;
            margin-left: 25px;
          "
        >
          <AIRadialBar :series="AIchartSeries" :labels="aichartLabels" />
          <RadialBar
            :series="MDchartSeries"
            :labels="chartLabels"
            style="margin-left: 10px"
          />
        </div>
        <div style="margin-top: 15px; margin-left: 25px">
          <BarGraph :series="chartSeries" :data="chartData" />
        </div>
      </div>
    </div>
  </div>
  <img
    src="../assets/OMBRE-GRAY.jpg"
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    "
  />
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import BarGraph from "src/components/Charts/BarGraph.vue";
import RadialBar from "src/components/Charts/RadialBar.vue";
import AIRadialBar from "src/components/Charts/RadialBarTotalAction.vue";

export default defineComponent({
  name: "IndexPage",
  components: { BarGraph, RadialBar, AIRadialBar },
  data() {
    return {
      disCountSub: [],
      disdeptMatch: [],
      chartLabels: ["Match Department", "No Match Department"],
      distotalAction: [],
      aichartLabels: ["Total Action Items", "Action Done Status"],
    };
  },

  computed: {
    ...mapGetters({ getCountSubs: "ApplyStore/getCountSubs" }),
    chartSeries() {
      return [
        {
          name: "Subject Count",
          data: this.disCountSub.map((item) => item.SubjectCodeCount),
        },
      ];
    },
    chartData() {
      return this.disCountSub.map((item) => item.SubjectCode);
    },

    MDchartSeries() {
      if (this.disdeptMatch.length === 0) return [0, 0];
      const matchCount = this.disdeptMatch.reduce(
        (acc, item) => acc + item.MatchCount,
        0
      );
      const noMatchCount = this.disdeptMatch.reduce(
        (acc, item) => acc + item.NoMatchCount,
        0
      );
      return [matchCount, noMatchCount];
    },

    AIchartSeries() {
      if (this.distotalAction.length === 0) return [0, 0];
      const matchCount = this.distotalAction.reduce(
        (acc, item) => acc + item.TotalActionItems,
        0
      );
      const noMatchCount = this.distotalAction.reduce(
        (acc, item) => acc + item.ActionStatus2Count,
        0
      );
      return [matchCount, noMatchCount];
    },
  },

  created() {
    this.getCountSubject();
    this.getMatchDepartments();
    this.getTotalActions();
  },

  methods: {
    async getCountSubject() {
      try {
        await this.$store.dispatch("ApplyStore/disCountSubject");
        this.disCountSub = this.getCountSubs;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getMatchDepartments() {
      try {
        await this.$store.dispatch("ApplyStore/disMatchDepartment");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getTotalActions() {
      try {
        await this.$store.dispatch("ApplyStore/disTotalAction");
        this.distotalAction = this.getCountSubs;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
</script>

<style>
.repcards {
  background-color: #0d0d0e;
  padding: 1em;
  width: 1285px; /* Optional: set a max-width for the card */
  height: 1075px;
  margin-top: 5px;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: 500;
}
.text-caption {
  font-size: 0.9rem;
  color: #757575;
}
</style>
