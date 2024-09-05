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
          <div class="IRQHText">INCIDENT REPORT</div>
          <div
            class="q-gutter-md row"
            style="display: flex; align-items: center"
          >
            <q-input
              dark
              dense
              standout
              v-model="searchContent"
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

        <q-spinner-ball
          class="spinner"
          v-if="loading"
          size="150px"
          color="primary"
        ></q-spinner-ball>

        <AssistantQATable
          v-show="showTable"
          :rows="filteredDisAll"
          :columns="disColumns"
          row-key="IRNo"
          :loading="loading"
          :getAssistantQAs="getAssistantQAs"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AssistantQATab from "../components/AssistantQATable.vue";

export default {
  data() {
    return {
      loading: true,
      showTable: false,
      selectedStatus: null,
      searchContent: "",
      disAllAssistantQA: [],
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
          name: "division",
          label: "DIVISION",
          align: "left",
          field: "Division",
        },
        {
          name: "subject",
          label: "SUBJECT OF THE REPORTABLE INCIDENT",
          align: "left",
          field: "SubjectCode",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      getAssistantQA: "ApplyStore/getAssistantQA",
      getGoogleUser: "ApplyStore/getGoogleUser",
      loggedInUser: "ApplyStore/getUser",
    }),

    filteredDisAll() {
      const { disAllAssistantQA, searchContent } = this;
      let filteredData = [...disAllAssistantQA];
      if (searchContent && typeof searchContent === "string") {
        const query = searchContent.toLowerCase();
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
      this.disAllAssistantQA;
      this.loading = false;
    }, 2000); // Simulating 2 seconds of loading time
  },

  created() {
    this.getAssistantQAs();
  },

  components: {
    AssistantQATable: AssistantQATab,
  },

  methods: {
    async getAssistantQAs() {
      try {
        await this.$store.dispatch("ApplyStore/disAssistantQA");
        this.disAllAssistantQA = this.getAssistantQA;
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
/* ///////////////////////////////////////QAHEADER////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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
.IRQHText {
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
  margin-top: 100px;
  margin-left: 45%;
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

/* ///////////////////////////////////////IRDETAILS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.custom-item-section {
  border: 1px solid #ffffff; /* Border style */
  border-radius: 1px; /* Border radius */
  padding: 5px; /* Optional padding */
}
.AQADialog {
  background-color: #ffffff;
  max-height: 100%; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.AQAIR {
  height: 80px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.AQAText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}
.AQAlist {
  height: 15%;
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}
.AQADes {
  padding: 8px;
  margin-top: 5px;
  width: 98%;
  font-size: 15px;
  border: 0.1em solid #cacaca;
}
.AQATextlist {
  font-weight: bold;
  display: flex;
  color: #ffc619;
  font-size: 20px;
  justify-content: center;
}

/* ///////////////////////////////////////CHANGE DIVISION CODE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.DivisionHD {
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.DivisionText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}

/* ///////////////////////////////////////CHANGE SUBJECT CODE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.AQACHANGE {
  height: 150px;
  width: 450px;
}

.footer-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white; /* or any color to match the card */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid #d5d7da;
}

/* ///////////////////////////////////////LOADING////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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

/* ////////////////////////////////////////////////////////////////////DIALOG LOADING/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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
