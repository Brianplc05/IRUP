<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-sm row items-start q-gutter-xs">
      <div class="my-card">
        <q-card-section
          class="bg-primary text-white"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="display: flex; align-items: center">
            <q-btn-dropdown
              push
              class="filtertab"
              icon="sort"
              dropdown-icon="change_history"
              label="FILTER STATUS "
              menu-anchor="top right"
              style="width: 25ch; padding: auto"
            >
              <q-list>
                <q-item
                  v-for="option in hrStats"
                  :key="option.value"
                  clickable
                  @click="selectStatus(option)"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class="IRHHText">INCIDENT REPORT</div>
          <div
            class="q-gutter-md row"
            style="display: flex; align-items: center"
          >
            <q-input
              dark
              dense
              standout
              v-model="searchQuery"
              input-class="text-right"
              class="q-ml-md"
              style="background-color: #f3f4f7; border-radius: 0.4em"
            >
              <template v-slot:append>
                <q-icon name="search" style="color: black"></q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-page>
          <q-spinner-ball
            class="spinner"
            v-if="loading"
            size="150px"
            color="primary"
          ></q-spinner-ball>
          <humanRTable
            v-show="showTable"
            :items="filteredDisAll"
            :columns="disColumns"
            :hrStats="hrStats"
            :getInc="getInc"
            :getQAForm="getQAForm"
            :disCod="disCod"
            :disSpeOF="disSpeOF"
            :Occurrences="Occurrences"
            :Penalty="Penalty"
            style="border-collapse: collapse"
            :loading="loading"
          />
        </q-page>
      </div>
    </div>
  </div>
</template>

<script>
import humanRTab from "components/HRTables.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: true,
      showTable: false,
      disAll: [],
      disEmployees: [],
      disColumns: [
        {
          name: "viewIR",
          label: "INCIDENT REPORT DETAILS",
          align: "left",
          field: "id",
        },
        { name: "IRNo", label: "IRNUMBER", align: "left", field: "IRNo" },
        {
          name: "departmentNumber",
          label: "INFORMANT (DEPARTMENT)",
          align: "left",
          field: "Department_Description",
        },
        {
          name: "subject",
          label: "SUBJECT OF THE INCIDENT",
          align: "left",
          field: "SubjectName",
        },
        { name: "QA", label: "QA INCHARGE", align: "left", field: "id" },
        {
          name: "lostrec",
          label: "LOST RECOVERY REQUIRED",
          align: "left",
          field: "lostRec,",
        },
        // { name: 'qaref', label: 'HR EVALUATION', align: 'left', field: 'QAReferral,' },
        {
          name: "financialLia",
          label: "PECUNIARY LIABILITY",
          align: "left",
          field: "id",
        },
        // { name: 'demerit', label: 'EMPLOYEE OFFENSE RECORD', align: 'left', field: 'id' },
        {
          name: "hrnotes",
          label: "HUMAN RESOURCES(HR) NOTE",
          align: "left",
          field: "newHRNote",
        },
        { name: "hrstatus", label: "STATUS", align: "left", field: "HRStatus" },
        // { name: 'rcastatus', label: 'RCA SUBMITTED', align: 'left', field: 'RCA'},
        // { name: 'hrdisAct', label: 'NTE REQUIRED', align: 'left', field: 'HRDicipAction' },
      ],
      hrStats: [
        { label: "OPEN", value: true },
        { label: "CLOSED", value: false },
      ],
      Occurrences: [
        { label: "1ST", value: "1ST" },
        { label: "2ND", value: "2ND" },
        { label: "3RD", value: "3RD" },
        { label: "4TH", value: "4TH" },
        { label: "5TH", value: "5TH" },
      ],
      Penalty: [
        { label: "VERBAL WARNING", value: "VERBAL WARNING" },
        { label: "WRITTEN WARNING", value: "WRITTEN WARNING" },
        { label: "SUSPENSION", value: "SUSPENSION" },
        { label: "DISMISSAL", value: "DISMISSAL" },
      ],
      disCod: [],
      disSpeOF: [],
      date: new Date(),
      selectedStatus: null,
      searchQuery: "",
      DisciplineCode: null,
      PenaltiesCode: null,
    };
  },

  computed: {
    ...mapGetters({
      getForm: "ApplyStore/getForm",
      departments: "ApplyStore/departments",
      employees: "ApplyStore/employees",
      getQAForm: "ApplyStore/getQAForm",
    }),

    filteredDisAll() {
      const { disAll, selectedStatus, searchQuery } = this;
      let filteredData = [...disAll];
      if (selectedStatus && typeof selectedStatus === "object") {
        const { value: statusValue } = selectedStatus;
        filteredData = filteredData.filter(
          (item) => item.HRStatus === statusValue
        );
      }
      if (searchQuery && typeof searchQuery === "string") {
        const query = searchQuery.toLowerCase();
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

  components: {
    humanRTable: humanRTab,
  },

  mounted() {
    setTimeout(() => {
      this.showTable = true;
      this.disAll;
      this.loading = false;
    }, 3000); // Simulating 2 seconds of loading time
  },

  created() {
    this.getInc();
    this.getCod();
    this.getSpeOf();
    this.getEmployees();
  },

  methods: {
    async getEmployees() {
      try {
        await this.$store.dispatch("ApplyStore/Employees");
        this.disEmployees = this.employees;
      } catch (error) {
        console.error("Error displaying data:", error);
      }
    },

    async getCod() {
      try {
        await this.$store.dispatch("ApplyStore/codedis");
        this.disCod = this.getForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    async getSpeOf() {
      try {
        await this.$store.dispatch("ApplyStore/speOfdis");
        this.disSpeOF = this.getForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    async getInc() {
      try {
        await this.$store.dispatch("ApplyStore/disInc");
        this.disAll = this.getForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    search() {},

    async selectStatus(option) {
      this.selectedStatus = option;
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
.filtertab {
  background-color: #0f4d91;
  font-weight: bold;
  border: 0.1em solid #f3f4f7;
  box-shadow: 0 4px 8px rgba(243, 238, 238, 0.1);
  font-style: Arial Black;
}
.IRHHText {
  font-weight: bold;
  font-style: roboto;
  font-family: Arial Black;
  display: flex;
  color: #ffc619;
  font-size: 35px;
  justify-content: center;
}

/* ///////////////////////////////////////TABLE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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
  max-width: 300px; /* Set a maximum width for cells */
  word-wrap: break-word; /* Enable word wrapping */
  white-space: normal; /* Allow the text to wrap to the next line */
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

/* ///////////////////////////////////////HRIR///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.custom-item-section {
  border: 1px solid #ccc; /* Border style */
  border-radius: 1px; /* Border radius */
  padding: 5px; /* Optional padding */
}
.HRVDia {
  background-color: #ffffff;
  max-height: 100%; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #dcdddf;
}
.HRVHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 85px;
  width: 100%;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.HRVText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  flex: 1;
  color: #ffc619;
  font-size: 25px;
}
.HRVBC {
  display: flex;
}
.HRVList {
  height: 15%;
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}
.HRVGT {
  font-weight: bold;
  display: flex;
  color: #ffc619;
  font-size: 20px;
  justify-content: center;
}
.HRDes {
  padding: 8px;
  margin-top: 5px;
  width: 98%;
  font-size: 15px;
  border: 0.1em solid #cacaca;
}

/* ///////////////////////////////////////HRDISACTION ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.HRDA {
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.HRDAText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}

/* ///////////////////////////////////////DEMERIT///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.HRDE {
  width: 500px;
  background-color: #ffffff;
  border: 0.2em solid #f3f4f7;
  font-weight: bold;
  font-style: Arial Black;
}
.HRDHead {
  height: 70px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.HRDText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}
.HRDEH {
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
  height: 40px;
  padding: 1px;
  display: flex;
  align-items: center;
}
.HRDEHText {
  font-weight: bold;
  color: #ffc619;
  margin-left: 20px;
  font-size: 18px;
  flex: 1;
  justify-content: center;
}

/* ///////////////////////////////////////HRNOTE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.HRNT {
  background-color: #ffffff;
  height: 320px;
  width: 560px;
  border: 0.2em solid #f3f4f7;
}
.HRNHead {
  height: 70px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.HRNText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  flex: 1;
  color: #ffc619;
  font-size: 25px;
}

/* ///////////////////////////////////////HRSTATUS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.HRHS {
  height: 8HRNT5px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.HRHSTest {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}

/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.spinner {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 100px;
  margin-left: 45%;
}

/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.non-transparent-dialog {
  background-color: white; /* Change to the desired background color */
}

.centered-card {
  width: 450px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  color: #dfe8f0;
  align-items: center;
}

.please-wait {
  margin-top: 10px;
  font-style: roboto;
  font-weight: bold;
  font-size: 20px;
  color: #ffc619;
  display: flex;
}
</style>
