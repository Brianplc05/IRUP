<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-sm row items-start q-gutter-xs">
      <div class="my-card">
          <q-card-section class="bg-primary text-white" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="IRQHText">INCIDENT REPORT </div>
            <div class="q-gutter-md row" style="display: flex; align-items: center;">
              <q-input dark dense standout v-model="searchContent" input-class="text-right" class="q-ml-md" style="background-color: #f3f4f7; border-radius: 0.4em;">
                <template v-slot:append>
                  <q-icon name="search" style="color:black"></q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
            <q-spinner-ball class="spinner" v-if="loading" size="150px" color="primary"></q-spinner-ball>
            <q-table
              v-show="showTable"
              :rows="filteredDisAll"
              :columns="disColumns"
              row-key="IRNo"
              :pagination="{ rowsPerPage: filteredDisAll.length }"
              :loading="loading"
              hide-bottom
            />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
      showTable: false,
      selectedStatus: null,
      searchContent: '',
      disAllDash: [],
      disColumns: [
        { name: 'IRNo', label: 'IRNUMBER', align: 'left', field: 'IRNo' },
        { name: 'departmentNumber', label: 'INFORMANT (DEPARTMENT)', align: 'left', field: 'Department_Description'},
        { name: 'subject', label: 'SUBJECT OF THE INCIDENT', align: 'left', field: 'SubjectName' },
      ],
    };
  },

  computed: {
    ...mapGetters({ getDash: 'ApplyStore/getDash' }),

    filteredDisAll() {
        const { disAllDash, searchContent } = this;
        let filteredData = [...disAllDash];
        if (searchContent && typeof searchContent === 'string') {
          const query = searchContent.toLowerCase();
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
      this.disAllDash;
      this.loading = false;
    }, 2000); // Simulating 2 seconds of loading time
  },

  created() {
    this.getDashboards();
  },

  methods: {

  async getDashboards() {
      try {
        await this.$store.dispatch("ApplyStore/disDashboard");
        this.disAllDash = this.getDash;
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
  border: 0.1em solid #f3f4f7;
  box-shadow: 0 4px 8px rgba(243, 238, 238, 0.1);
  font-style: Arial Black;
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
</style>
