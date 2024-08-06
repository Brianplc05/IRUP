<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-sm row items-start q-gutter-xs">
      <div class="my-card">
          <q-card-section class="bg-primary text-white" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              <q-btn-dropdown
                push
                class="filtertab"
                icon="sort"
                dropdown-icon="change_history"
                label="FILTER STATUS "
                menu-anchor="top right"
                style="width: 25ch; padding: auto;"
              >
                <q-list>
                  <q-item v-for="option in qaStats" :key="option.value" clickable @click="selectStatus(option)">
                    <q-item-section>{{ option.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div class="IRQHText">INCIDENT REPORT </div>
            <div class="q-gutter-md row" style="display: flex; align-items: center;">
              <q-input dark dense standout v-model="searchQuery" input-class="text-right" class="q-ml-md" style="background-color: #f3f4f7; border-radius: 0.4em;">
                <template v-slot:append>
                  <q-icon name="search" style="color:black"></q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-page>
            <q-spinner-ball class="spinner" v-if="loading" size="150px" color="primary"></q-spinner-ball>
            <QATables
              v-show="showTable"
              :items="filteredDisAll"
              :columns="disColumns"
              :getInc="getInc"
              :getQAForm="getQAForm"
              :disQA="disQA"
              :disDept="disDept"
              :rcaStats="rcaStats"
              :qaStats="qaStats"
              :lostStatus="lostStatus"
              style="border-collapse: collapse;"
              :loading="loading"
            />
          </q-page>
      </div>
    </div>
  </div>
</template>


<script>
import QATab from '../components/QATable.vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
      showTable: false,
      selectedStatus: null,
      searchQuery: '',
      disAllQA: [],
      disColumns: [
        { name: 'viewIR', label: 'INCIDENT REPORT DETAILS', align: 'left', field: 'id' },
        { name: 'IRNo', label: 'IRNUMBER', align: 'left', field: 'IRNo' },
        { name: 'departmentNumber', label: 'INFORMANT (DEPARTMENT)', align: 'left', field: 'Department_Description'},
        { name: 'subject', label: 'SUBJECT OF THE INCIDENT', align: 'left', field: 'SubjectName' },
        { name: 'QA', label: 'QA INCHARGE', align: 'left', field: 'id' },
        { name: 'rcaStat', label: 'ROOT CAUSE ANALYSIS (RCA)', align: 'left', field: 'RCA_Status'},
        { name: 'involvedDept', label: 'DEPARTMENT INVOLVED', align: 'left', field: 'id' },
        { name: 'lostrec', label: 'LOST RECOVERY REQUIRED', align: 'left', field: 'lostRec,' },
        { name: 'rcastatus', label: 'RCA SUBMISSION STATUS', align: 'left', field: 'RCA'},
        { name: 'actionitems', label: 'ACTION ITEM COMPLETIONS', align: 'left', field: 'id' },
        { name: 'remarks', label: 'STATUS', align: 'left', field: 'id' },
        { name: 'qastatus', label: 'QA SIGN OFF ', align: 'left', field: 'QAStatus'}
      ],
      disDept: [],
      rcaStats: [
        { label: 'PENDING', value: '1' },
        { label: 'SUBMITTED', value: '0' },
        { label: 'NOT APPLICABLE', value: '3' }
      ],
      qaStats: [
        { label: 'OPEN', value: true },
        { label: 'CLOSED', value: false },
      ],
      lostStatus: [
        { label: 'YES', value: '1' },
        { label: 'NO', value: '2' },
      ],
      disQA: [],
    };
  },

  computed: {
    ...mapGetters({ getQAForm: 'ApplyStore/getQAForm', departments: 'ApplyStore/departments', getQA: 'ApplyStore/getQA'}),

    filteredDisAll() {
        const { disAllQA, selectedStatus, searchQuery } = this;
        let filteredData = [...disAllQA];
        if (selectedStatus && typeof selectedStatus === 'object') {
          const { value: statusValue } = selectedStatus;
          filteredData = filteredData.filter(item => item.QAStatus === statusValue);
        }
        if (searchQuery && typeof searchQuery === 'string') {
          const query = searchQuery.toLowerCase();
          filteredData = filteredData.filter(item =>
            Object.values(item).some(val =>
              typeof val === 'string' && val.toLowerCase().includes(query)
            )
          );
        }
        return filteredData;
      }
  },

  mounted() {
    setTimeout(() => {
      this.showTable = true;
      this.disAllQA;
      this.loading = false;
    }, 3000); // Simulating 2 seconds of loading time
  },

  components: {
    'QATables': QATab
  },

  created() {
    this.getInc();
    this.getDet();
    this.getQAtrans();

  },

  methods: {
  async getDet() {
        try {
          await this.$store.dispatch('ApplyStore/departments');
          this.disDept = this.departments;
        } catch (error) {
          console.error('Error displaying data:', error);
        }
    },

  async getQAtrans() {
        try {
          await this.$store.dispatch('ApplyStore/disQAs');
          this.disQA = this.getQA;
        } catch (error) {
          console.error('Error displaying data:', error);
        }
    },

  async getInc() {
      try {
        await this.$store.dispatch("ApplyStore/disIncQA");
        this.disAllQA = this.getQAForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

  search() {
    },

    async selectStatus(option) {
    this.selectedStatus = option;
    },
  }
}
</script>

<style>
/* ///////////////////////////////////////QAHEADER////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.my-card {
  height: 500px;
  width: 100%;
  margin-bottom: 25px;
}
.filtertab{
  background-color: #0F4D91;
  font-weight: bold;
}
.IRQHText{
  font-weight: bold;
  font-style: roboto;
  font-family: Arial Black;
  display: flex;
  color: #FFC619;
  font-size: 35px;
  justify-content: center;
}

.spinner{
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
  max-width: 300px; /* Set a maximum width for cells */
  word-wrap: break-word; /* Enable word wrapping */
  white-space: normal; /* Allow the text to wrap to the next line */
}
.q-table th {
  background-color: #0F4D91;
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
.QADialog{
  background-color: #ffffff;
  max-height: 100%; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.QAIR{
  height: 85px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QAText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.QAlist {
  height: 15%;
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}
.QADes {
  padding: 8px;
  margin-top: 5px;
  width: 98%;
  font-size: 15px;
  border: 0.1em solid #cacaca;
}
.QATextlist{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
}

/* ///////////////////////////////////////QA INCHARGE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
.QAIC{
  height: 230px;
  width: 430px;
  background-color: #ffffff;
  border: 0.2em solid #f3f4f7;
}
.QAICHead{
  height: 65px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.5em solid #d5d7da;
}
.QAICText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
/* ///////////////////////////////////////RCA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QADeptIn{
  height: 580px;
  width: 550px;
}
.footer-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white; /* or any color to match the card */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid #d5d7da;
}
.q-card-section {
  flex: 1;
  overflow-y: auto;
}
.QADHead{
  height: 85px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QADText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.QADTestlist{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
  margin-left: 10px;
}
.QADLay{
  height: 35px;
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}
.QACon{
  background-color: #ffffff;
  height: 380px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  width: 550px;
  border: 0.2em solid #f3f4f7;
}
.QAHeadCon{
  height: 20%;
  width: 100%;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QACText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  flex: 1;
  color: #FFC619;
  font-size: 25px;
}

/* ///////////////////////////////////////RCA Submitted////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QARCA{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QARText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.QCRCA{
  background-color: #ffffff;
  height: 350px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  width: 550px;
  border: 0.2em solid #f3f4f7;
}
.QCRHead{
  height: 80px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QCRText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  flex: 1;
  color: #FFC619;
  font-size: 25px;
}


/* ///////////////////////////////////////RCA APPROVED////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QCRCApproved{
  background-color: #ffffff;
  height: 460px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.QAPApproved{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QAPText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
}
.QAPTestlist{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
  margin-left: 10px;
}
.QAPLay{
  height: 35px;
  width: 100%;
  margin-top: 10px;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}

.action-item {
  margin-top: 8px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}

/* ///////////////////////////////////////QA RECOMMENDATION////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QARECOM{
  background-color: #ffffff;
  height: 200px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  width: 30%;
  border: 0.2em solid #f3f4f7;
}
.QAREC{
  height: 70px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QARECText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.acfooter-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white; /* or any color to match the card */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid #d5d7da;
}

/* ///////////////////////////////////////ACTION ITEMS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QAACT{
  background-color: #ffffff;
  border: 0.2em solid #f3f4f7;
}
.QAACTHead{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QAACText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.QAACTABLE {
    border: 1px solid #ccc; /* Border style */
    border-radius: 1px; /* Border radius */
    padding: 10px; /* Optional padding */
    font-size: 15px;
    font-style: Arial Black;
}
.QAACTabtext{
  font-size: 18px;
}

.QAACStatus{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QAACSText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

/* ///////////////////////////////////////QA STATUS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.QAStatus{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.QASText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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
  color: #FFC619;
  display: flex;
}
.green-text {
  color: green;
}
.red-text {
  color: red;
}
</style>
