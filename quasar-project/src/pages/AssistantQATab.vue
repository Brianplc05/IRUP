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

        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
        <q-card-section
          class="bg-primary"
          style="border-top: 0.1em solid #d5d7da"
        >
          <div class="text-right">
            <q-btn
              @click="content"
              :ripple="{ center: true }"
              icon="add_card"
              color="accent"
              label="REPORTABLE INCIDENT & RISK DICTIONARY"
              class="text-black text-bold text-center shadow-5"
              style="width: 370px"
            />
          </div>

          <q-dialog maximized v-model="FullContent" persistent>
            <q-card class="RERDialog">
              <q-card-section class="AAstIR">
                <div class="row items-center justify-between">
                  <div class="AAstText">
                    REPORTABLE INCIDENT & RISK DICTIONARY
                  </div>
                  <q-btn
                    style="margin-left: 5px"
                    round
                    push
                    icon="close"
                    class="bg-accent text-black"
                    @click="FullContent = false"
                    v-close-popup
                  />
                </div>
              </q-card-section>
              <q-card-section>
                <div class="q-gutter-y-md" full-width>
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      dense
                      class="text-primary bg-warning"
                      active-color="primary"
                      indicator-color="primary"
                      align="justify"
                    >
                      <q-tab
                        style="font-size: larger; border: 0.5px solid #f3f4f7"
                        name="repIncident"
                        label="REPORTABLE INCIDENT DETAILS"
                      ></q-tab>
                      <q-tab
                        style="font-size: larger; border: 0.5px solid #f3f4f7"
                        name="riskDic"
                        label="RISK DICTIONARY"
                      ></q-tab>
                    </q-tabs>

                    <q-separator></q-separator>

                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="repIncident">
                        <div class="row justify-between">
                          <div>
                            <q-btn-dropdown
                              v-model="dropdownOpen2"
                              push
                              class="filtertab"
                              dense
                              icon="sort"
                              text-color="white"
                              dropdown-icon="change_history"
                              label="FILTER RISK DOMAIN"
                              style="width: 30ch; height: 44px"
                            >
                              <q-list>
                                <q-item
                                  v-for="option in disAllDomain"
                                  :key="option.DomainCode"
                                  clickable
                                  @click="selectSubjectCode(option)"
                                >
                                  <q-item-section>
                                    {{ option.RiskDomain }}
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-btn-dropdown>
                          </div>
                          <div>
                            <q-input
                              color="secondary"
                              label-color="secondary"
                              outlined
                              dense
                              v-model="search"
                              label="SEARCH"
                              style="width: 35ch; height: 44px; margin-top: 2px"
                            >
                              <template v-slot:append>
                                <q-icon name="search" color="secondary" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <q-card-section
                          class="bg-secondary row justify-end"
                          style="
                            border-top: 0.1em solid #d5d7da;
                            margin-top: 15px;
                          "
                        >
                          <q-btn
                            @click="subjectIncident"
                            :ripple="{ center: true }"
                            icon="add_card"
                            color="accent"
                            label="REPORTABLE INCIDENT"
                            class="text-black text-bold text-center shadow-5"
                            style="width: 220px"
                          />
                          <q-dialog v-model="SubIncident" persistent>
                            <q-card
                              class="bg-warning"
                              style="height: 63%; width: 40%"
                            >
                              <q-card-section
                                class="bg-accent"
                                style="height: 13%"
                              >
                                <div class="RiskText">
                                  ADD REPORTABLE INCIDENT
                                </div>
                              </q-card-section>
                              <q-card-section class="q-gutter-md">
                                <q-input
                                  square
                                  outlined
                                  v-model="SubjectName"
                                  label-slot
                                >
                                  <template v-slot:label
                                    >REPORTABLE INCIDENT
                                    <span class="text-red">*</span></template
                                  >
                                </q-input>
                                <q-select
                                  outlined
                                  use-input
                                  clearable
                                  v-model="SubjectRiskCode"
                                  label-slot
                                  :options="disAllRisk"
                                  @filter="FilterFn"
                                  emit-value
                                  map-options
                                  :option-value="(option) => option"
                                  :option-label="(option) => option.Risk"
                                >
                                  <template v-slot:label>
                                    RISK CODE
                                    <span class="text-red">*</span>
                                  </template>
                                </q-select>
                                <q-select
                                  use-input
                                  square
                                  outlined
                                  v-model="EmployeeCode"
                                  :options="disQA"
                                  label-slot
                                  emit-value
                                  map-options
                                  :option-value="
                                    (option) => option.EmployeeCode
                                  "
                                  :option-label="(option) => option.FullName"
                                >
                                  <template v-slot:label
                                    >QA INCHARGE
                                    <span class="text-red">*</span></template
                                  >
                                </q-select>
                                <q-select
                                  v-model="SubjectPolicy"
                                  @new-value="createValue"
                                  label="POLICY"
                                  square
                                  outlined
                                  multiple
                                  use-input
                                  use-chips
                                  hide-dropdown-icon
                                />
                                <q-select
                                  use-input
                                  square
                                  outlined
                                  v-model="SecondaryQA"
                                  :options="disQA"
                                  label="SECONDARY QA"
                                  emit-value
                                  map-options
                                  :option-value="
                                    (option) => option.EmployeeCode
                                  "
                                  :option-label="(option) => option.FullName"
                                />
                              </q-card-section>
                              <q-card-actions
                                align="right"
                                class="footer-actions"
                              >
                                <q-btn
                                  push
                                  label="CANCEL"
                                  @click="onCancelRisk"
                                  color="secondary"
                                  class="button1"
                                ></q-btn>
                                <q-btn
                                  push
                                  label="SAVE"
                                  @click="submitRisk"
                                  color="accent text-black"
                                  class="button1"
                                ></q-btn>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>

                          <q-dialog
                            v-model="waiting"
                            persistent
                            content-class="non-transparent-dialog"
                          >
                            <div class="risk-card">
                              <q-card-section>
                                <div class="spinner-container">
                                  <q-spinner-facebook
                                    size="200px"
                                  ></q-spinner-facebook>
                                  <div class="risk-wait">
                                    Doing something. Please wait...
                                  </div>
                                </div>
                              </q-card-section>
                            </div>
                          </q-dialog>
                        </q-card-section>

                        <div>
                          <q-markup-table class="custom-q-table">
                            <thead>
                              <tr>
                                <th
                                  v-for="column in disSubColumns"
                                  :key="column.name"
                                  class="custom-header"
                                >
                                  {{ column.label }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="row in filteredDisSub" :key="row.id">
                                <td
                                  v-for="column in disSubColumns"
                                  :key="column.name"
                                  class="custom-cell"
                                >
                                  {{ row[column.field] }}
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>
                        </div>
                      </q-tab-panel>

                      <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                      <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                      <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

                      <q-tab-panel name="riskDic">
                        <div class="row justify-between">
                          <div>
                            <q-btn-dropdown
                              v-model="dropdownOpen"
                              push
                              class="filtertab"
                              dense
                              icon="sort"
                              text-color="white"
                              dropdown-icon="change_history"
                              label="FILTER RISK DOMAIN"
                              style="width: 30ch; height: 44px"
                            >
                              <q-list>
                                <q-item
                                  v-for="option in disAllDomain"
                                  :key="option.DomainCode"
                                  clickable
                                  @click="selectRickDics(option)"
                                >
                                  <q-item-section>
                                    {{ option.RiskDomain }}
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-btn-dropdown>
                          </div>
                          <div>
                            <q-input
                              color="secondary"
                              label-color="secondary"
                              outlined
                              dense
                              v-model="searchRisk"
                              label="SEARCH"
                              style="width: 35ch; height: 44px; margin-top: 2px"
                            >
                              <template v-slot:append>
                                <q-icon name="search" color="secondary" />
                              </template>
                            </q-input>
                          </div>
                        </div>

                        <q-card-section
                          class="bg-secondary row justify-end"
                          style="
                            border-top: 0.1em solid #d5d7da;
                            margin-top: 15px;
                          "
                        >
                          <q-btn
                            @click="riskDisctionary"
                            :ripple="{ center: true }"
                            color="accent"
                            icon="edit_square"
                            label="CREATE RISK"
                            class="text-black text-bold text-center shadow-5"
                            style="width: 10%"
                          />

                          <q-dialog v-model="RiskDictionary" persistent>
                            <q-card
                              class="bg-warning"
                              style="height: 60%; width: 40%"
                            >
                              <q-card-section
                                class="bg-accent"
                                style="height: 13%"
                              >
                                <div class="RiskText">ADD RISK DICTIONARY</div>
                              </q-card-section>

                              <q-card-section class="q-gutter-md">
                                <q-input
                                  square
                                  outlined
                                  v-model="DomainCode"
                                  label="DOMAIN CODE "
                                  class="text-uppercase"
                                  hint="*FORMANT: [ST-01]"
                                ></q-input>
                                <q-input
                                  square
                                  outlined
                                  v-model="RiskDomain"
                                  label="RISK DOMAIN"
                                ></q-input>
                                <q-input
                                  square
                                  outlined
                                  v-model="Risk"
                                  label="RISK"
                                ></q-input>
                                <q-input
                                  square
                                  outlined
                                  autogrow
                                  v-model="RiskDescription"
                                  label="RISK DESCRIPTION"
                                ></q-input>
                              </q-card-section>

                              <q-card-actions
                                align="right"
                                class="footer-actions"
                              >
                                <q-btn
                                  push
                                  label="CANCEL"
                                  @click="onCancelRiskDic"
                                  color="secondary"
                                  class="button1"
                                ></q-btn>
                                <q-btn
                                  push
                                  label="SAVE"
                                  @click="submitRiskDic"
                                  color="accent text-black"
                                  class="button1"
                                ></q-btn>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                          <q-dialog
                            v-model="waiting"
                            persistent
                            content-class="non-transparent-dialog"
                          >
                            <div class="risk-card">
                              <q-card-section>
                                <div class="spinner-container">
                                  <q-spinner-facebook
                                    size="200px"
                                  ></q-spinner-facebook>
                                  <div class="risk-wait">
                                    Doing something. Please wait...
                                  </div>
                                </div>
                              </q-card-section>
                            </div>
                          </q-dialog>
                        </q-card-section>

                        <div>
                          <q-markup-table class="custom-q-table">
                            <thead>
                              <tr>
                                <th
                                  v-for="column in disRiskDicColumns"
                                  :key="column.name"
                                  class="custom-header"
                                >
                                  {{ column.label }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="row in filteredDisRiskDic"
                                :key="row.id"
                              >
                                <td
                                  v-for="column in disRiskDicColumns"
                                  :key="column.name"
                                  class="custom-cell"
                                >
                                  {{ row[column.field] }}
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>
                        </div>
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card-section>
        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
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
      ///////////////////////////////////////////////////////////////////////////////

      FullContent: false,
      tab: "repIncident",
      dropdownOpen2: false,
      search: "",
      selectedSubject: null,
      SubIncident: false,
      isAddRiskOpen: true,
      isRiskDetailsOpen: false,

      SubjectName: "",
      SubjectRiskCode: "",
      disAllDomain: [],
      disQA: [],
      SubjectPolicy: [],
      EmployeeCode: "",
      SecondaryQA: "",
      waiting: false,

      disAllSubject: [],
      disSubColumns: [
        {
          name: "domain",
          label: "RISK DOMAIN",
          align: "left",
          field: "RiskDomain",
        },
        { name: "risk", label: "RISK", align: "left", field: "Risk" },
        {
          name: "description",
          label: "RISK DESCRIPTION",
          align: "left",
          field: "RiskDescription",
        },
        {
          name: "subjectcode",
          label: "REPORTABLE INCIDENT CODE",
          align: "left",
          field: "SubjectCode",
        },
        {
          name: "subject",
          label: "REPORTABLE INCIDENT",
          align: "left",
          field: "SubjectName",
        },
        { name: "qa", label: "QA INCHARGE", align: "left", field: "QAName" },
      ],

      ///////////////////////////////////////////////////////////////////////////////

      dropdownOpen: false,
      searchRisk: "",
      selectedRiskDomain: null,
      RiskDictionary: false,
      isRiskDicOpen: false,
      isAddRiskDicOpen: false,

      DomainCode: "",
      RiskDomain: "",
      Risk: "",
      RiskDescription: "",

      disAllRisk: [],
      disRiskDicColumns: [
        {
          name: "domain",
          label: "RISK DOMAIN",
          align: "left",
          field: "RiskDomain",
        },
        {
          name: "riskCode",
          label: "RISK CODE",
          align: "left",
          field: "RiskCode",
        },
        { name: "risk", label: "RISK", align: "left", field: "Risk" },
        {
          name: "description",
          label: "RISK DESCRIPTION",
          align: "left",
          field: "RiskDescription",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      getAssistantQA: "ApplyStore/getAssistantQA",
      getGoogleUser: "ApplyStore/getGoogleUser",
      loggedInUser: "ApplyStore/getUser",
      getQA: "ApplyStore/getQA",
      getRisk: "ApplyStore/getRisk",
      getSubject: "ApplyStore/getSubject",
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

    filteredDisSub() {
      const { disAllSubject, selectedSubject, search } = this;
      let filteredSub = [...disAllSubject];

      if (selectedSubject && typeof selectedSubject === "object") {
        const { DomainCode: statusValue } = selectedSubject;
        filteredSub = filteredSub.filter(
          (item) => item.DomainCode === statusValue
        );
      }

      if (search && typeof search === "string") {
        const query = search.toLowerCase();
        filteredSub = filteredSub.filter((item) =>
          Object.values(item).some(
            (val) =>
              typeof val === "string" && val.toLowerCase().includes(query)
          )
        );
      }
      return filteredSub;
    },

    filteredDisRiskDic() {
      const { disAllRisk, selectedRiskDomain, searchRisk } = this;
      let filteredRisk = [...disAllRisk];

      if (selectedRiskDomain && typeof selectedRiskDomain === "object") {
        const { DomainCode: statusValue } = selectedRiskDomain;
        filteredRisk = filteredRisk.filter(
          (item) => item.DomainCode === statusValue
        );
      }

      if (searchRisk && typeof searchRisk === "string") {
        const query = searchRisk.toLowerCase();
        filteredRisk = filteredRisk.filter((item) =>
          Object.values(item).some(
            (val) =>
              typeof val === "string" && val.toLowerCase().includes(query)
          )
        );
      }

      return filteredRisk;
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
    this.getDomainOption();
    this.getSubjecttab();
    this.getQAtrans();
    this.getRiskTable();
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

    async selectStatus(option) {
      this.selectedStatus = option;
    },

    /* ////////////////////////////////////////////////////////////////////////REPORTABLE AND RISK////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

    /* ////////////////////////////////////////////////////// REPORTABLE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

    content() {
      this.FullContent = true;
    },

    async selectSubjectCode(option) {
      this.selectedSubject = option;
      this.dropdownOpen2 = false; // Close the dropdown
    },

    async getDomainOption() {
      try {
        await this.$store.dispatch("ApplyStore/disDomainCode");
        this.disAllDomain = this.getRisk;
      } catch (error) {
        console.error("Error Displaying data:", error);
      }
    },

    async getSubjecttab() {
      try {
        await this.$store.dispatch("ApplyStore/disSubjectTab");
        console.log(this.getSubject);
        this.disAllSubject = this.getSubject;
      } catch (error) {
        console.error("Error Displaying data:", error);
      }
    },

    subjectIncident() {
      this.SubIncident = true;
    },

    FilterFn(val, update) {
      if (val === "") {
        update(() => {
          this.disAllRisk = this.getRisk;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.disAllRisk = this.getRisk.filter((option) => {
          return option.Risk.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    async getQAtrans() {
      try {
        await this.$store.dispatch("ApplyStore/disQAs");
        this.disQA = this.getQA;
      } catch (error) {
        console.error("Error displaying data:", error);
      }
    },

    createValue(val, done) {
      this.SubjectPolicy.push(val);
      done(val, "add-unique");
    },

    onCancelRisk() {
      this.SubjectName = "";
      this.SubjectPolicy = [];
      this.SubjectRiskCode = "";
      this.EmployeeCode = "";
      this.SecondaryQA = "";
      this.SubIncident = false;
    },

    getPlainArray(arr) {
      return Array.from(arr);
    },

    validateRisk() {
      return this.SubjectName && this.SubjectRiskCode && this.EmployeeCode;
    },

    async submitRisk() {
      try {
        if (!this.validateRisk()) {
          this.$q.notify({
            type: "negative",
            message: "ALL ITEMS ARE REQUIRED",
            position: "top",
            timeout: 1000,
            progress: true,
          });
          return;
        }
        this.waiting = true;
        await this.saveRisk();
        this.getSubjecttab();
        setTimeout(() => {
          this.waiting = false;
          this.isAddRiskOpen = false;
          this.isRiskDetailsOpen = true;
        }, 2000); // Refresh the page after 3 seconds
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS ADDING RISK",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      } catch (error) {
        console.error(error);
      }
    },

    async saveRisk() {
      try {
        const riskdata = {
          SubjectName: this.SubjectName,
          SubjectPolicy: this.getPlainArray(this.SubjectPolicy),
          SubjectRiskCode: this.SubjectRiskCode.RiskCode,
          EmployeeCode: this.EmployeeCode,
          SecondaryQA: this.SecondaryQA,
        };
        this.onCancelRisk();
        await this.$store.dispatch("ApplyStore/addSubjectDetails", riskdata);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    /* ////////////////////////////////////////////////////  RISK DICTIONARY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

    async selectRickDics(option) {
      this.selectedRiskDomain = option;
      this.dropdownOpen = false; // Close the dropdown
    },

    async getRiskTable() {
      try {
        await this.$store.dispatch("ApplyStore/disRiskTab");
        this.disAllRisk = this.getRisk;
      } catch (error) {
        console.error("Error Displaying data:", error);
      }
    },

    riskDisctionary() {
      this.RiskDictionary = true;
    },

    onCancelRiskDic() {
      this.DomainCode = "";
      this.RiskDomain = "";
      this.Risk = "";
      this.RiskDescription = "";
      this.RiskDictionary = false;
    },

    validateRiskDic() {
      return (
        this.DomainCode && this.RiskDomain && this.Risk && this.RiskDescription
      );
    },

    async submitRiskDic() {
      try {
        if (!this.validateRiskDic()) {
          this.$q.notify({
            type: "negative",
            message: "ALL ITEMS ARE REQUIRED",
            position: "top",
            timeout: 1000,
            progress: true,
          });
          return;
        }
        this.waiting = true;
        await this.saveRiskDic();
        this.getRiskTable();
        setTimeout(() => {
          this.waiting = false;
          this.isAddRiskDicOpen = false;
          this.isRiskDicOpen = true;
        }, 2000); // Refresh the page after 3 seconds
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS ADDING NEW RISK DICTIONARY",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      } catch (error) {
        console.error(error);
      }
    },

    async saveRiskDic() {
      try {
        const riskdic = {
          DomainCode: this.DomainCode,
          RiskDomain: this.RiskDomain,
          Risk: this.Risk,
          RiskDescription: this.RiskDescription,
        };
        this.onCancelRiskDic();
        await this.$store.dispatch("ApplyStore/addRiskDictionary", riskdic);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
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
/* ////////////////////////////////////////////////////////////////////REPORTABLE & RISK////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
.RERDialog {
  background-color: #ffffff;
}
.AAstIR {
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.AAstText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #ffc619;
  font-size: 25px;
  justify-content: center;
}
.filtertab {
  background-color: #0f4d91;
  font-weight: bold;
  border: 0.1em solid #f3f4f7;
  box-shadow: 0 4px 8px rgba(243, 238, 238, 0.1);
  font-style: Arial Black;
}
.q-tab--active {
  background-color: #ffc412 !important;
  font-size: 18px;
}
.RiskText {
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #003566;
  font-size: 25px;
  justify-content: center;
}

.footer-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white; /* or any color to match the card */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid #d5d7da;
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
</style>
