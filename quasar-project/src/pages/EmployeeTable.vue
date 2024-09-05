<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-sm row items-start q-gutter-xs">
      <div class="my-card">
        <q-card-section class="bg-primary text-white">
          <div style="display: flex; justify-content: space-between">
            <div class="EmpoText">EMPLOYEE OFFENSE</div>
            <div
              class="q-gutter-md row"
              style="display: flex; align-items: center"
            >
              <q-input
                dark
                dense
                standout
                v-model="search"
                input-class="text-right"
                class="q-ml-md"
                style="background-color: #f3f4f7; border-radius: 0.4em"
              >
                <template v-slot:append>
                  <q-icon name="search" style="color: black"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-spinner-ball
          class="spinner"
          v-if="loading"
          size="150px"
          color="primary"
        ></q-spinner-ball>
        <OFFENSES
          v-show="showTable"
          :items="filteredDisAll"
          :columns="disColumns"
          :loading="loading"
        >
        </OFFENSES>
      </div>
    </div>
  </div>
</template>

<script>
import Offenses from "src/components/OffensesTab.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: true,
      showTable: false,
      search: "",
      disDemEmplo: [],
      disColumns: [
        { name: "IRNo", label: "IRNUMBER", align: "left", field: "IRNo" },
        {
          name: "section",
          label: "SECTION",
          align: "left",
          field: "DisciplineName",
        },
        {
          name: "viewEmp",
          label: "EMPLOYEE OFFENSES DETAILS",
          align: "left",
          field: "id",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({ getForm: "ApplyStore/getForm" }),

    filteredDisAll() {
      const { disDemEmplo, search } = this;
      let filteredData = [...disDemEmplo];
      if (search && typeof search === "string") {
        const query = search.toLowerCase();
        filteredData = filteredData.filter((item) =>
          Object.values(item).some(
            (val) =>
              typeof val === "string" && val.toLowerCase().includes(query)
          )
        );
      }
      return filteredData;
    },
  },

  mounted() {
    setTimeout(() => {
      this.showTable = true;
      this.disDemEmplo;
      this.loading = false;
    }, 3000); // Simulating 2 seconds of loading time
  },

  components: {
    OFFENSES: Offenses,
  },

  created() {
    this.getEmployeeDem();
  },

  methods: {
    async getEmployeeDem() {
      try {
        await this.$store.dispatch("ApplyStore/disEmployeeDem");
        this.disDemEmplo = this.getForm;
      } catch (error) {
        console.error("Error displaying data:", error);
      }
    },
  },
};
</script>

<style>
.my-card {
  height: 500px;
  width: 100%;
  margin-bottom: 25px;
}
.EmpoText {
  font-weight: bold;
  font-style: roboto;
  font-family: Arial Black;
  display: flex;
  color: #ffc619;
  font-size: 35px;
  justify-content: center;
}
.spinner {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 30px;
  margin-left: 45%;
}

.table-with-border {
  border-bottom: 2em solid hsl(220, 22%, 81%);
  border-collapse: collapse;
  margin-top: 25px;
}
.q-table-container {
  border-radius: 5px;
  overflow: hidden;
}
.q-table td,
.q-table th {
  padding: 8px;
  border: 0.5px solid #ccc;
  text-align: center;
}
.q-table th {
  background-color: #0f4d91;
  color: #fff;
}
.q-table tbody tr:nth-child(odd) {
  background-color: #f4f4f4;
  padding: 8px;
}
.q-table button {
  height: 30px; /* Set your desired height */
  width: 80px; /* Set your desired width */
  border-radius: 5px;
  margin: 0;
  padding: 0;
}

.EOBG {
  background-color: #ffffff;
  height: 395px;
  border: 0.2em solid #dcdddf;
}
.custom-dialog-class {
  max-width: 80vw; /* Adjust the max-width as needed */
  width: 100%;
}
</style>
