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
          <q-card class="QADialog">
            <q-card-section class="QAIR">
              <div class="row items-center justify-between">
                <div class="QAText">INCIDENT REPORT</div>
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
                    <q-item-section class="QAlist">
                      <div class="QATextlist">INCIDENT INFORMATION</div>
                    </q-item-section>

                    <q-item-section class="QADes">
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

                    <q-item-section class="QADes">
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

                    <q-item-section class="QADes">
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

                    <q-item-section class="QADes">
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

                    <q-item-section class="QADes">
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

                    <q-item-section class="QADes">
                      <q-item-section class="QAlist">
                        <div class="QATextlist">
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
        <span class="text-dark text-bold text-center">{{
          props.row.MainFullName
        }}</span>

        <!-- <span
          v-if="props.row.MainFullName !== 'null'"
          :class="{
            'cursor-not-allowed':
              props.row.TransferFullName !== null ||
              props.row.QAStatus === false,
          }"
          @click="
            props.row.TransferFullName === null && props.row.QAStatus !== false
              ? qaTransfer(props.row.IRNo, props.row.SubjectCode)
              : null
          "
          class="text-dark text-bold text-center"
        >
          {{ props.row.MainFullName }}
        </span>

        <br />

        <span
          v-if="props.row.TransferFullName !== null"

        >
          REDIRECTED TO:
          <b style="background: #ffc619">{{ props.row.TransferFullName }}</b>
        </span>

        <q-dialog v-model="setQATraDialogs">
          <q-card>
            <q-card-section class="QAStatus">
              <div class="row items-center justify-between">
                <div class="QASText">CONFIRM TRANSFER</div>
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
                @click="setQATraDialogs = false"
              />
              <q-btn
                push
                label="YES"
                color="accent"
                class="text-black"
                @click="saveQATra"
              />
            </q-card-actions>
          </q-card>
        </q-dialog> -->
        <!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
        <!-- <q-dialog v-model="setQATrans" persistent>
          <q-card class="QAIC">
            <q-card-section class="QAICHead">
              <div class="row items-center justify-between">
                <div class="QAICText">QA TRANSFER</div>
              </div>
            </q-card-section>
            <q-card-section>
              <q-input outlined v-model="SubjectCode" style="display: none" />
              <q-select
                use-input
                square
                outlined
                v-model="EmpTransfer"
                :options="disQA"
                label="QA INCHARGE"
                emit-value
                map-options
                :option-value="(option) => option.EmployeeCode"
                :option-label="(option) => option.FullName"
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
                @click="cancelTrans"
              />
              <q-btn
                push
                label="SAVE"
                color="accent"
                class="text-black"
                @click="transfer"
              />
            </q-card-actions>
          </q-card>
        </q-dialog> -->

        <!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
        <!-- <q-dialog
          v-model="transfering"
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
        </q-dialog> -->
      </q-td>
    </template>

    <template v-slot:body-cell-involvedDept="props">
      <q-td>
        <span class="text-dark text-bold text-center">{{
          props.row.Department_Involved
        }}</span>
      </q-td>
    </template>

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

    <template v-slot:body-cell-rcaStat="props">
      <td style="width: 50px">
        <q-btn
          push
          :ripple="{ center: true }"
          :disable="props.row.PrimaryDept !== null"
          icon="mail_outline"
          @click="requiredRCA(props.row.IRNo)"
          :class="{
            'bg-positive': props.row.PrimaryDept === null,
            'bg-dark': props.row.PrimaryDept !== null,
          }"
          class="text-white text-bold text-center shadow-5"
        />

        <!-- <q-btn
          label="NOT REQUIRED"
          style="margin-left: 20px; width: 120px;"
          @click="editCon(props.row.IRNo)"
          class="bg-accent text-black text-bold text-center"
        /> -->

        <q-dialog v-model="setRCAreceived" persistent>
          <q-card class="QADeptIn">
            <q-card-section class="QADHead">
              <div class="row items-center justify-between">
                <div class="QADText">DEPARTMENTS INVOLVED</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>
                <q-select
                  use-input
                  square
                  outlined
                  clearable
                  v-model="PrimaryDept"
                  :options="disDept"
                  @filter="FilterFn"
                  label="(Primary) Department"
                  emit-value
                  map-options
                  :option-value="(option) => option.DeptCode"
                  :option-label="(option) => option.Dept_Desc"
                />
              </div>
            </q-card-section>

            <q-item-section class="QADLay q-ml-auto">
              <div class="QADTestlist">
                OTHER DEPARTMENT/S INVOLVED
                <q-btn
                  class="q-ml-auto"
                  flat
                  round
                  dense
                  icon="add"
                  @click="addParty"
                />
              </div>
            </q-item-section>

            <div>
              <div
                v-for="(party, index) in parties"
                :key="index"
                style="
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  margin-left: 15px;
                "
              >
                <q-select
                  use-input
                  square
                  outlined
                  clearable
                  v-model="party.DeptCodeInv"
                  :options="disDept"
                  label="Department Name"
                  @filter="FilterFn"
                  emit-value
                  map-options
                  :option-value="(option) => option.DeptCode"
                  :option-label="(option) => option.Dept_Desc"
                  style="margin-top: 10px; width: 80%"
                />

                <q-btn
                  @click="removeParty(index)"
                  color="negative"
                  icon="remove_circle"
                  class="q-ml-md"
                  size="sm"
                />
              </div>
            </div>

            <q-card-actions align="right" class="footer-actions">
              <q-btn
                push
                label="Cancel"
                color="secondary"
                @click="onRCACancel"
              />
              <q-btn
                push
                label="Save"
                color="accent"
                class="text-black"
                @click="submitRCAEmail"
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
                <div class="please-wait">
                  Notifiying the Department Heads. Please wait...
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </td>
    </template>

    <template v-slot:body-cell-rcastatus="props">
      <q-td>
        <q-btn
          push
          :ripple="{ center: true }"
          label="PENDING"
          @click="editConclusion(props.row.IRNo)"
          style="width: 125px"
          v-if="props.row.RCA === '1' && props.row.PrimaryDept !== null"
          class="bg-negative text-white text-bold text-center shadow-5"
        />

        <q-btn
          push
          :ripple="{ center: true }"
          label="RETURN"
          @click="editConclusion(props.row.IRNo)"
          style="width: 125px"
          v-if="props.row.RCA === '2' && props.row.PrimaryDept !== null"
          class="bg-accent text-black text-bold text-center shadow-5"
        />

        <q-btn
          push
          :ripple="{ center: true }"
          label="SUBMITTED"
          style="width: 125px"
          :disable="props.row.RCA === '3'"
          v-if="props.row.RCA === '3' && props.row.PrimaryDept !== null"
          class="bg-dark text-white text-bold text-center shadow-5"
        />

        <!-- ///////////////////////////////////////CONFIRM RCA SUBMISSION////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <q-dialog v-model="setRCASubDialogs">
          <q-card>
            <q-card-section class="QARCA">
              <div class="row items-center justify-between">
                <div class="QARText">CONFIRM RCA SUBMISSION</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>DO YOU RECEIVE THE ROOT CAUSE ANALYSIS (RCA) FORM?</div>
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="NO"
                color="secondary"
                @click="setRCASubDialogs = false"
              />
              <q-btn
                push
                label="YES"
                color="accent"
                class="text-black"
                @click="saveIRCA"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <!-- ///////////////////////////////////////RCA REMARKS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <q-dialog v-model="addConclusion" persistent>
          <q-card class="QCRCA">
            <q-card-section class="QCRHead">
              <div class="QCRText">RCA REMARKS</div>
            </q-card-section>

            <q-card-section>
              <q-input
                outlined
                v-model="IrNo"
                label="IRNo."
                style="display: none"
              />
              <q-input
                v-model="addConote"
                filled
                label="Note"
                type="textarea"
                class="q-mt-md"
                auto-focus
              />
            </q-card-section>

            <q-card-actions align="right" class="footer-actions">
              <q-btn
                push
                label="DISAPPROVED"
                color="secondary"
                @click="submitRCADisapprovedEmail(selectedIrNo)"
              />
              <q-btn
                push
                label="APPROVED"
                color="accent"
                class="text-black"
                @click="ConclusionSubmit(selectedIrNo)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <!-- ///////////////////////////////////////RCA APPROVED////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <q-dialog full-width full-height v-model="setRCAApproved" persistent>
          <q-card class="QCRCApproved">
            <q-card-section class="QAPApproved">
              <div class="row items-center justify-between">
                <div class="QAPText">ACTION ITEMS</div>
              </div>
            </q-card-section>
            <q-item-section class="QAPLay">
              <q-input
                outlined
                v-model="IrNo"
                label="IRNo."
                style="display: none"
              />
              <div class="QAPTestlist">
                ADD ACTIONS
                <q-btn
                  class="q-ml-auto"
                  flat
                  round
                  dense
                  icon="add"
                  @click="addActionItem"
                />
              </div>
            </q-item-section>

            <q-item-section>
              <div
                v-for="(party, index) in actionparties"
                :key="index"
                style="
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  margin-left: 10px;
                "
              >
                <q-input
                  v-model="party.ActionItem"
                  label="ACTION NOTE"
                  outlined
                  autogrow
                  style="width: 70%"
                />
                <q-input
                  v-model="party.TimelineFromDate"
                  square
                  outlined
                  label="TIMELINE FROM:"
                  style="width: 20%; margin-left: 15px; margin-right: 10px"
                />

                <q-input
                  v-model="party.TimelineToDate"
                  square
                  outlined
                  label="TIMELINE TO:"
                  style="width: 20%; margin-left: 5px; margin-right: 5px"
                  @click="showActionDatePicker = true"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                      @click="showActionDatePicker = true"
                    />
                  </template>

                  <q-dialog v-model="showActionDatePicker">
                    <q-card>
                      <q-card-section>
                        <q-date
                          landscape
                          v-model="party.TimelineToDate"
                          @input="updateSubjectDate"
                          :options="dateAfterOrToday"
                        />
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                </q-input>

                <q-btn
                  @click="removeActionItem(index)"
                  color="negative"
                  icon="remove_circle"
                  class="q-ml-md"
                  style="margin-right: 15px"
                  size="sm"
                />
              </div>
            </q-item-section>

            <q-card-actions align="right" class="acfooter-actions">
              <q-btn
                push
                label="Cancel"
                color="secondary"
                @click="onCancelApprovedRCA"
              />
              <q-btn
                push
                label="Save"
                color="accent"
                class="text-black"
                @click="saveRCAApprovedEmail(selectedIrNo)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="acWait"
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

        <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
      </q-td>
    </template>

    <template v-slot:body-cell-actionitems="props">
      <q-td>
        <q-btn
          push
          :disable="
            props.row.QAStatus === false ||
            (props.row.CombinedActionItems &&
              !props.row.CombinedActionItems.split(', ').includes('1'))
          "
          v-if="
            props.row.RCA === '3' &&
            props.row.CombinedActionItems &&
            props.row.CombinedActionItems.split(', ').includes('1')
          "
          @click="viewActionItem(props.row.IRNo)"
          style="width: 125px"
          label="INCOMPLETE"
          class="bg-accent text-black text-bold text-center"
        >
        </q-btn>

        <q-btn
          :disable="
            props.row.CombinedActionItems &&
            !props.row.CombinedActionItems.split(', ').includes('1')
          "
          v-if="
            props.row.CombinedActionItems &&
            !props.row.CombinedActionItems.split(', ').includes('1')
          "
          class="bg-dark text-white text-bold text-center"
          label="COMPLETE"
          style="width: 125px"
        />

        <!-- //////////////////////////////////////ACTION ITEMS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <q-dialog
          full-width
          full-height
          v-model="setActionItemDialogs"
          persistent
        >
          <q-card class="QAACT">
            <q-card-section class="QAACTHead">
              <div class="row items-center justify-between">
                <div class="QAACText">ACTION DETAILS</div>
                <div>
                  <q-btn
                    push
                    label="CLOSE"
                    color="info"
                    class="text-black"
                    @click="onCloseActionItems()"
                  />
                  <q-btn
                    push
                    v-if="hasPendingActions"
                    label="SAVE"
                    color="accent"
                    class="text-black"
                    @click="editDoneStatus"
                    style="margin-left: 10px"
                  />
                  <q-btn
                    push
                    v-else
                    label="SAVE"
                    color="accent"
                    class="text-black"
                    @click="editIRQA(selectedIrNo)"
                    style="margin-left: 10px"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <q-list bordered>
                <q-item
                  v-for="(actionitems, index) in actionitemDetails"
                  :key="index"
                >
                  <q-item-section class="QAACTABLE" v-if="actionitems">
                    <div class="QAACTabtext">
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <div>
                          <b>TIMELINE FROM:</b>
                          {{
                            FormatTimelineDateFrom(actionitems.TimelineFromDate)
                          }}
                        </div>
                        <div>
                          <b>TIMELINE TO:</b>
                          {{ FormatTimelineDateTo(actionitems.TimelineToDate) }}
                        </div>
                      </div>
                      <div
                        style="
                          background-color: #ffc619;
                          height: 2px;
                          margin: 5px 0;
                        "
                      ></div>
                      <div>
                        <b>CORRECTIVE/ PREVENTIVE ACTION:</b><br />
                        {{ actionitems.ActionItem }}
                      </div>
                    </div>
                  </q-item-section>

                  <q-item-section style="border: 1px solid #ccc" side>
                    <span
                      class="text-dark text-bold text-center"
                      style="margin-bottom: 10px; margin-right: 20px"
                      >VERIFICATION</span
                    >
                    <q-btn
                      push
                      v-if="actionitems.ActionStatus === 1"
                      @click="editActionStatus(actionitems.Id)"
                      label="PENDING"
                      style="width: 100px; margin-right: 15px"
                      class="bg-negative text-white text-bold text-center shadow-5"
                    />
                    <q-dialog v-model="setActionStatusDialogs" persistent>
                      <q-card>
                        <q-card-section class="QAACStatus">
                          <div class="row items-center justify-between">
                            <div class="QAACSText">CONFIRM ACTION STATUS</div>
                          </div>
                        </q-card-section>
                        <q-card-section>
                          <div>
                            ARE YOU SURE THAT THE CORRECTIVE/ PREVENTIVE WAS
                            IMPLEMENTED?
                          </div>
                        </q-card-section>

                        <q-separator
                          style="background-color: #d5d7da; height: 2px"
                        ></q-separator>
                        <q-card-actions align="right">
                          <q-btn
                            push
                            label="NO"
                            color="secondary"
                            @click="setActionStatusDialogs = false"
                          />
                          <q-btn
                            push
                            label="YES"
                            color="accent"
                            class="text-black"
                            @click="saveActionStatus(actionitems.IRNo)"
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>

                    <q-btn
                      push
                      v-if="actionitems.ActionStatus === 2"
                      :disable="actionitems.ActionStatus === 2"
                      label="DONE"
                      style="width: 100px; margin-right: 15px"
                      class="bg-positive text-white text-bold text-center shadow-5"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="setQADialogs">
          <q-card>
            <q-card-section class="QAStatus">
              <div class="row items-center justify-between">
                <div class="QASText">CONFIRM SAVE</div>
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                outlined
                v-model="IrNo"
                label="IRNo."
                style="display: none"
              />
              <div>WAS THE CORRECTIVE/PREVENTIVE ACTION IMPLEMENTED?</div>
            </q-card-section>
            <q-separator
              style="background-color: #d5d7da; height: 2px"
            ></q-separator>
            <q-card-actions align="right">
              <q-btn
                push
                label="CLOSE"
                color="secondary"
                @click="setQADialogs = false"
              />
              <q-btn
                push
                label="YES"
                color="accent"
                class="text-black"
                @click="saveIRQAStatus(selectedIrNo)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="itemWait"
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

        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
      </q-td>
    </template>

    <template v-slot:body-cell-remarks="props">
      <td>
        <q-btn
          v-if="
            props.row.CombinedActionItems &&
            props.row.CombinedActionItems.split(', ').includes('1')
          "
          class="bg-negative text-white text-bold text-center"
          @click="PendingRemarksTab(props.row.IRNo)"
          label="pending"
          style="width: 125px"
        />

        <q-btn
          :disable="
            props.row.CombinedActionItems &&
            !props.row.CombinedActionItems.split(', ').includes('1')
          "
          v-if="
            props.row.CombinedActionItems &&
            !props.row.CombinedActionItems.split(', ').includes('1')
          "
          class="bg-dark text-white text-bold text-center"
          label="done"
          style="width: 125px"
        />

        <q-dialog full-width full-height v-model="setRemarksDialogs" persistent>
          <q-card class="QAACT">
            <q-card-section class="QAACTHead">
              <div class="row items-center justify-between">
                <div class="QAACText">REMARKS FOR PENDING ACTION ITEMS</div>
                <div>
                  <q-btn
                    @click="addPendingRemarks(selectedIrNo)"
                    color="secondary "
                    icon="post_add"
                    label="Add Remarks"
                    style="
                      background-color: #024089;
                      border: 0.2em solid #f3f4f7;
                      border-radius: 0.5em;
                    "
                  />
                  <q-btn
                    style="margin-left: 25px"
                    round
                    push
                    icon="close"
                    class="bg-accent text-black"
                    @click="cancelPendingRemarks()"
                    v-close-popup
                  />
                </div>
              </div>
            </q-card-section>

            <q-dialog v-model="PendingRemarksDia" persistent>
              <q-card class="QCRCA">
                <q-card-section class="QCRHead">
                  <div class="QCRText">QA REMARKS</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    outlined
                    v-model="IrNo"
                    label="IRNo."
                    style="display: none"
                  />
                  <q-input
                    v-model="PendingRemarks"
                    filled
                    label="Notes"
                    type="textarea"
                    class="q-mt-md"
                    auto-focus
                  />
                </q-card-section>

                <q-card-actions align="right" class="footer-actions">
                  <q-btn
                    push
                    label="CANCEL"
                    color="secondary"
                    @click="onClosePendingRem"
                  />
                  <q-btn
                    push
                    label="SAVE"
                    color="accent"
                    class="text-black"
                    @click="savePendingRemarks(selectedIrNo)"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-card-section>
              <q-list bordered>
                <q-item
                  v-for="(pendingDet, index) in pendingRemarksDetails"
                  :key="index"
                >
                  <q-item-section class="QAACTABLE" v-if="pendingDet">
                    <div class="QAACTabtext">
                      <div>
                        <div>
                          <b>DATE:</b>
                          {{
                            FormatTimelineDateFrom(pendingDet.DateTimeCreated)
                          }}
                        </div>
                        <div
                          style="
                            background-color: #ffc619;
                            height: 2px;
                            margin: 5px 0;
                          "
                        ></div>
                        <div>
                          <b>REMARKS NOTE:</b><br />
                          {{ pendingDet.PendingRemarks }}
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </td>
    </template>

    <template v-slot:body-cell-qastatus="props">
      <q-td>
        <q-btn
          :disable="props.row.QAStatus === true"
          v-if="props.row.QAStatus === true"
          class="bg-positive text-white text-bold text-center"
          >OPEN</q-btn
        >
        <q-btn
          :disable="props.row.QAStatus === false"
          v-if="props.row.QAStatus === false"
          class="bg-negative text-white text-bold text-center"
          >CLOSED</q-btn
        >
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
    getInc: Function,
    disQA: Array,
    // disDept: Array,
    rcaStats: Array,
    qaStats: Array,
  },
  data() {
    return {
      IRQADetailss: [],
      parties: [],
      IRDialog: false,
      setQADialogs: false,
      setRCAreceived: false,
      addCon: false,
      please: false,
      rdPWait: false,
      iRNo: "",
      PrimaryDept: "",
      QAStatus: null,

      setRCAApproved: false,
      showDatePicker: false,
      actionparties: [
        {
          ActionItem: "",
          TimelineFromDate: new Date().toISOString().substr(0, 10),
          TimelineToDate: "",
        },
      ],
      ActionItem: "",
      acWait: false,

      setActionItemDialogs: false,
      actionitemDetails: [],
      setActionStatusDialogs: false,
      itemWait: false,
      setStatusDone: false,
      TimelineFromDate: new Date().toISOString().substr(0, 10),
      TimelineToDate: "",
      showActionDatePicker: false,

      setQATraDialogs: false,
      setQATrans: false,
      transfering: false,
      EmpTransfer: null,
      SubjectCode: "",

      setRemarksDialogs: false,
      pendingRemarksDetails: [],
      PendingRemarksDia: false,
      PendingRemarks: "",

      setRCASubDialogs: false,
      addConclusion: false,
      setQARefDialogs: false,
      IrNo: "",
      selectedIrNo: "",
      addConote: "",
      DeptCodeInform: null,
      disDept: [],
    };
  },

  computed: {
    ...mapGetters({
      getQACon: "ApplyStore/getQACon",
      departments: "ApplyStore/departments",
      getActionItem: "ApplyStore/getActionItem",
      getRemarks: "ApplyStore/getRemarks",
    }),

    hasPendingActions() {
      return this.actionitemDetails.some((item) => item.ActionStatus === 1);
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
        const response = await this.$store.dispatch("ApplyStore/disIrp", data);
        this.IRQADetailss = this.getQACon;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    ///////////////////////////////////////QA INCHARGE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    qaTransfer(IRNo, SubjectCode) {
      this.setQATraDialogs = true;
      this.IrNo = IRNo;
      this.SubjectCode = SubjectCode;
    },

    saveQATra() {
      this.setQATraDialogs = false;
      this.setQATrans = true;
    },

    async transfer() {
      this.setQATrans = false;
      this.transfering = true;

      try {
        // Constructing payload
        const payload = {
          IRNo: this.IrNo,
          SubjectCode: this.SubjectCode,
          EmpTransfer: this.EmpTransfer,
        };
        // Dispatching the action to add QA transfer
        this.cancelTrans();
        await this.$store.dispatch("ApplyStore/AddqaTrans", payload);

        // Notifying the user of successful transfer
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS TRANSFERRING OWNERSHIP",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });

        // Delay further execution to allow data processing or UI updates
        setTimeout(() => {
          this.getInc();
          this.transfering = false;
        }, 5000);
      } catch (error) {
        console.error("Error inserting data:", error);
        this.transfering = false;
        this.$q.notify({
          color: "red-5",
          position: "top",
          message: "ERROR TRANSFERRING OWNERSHIP",
          icon: "error",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      }
    },

    cancelTrans() {
      this.setQATrans = false;
      this.EmpTransfer = null;
      this.SubjectCode = "";
      this.IrNo = "";
    },

    ///////////////////////////////////////REQUIRED//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FilterFn(val, update) {
      if (val === "") {
        update(() => {
          this.disDept = this.departments;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.disDept = this.departments.filter((option) => {
          return option.Dept_Desc.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    requiredRCA(IRNo) {
      this.setRCAreceived = true;
      this.IrNo = IRNo;
    },

    submitRCAEmail() {
      if (!this.validateIR()) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "REQUIRED ALL FIELDS",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000, // Increased timeout to 2000 milliseconds
          progress: true,
        });
        return;
      }
      this.rdPWait = true;
      this.saveRCAEmail();

      setTimeout(() => {
        this.getInc();
        this.rdPWait = false;
      }, 4000);
      this.onRCACancel();
      this.$q.notify({
        color: "green-8",
        position: "top",
        message: "SUCCESS SENDING EMAIL",
        icon: "check",
        iconColor: "white",
        timeout: 5000,
        progress: true,
      });
    },

    async saveRCAEmail() {
      try {
        const qaEmail = {
          IRNo: this.IrNo,
          PrimaryDept: this.PrimaryDept,
          DeptCodeInv: this.parties.map((party) => party.DeptCodeInv),
        };
        this.onRCACancel();
        const response = await this.$store.dispatch(
          "ApplyStore/addEmail",
          qaEmail
        );
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    addParty() {
      if (this.parties.length < 4) {
        this.parties.push({ DeptCodeInv: "" });
      } else {
        this.$q.notify({
          type: "negative",
          message: "Cannot add more parties",
        });
      }
    },

    removeParty(index) {
      this.parties.splice(index, 1);
    },

    onRCACancel() {
      this.IrNo = "";
      this.PrimaryDept = "";
      this.parties = [];
      this.setRCAreceived = false;
      this.removeParty();
    },

    validateIR() {
      return this.IrNo && this.PrimaryDept && this.parties;
    },

    ///////////////////////////////////////RCA SUMMISSION//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    editConclusion(IRNo) {
      this.setRCASubDialogs = true;
      this.IrNo = IRNo; // Ensure consistency with this.IrNo
      this.selectedIrNo = IRNo;
    },

    async saveIRCA() {
      try {
        const payload = { IRNo: this.IrNo, CountRCA: "1" };
        const response = await this.$store.dispatch(
          "ApplyStore/putRCASub",
          payload
        );
        setTimeout(() => {
          this.getInc();
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS RCA SUBMITTED",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        this.setRCASubDialogs = false;
        this.addConclusion = true;
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////RCA REMARKS/CONCLUSION//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cancelConclusion() {
      this.IrNo = "";
      this.addConote = "";
    },

    validateConclusion() {
      return this.addConote;
    },

    async ConclusionSubmit(IRNo) {
      try {
        if (!this.validateConclusion()) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000,
            progress: true,
          });
          return;
        }
        const data = {
          newConclusion: this.addConote,
          IRNo: this.IrNo,
        };
        await this.$store.dispatch("ApplyStore/AddRECon", data);
        setTimeout(() => {
          this.getInc();
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS RCA SUBMITTED",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        this.cancelConclusion();
        this.addConclusion = false;
        this.setRCAApproved = true;
        this.selectedIrNo = IRNo;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////RCA DISAPPROVED//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cancelDispprovedRca() {
      this.IrNo = "";
      this.addConote = "";
      this.addConclusion = false;
    },

    validateRemarks() {
      return this.addConote;
    },

    async submitRCADisapprovedEmail(IRNo) {
      try {
        if (!this.validateRemarks()) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000,
            progress: true,
          });
          return;
        }
        const DispprovedRca = {
          IRNo: this.selectedIrNo,
          newConclusion: this.addConote,
        };
        this.acWait = true;
        const response = await this.$store.dispatch(
          "ApplyStore/addRCADispproved",
          DispprovedRca
        );
        this.cancelDispprovedRca();
        setTimeout(() => {
          this.getInc();
          this.acWait = false;
        }, 2000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS SENDING DISAPPROVED EMAIL",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      } catch (error) {
        console.error("Error creating action items:", error);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////RCA APPROVED//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateSubjectDate(date) {
      this.SubjectDate = date.toISOString().split("T")[0];
      this.showActionDatePicker = false;
    },

    dateAfterOrToday(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      return (
        selectedDate.getFullYear() > today.getFullYear() ||
        (selectedDate.getFullYear() === today.getFullYear() &&
          (selectedDate.getMonth() > today.getMonth() ||
            (selectedDate.getMonth() === today.getMonth() &&
              selectedDate.getDate() >= today.getDate())))
      );
    },

    addActionItem() {
      this.actionparties.push({
        ActionItem: "",
        TimelineFromDate: new Date().toISOString().substr(0, 10),
        TimelineToDate: "",
      });
    },

    removeActionItem(index) {
      this.actionparties.splice(index, 1);
    },

    onCancelApprovedRCA() {
      this.IrNo = "";
      this.actionparties = [];
      this.setRCAApproved = false;
    },

    validateApprovedAction() {
      return this.actionparties.every(
        (party) => party.ActionItem && party.TimelineToDate
      );
    },

    async saveRCAApprovedEmail(IRNo) {
      try {
        if (!this.validateApprovedAction()) {
          this.$q.notify({
            color: "negative",
            position: "center",
            message: "REQUIRED ALL FIELDS",
            icon: "report_problem",
            iconColor: "white",
            timeout: 2000,
            progress: true,
          });
          return;
        }
        // Submit approved RCA email
        this.acWait = true;
        await this.submitRCAApprovedEmail(IRNo);

        // Reset form and get updated incidents
        setTimeout(() => {
          this.getInc();
          this.acWait = false;
        }, 2000);

        // Success notification
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS RCA APPROVED",
          icon: "check",
          iconColor: "white",
          timeout: 3000,
          progress: true,
        });
      } catch (error) {
        console.error("Error creating action items:", error);

        // Error notification
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Error creating action items",
          icon: "report_problem",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
      }
    },

    async submitRCAApprovedEmail(IRNo) {
      try {
        const ApprovedRca = {
          IRNo: this.selectedIrNo,
          ActionItem: this.actionparties.map((party) => party.ActionItem),
          TimelineFromDate: this.actionparties.map(
            (party) => party.TimelineFromDate
          ),
          TimelineToDate: this.actionparties.map(
            (party) => party.TimelineToDate
          ),
        };
        this.onCancelApprovedRCA();
        await this.$store.dispatch("ApplyStore/addRCAApproved", ApprovedRca);
      } catch (error) {
        console.error("Error creating action items:", error);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////ACTION ITEMS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    FormatTimelineDateFrom(TimelineFromDate) {
      const date = new Date(TimelineFromDate);
      const options = { year: "numeric", month: "short", day: "2-digit" };
      const formattedDate = date
        .toLocaleDateString("en-US", options)
        .toUpperCase()
        .replace(/\s/g, " ");
      return formattedDate;
    },

    FormatTimelineDateTo(TimelineToDate) {
      const date = new Date(TimelineToDate);
      const options = { year: "numeric", month: "short", day: "2-digit" };
      const formattedDate = date
        .toLocaleDateString("en-US", options)
        .toUpperCase()
        .replace(/\s/g, " ");
      return formattedDate;
    },

    async viewActionItem(IRNo) {
      this.setActionItemDialogs = true;
      try {
        const acttab = {
          iRNo: IRNo,
        };
        this.selectedIrNo = IRNo;
        await this.$store.dispatch("ApplyStore/disActionItem", acttab);
        this.actionitemDetails = this.getActionItem;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    editActionStatus(Id) {
      this.setActionStatusDialogs = true;
      this.Id = Id;
    },

    async saveActionStatus(IRNo) {
      try {
        const payload = {
          Id: this.Id,
          ActionStatus: 2,
        };
        this.setActionStatusDialogs = false;
        this.itemWait = true;
        await this.$store.dispatch("ApplyStore/putActionStatus", payload);
        setTimeout(() => {
          this.viewActionItem(IRNo);
          this.itemWait = false;
        }, 1000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS EDITING ACTION ITEMS",
          icon: "check",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },

    onCloseActionItems() {
      this.setActionItemDialogs = false;
      this.actionitemDetails = [];
    },

    ///////////////////////////////////////ACTION PENDING ITEMS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    editDoneStatus() {
      this.setActionItemDialogs = false;
      this.itemWait = true;
      setTimeout(() => {
        this.getInc();
        this.itemWait = false;
      }, 3000);
    },

    ///////////////////////////////////////ACTION DONE ITEMS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    editIRQA(IRNo) {
      this.setQADialogs = true;
      this.IrNo = IRNo;
      this.selectedIrNo = IRNo;
    },

    async saveIRQAStatus(IRNo) {
      try {
        this.setQADialogs = false;
        const payload = { IRNo: IRNo, QAStatus: false };
        const response = await this.$store.dispatch(
          "ApplyStore/putqaIR",
          payload
        );
        this.setActionItemDialogs = false;
        this.itemWait = true;
        setTimeout(() => {
          this.getInc();
          this.itemWait = false;
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
      } catch (error) {
        console.error("Error updating status:", error);
        // Optionally, you can show an error message to the user
      }
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////// PENDING REMARKS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cancelPendingRemarks() {
      this.IrNo = "";
      this.pendingRemarksDetails = [];
      this.setRemarksDialogs = false;
    },

    async PendingRemarksTab(IRNo) {
      this.setRemarksDialogs = true;
      try {
        const data = {
          iRNo: IRNo,
        };
        this.selectedIrNo = IRNo;
        await this.$store.dispatch("ApplyStore/disPendingRemarks", data);
        this.pendingRemarksDetails = this.getRemarks;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    addPendingRemarks(selectedIrNo) {
      this.PendingRemarksDia = true;
      this.IrNo = selectedIrNo;
    },

    onClosePendingRem() {
      this.PendingRemarks = "";
      this.PendingRemarksDia = false;
    },

    validatePendingRemarks() {
      return this.PendingRemarks;
    },

    async savePendingRemarks(IRNo) {
      try {
        if (!this.validatePendingRemarks()) {
          this.$q.notify({
            type: "negative",
            message: "Notes are required",
            position: "top",
            timeout: 1000,
            progress: true,
          });
          return;
        }
        const data = {
          PendingRemarks: this.PendingRemarks,
          IRNo: this.IrNo,
        };
        this.itemWait = true;
        this.onClosePendingRem();
        await this.$store.dispatch("ApplyStore/AddPendingRemarks", data);
        setTimeout(() => {
          this.PendingRemarksTab(IRNo);
          this.itemWait = false;
        }, 1000);
        this.$q.notify({
          color: "green-8",
          position: "top",
          message: "SUCCESS CREATING PENDING NOTES",
          icon: "check",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },
  },
};
</script>
