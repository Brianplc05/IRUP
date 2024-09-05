<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md row items-start">
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
              class="filtertab"
              icon="filter_list"
              label="DEMERIT TABLE"
              menu-anchor="top right"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="onItemClick('employee')"
                >
                  <q-item-section>
                    <q-item-label>EMPLOYEE DEMERIT</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-close-popup
                  @click="onItemClick('department')"
                >
                  <q-item-section>
                    <q-item-label>DEPARTMENT DEMERIT</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class="textDem">DEMERIT REPORT</div>
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
              style="
                background-color: #024089;
                border: 0.2em solid #f3f4f7;
                border-radius: 0.5em;
              "
            >
              <template v-slot:append>
                <q-icon name="search"></q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <!-- ////////////////////////////////////////////DEMERITTABLE////////////////////////////////////////// -->
        <div class="my-card1">
          <q-table
            v-if="showTable && selectedOption === 'employee'"
            :rows="disEmplo"
            :columns="disEmploColumns"
          />

          <q-table
            v-if="showTable && selectedOption === 'department'"
            :rows="disAllDepartment"
            :columns="disColumnsDepartment"
          />
        </div>
        <!-- ////////////////////////////////////////////DEMERITTABLE////////////////////////////////////////// -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchQuery: "",
      disEmplo: [],
      disEmploColumns: [
        { name: "IRNo", label: "IR NUMBER", align: "left", field: "IRNo" },
        {
          name: "employeeCode",
          label: "EMPLOYEE NUMBER",
          align: "left",
          field: "employeeCode",
        },
        {
          name: "PenaltiesCode",
          label: "PENALTIES",
          align: "left",
          field: "PenaltiesName",
        },
      ],
      disAllDepartment: [],
      disColumnsDepartment: [
        {
          name: "Department_Description",
          label: "DEPARTMENT NAME",
          align: "left",
          field: "Department_Description",
        },
        {
          name: "demerits",
          label: "DEMERITS",
          align: "left",
          field: "totalDemerits",
        },
      ],
      showTable: false,
      selectedOption: "",
    };
  },

  computed: {
    ...mapGetters({ getForm: "ApplyStore/getForm" }),

    filteredDisAll() {
      const { disEmplo, disAllDepartment, searchQuery } = this;
      let allData = [...disEmplo, ...disAllDepartment];

      if (searchQuery && typeof searchQuery === "string") {
        const query = searchQuery.toLowerCase();
        allData = allData.filter((item) =>
          Object.values(item).some(
            (val) =>
              typeof val === "string" && val.toLowerCase().includes(query)
          )
        );
      }

      return allData;
    },
  },

  created() {
    this.getEmployee();
    this.getDepartment();
  },

  methods: {
    search() {},

    onItemClick(option) {
      this.selectedOption = option;
      this.showTable = true;
    },

    async getEmployee() {
      try {
        await this.$store.dispatch("ApplyStore/disEmpTab");
        this.disEmplo = this.getForm;
      } catch (error) {
        console.error("Error displaying data:", error);
      }
    },

    async getDepartment() {
      try {
        await this.$store.dispatch("ApplyStore/disDepTab");
        this.disAllDepartment = this.getForm;
      } catch (error) {
        console.error("Error displaying data:", error);
      }
    },
  },
};
</script>

<style>
.my-card {
  height: 600px;
  width: 100%;
}
.my-card1 {
  height: 300px;
  width: 100%;
  color: #f3f4f7;
}
.filtertab {
  background-color: #0f4d91;
  font-weight: bold;
  border: 0.1em solid #f3f4f7;
  box-shadow: 0 4px 8px rgba(243, 238, 238, 0.1);
  font-style: Arial Black;
}
.filtertab {
  background-color: #0f4d91;
  font-weight: bold;
  border: 0.2em solid #f3f4f7;
  box-shadow: 0 4px 8px rgba(243, 238, 238, 0.1);
  font-style: Arial Black;
}
.text1 {
  font-weight: bold;
  font-style: Arial Black;
  display: flex;
  font-size: 25px;
  justify-content: space-between;
}
.textDem {
  font-weight: bold;
  font-family: Arial Black;
  display: flex;
  color: #ffc619;
  font-size: 35px;
  justify-content: space-between;
}
.q-table-container {
  border-radius: 5px;
  overflow: hidden;
}

.q-table td,
.q-table th {
  padding: 5px;
  border: 1px solid #ccc;
  text-align: center;
}

.q-table th {
  background-color: #0f4d91;
  color: #fff;
}

.q-table tbody tr:nth-child(odd) {
  background-color: #f4f4f4;
  padding: 5px;
}
</style>
