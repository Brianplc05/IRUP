<template>
  <q-table :rows="items" :columns="columns" row-key="IRNo">
    <template v-slot:body-cell-viewIR="props">
      <q-td>
        <q-btn
          push
          @click="viewIReport(props.row.IRNo)"
          :ripple="{ center: true }"
          color="accent"
          icon="description"
          class="text-black text-bold text-center shadow-5"
        />

        <q-dialog full-width full-height v-model="IRDialog" persistent>
          <q-card class="AQADialog">
            <q-card-section class="AQAIR">
              <div class="row items-center justify-between">
                <div class="AQAText">INCIDENT REPORT</div>
                <q-btn
                  style="margin-left: 25px"
                  round
                  push
                  icon="close"
                  class="bg-accent text-black"
                  @click="IRDialog = false"
                  v-close-popup
                />
              </div>
            </q-card-section>

            <q-card-section>
              <q-list>
                <q-item v-for="(ird, index) in IRAQADetailss" :key="index">
                  <q-item-section class="custom-item-section">
                    <q-item-section class="AQAlist">
                      <div class="AQATextlist">INCIDENT INFORMATION</div>
                    </q-item-section>

                    <q-item-section class="AQADes">
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div><b>INCIDENT REPORT NUMBER:</b> {{ ird.IRNo }}</div>
                        <div>
                          <b>INCIDENT REPORT DATE CREATED:</b>
                          {{ FormatDate(ird.DateTimeCreated) }}
                        </div>
                      </div>
                    </q-item-section>

                    <q-item-section class="AQADes">
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div>
                          <b>SUBJECT OF THE INCIDENT:</b>
                          {{ ird.SubjectName }}
                        </div>
                        <div>
                          <b>LOCATION OF THE INCIDENT:</b>
                          {{ ird.SubjectLoc }}
                        </div>
                      </div>
                      <div>
                        <b>BRIEF DESCRIPTION OF THE INCIDENT:</b>
                        {{ ird.SubjectBriefDes }}
                      </div>
                      <div
                        style="
                          background-color: #ffc619;
                          height: 2px;
                          margin: 5px 0;
                        "
                      ></div>
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div>
                          <b>DATE OF THE INCIDENT:</b>
                          {{ FormatDate(ird.SubjectDate) }}
                        </div>
                        <div>
                          <b>TIME OF THE INCIDENT:</b>
                          {{ FormatTime(ird.SubjectTime) }}
                        </div>
                      </div>
                    </q-item-section>

                    <q-item-section class="AQADes">
                      <div><b>NARRATIVE DESCRIPTION OF THE INCIDENT</b></div>
                      <q-separator
                        style="
                          background-color: #ffc619;
                          height: 2px;
                          margin: 5px 0;
                        "
                      ></q-separator>
                      <div>
                        <p>{{ ird.SubjectNote }}</p>
                      </div>
                    </q-item-section>

                    <q-item-section class="AQADes">
                      <div><b>POSSIBLE CAUSES OF THE INCIDENT</b></div>
                      <q-separator
                        style="
                          background-color: #ffc619;
                          height: 2px;
                          margin: 5px 0;
                        "
                      ></q-separator>
                      <div>
                        <p>{{ ird.SubjectCause }}</p>
                      </div>
                    </q-item-section>

                    <q-item-section class="AQADes">
                      <div><b>IMMEDIATE RESPONSE</b></div>
                      <q-separator
                        style="
                          background-color: #ffc619;
                          height: 2px;
                          margin: 5px 0;
                        "
                      ></q-separator>
                      <div>
                        <p>{{ ird.SubjectResponse }}</p>
                      </div>
                    </q-item-section>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-td>
    </template>

    <template v-slot:body-cell-division="props">
      <q-td :props="props">
        <q-btn
          @click="tranferDivision(props.row.IRNo, props.row.DivisionCode)"
          class="bg-positive text-white text-bold text-center"
        >
          {{ props.row.Division }}
        </q-btn>

        <q-dialog v-model="setDivisionDialogs">
          <q-card>
            <q-card-section class="DivisionHD">
              <div class="row items-center justify-between">
                <div class="DivisionText">CONFIRM TRANSFER</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>DO YOU WANT TO TRANSFER THE INCIDENT REPORT?</div>
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px; margin: 2px 0"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="NO"
                color="secondary"
                @click="setDivisionDialogs = false"
              />
              <q-btn
                push
                label="YES"
                color="accent"
                class="text-black"
                @click="saveDivisionTra"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="setDivisionCodeDialogs">
          <q-card>
            <q-card-section class="DivisionHD">
              <div class="row items-center justify-between">
                <div class="DivisionText">DIVISION TRANSFER</div>
              </div>
            </q-card-section>
            <q-card-section>
              <q-input outlined v-model="IRNo" style="display: none" />
              <q-select
                use-input
                square
                outlined
                v-model="DivisionSubCode"
                :options="filteredDivCodeOptions"
                label="DIVISION"
                emit-value
                map-options
                :option-value="(option) => option.DivisionCode"
                :option-label="(option) => option.Division"
                style="margin-bottom: 10px; width: 100%"
              />
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px; margin: 2px 0"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="CANCEL"
                color="secondary"
                @click="cancelDivision"
              />
              <q-btn
                push
                label="SAVE"
                color="accent"
                class="text-black"
                @click="submitDivision"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="transfer"
          persistent
          content-class="non-transparent-dialog"
        >
          <q-card class="centered-card">
            <q-card-section>
              <div class="spinner-container">
                <q-spinner-ios size="100px"></q-spinner-ios>
                <div class="please-wait">Transfering QA. Please wait...</div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-td>
    </template>

    <template v-slot:body-cell-subject="props">
      <q-td>
        <div class="q-gutter-sm row justify-evenly">
          <span
            class="text-dark text-bold text-center"
            v-if="props.row.SubjectCode"
          >
            OTHERS
          </span>
          <q-btn
            push
            class="bg-positive text-white text-bold text-center"
            style="width: 35%"
            label="CHANGE"
            icon="edit_document"
            v-if="props.row.SubjectCode === 'others'"
            @click="changeSubCode(props.row.IRNo)"
          />
          <q-dialog v-model="SubCodeDialog" persistent>
            <q-card class="AQACHANGE">
              <q-card-section>
                <q-select
                  class="text-uppercase"
                  outlined
                  use-input
                  fill-input
                  clearable
                  hide-dropdown-icon
                  hide-selected
                  v-model="SubjectCode"
                  label="REPORTABLE INCIDENT CODE"
                  :options="disAllSubCode"
                  @filter="FilterFn"
                  emit-value
                  map-options
                  :option-value="(option) => option.SubjectCode"
                  :option-label="(option) => option.SubjectName"
                />
              </q-card-section>
              <q-card-actions align="right" class="footer-actions">
                <q-btn
                  push
                  label="Cancel"
                  color="secondary"
                  @click="onAQACancel"
                />
                <q-btn
                  push
                  label="Save"
                  color="accent"
                  class="text-black"
                  @click="submitChangeCode"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog
            v-model="rdPWait"
            persistent
            content-class="non-transparent-dialog"
          >
            <q-card class="centered-card">
              <q-card-section>
                <div class="spinner-container">
                  <q-spinner-facebook size="100px"></q-spinner-facebook>
                  <div class="please-wait">Doing something. Please wait...</div>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    items: Array,
    columns: Array,
    getAssistantQAs: Function,
  },

  data() {
    return {
      IRAQADetailss: [],
      disAllSubCode: [],
      disAllDivCode: [],
      IRDialog: false,
      rdPWait: false,
      transfer: false,
      SubCodeDialog: false,
      setDivisionDialogs: false,
      setDivisionCodeDialogs: false,
      IrNo: "",
      IRNo: "",
      SubjectCode: "",
      DivisionCode: "",
      DivisionSubCode: "",
    };
  },

  computed: {
    ...mapGetters({
      getAssistantSubCode: "ApplyStore/getAssistantSubCode",
      getAssistantQAForm: "ApplyStore/getAssistantQAForm",
      getAssistantDivision: "ApplyStore/getAssistantDivision",
    }),

    filteredDivCodeOptions() {
      return this.disAllDivCode.filter(
        (item) => item.DivisionCode != this.DivisionCode
      );
    },
  },

  created() {
    this.getSubjectcode();
    this.getDivisioncode();
  },

  methods: {
    ///////////////////////////////////////IRDETAILS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FormatDate(SubjectDate) {
      const date = new Date(SubjectDate);
      const options = { year: "numeric", month: "short", day: "2-digit" };
      const formattedDate = date
        .toLocaleDateString("en-US", options)
        .toUpperCase()
        .replace(/\s/g, " ");
      return formattedDate;
    },

    FormatTime(SubjectTime) {
      const date = new Date(SubjectTime);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return formattedTime;
    },

    async viewIReport(IRNo) {
      try {
        this.IRDialog = true;
        const data = {
          iRNo: IRNo,
        };
        const response = await this.$store.dispatch("ApplyStore/disAQA", data);
        this.IRAQADetailss = this.getAssistantQAForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////// TRANSFER DIVISION CODE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    tranferDivision(IRNo, DivisionCode) {
      this.setDivisionDialogs = true;
      this.IRNo = IRNo;
      this.DivisionCode = DivisionCode;
    },

    saveDivisionTra() {
      this.setDivisionDialogs = false;
      this.setDivisionCodeDialogs = true;
    },

    async getDivisioncode() {
      try {
        await this.$store.dispatch("ApplyStore/disDivisionCode");
        this.disAllDivCode = this.getAssistantDivision;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    submitDivision() {
      try {
        this.transfer = true;
        this.transferDivision();
        setTimeout(() => {
          this.getAssistantQAs();
          this.transfer = false;
        }, 4000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS NOTIFIYING QA",
          icon: "check",
          iconColor: "white",
          timeout: 5000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting transfer division data:", error);
      }
    },

    async transferDivision() {
      try {
        const data = {
          IRNo: this.IRNo,
          DivisionCode: this.DivisionSubCode,
        };
        this.cancelDivision();
        const response = await this.$store.dispatch(
          "ApplyStore/putChangeDivision",
          data
        );
      } catch (error) {
        console.error("Error inserting transfer division data:", error);
      }
    },

    cancelDivision() {
      this.setDivisionCodeDialogs = false;
      this.IRNo = "";
      this.DivisionSubCode = "";
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////// DISPLAY SUBJECT CODE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getSubjectcode() {
      try {
        await this.$store.dispatch("ApplyStore/disSubjectCode");
        this.disAllSubCode = this.getAssistantSubCode;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    FilterFn(val, update) {
      if (val === "") {
        update(() => {
          this.disAllSubCode = this.getAssistantSubCode;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.disAllSubCode = this.getAssistantSubCode.filter((option) => {
          return option.SubjectName.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    ///////////////////////////////////////////////////////////////////CHANGE SUBJECT CODE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    changeSubCode(IRNo) {
      this.SubCodeDialog = true;
      this.IrNo = IRNo;
    },

    submitChangeCode() {
      if (!this.SubjectCode) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "REPORTABLE INCIDENT CODE IS REQUIRED",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000, // Increased timeout to 2000 milliseconds
          progress: true,
        });
        return;
      }
      this.rdPWait = true;
      this.saveChangeCode();

      setTimeout(() => {
        this.getAssistantQAs();
        this.rdPWait = false;
      }, 2000);
      this.$q.notify({
        color: "green-8",
        position: "top",
        message: "SUCCESS NOTIFIYING QUALITY OFFICER",
        icon: "check",
        iconColor: "white",
        timeout: 3000,
        progress: true,
      });
    },

    async saveChangeCode() {
      try {
        const data = {
          IRNo: this.IrNo,
          SubjectCode: this.SubjectCode,
        };
        this.onAQACancel();
        const response = await this.$store.dispatch(
          "ApplyStore/putChangeCode",
          data
        );
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    onAQACancel() {
      this.SubCodeDialog = false;
      this.IrNo = "";
      this.SubjectCode = "";
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },
};
</script>
