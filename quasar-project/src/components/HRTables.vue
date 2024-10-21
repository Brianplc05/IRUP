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
          <q-card class="HRVDia">
            <q-card-section class="HRVHead">
              <div class="HRVText">INCIDENT REPORT DETAILS</div>
              <div class="HRVBC">
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
                <q-item v-for="(ird, index) in IRQADetailss" :key="index">
                  <q-item-section class="custom-item-section">
                    <q-item-section class="HRVList">
                      <div class="HRVGT">INCIDENT INFORMATION</div>
                    </q-item-section>

                    <q-item-section class="HRDes">
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div><b>INCIDENT REPORT NUMBER:</b> {{ ird.IRNo }}</div>
                        <div>
                          <b>INCIDENT REPORT DATE CREATED:</b>
                          {{ FormatDate(ird.DateTimeCreated) }}
                        </div>
                      </div>
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div>
                          <b>PRIMARY(DEPARTMENT):</b> {{ ird.PrimaryDept }}
                        </div>
                        <div>
                          <b>SECONDARY(DEPARTMENT/S):</b>
                          {{ ird.DeptCodeInvDescriptions }}
                        </div>
                      </div>
                    </q-item-section>

                    <q-item-section class="HRDes">
                      <div>
                        <b>SUBJECT OF THE INCIDENT:</b> {{ ird.SubjectName }}
                      </div>
                      <div>
                        <b>LOCATION OF THE INCIDENT:</b> {{ ird.SubjectLoc }}
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

                    <q-item-section class="HRDes">
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

                    <q-item-section class="HRDes">
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

                    <q-item-section class="HRDes">
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

                    <q-item-section class="HRDes">
                      <q-item-section class="HRVList">
                        <div class="HRVGT">
                          ROOT CAUSE ANALYSIS (RCA) ACTION ITEMS
                        </div>
                      </q-item-section>
                      <q-item-section v-if="ird.ActionItem">
                        <div><b>ACTION DETAILS:</b></div>
                        <div>
                          <p>{{ ird.ActionItem }}</p>
                        </div>
                      </q-item-section>
                      <q-item-section v-else>
                        <div><b>ACTION DETAILS:</b></div>
                        <div
                          style="
                            text-align: center;
                            font-size: 30px;
                            color: #a9a9a9;
                          "
                        >
                          <p><i>~ACTION DETAILS IS EMPTY~</i></p>
                        </div>
                      </q-item-section>
                    </q-item-section>

                    <q-item-section class="HRDes">
                      <q-item-section class="HRVList">
                        <div class="HRVGT">HUMAN RESOURCES(HR) NOTES</div>
                      </q-item-section>
                      <q-item-section v-if="ird.newHRNote">
                        <div><b>NOTE:</b></div>
                        <div>
                          <p>{{ ird.newHRNote }}</p>
                        </div>
                      </q-item-section>
                      <q-item-section v-else>
                        <div><b>NOTE:</b></div>
                        <div
                          style="
                            text-align: center;
                            font-size: 30px;
                            color: #a9a9a9;
                          "
                        >
                          <p><i>~HR NOTE IS EMPTY~</i></p>
                        </div>
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

    <!-- <template v-slot:body-cell-rcastatus="props">
    <q-td>
      <span v-if="props.row.RCA === '2'" class="text-dark text-bold text-center">NOT APPLICABLE</span>
      <span v-if="props.row.RCA === '3'" class="text-positive text-bold text-center">YES</span>
    </q-td>
  </template> -->

    <template v-slot:body-cell-QA="props">
      <q-td :props="props">
        <span class="text-dark text-bold text-center">
          {{ props.row.MainFullName }}
        </span>
        <br />
        <span
          v-if="props.row.TransferFullName !== null"
          class="text-dark text-bold text-center"
        >
          REDIRECTED TO:
          <b style="background: #ffc619">{{ props.row.TransferFullName }}</b>
        </span>
      </q-td>
    </template>

    <!-- <template v-slot:body-cell-qaref="props">
    <q-td>
      <span v-if="props.row.QAReferral === 1" class="text-positive text-bold text-center">YES</span>
      <span v-if="props.row.QAReferral === 2" class="text-negative text-bold text-center">NO</span>
    </q-td>
  </template> -->

    <template v-slot:body-cell-lostrec="props">
      <q-td>
        <span
          v-if="props.row.lostRec === 1"
          class="text-positive text-bold text-center"
          >YES</span
        >
        <span
          v-if="props.row.lostRec === 2"
          class="text-negative text-bold text-center"
          >NO</span
        >
      </q-td>
    </template>

    <template v-slot:body-cell-financialLia="props">
      <q-td>
        <q-btn
          push
          :ripple="{ center: true }"
          @click="editFinlia(props.row.IRNo)"
          label="APPLICABLE"
          style="width: 125px"
          v-if="props.row.FinancialLiability == 'APPLICABLE'"
          class="bg-positive text-white text-bold text-center shadow-5"
        >
        </q-btn>
        <q-btn
          push
          style="width: 125px"
          label="COLLECT"
          v-if="props.row.FinancialLiability === 'COLLECT'"
          :disable="props.row.FinancialLiability === 'COLLECT'"
          class="bg-negative text-white text-bold text-center shadow-5"
        />
        <q-btn
          push
          style="width: 125px"
          label="WAVE"
          v-if="props.row.FinancialLiability === 'WAVE'"
          :disable="props.row.FinancialLiability === 'WAVE'"
          class="bg-positive text-white text-bold text-center shadow-5"
        />
        <q-btn
          push
          :ripple="{ center: true }"
          label="NOT APPLICABLE"
          style="width: 125px"
          :disable="
            props.row.FinancialLiability === 'NOT APPLICABLE' ||
            props.row.lostRec === 2
          "
          v-if="
            props.row.FinancialLiability === 'NOT APPLICABLE' ||
            props.row.lostRec === 2
          "
          class="bg-dark text-white text-bold text-center shadow-5"
        />

        <!-- <div old process>
      <q-btn
        push
        :ripple="{ center: true }"
        :disable="props.row.FinancialLiability === 'COLLECT' || props.row.FinancialLiability === 'WAVE'"
        @click="editFinlia(props.row.IRNo)"
        style="width: 125px;"
        v-if="props.row.lostRec === 1 && props.row.QAReferral === 1"
        :class="{
          'bg-positive': props.row.FinancialLiability !== 'COLLECT',
          'bg-negative': props.row.FinancialLiability === 'COLLECT'
        }"
        class="text-white text-bold text-center shadow-5"
      >
        <b v-if="props.row.FinancialLiability !== null">{{ props.row.FinancialLiability }}</b>
      </q-btn>

      <q-btn
        push
        :ripple="{ center: true }"
        label="NOT APPLICABLE"
        style="width: 125px;"
        :disable="props.row.lostRec === 2"
        v-if="props.row.QAReferral === 2 && props.row.lostRec === 2"
        class="bg-dark text-white text-bold text-center shadow-5"
      />

      <q-btn
        push
        :ripple="{ center: true }"
        label="NOT APPLICABLE"
        style="width: 125px;"
        :disable="props.row.QAReferral === 1"
        v-if="props.row.QAReferral === 1 && props.row.lostRec === 2"
        class="bg-dark text-white text-bold text-center shadow-5"
      />

      <q-btn
        push
        :ripple="{ center: true }"
        label="NOT APPLICABLE"
        style="width: 125px;"
        :disable="props.row.QAReferral === 2"
        v-if="props.row.QAReferral === 2 && props.row.lostRec === 1"
        class="bg-dark text-white text-bold text-center shadow-5"
      />
</div old process> -->

        <q-dialog v-model="setFinLiaDialogs">
          <q-card>
            <q-card-section class="HRHS">
              <div class="row items-center justify-between">
                <div class="HRHSTest">PECUNIARY LIABILITY</div>
              </div>
            </q-card-section>
            <q-input
              outlined
              v-model="IrNo"
              label="IRNo."
              style="display: none"
            />
            <q-card-actions align="center">
              <q-btn
                style="width: 115px"
                label="WAVE"
                class="bg-accent text-black text-bold text-center shadow-5"
                @click="saveResponse('WAVE')"
              />
              <q-btn
                style="width: 115px"
                label="COLLECT"
                class="bg-accent text-black text-bold text-center shadow-5"
                @click="saveResponse('COLLECT')"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="waitplease"
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
      </q-td>
    </template>

    <!-- <template v-slot:body-cell-hrdisAct="props">
    <q-td>
         <q-btn
            label="NO"
            @click="editHRAct(props.row.IRNo, false)"
            v-if="props.row.HRDicipAction === true"
            class="bg-negative text-white text-bold text-center"
          />
          <q-btn
            label="YES"
            :disable="props.row.HRDicipAction === false"
            v-if="props.row.HRDicipAction === false"
            class="bg-positive text-white text-bold text-center"
          />

        <q-dialog v-model="setHRActDialogs">
          <q-card>
            <q-card-section class="HRDA">
              <div class="row items-center justify-between">
                <div class="HRDAText">DISCIPLINARY ACTION</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="q-mt"><p>DO YOU WANT TO DEMERIT A PERSON?</p></div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="NO" color="primary" @click="setHRActDialogs = false" />
              <q-btn label="YES" color="accent" class="text-black" @click="saveHRAct" />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </q-td>
  </template> -->

    <!-- <template v-slot:body-cell-demerit= "props">
      <q-td>

        <template v-if="props.row.QAReferral === null && props.row.lostRec === null">
          <q-btn
            push
            :disable="props.row.QAReferral === null && props.row.lostRec === null"
            icon="settings"
            :ripple="{ center: true }"
            style="width: 100px;"
            class="bg-positive text-white text-bold text-center shadow-5"
          />
        </template>
        <template v-if="props.row.QAReferral === 1 && props.row.lostRec === 1">
          <q-btn
            push
            :disable="props.row.FinancialLiability === 'APPLICABLE' ||  props.row.FinancialLiability === 'NOT APPLICABLE' || props.row.DisciplineCode !== null"
            icon="settings"
            @click="editEmp(props.row.IRNo)"
            :ripple="{ center: true }"
            style="width: 100px;"
            class="bg-positive text-white text-bold text-center shadow-5"
          />
        </template>
        <template v-if="props.row.QAReferral === 1 && props.row.lostRec === 2">
          <q-btn
            push
            :disable="props.row.FinancialLiability === 'COLLECT' || props.row.FinancialLiability === 'WAVE' || props.row.DisciplineCode !== null"
            icon="settings"
            @click="editEmp(props.row.IRNo)"
            :ripple="{ center: true }"
            style="width: 100px;"
            class="bg-positive text-white text-bold text-center shadow-5"
          />
        </template>
        <template v-if="props.row.QAReferral === 2 && props.row.lostRec === 2">
          <q-btn
            push
            :disable="props.row.FinancialLiability === 'APPLICABLE' || props.row.FinancialLiability === 'NOT APPLICABLE'"
            icon="settings"
            @click="editEmp(props.row.IRNo)"
            :ripple="{ center: true }"
            style="width: 100px;"
            class="bg-positive text-white text-bold text-center shadow-5"
          />
        </template>
        <template v-if="props.row.QAReferral === 2 && props.row.lostRec === 1">
          <q-btn
            push
            :disable="props.row.FinancialLiability === 'APPLICABLE' ||  props.row.FinancialLiability === 'NOT APPLICABLE'"
            icon="settings"
            @click="editEmp(props.row.IRNo)"
            :ripple="{ center: true }"
            style="width: 100px;"
            class="bg-positive text-white text-bold text-center shadow-5"
          />
        </template>

            <q-dialog v-model="editDialog" transition-show="rotate" transition-hide="rotate" persistent>
                <q-card class="HRDE">
                      <q-card-section class="HRDHead">
                        <div class="HRDText">EMPLOYEE OFFENSE RECORD</div>
                      </q-card-section>
                      <q-card-section class="HRDForm">
                          <q-card-section class="HRDEH">

                            <q-card-section>
                            <q-input outlined v-model="IrNo" label="IRNo." style="display: none;"/>
                            </q-card-section>

                            <div class="HRDEHText">EMPLOYEE/S INVOLVED
                              <q-btn
                                style="margin-left: 150px"
                                flat
                                round
                                dense
                                icon="add"
                                @click="addEmParty"
                              />
                            </div>
                          </q-card-section>

                          <q-card-section>
                            <div>
                              <div
                                v-for="(party, index) in Emparties"
                                :key="index"
                                style="display: flex; justify-content: space-between; align-items: center;"
                              >
                              <q-select
                                use-input
                                square
                                outlined
                                clearable
                                v-model="party.EmployeeCode"
                                :options="disEmployees"
                                @filter="FilterFn"
                                label="EMPLOYEE NAME"
                                emit-value
                                map-options
                                :option-value="option => option.EmployeeCode"
                                :option-label="option => option.FullName"
                                style="width: 85%; margin-top: 5px;">

                                <template v-slot:no-option>
                                  <q-item>
                                    <q-item-section class="text-grey">
                                      No results
                                    </q-item-section>
                                  </q-item>
                                </template>
                                </q-select>

                                <q-btn
                                  @click="removeParty(index)"
                                  color="negative"
                                  icon="remove_circle"
                                  class="q-ml-md"
                                  size="sm"
                                  style="margin-left: 10px;"
                                />
                              </div>
                            </div>
                          </q-card-section>

                          <q-separator style="background-color: #FFC619; height: 2px; margin: 10px 0;"></q-separator>

                          <q-card-section>
                            <q-select
                                use-input
                                square
                                outlined
                                clearable
                                v-model="DisciplineCode"
                                :options="disCod"
                                label="SECTION"
                                emit-value
                                map-options
                                :option-value="option => option.DisciplineCode"
                                :option-label="option => option.DisciplineName"
                                style="margin-top: 5px;"
                                />

                              <q-select
                                use-input
                                square
                                outlined
                                clearable
                                v-model="SpecificOfNo"
                                :options="filteredSpecificOff"
                                label="SPECIFIC OFFENSES"
                                emit-value
                                map-options
                                :option-value="option => option.SpecificOfNo"
                                :option-category="option => option.DisciplineCode"
                                :option-label="option => option.SpecificOffenses"
                                style="margin-top: 10px;"
                                />
                            <q-select outlined square clearable label="NUMBER OF OCCURRENCES" v-model="Occurrence" :options="Occurrences" style="margin-top: 10px;" ></q-select>
                            <q-select outlined square clearable label="PENALTY IMPOSED" v-model="Penalties" :options="Penalty" style="margin-top: 10px;"></q-select>
                          </q-card-section>
                        </q-card-section>
                          <q-separator style="background-color: #d5d7da; height: 2px; margin: 5px 0;"></q-separator>
                          <q-card-actions align="right">
                            <q-btn push label="CANCEL" color="secondary" @click="onReset" />
                            <q-btn push label="SAVE" color="accent" class="text-black" @click="handleSave" />
                          </q-card-actions>
                </q-card>
            </q-dialog>


            <q-dialog v-model="waitOff" persistent content-class="non-transparent-dialog">
              <q-card class="centered-card">
                <q-card-section>
                  <div class="spinner-container">
                    <q-spinner-facebook size="100px"></q-spinner-facebook>
                    <div class="please-wait">PLEASE WAIT...</div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>

      </q-td>
  </template> -->

    <template v-slot:body-cell-hrnotes="props">
      <td>
        <q-btn
          push
          icon="note_add"
          :disable="props.row.newHRNote !== null"
          v-if="
            props.row.lostRec === 2 ||
            props.row.FinancialLiability === 'NOT APPLICABLE'
          "
          @click="editHRNotes(props.row.IRNo)"
          :ripple="{ center: true }"
          style="width: 100px"
          :class="[
            {
              'bg-dark': props.row.newHRNote !== null,
              'bg-positive': props.row.newHRNote === null,
            },
            'text-white text-bold text-center shadow-5',
          ]"
        />

        <q-btn
          push
          icon="note_add"
          :disable="
            props.row.HRStatus === false || props.row.newHRNote !== null
          "
          v-if="
            props.row.FinancialLiability === 'COLLECT' ||
            props.row.FinancialLiability === 'WAVE'
          "
          @click="editHRNote(props.row.IRNo)"
          :ripple="{ center: true }"
          style="width: 100px"
          :class="[
            {
              'bg-dark': props.row.newHRNote !== null,
              'bg-positive': props.row.newHRNote === null,
            },
            'text-white text-bold text-center shadow-5',
          ]"
        />

        <q-dialog v-model="setHRNDialogs" persistent>
          <q-card class="HRNT">
            <q-card-section class="HRNHead">
              <div class="HRNText">ADD NOTES/ RECOMMENDATION</div>
            </q-card-section>

            <q-card-section>
              <q-input
                outlined
                v-model="IrNo"
                label="IRNo."
                style="display: none"
              />
              <q-input
                v-model="addNewNote"
                filled
                label="Note"
                type="textarea"
                class="q-mt-s"
                auto-focus
              />
            </q-card-section>

            <q-separator
              style="background-color: #d5d7da; height: 2px; margin: 5px 0"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="CANCEL"
                color="secondary"
                @click="cancelConclusion"
              />
              <q-btn
                push
                label="SAVE"
                color="accent"
                class="text-black"
                @click="ConSubmit"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="waitNote"
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

        <q-dialog v-model="setHRNoteDialogs" persistent>
          <q-card class="HRNT">
            <q-card-section class="HRNHead">
              <div class="HRNText">ADD NOTES/ RECOMMENDATION</div>
            </q-card-section>

            <q-card-section>
              <q-input
                outlined
                v-model="IrNo"
                label="IRNo."
                style="display: none"
              />
              <q-input
                v-model="addNewNote"
                filled
                label="Note"
                type="textarea"
                class="q-mt-s"
                auto-focus
              />
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px; margin: 5px 0"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="CANCEL"
                color="secondary"
                @click="cancelHRConclusion"
              />
              <q-btn
                push
                label="SAVE"
                color="accent"
                class="text-black"
                @click="ConHRSubmit"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </td>
    </template>

    <template v-slot:body-cell-hrstatus="props">
      <q-td>
        <q-btn
          push
          :disable="props.row.newHRNote === null"
          label="OPEN"
          @click="editIRHR(props.row.IRNo, false)"
          v-if="props.row.HRStatus === true"
          :ripple="{ center: true }"
          style="width: 100px"
          class="bg-positive text-white text-bold text-center shadow-5"
        />
        <q-btn
          push
          label="CLOSE"
          :disable="props.row.newHRNote !== null"
          v-if="props.row.HRStatus === false"
          :ripple="{ center: true }"
          style="width: 100px"
          class="bg-negative text-white text-bold text-center shadow-5"
        />

        <q-dialog v-model="setHRDialogs">
          <q-card>
            <q-card-section class="HRHS">
              <div class="row items-center justify-between">
                <div class="HRHSTest">CONFIRM CLOSE</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>DO YOU WANT TO CLOSE THE INCIDENT REPORT?</div>
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px; margin: 5px 0"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="NO"
                color="secondary"
                @click="setHRDialogs = false"
              />
              <q-btn
                push
                label="YES"
                color="accent"
                class="text-black"
                @click="saveIRHRStatus"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
    hrstatus: Object,
    getInc: Function,
    getQAForm: Array,
    DemOp: Object,
    rcaStats: Object,
    disCod: Array,
    disSpeOF: Array,
    Occurrences: Object,
    Penalty: Object,
  },
  data() {
    return {
      IRQADetailss: [],
      Emparties: [],
      iRNo: "",
      setHRDialogs: false,
      setHRActDialogs: false,
      setHRNDialogs: false,
      IrNo: "",
      selectedIrNo: "",
      addNewNote: "",
      lostRec: "",

      // -------------------
      setFinLiaDialogs: false,
      waitplease: false,

      // -------------------
      setHRNoteDialogs: false,

      // -------------------
      disEmployees: [],
      editDems: null,
      setDemDialogs: false,
      IRDialog: false,
      setDialogs: false,
      setRCADialogs: false,
      editDialogs: false,

      // -------------------
      editDialog: false,
      EmployeeCode: "",
      DisciplineCode: "",
      SpecificOfNo: "",
      Occurrence: "",
      Penalties: "",

      // -------------------
      waitOff: false,
      waitNote: false,
    };
  },

  computed: {
    ...mapGetters({ employees: "ApplyStore/employees" }),
    filteredSpecificOff() {
      if (!this.DisciplineCode) {
        return this.disSpeOF;
      } else {
        return this.disSpeOF.filter(
          (option) => option.DisciplineCode === this.DisciplineCode
        );
      }
    },
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
        this.selectedIrNo = IRNo;
        const response = await this.$store.dispatch(
          "ApplyStore/disIrpHR",
          data
        );
        this.IRQADetailss = this.getQAForm;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    ///////////////////////////////////////////////////////////sTATUS///////////////////////////////////////////////////////////////////////////////////////////////

    editIRHR(IRNo) {
      this.setHRDialogs = true;
      this.IrNo = IRNo;
    },

    async saveIRHRStatus() {
      try {
        const payload = { IRNo: this.IrNo, HRStatus: false };
        const response = await this.$store.dispatch(
          "ApplyStore/puthrIR",
          payload
        );
        setTimeout(() => {
          this.getInc();
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS CLOSING STATUS",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        this.setHRDialogs = false;
        this.HRStatus = "";
      } catch (error) {
        console.error("Error updating status:", error);
        // Optionally, you can show an error message to the user
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////FINANCIAL LIABILITY////////////////////////////////////////////////////////////////////////////////////////////////////

    editFinlia(IRNo) {
      this.setFinLiaDialogs = true;
      this.IrNo = IRNo;
    },

    async saveResponse(choice) {
      try {
        this.waitplease = true;
        const payload = { IRNo: this.IrNo, FinancialLiability: choice };
        const response = await this.$store.dispatch(
          "ApplyStore/AddfinLia",
          payload
        );
        setTimeout(() => {
          this.getInc();
          this.waitplease = false;
        }, 3000);
        this.setFinLiaDialogs = false;
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS INPUTTING FIELDS",
          icon: "check",
          iconColor: "white",
          timeout: 4000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    //////////////////////////////////////////////////////HRDicipAction////////////////////////////////////////////////////////////////////////////////////////////////////

    // editHRAct(IRNo){
    //       this.setHRActDialogs = true;
    //       this.IrNo = IRNo;
    //     },

    //     async saveHRAct(){
    //     try {
    //           const payload = { IRNo: this.IrNo, HRDicipAction: false };
    //           console.log(payload)
    //           const response = await this.$store.dispatch("ApplyStore/putDisAct", payload);
    //           setTimeout(() => {
    //             this.getInc();
    //           }, 2000);
    //           this.$q.notify({
    //             color: 'green-8',
    //             position: 'top',
    //             message: 'SUCCESS TAGGING DISCIPLINARY ACTION ',
    //             icon: 'check',
    //             iconColor: 'white',
    //             timeout: 1000,
    //             progress: true,
    //           });
    //           this.setHRActDialogs = false;
    //           this.HRDicipAction = '';
    //     } catch (error) {
    //           console.error('Error updating status:', error);
    //           // Optionally, you can show an error message to the user
    //       }
    //     },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////ADD NOTE/////////////////////////////////////////////////////////////////////////////////////////////

    editHRNote(IRNo) {
      this.setHRNDialogs = true;
      this.IrNo = IRNo;
    },

    async ConSubmit() {
      try {
        if (!this.validateNOTE()) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000, // Increased timeout to 2000 milliseconds
            progress: true,
          });
          this.setHRNDialogs = true;
          return;
        }
        const data = {
          newHRNote: this.addNewNote,
          iRNo: this.IrNo,
        };
        this.setHRNDialogs = false;
        this.waitNote = true;
        await this.$store.dispatch("ApplyStore/AddNew", data);
        setTimeout(() => {
          this.getInc();
          this.waitNote = false;
          this.cancelConclusion();
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS ADDING CONCLUSION",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    cancelConclusion() {
      this.IrNo = "";
      this.addNewNote = ""; // Clears the array noteDetails by assigning an empty array
      this.setHRNDialogs = false;
    },

    validateNOTE() {
      return this.IrNo && this.addNewNote;
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    editHRNotes(IRNo) {
      this.setHRNoteDialogs = true;
      this.IrNo = IRNo;
    },

    async ConHRSubmit() {
      try {
        if (!this.validateHRNOTE()) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000, // Increased timeout to 2000 milliseconds
            progress: true,
          });
          this.setHRNoteDialogs = true;
          return;
        }
        const data = {
          newHRNote: this.addNewNote,
          iRNo: this.IrNo,
        };
        this.setHRNoteDialogs = false;
        this.waitNote = true;
        setTimeout(() => {
          this.getInc();
          this.waitNote = false;
          this.cancelConclusion();
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS ADDING CONCLUSION",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
        await this.$store.dispatch("ApplyStore/AddNoteNew", data);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    cancelHRConclusion() {
      this.IrNo = "";
      this.addNewNote = ""; // Clears the array noteDetails by assigning an empty array
      this.setHRNoteDialogs = false;
    },

    validateHRNOTE() {
      return this.IrNo && this.addNewNote;
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    FilterFn(val, update) {
      if (val === "") {
        update(() => {
          this.disEmployees = this.employees;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.disEmployees = this.employees.filter((option) => {
          return option.FullName.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    addEmParty() {
      if (this.Emparties.length < 5) {
        this.Emparties.push({ EmployeeCode: "" });
      } else {
        this.$q.notify({
          type: "negative",
          message: "Cannot add more parties",
        });
      }
    },

    removeParty(index) {
      this.Emparties.splice(index, 1);
    },

    editEmp(IRNo) {
      this.editDialog = true;
      this.IrNo = IRNo;
    },

    async handleSave() {
      try {
        if (!this.validateForm()) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000, // Increased timeout to 2000 milliseconds
            progress: true,
          });
          this.editDialog = true;
          return;
        }
        const data = {
          iRNo: this.IrNo,
          EmployeeCode: this.Emparties.map((party) => party.EmployeeCode),
          DisciplineCode: this.DisciplineCode,
          SpecificOfNo: this.SpecificOfNo,
          Occurrence: this.Occurrence.value,
          Penalties: this.Penalties.value,
        };
        const response = await this.$store.dispatch("ApplyStore/EmplDem", data);
        this.editDialog = false;
        this.waitOff = true;
        setTimeout(() => {
          this.getInc();
          this.waitOff = false;
          this.onReset();
        }, 3000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESSFUL DEMERITING EMPLOYEES",
          icon: "check",
          iconColor: "white",
          timeout: 4000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    validateForm() {
      return (
        this.IrNo &&
        this.Emparties &&
        this.SpecificOfNo &&
        this.DisciplineCode &&
        this.Occurrence &&
        this.Penalties
      );
    },

    onReset() {
      this.Emparties = [];
      this.IrNo = "";
      (this.DisciplineCode = ""),
        (this.SpecificOfNo = ""),
        (this.Occurrence = "");
      this.Penalties = "";
      this.editDialog = false;
    },
  },
};
</script>
