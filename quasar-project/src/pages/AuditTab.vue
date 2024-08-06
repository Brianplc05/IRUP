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
                  <q-item v-for="option in auditStats" :key="option.value" clickable @click="selectStatus(option)">
                    <q-item-section>{{ option.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div class="IRAHText">INCIDENT REPORT </div>
            <div class="q-gutter-md row" style="display: flex; align-items: center;">
              <q-input dark dense standout v-model="searchQuery" input-class="text-right" class="q-ml-md" style="background-color: #f3f4f7; border-radius: 0.4em;">
                <template v-slot:append>
                  <q-icon name="search" style="color:black"></q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-section class="bg-primary" style="border-top: 0.1em solid #d5d7da;">
            <div class="text-right">
              <q-btn @click="subjectIncident" :ripple="{ center: true }" color="accent" icon="edit_square" label="RISK" class="text-black text-bold text-center shadow-5" style="width: 110px;" />
            </div>

            <q-dialog full-width full-height v-model="SubIncident" persistent>
              <q-card class="SIODialog">
                <q-card-section class="AuditIR">
                  <div class="row items-center justify-between">
                    <div class="AuditText">SUBJECT OF INCIDENT</div>
                    <q-btn style=" margin-left: 5px;" round push icon="close" class="bg-accent text-black" @click="SubIncident = false" v-close-popup/>
                  </div>
                </q-card-section>

                <q-card-section>
                  <q-list full-width>

                    <q-expansion-item group="somegroup" icon="library_books" label="ADD RISK" class="expansiondes" v-model="isAddRiskOpen">
                    <q-card class="bg-warning">
                      <q-card-section>
                        <div style="display: flex; justify-content: space-between;">
                          <q-input square outlined v-model="SubjectName" label="RISK NAME*" style="margin-left: 5px; width: 49%;"></q-input>
                          <q-select v-model="SubjectPolicy" @new-value="createValue" label="POLICY" square outlined multiple use-input use-chips hide-dropdown-icon
                            style="margin-right: 5px; width: 49%;"
                          />
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                          <q-input square outlined v-model="SubjectCatCode" label="RISK CATEGORY CODE" style="margin-left: 5px; width: 49%;"></q-input>
                          <q-input square outlined v-model="SubjectCategory" label="RISK CATEGORY" style="margin-right: 5px; width: 49%;"></q-input>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                          <q-select use-input square outlined v-model="EmployeeCode" :options="disQA" label="QA INCHARGE" emit-value map-options :option-value="option => option.EmployeeCode" :option-label="option => option.FullName" style="margin-left: 5px; width: 49%;"/>
                          <q-select use-input square outlined v-model="SecondaryQA" :options="disQA" label="SECONDARY QA" emit-value map-options :option-value="option => option.EmployeeCode" :option-label="option => option.FullName" style="margin-right: 5px; width: 49%;"/>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                          <q-input square outlined autogrow v-model="SubjectDescription" label="RISK DESCRIPTION" style="margin-left: 5px; width: 49%;"></q-input>
                          <q-input square outlined autogrow v-model="SubjectExample" label="RISK EXAMPLE" style="margin-right: 5px; width: 49%;"></q-input>
                        </div>
                      </q-card-section>
                      <q-card-actions align="right" class="custom-card-actions">
                          <q-btn push label="CLEAR" @click="onCancelRisk" color="secondary" class="button1"></q-btn>
                          <q-btn push label="SAVE" @click="submitRisk" color="accent text-black" class="button1"></q-btn>
                      </q-card-actions>
                    </q-card>
                    </q-expansion-item>

                    <q-expansion-item default-opened group="somegroup" icon="table_rows" label="RISK DETAILS" class="expansiondes"  v-model="isRiskDetailsOpen">
                      <q-markup-table class="custom-q-table">
                        <thead>
                          <tr>
                            <th v-for="column in disSubColumns" :key="column.name" class="custom-header">
                              {{ column.label }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in filteredDisSub" :key="row.id">
                            <td v-for="column in disSubColumns" :key="column.name" class="custom-cell">
                              {{ row[column.field] }}
                            </td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                    </q-expansion-item>

                      <q-dialog v-model="waiting" persistent content-class="non-transparent-dialog">
                        <div class="risk-card">
                          <q-card-section>
                            <div class="spinner-container">
                              <q-spinner-facebook size="200px"></q-spinner-facebook>
                              <div class="risk-wait">Doing something. Please wait...</div>
                            </div>
                          </q-card-section>
                        </div>
                      </q-dialog>

                  </q-list>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-card-section>

          <q-spinner-ball class="spinner" v-if="spiloading" size="150px" color="primary"/>
          <q-table
              v-show="showTable"
              :rows="filteredDisAll"
              :columns="disColumns"
              row-key="IRNo"
              :loading="spiloading"
            >
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
          <template v-slot:body-cell-viewIR= "props">
              <q-td>
                <q-btn push @click="viewIReport(props.row.IRNo)" :ripple="{ center: true }" color="accent" icon="description" class="text-black text-bold text-center shadow-5"/>
                  <q-dialog full-width full-height v-model="IRDialog" persistent>
                    <q-card class="ADDialog">
                      <q-card-section class="ADIR">
                        <div class="row items-center justify-between">
                          <div class="ADText">INCIDENT REPORT</div>
                          <q-btn style=" margin-left: 25px;" round push icon="close" class="bg-accent text-black" @click="IRDialog = false" v-close-popup/>
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <q-list>
                          <q-item v-for="(ird, index) in IRQADetailss" :key="index">
                            <q-item-section class="custom-item-section">
                              <q-item-section class="ADlist">
                                  <div class="ADTextlist">INCIDENT INFORMATION</div>
                              </q-item-section>

                              <q-item-section class="ADDes">
                                <div style="display: flex; justify-content: space-between;">
                                  <div><b>INCIDENT REPORT NUMBER:</b> {{ ird.IRNo }}</div>
                                  <div><b>INCIDENT REPORT DATE CREATED:</b> {{ FormatDate(ird.DateTimeCreated) }}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <div><b>PRIMARY(DEPARTMENT):</b> {{ ird.PrimaryDept }}</div>
                                    <div><b>SECONDARY(DEPARTMENT/S):</b> {{ ird.DeptCodeInvDescriptions }}</div>
                                </div>
                              </q-item-section>

                              <q-item-section class="ADDes">
                                <div><b>SUBJECT OF THE INCIDENT:</b> {{ ird.SubjectName }}</div>
                                <div><b>LOCATION OF THE INCIDENT:</b> {{ ird.SubjectLoc }}</div>
                                <div style="background-color: #FFC619; height: 2px; margin: 5px 0;"></div>
                                <div style="display: flex; justify-content: space-between;">
                                <div><b>DATE OF THE INCIDENT:</b> {{ FormatDate(ird.SubjectDate) }}</div>
                                <div><b>TIME OF THE INCIDENT:</b> {{ FormatTime(ird.SubjectTime) }}</div>
                                </div>
                              </q-item-section>

                              <q-item-section class="ADDes">
                                <div><b>NARRATIVE DESCRIPTION OF THE INCIDENT</b></div>
                                <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                                <div><p>{{ ird.SubjectNote }}</p></div>
                              </q-item-section>

                              <q-item-section class="ADDes">
                                <div><b>POSSIBLE CAUSES OF THE INCIDENT</b></div>
                                <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                                <div><p>{{ ird.SubjectCause }}</p></div>
                              </q-item-section>

                              <q-item-section class="ADDes">
                                <div><b>IMMEDIATE RESPONSE</b></div>
                                <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                                <div><p>{{ ird.SubjectResponse }}</p></div>
                              </q-item-section>

                              <q-item-section class="ADDes" v-if="ird.ActionItem">
                                <q-item-section class="ADlist">
                                    <div class="ADTextlist">ROOT CAUSE ANALYSIS (RCA) ACTION ITEMS</div>
                                  </q-item-section>
                                    <q-item-section v-if="ird.ActionItem">
                                        <div><b>ACTION DETAILS:</b></div>
                                        <div><p>{{ ird.ActionItem }}</p></div>
                                    </q-item-section>
                                    <q-item-section v-else>
                                      <div><b>ACTION DETAILS:</b></div>
                                      <div style="text-align: center; font-size: 30px; color: #A9A9A9;">
                                          <p><i>~ACTION DETAILS IS EMPTY~</i></p>
                                      </div>
                                  </q-item-section>
                              </q-item-section>

                              <q-item-section class="ADDes" v-if="ird.newHRNote">
                                <q-item-section class="ADlist">
                                    <div class="ADTextlist">HUMAN RESOURCES(HR) NOTES </div>
                                </q-item-section >
                                  <q-item-section>
                                      <div><b>NOTE:</b></div>
                                      <div><p>{{ ird.newHRNote }}</p></div>
                                  </q-item-section>
                              </q-item-section>

                            </q-item-section>
                          </q-item>
                        </q-list>
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </q-td>
          </template>
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
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
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
          <template v-slot:body-cell-note="props">
              <q-td :props="props">
                  <q-btn @click="noteTab(props.row.IRNo)"
                    push
                    icon="note"
                    :ripple="{ center: true }"
                    style="width: 90px;"
                    class="bg-primary text-white text-bold text-center shadow-5"/>


                  <q-dialog full-width v-model="noteDia " persistent>
                      <q-card class="ADNDIA">
                          <q-card-section class="ADNHead">
                              <div class="ADNText">REMARKS</div>

                              <div class="button-container">
                                <q-btn @click="editDia(selectedIrNo)" color="secondary " icon="post_add" label="Add Remarks" style="background-color: #024089; border: 0.2em solid #f3f4f7; border-radius: 0.5em;"/>
                                <q-btn style=" margin-left: 25px;" round push icon="close" class="bg-accent text-black" @click="cancelNote()" v-close-popup/>

                                <q-dialog v-model="editDialog" persistent>
                                    <q-card class="ADANDIA">
                                        <q-card-section class="ADANHead">
                                            <div class="ADANText">ADD REMARKS</div>
                                        </q-card-section>
                                        <q-card-section>
                                            <q-input outlined v-model="IrNo" label="IRNo." style="display: none;" />
                                            <q-input class="q-pt-sd" outlined v-model="policyCode" label="Policy"/>
                                            <q-input
                                                v-model="addNote"
                                                filled
                                                label="Note"
                                                type="textarea"
                                                class="q-mt-md"
                                                auto-focus
                                              ></q-input>
                                        </q-card-section>

                                        <q-separator style="background-color: #d5d7da; height: 2px; margin: 5px 0;"></q-separator>
                                          <q-card-actions class="q-pt-sd" align="right">
                                            <q-btn push label="CANCEL" color="secondary" @click="onCancel" />
                                            <q-btn push label="SAVE" color="accent" class="text-black" @click.prevent="NoteSubmit(selectedIrNo)"/>
                                          </q-card-actions>
                                    </q-card>
                                </q-dialog>


                                        <q-dialog v-model="waitplease" persistent>
                                          <q-card class="centered-card">
                                            <q-card-section>
                                              <div class="spinner-container">
                                                <q-spinner-ios size="130px"></q-spinner-ios>
                                                <div class="please-wait">Doing something. Please wait...</div>
                                              </div>
                                            </q-card-section>
                                          </q-card>
                                        </q-dialog>
                              </div>
                            </q-card-section>


                              <q-card-section>
                                  <q-list bordered>
                                      <q-item v-for="(note, index) in noteDetails" :key="index">
                                          <q-item-section class="ADANCon" v-if="note">
                                              <div class="ADANPolicy">{{ note.policyCode }}</div>
                                              <div ><p>{{ note.newNote }}</p></div>
                                              <div class="ADANPolicy text-right">{{ FormatDate(note.DateTime) }}</div>
                                          </q-item-section>

                                          <q-item-section side>
                                              <q-btn icon="edit" color="accent" @click="editNote(note.Id)" />
                                              <q-dialog v-model="editNoteDialog" persistent>
                                                <q-card class="ADENDia">
                                                    <q-card-section class="ADENHead">
                                                        <div class="ADENText">EDIT NOTE</div>
                                                    </q-card-section>
                                                    <q-card-section>
                                                      <q-input outlined v-model="Id" label="Id Number" style="display: none;" />
                                                        <q-input
                                                            v-model="newNote"
                                                            filled
                                                            label="Note"
                                                            type="textarea"
                                                            class="q-mt-md"
                                                            auto-focus
                                                          ></q-input>
                                                    </q-card-section>
                                                    <q-separator style="background-color: #d5d7da; height: 2px; margin: 5px 0;"></q-separator>
                                                      <q-card-actions align="right">
                                                        <q-btn push label="CANCEL" color="secondary" @click="onCancelNote"/>
                                                        <q-btn push label="SAVE" color="accent" class="text-black" @click.prevent="confirmEdit(note.IRNo)" />
                                                      </q-card-actions>
                                                </q-card>
                                              </q-dialog>
                                              <q-btn class="q-mt-sm" icon="delete" color="negative" @click="deleteNote(note.Id, note.IRNo)" />
                                          </q-item-section>
                                      </q-item>

                                      <q-item v-if="noteDetails.length === 0">
                                          <q-item-section>
                                              <div style="text-align: center; font-size: 30px; color: #A9A9A9;">
                                                  <p><i>~REMARKS IS EMPTY~</i></p>
                                              </div>
                                          </q-item-section>
                                      </q-item>
                                  </q-list>
                              </q-card-section>
                      </q-card>
                  </q-dialog>

                  <q-dialog v-model="itemWait" persistent content-class="non-transparent-dialog">
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
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
          <template v-slot:body-cell-auditstatus="props">
            <q-td>
                <q-btn
                  push
                  @click="editIRAudit(props.row.IRNo, false)"
                  v-if="props.row.AuditStatus === true"
                  :ripple="{ center: true }"
                  style="width: 100px;"
                  class="bg-positive text-white text-bold text-center shadow-5"
                >OPEN</q-btn>
                <q-btn
                  push
                  :disable="props.row.AuditStatus === false"
                  v-if="props.row.AuditStatus === false"
                  :ripple="{ center: true }"
                  style="width: 100px;"
                  class="bg-negative text-white text-bold text-center shadow-5"
                >CLOSED</q-btn>

                <q-dialog v-model="setAuditDialogs">
                <q-card>
                  <q-card-section class="ADStatus">
                    <div class="row items-center justify-between">
                      <div class="ADSText">CONFIRM CLOSE</div>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div>DO YOU WANT TO CLOSE THE INCIDENT REPORT?</div>
                  </q-card-section>
                  <q-separator style="background-color: #d5d7da; height: 2px; margin: 5px 0;"></q-separator>
                  <q-card-actions align="right">
                    <q-btn push label="NO" color="secondary" @click="setAuditDialogs = false" />
                    <q-btn push label="YES" color="accent" class="text-black" @click="saveIRAuditStatus" />
                  </q-card-actions>
                </q-card>
                </q-dialog>

                  <q-dialog v-model="itemWait" persistent content-class="non-transparent-dialog">
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
<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
          </q-table>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  data(){
    return{
      disAll: [],
      IRDetails: [],
      IRQADetailss:[],
      disAllSubject: [],
      spiloading: true,
      showTable: false,
      setAuditDialogs: false,
      IRDialog: false,
      editDialog: false,
      editNoteDialog: false,
      noteDia: false,
      waitplease: false,
      SubIncident: false,
      itemWait: false,
      newNote: "",
      addNote: "",
      IrNo: "",
      Id: "",
      searchQuery: '',
      search: '',
      selectedStatus: null,
      noteDetails: [],
      selectedIrNo: '',
      policyCode: '',
      disColumns: [
          { name: 'viewIR', label: 'INCIDENT REPORT DETAILS', align: 'left', field: 'id' },
          { name: 'IRNo', label: 'IR NUMBER ', align: 'left', field: 'IRNo' },
          { name: 'departmentNumber', label: 'DEPARTMENT NAME', align: 'left', field: 'Department_Description'},
          { name: 'subject', label: 'SUBJECT OF THE INCIDENT', align: 'left', field: 'SubjectName' },
          { name: 'QA', label: 'QA INCHARGE', align: 'left', field: 'id' },
          { name: 'note', label: 'POLICY', align: 'center', },
          { name: 'auditstatus', label: 'STATUS', align: 'left', field: 'AuditStatus' }
      ],
      disSubColumns:[
          { name: 'category', label: 'RISK CATEGORY', align: 'left', field: 'SubjectCategory' },
          { name: 'subject', label: 'SUBJECT OF THE INCIDENT', align: 'left', field: 'SubjectName' },
          { name: 'qa', label: 'QA INCHARGE', align: 'left', field: 'QAName' },
          { name: 'description', label: 'RISK DESCRIPTION', align: 'left', field: 'SubjectDescription' },
          { name: 'example', label: 'RISK EXAMPLE', align: 'left', field: 'SubjectExample' },
      ],
      auditStats: [
        { label: 'OPEN', value: true },
        { label: 'CLOSED', value: false },
      ],
      showDeleteDialog: false,
      shouldShowInput: true,

      disQA: [],
      EmployeeCode: '',
      SecondaryQA: '',
      SubjectPolicy: [],
      SubjectCatCode: '',
      SubjectName: '',
      SubjectCategory: '',
      SubjectDescription: '',
      SubjectExample: '',
      waiting: false,
      isAddRiskOpen: true,
      isRiskDetailsOpen: false,
    }
  },

  computed: {
    ...mapGetters({ getForm: 'ApplyStore/getForm', getSubject: 'ApplyStore/getSubject', getQA: 'ApplyStore/getQA', getAudit: 'ApplyStore/getAudit',  getQAForm: 'ApplyStore/getQAForm'}),

    filteredDisAll() {
        const { disAll, selectedStatus, searchQuery } = this;
        let filteredData = [...disAll];
        if (selectedStatus && typeof selectedStatus === 'object') {
          const { value: statusValue } = selectedStatus;
          filteredData = filteredData.filter(item => item.AuditStatus === statusValue);
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
      },

    filteredDisSub(){
      const { disAllSubject, search } = this;
      let filteredSub = [...disAllSubject];

      if (search && typeof search === 'string') {
          const query = search.toLowerCase();
          filteredSub = filteredSub.filter(item =>
            Object.values(item).some(val =>
              typeof val === 'string' && val.toLowerCase().includes(query)
            )
          );
        }
      return filteredSub;
    }
  },

  mounted() {
    setTimeout(() => {
      this.showTable = true;
      this.disAll;
      this.spiloading = false;
    }, 3000); // Simulating 2 seconds of loading time


  },

  created() {
    this.getInc();
    this.getSubjecttab();
    this.getQAtrans();
  },

  methods: {
    async getInc() {
      try {
        await this.$store.dispatch("ApplyStore/disTab");
        this.disAll = this.getForm;
      } catch (error) {
        console.error("Error Displaying data:", error);
      }
    },

    async getSubjecttab() {
      try {
        await this.$store.dispatch("ApplyStore/disSubjectTab");
        this.disAllSubject = this.getSubject;
      } catch (error) {
        console.error("Error Displaying data:", error);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    createValue(val, done) {
      this.SubjectPolicy.push(val);
      done(val, 'add-unique');
    },

    getPlainArray(arr) {
      return Array.from(arr);
    },


    subjectIncident(){
      this.SubIncident = true;
    },

    onCancelRisk(){
        this.SubjectName = '',
        this.SubjectPolicy = [],
        this.SubjectCatCode = '',
        this.SubjectCategory = '',
        this.SubjectDescription = '',
        this.SubjectExample = '',
        this.EmployeeCode = '',
        this.SecondaryQA = ''
    },

    validateRisk(){
      return(
        this.SubjectName &&
        this.SubjectCategory &&
        this.EmployeeCode
        )
      },

    async submitRisk() {
        try {
            if (!this.validateRisk()) {
                this.$q.notify({
                    type: 'negative',
                    message: 'ALL ITEMS ARE REQUIRED',
                    position: 'top',
                    timeout: 1000,
                    progress: true
                });
            return;
          }
          this.waiting = true;
          await this.saveRisk();
          setTimeout(() => {
            this.getSubjecttab();
            this.waiting = false;
            this.isAddRiskOpen = false;
            this.isRiskDetailsOpen = true;
          }, 2000); // Refresh the page after 3 seconds
          this.$q.notify({
                color: 'green-8',
                position: 'top',
                message: 'SUCCESS ADDING RISK',
                icon: 'check',
                iconColor: 'white',
                timeout: 3000,
                progress: true,
              });
        } catch (error) {
          console.error(error);
      }
    },

    async saveRisk(){
      try{
        const riskdata = {
          SubjectName: this.SubjectName,
          SubjectPolicy: this.getPlainArray(this.SubjectPolicy),
          SubjectCatCode: this.SubjectCatCode,
          SubjectCategory: this.SubjectCategory,
          SubjectDescription: this.SubjectDescription,
          SubjectExample: this.SubjectExample,
          EmployeeCode: this.EmployeeCode,
          SecondaryQA: this.SecondaryQA
        }
        console.log('ETO ANG LAMAN NG RISKDATA', riskdata)
        this.onCancelRisk();
        await this.$store.dispatch('ApplyStore/addSubjectDetails', riskdata);
        console.log("DATA INSERTED SUCCESSFULLY");
      }catch(error) {
        console.error('Error inserting data:', error);
      }
    },

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        this.selectedIrNo = IRNo
        console.log(data)
        const response = await this.$store.dispatch('ApplyStore/disIrpHR', data);
        console.log(this.getQAForm)
        this.IRQADetailss = this.getQAForm;
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    },

//////////////////////////////////////////////////// POLICY /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async selectStatus(option) {
    this.selectedStatus = option;
    },

    async noteTab(IRNo) {
      this.noteDia = true;
      console.log(IRNo)
      try {
        const data = {
          iRNo: IRNo
        }
        this.selectedIrNo = IRNo
        await this.$store.dispatch('ApplyStore/disNote', data);
        this.noteDetails = this.getAudit;
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    },

    async NoteSubmit(IRNo) {
        try {
          this.selectedIrNo = IRNo
          await this.saveNote();
          setTimeout(() => {
          this.noteTab(IRNo);
          this.waitplease = false;
          }, 2000); // Refresh the page after 3 seconds
        } catch (error) {
          console.error(error);
        }
      },

    editDia(selectedIrNo){
      this.editDialog = true;
      this.IrNo = selectedIrNo;
    },

    async saveNote() {
          try {
            if (!this.validateRemarks()) {
              this.$q.notify({
                  type: 'negative',
                  message: 'Note & Policy are required',
                  position: 'top',
                  timeout: 1000,
                  progress: true
              });
              this.editDialog = true;
              return;
            }
              const data = {
                  note: this.addNote,
                  iRNo: this.IrNo,
                  policyCode: this.policyCode
              };
              await this.$store.dispatch("ApplyStore/AddAud", data);
              this.cancelNote();
              this.onCancel();
              console.log("DATA INSERTED SUCCESSFULLY");
              this.waitplease = true;
              this.$q.notify({
                color: 'green-8',
                position: 'top',
                message: 'SUCCESS ADDING REMARKS',
                icon: 'check',
                iconColor: 'white',
                timeout: 3000,
                progress: true,
              });
          } catch (error) {
              console.error("Error inserting data:", error);
              this.$q.notify({
                  type: 'negative',
                  message: 'Failed to save note. Please try again later.',
                  position: 'top',
                  timeout: 1000,
                  progress: true
              });
          }
      },

      validateRemarks(){
      return(
          this.IrNo &&
          this.addNote &&
          this.policyCode
        )
      },

      cancelNote() {
      this.IrNo = '';
      this.noteDetails = [];    // Clears the array noteDetails by assigning an empty array
      },

      onCancel(){
        this.IrNo = '';
        this.policyCode = '';
        this.addNote = '';
        this.editDialog = false;
      },

      editNote(Id){
        this.editNoteDialog = true;
        this.Id = Id;
      },

      async confirmEdit(IRNo) {
          try {
            if(!this.newNote){
            this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'REQUIRED ALL FIELDS',
            icon: 'report_problem',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          this.editNoteDialog = true;
          return;
          }
            const payload = {
              Id: this.Id,
              newNote: this.newNote
          }
          this.onCancelNote();
          await this.$store.dispatch('ApplyStore/putEdNote', payload);
          this.itemWait = true;
          setTimeout(() => {
          this.noteTab(IRNo);
          this.itemWait = false;
          }, 1000);
          this.$q.notify({
            color: 'green-8',
            position: 'top',
            message: 'SUCCESS EDITING REMARKS',
            icon: 'check',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          } catch (error) {
            // console.error('Error inserting data:', error);
          }
        },

        onCancelNote(){
        this.Id = '';
        this.newNote = '';
        this.editNoteDialog = false;
      },

        validateEdit(){
          return this.Id && this.newNote
        },

      async deleteNote(Id,IRNo){
        try{
          const data = {
            Id: Id
          }
        await this.$store.dispatch('ApplyStore/putNote', data);
        this.itemWait = true;
        setTimeout(() => {
          this.noteTab(IRNo);
          this.itemWait = false;
          }, 1000);
          this.$q.notify({
            color: 'green-8',
            position: 'top',
            message: 'SUCCESS DELETING REMARKS',
            icon: 'check',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
        }catch (error) {
        console.error('Error deleting data:', error);
      }
      },

///////////////////////////////////AUDIT Status//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

editIRAudit(IRNo){
      this.setAuditDialogs = true;
      this.IrNo = IRNo;
    },

async saveIRAuditStatus(){
    try {
          const payload = { IRNo: this.IrNo, AuditStatus: false };
          console.log(payload)
          const response = await this.$store.dispatch("ApplyStore/putauditIR", payload);
          this.itemWait = true;
          setTimeout(() => {
            this.getInc();
            this.itemWait = false;
          }, 2000);
          this.$q.notify({
            color: 'green-8',
            position: 'top',
            message: 'SUCCESS CLOSING STATUS',
            icon: 'check',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          this.setAuditDialogs = false;
          this.AuditStatus = '';
    } catch (error) {
          console.error('Error updating status:', error);
          // Optionally, you can show an error message to the user
      }
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
.IRAHText{
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
  margin-top: 50px;
  margin-left: 45%;
}

/* ///////////////////////////////////////TABLE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.SIODialog{
  background-color: #ffffff;
}
.SIOTRANS {
  padding: 1em;
  width: auto;
  height: 200px;
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: #ccc;
}
.SIOCARD{
  height: 690px;
  width: 840px;
  background-color: #ccc;
}
.AuditIR{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.AuditText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
/* ////////////////////////////////////// ADD RISK ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.custom-card {
  background-color:#ffffff;
  color: rgb(0, 0, 0);
  height: 700px; /* Adjust the height as needed */
}

.custom-card-actions {
  border-top: 4px solid #d5d7da;
  margin-top: auto;
}

.button1{
  width: 80px;
  font-size: 15px;
  box-shadow: #000000;
}

.expansiondes{
  font-size: 18px;
  font-weight: bold;
  color: #FFC619;
  background-color: #003566;
  border: 0.2em solid #dadbde;
}
/* ////////////////////////////////////// RISK TABLE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-header {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px;
  text-align: left;
  word-wrap: break-word; /* Enable word wrapping */
}

.custom-cell {
  padding: 10px;
  border: 1px solid #ddd;
  word-wrap: break-word; /* Enable word wrapping */
  max-width: 110px; /* Set a maximum width for cells */
  white-space: normal; /* Allow the text to wrap to the next line */
}

.risk-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.risk-wait {
  margin-top: 8px;
  font-style: roboto;
  font-weight: bold;
  font-size: 30px;
  color: #FFC619;
  display: flex;
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
    border: 1px solid #ccc; /* Border style */
    border-radius: 1px; /* Border radius */
    padding: 5px; /* Optional padding */
}
.ADDialog{
  background-color: #ffffff;
  max-height: 100%; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.ADIR{
  height: 85px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.ADText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.ADlist {
  height: 15%;
  width: 100%;
  border: 0.1em solid #cacaca;
  background-color: #003566;
}
.ADDes {
  padding: 8px;
  margin-top: 5px;
  width: 98%;
  font-size: 15px;
  border: 0.1em solid #cacaca;
}
.ADTextlist{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
}

/* ///////////////////////////////////////AUDIT NOTE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.ADNDIA{
  background-color: #ffffff;
  height: 95%; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.ADNHead{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  width: 100%;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.ADNText{
  font-weight: bold;
  font-style: Arial Black;
  display: flex;
  color: #FFC619;
  font-size: 30px;
  justify-content: center;
}
.button-container {
    display: flex;
}

/* ///////////////////////////////////////ADD NOTE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.ADANDIA{
  background-color: #ffffff;
  width: 450px;
  height: 395px;
  border: 0.2em solid #f3f4f7;
  font-weight: bold;
  font-style: Arial Black;
}
.ADANHead{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color:  #003566;;
  border: 0.6em solid #d5d7da;
}
.ADANText{
  font-weight: bold;
  font-style: Arial Black;
  display: flex;
  color: #FFC619;
  font-size: 30px;
  justify-content: center;
}

/* ///////////////////////////////////////ADD NOTE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.ADANCon {
    border: 1px solid #ccc; /* Border style */
    border-radius: 1px; /* Border radius */
    padding: 10px; /* Optional padding */
    font-size: 15px;
    font-style: Arial Black;
}
.ADANPolicy{
  font-style: Arial Black;
  font-weight: bold;
  font-size: 18px;
}
.ADENDia{
  background-color: #ffffff;
  width: 480px;
  height: 338px;
  border: 0.2em solid #f3f4f7;
  font-weight: bold;
  font-style: Arial Black;
}
.ADENHead{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color:  #003566;;
  border: 0.6em solid #d5d7da;
}
.ADENText{
  font-weight: bold;
  font-style: Arial Black;
  display: flex;
  color: #FFC619;
  font-size: 30px;
  justify-content: center;
}

/* ///////////////////////////////////////HRSTATUS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.ADStatus{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.ADSText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
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
  color: #FFC619;
  display: flex;
}
</style>
