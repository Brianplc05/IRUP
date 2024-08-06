<template>
    <q-table
      :rows="items"
      :columns="columns"
      row-key="IRNo"
    >

    <template v-slot:body-cell-viewIR= "props">
      <q-td>
        <q-btn push @click="viewIReport(props.row.IRNo)" :ripple="{ center: true }" color="accent" icon="description" class="text-black text-bold text-center shadow-5"/>

          <q-dialog full-width full-height v-model="IRDialog" persistent>
            <q-card class="DirectorDialog">
              <q-card-section class="DirectorIR">
                <div class="row items-center justify-between">
                  <div class="DirectorText">INCIDENT REPORT</div>
                  <q-btn style=" margin-left: 25px;" round push icon="close" class="bg-accent text-black" @click="IRDialog = false" v-close-popup/>
                </div>
              </q-card-section>

              <q-card-section>
                <q-list>
                  <q-item v-for="(ird, index) in IRDirectorDetailss" :key="index">
                    <q-item-section class="custom-item-section">

                      <q-item-section class="Directorlist">
                          <div class="DirectorTextlist">INCIDENT INFORMATION</div>
                      </q-item-section>

                      <q-item-section class="DirectorDes">
                        <div style="display: flex; justify-content: space-between;">
                          <div><b>INCIDENT REPORT NUMBER:</b> {{ ird.IRNo }}</div>
                          <div><b>INCIDENT REPORT DATE CREATED:</b> {{ FormatDate(ird.DateTimeCreated) }}</div>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <div><b>PRIMARY(DEPARTMENT):</b> {{ ird.PrimaryDept }}</div>
                            <div><b>SECONDARY(DEPARTMENT/S):</b> {{ ird.DeptCodeInvDescriptions }}</div>
                        </div>
                      </q-item-section>

                      <q-item-section class="DirectorDes">
                        <div><b>SUBJECT OF THE INCIDENT:</b> {{ ird.SubjectName }}</div>
                        <div><b>LOCATION OF THE INCIDENT:</b> {{ ird.SubjectLoc }}</div>
                        <div style="background-color: #FFC619; height: 2px; margin: 5px 0;"></div>
                        <div style="display: flex; justify-content: space-between;">
                        <div><b>DATE OF THE INCIDENT:</b> {{ FormatDate(ird.SubjectDate) }}</div>
                        <div><b>TIME OF THE INCIDENT:</b> {{ FormatTime(ird.SubjectTime) }}</div>
                        </div>
                      </q-item-section>

                      <q-item-section class="DirectorDes">
                        <div><b>NARRATIVE DESCRIPTION OF THE INCIDENT</b></div>
                        <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                        <div><p>{{ ird.SubjectNote }}</p></div>
                      </q-item-section>

                      <q-item-section class="DirectorDes">
                        <div><b>POSSIBLE CAUSES OF THE INCIDENT</b></div>
                        <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                        <div><p>{{ ird.SubjectCause }}</p></div>
                      </q-item-section>

                      <q-item-section class="DirectorDes">
                        <div><b>IMMEDIATE RESPONSE</b></div>
                        <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                        <div><p>{{ ird.SubjectResponse }}</p></div>
                      </q-item-section>

                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>


            </q-card>
          </q-dialog>

      </q-td>
    </template>

    <template v-slot:body-cell-QA="props">
      <q-td :props="props">
        <span
          class="text-dark text-bold text-center">
          {{ props.row.MainFullName }}
        </span>
        <br/>
        <span v-if="props.row.TransferFullName !== null" class="text-dark text-bold text-center">
          REDIRECTED TO: <b style="background: #ffc619;">{{ props.row.TransferFullName }}</b>
        </span>
      </q-td>
    </template>

    <template v-slot:body-cell-QAreco="props">
    <q-td>
      <q-btn
      :disable="props.row.lostRec !== null"
      @click="lostRecommendation(props.row.IRNo)"
      icon="recommend"
      class="bg-positive text-white text-bold text-center"
      >
      </q-btn>

      <q-dialog v-model="setLostRecovery" persistent>
        <q-card class="DirectorRECOM">
          <q-card-section class="DirectorREC">
            <div class="row items-center justify-between">
              <div class="DirectorRECText">RECOMENDATION</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-input outlined v-model="IrNo" label="IRNo." style="display: none;" />
            <div>IS LOST RECOVERY RECOMMENDED?</div>
          </q-card-section>
          <q-separator style="background-color: #d5d7da; height: 2px; margin: 8px 0;"></q-separator>
          <q-card-actions align="right">
            <q-btn push label="NO" color="secondary" @click="submitLostRecommendation( 2, 'NOT APPLICABLE')"/>
            <q-btn push label="YES" color="accent" class="text-black" @click="submitLostRecommendation( 1, 'APPLICABLE')"  />
          </q-card-actions>
        </q-card>
      </q-dialog>

        <q-dialog v-model="waitplease" persistent content-class="non-transparent-dialog">
          <q-card class="centered-card">
            <q-card-section>
              <div class="spinner-container">
                <q-spinner-facebook size="100px"></q-spinner-facebook>
                <div class="please-wait">Doing something. Please wait...</div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

    </q-td>
    </template>

    </q-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props:{
    items: Array,
    columns: Array,
    getDirectors: Function,
  },

  data(){
    return{
      IRDirectorDetailss: [],
      IRDialog: false,

      setLostRecovery: false,
      lostRec: null,
      QAReferral: null,
      waitplease: false,
    }
  },

  computed: {
    ...mapGetters({ getDirector: 'ApplyStore/getDirector' }),
  },

  methods: {
///////////////////////////////////////IRDETAILS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  FormatDate(SubjectDate){
  const date = new Date(SubjectDate);
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase().replace(/\s/g, ' ');
  return formattedDate;
  },

  FormatTime(SubjectTime) {
  const date = new Date(SubjectTime);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return formattedTime;
  },

  async viewIReport(IRNo) {
    try {
      this.IRDialog = true;
      const data = {
        iRNo: IRNo
      };
      console.log(IRNo)
      const response = await this.$store.dispatch('ApplyStore/disDirectorIrp', data);
      this.IRDirectorDetailss = this.getDirector;
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  lostRecommendation(IRNo) {
    this.setLostRecovery = true;
    this.IrNo = IRNo; // Ensure consistency with this.IrNo
  },

  onCancelLostReco(){
    this.setLostRecovery = false;
  },

  async submitLostRecommendation(lostRec, FinancialLiability) {
    try {
      const lostRecom = {
        IRNo: this.IrNo,
        lostRec: lostRec,
        FinancialLiability: FinancialLiability,
      }
      console.log(lostRecom)
      this.waitplease= true;
      this.onCancelLostReco();
      await this.$store.dispatch("ApplyStore/addLostRecommendation", lostRecom);
      console.log("DATA INSERTED SUCCESSFULLY");

      setTimeout(() => {
      this.getDirectors();
      this.waitplease = false;
      }, 2000);
      // Success notification
        this.$q.notify({
        color: 'green-8',
        position: 'top',
        message: 'SUCCESS GIVING RECOMMENDATION',
        icon: 'check',
        iconColor: 'white',
        timeout: 3000,
        progress: true,
        });
      }catch (error) {
      console.error('Error creating action items:', error);
    }
  },

  },
}
</script>
