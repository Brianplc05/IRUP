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
                      <div>
                        <b>SUBJECT OF THE INCIDENT:</b>
                        {{ ird.SubjectName }}
                      </div>
                      <div>
                        <b>BRIEF DESCRIPTION OF THE INCIDENT:</b>
                        {{ ird.SubjectBriefDes }}
                      </div>
                      <div>
                        <b>LOCATION OF THE INCIDENT:</b>
                        {{ ird.SubjectLoc }}
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
          />
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
    getAssistantQA: Function,
  },

  data() {
    return {
      IRAQADetailss: [],
      IRDialog: false,
      setLostRecovery: false,
      lostRec: null,
      QAReferral: null,
      waitplease: false,
    };
  },

  computed: {
    ...mapGetters({ getAssistantQA: "ApplyStore/getAssistantQA" }),
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
        console.log(IRNo);
        const response = await this.$store.dispatch("ApplyStore/disAQA", data);
        this.IRAQADetailss = this.getAssistantQA;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },
};
</script>
