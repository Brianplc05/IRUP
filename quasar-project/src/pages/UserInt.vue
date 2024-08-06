<template>
  <div>
    <div style="height: 100%; width: 100%;">
      <div class="box">
        <div class="text1">INCIDENT REPORT</div>
        <div class="text2">Welcome to the Incident Report Management System!
          Our platform is designed to streamline the process of reporting, tracking,
          and managing incidents within your organization.
          Whether it's a safety concern, an operational issue, or any other type of incident,
          our system ensures that you can efficiently document and resolve these events.</div>

          <div class="btn">
            <q-btn push label="CREATE REPORT" color="accent" @click="basic = true" class="btn2 text-black shadow-17"></q-btn>
          </div>
      </div>
      <!-- <div class="box1">
        <img src="../assets/PEOPLE.png" alt="People Image" class="people-img">
      </div> -->
    </div>

<!-- ////////////////////////////////////////////////////CREATE INCIDENT ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

    <q-dialog v-model="basic">
        <q-card class="TOG">
          <q-item-section class="TGHEAD">
            <div class="TGTEXT">TERMS OF AGREEMENT</div>
          </q-item-section>

          <q-card-section class="q-pt-none">
            <p class="TGCONTENT">Incident reports shall undergo analysis. Any person who may be subjected to liability arising from an incident shall be accorded due process. </p>
          </q-card-section>

          <q-separator style="background-color: #d5d7da; height: 2px; margin: 5px 0;"></q-separator>
          <q-card-actions align="right">
            <q-btn push label="Decline" @click="basic = false" color="secondary" v-close-popup></q-btn>
            <q-btn push label="Accept" @click="Formaccept" color="accent text-black"></q-btn>
          </q-card-actions>
        </q-card>
    </q-dialog>

<!-- ////////////////////////////////////////////////////FORM///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    <q-dialog full-width full-height v-model="form" persistent>
        <div class="IRFORM">
          <q-card-section class="bg-primary text-white" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="text-h6">INCIDENT REPORT FORM</div>
            <div>
            <q-btn push @click="clearIRForm" label="CLOSE" class="bg-info text-white" style="font-weight: bold; width: 80px;" size="14px"></q-btn>
            <q-btn push @click="handleFormSubmit" label="SAVE" class="bg-accent text-black" style="margin-left: 10px; font-weight: bold; width: 80px;" size="14px"></q-btn>
            </div>
          </q-card-section>

          <div style="margin-top: 10px;">
            <div class="bg-primary text-white">
              <div class="IRID">INFORMANT DETAILS</div>
            </div>
            <div class="IRIDC">
              <q-input square outlined v-model="employeeCode" label="Employee Number" style="margin-left: 5px; width: 49%;"></q-input>
              <q-input square outlined v-model="deptCode" label="Department Number" style="margin-left: 5px; width: 49%;"></q-input>
              <!-- <q-select
                  square
                  outlined
                  readonly
                  v-model="DeptCode"
                  :options="matchingDepartments"
                  label="Department Name"
                  map-options
                  emit-value
                  :option-label="option => option.DEPT_DESC"
                  :option-value="option => option.DeptCode"
                  style="margin-left: 10px; width: 50%;"
              ></q-select> -->
            </div>
          </div>

        <div style="margin-top: 10px;">
          <div class="bg-primary text-white">
            <div class="IRGI">GENERAL INFORMATION</div>
          </div>

          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <!-- Left Side -->
            <div style="width: 48%; margin-left: 15px;">

              <q-select
                use-input
                square
                outlined
                clearable
                v-model="SubCategory"
                :options="disSubCategory"
                @filter="FilterCategory"
                label="RISK CATEGORY"
                emit-value
                map-options
                :option-value="option => option.SubjectCatCode"
                :option-label="option => option.SubjectCategory"
                style="margin-top: 15px;"
              />

              <!-- Subject Select -->
              <q-select
                use-input
                square
                outlined
                clearable
                :disable="!SubCategory"
                v-model="SubjectCode"
                :options="filteredSubjects"
                @filter="FilterSubIncident"
                label="SUBJECT OF THE INCIDENT"
                emit-value
                map-options
                :option-value="option => option.SubjectCode"
                :option-label="option => option.SubjectName"
                :option-category="option => option.SubjectDescription"
                style="margin-top: 15px;"
              />

              <q-input
                v-if="SubjectCode === 'others' && (SubCategory !== null || SubjectCode !== null)"
                v-model="OtherSubject"
                label="PLEASE SPECIFY THE SUBJECT OF THE INCIDENT"
                use-input
                square
                outlined
                autogrow
                style="margin-top: 15px;"
              />

              <q-item style="border: 0.2em solid #003566; margin-top: 15px;" v-if="SubjectCode !== 'others'">
                <q-item-section>
                  <q-item-label>
                    <b>DESCRIPTION :</b> {{ selectedDescription }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- Right Side -->
            <div style="width: 48%; margin-right: 15px;">
              <q-input
                square
                outlined
                v-model="SubjectLoc"
                label="INCIDENT LOCATION"
                style="margin-top: 15px; width: 100%;"
              />
              <q-input
                v-model="SubjectDate"
                square
                outlined
                clearable
                label="DATE OF THE INCIDENT"
                style="margin-top: 15px; width: 100%;"
                @click="showDatePicker = true"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true" />
                </template>
              </q-input>
              <q-dialog v-model="showDatePicker">
                <q-card>
                  <q-card-section>
                    <q-date landscape v-model="SubjectDate" @input="updateSubjectDate" :options="dateBeforeOrToday" />
                  </q-card-section>
                </q-card>
              </q-dialog>
              <q-input
                v-model="SubjectTime"
                outlined
                square
                clearable
                label="TIME OF THE INCIDENT"
                style="margin-top: 15px; width: 100%; margin-bottom: 5px;"
                @click="showTimePicker = true"
              >
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer" @click="showTimePicker = true" />
                </template>
              </q-input>
              <q-dialog v-model="showTimePicker">
                <q-card>
                  <q-card-section>
                    <q-time landscape v-model="SubjectTime" />
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </div>
        </div>

          <div style="margin-top: 10px; ">
            <div class="bg-primary text-white">
              <div class="IRND">NARRATIVE DESCRIPTION OF THE INCIDENT</div>
              <p class="text-center"><em>Narrate exactly how the incident happened (e.g. sequence of events, factors leading to the incident, other persons involved, etc.). Be specific as possible. Statement may be made in English or Filipino.</em></p>
            </div>
            <div class="IRNDC">
              <q-input v-model="SubjectNote" filled type="textarea" label="Note"/>
            </div>
          </div>

          <div style="margin-top: 10px; ">
            <div class="bg-primary text-white">
              <div class="IRND">POSSIBLE CAUSES OF THE INCIDENT</div>
              <p class="text-center"><em>Possible reason on the perspective of the Informant</em></p>
            </div>
            <div class="IRNDC">
              <q-input v-model="SubjectCause" filled type="textarea" label="Note"/>
            </div>
          </div>

          <div style="margin-top: 10px; ">
            <div class="bg-primary text-white">
              <div class="IRND">IMMEDIATE RESPONSE</div>
              <p class="text-center"><em>Action taken by the concerned department or by the Informant to ease the incident.</em></p>
            </div>
            <div class="IRNDC">
              <q-input v-model="SubjectResponse" filled type="textarea" label="Note"/>
            </div>
          </div>
        </div>
<!-- ////////////////////////////////////////////////////FORM///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

          <q-dialog v-model="confirm" style="background-color: rgba(0, 0, 0, 0.9);" persistent>
              <q-card >
                <q-card-section class="IRCON">
                  <div class="IRCONText">CONFIRM</div>
                </q-card-section>
                <q-card-section>
                  <div>WOULD YOU LIKE TO SAVE THIS INCIDENT REPORT?</div>
                </q-card-section>
                <q-separator style="background-color: #d5d7da; height: 2px; margin: 2px 0;"></q-separator>
                <q-card-actions align="right">
                  <q-btn push label="NO" color="secondary" @click="confirm = false" />
                  <q-btn push label="YES" color="accent" class="text-black" @click="SubmitForm" />
                </q-card-actions>
              </q-card>
            </q-dialog>

<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

            <q-dialog v-model="showLoading" persistent content-class="non-transparent-dialog">
              <q-card class="centered-card">
                <q-card-section>
                  <div class="spinner-container">
                    <q-spinner-ios size="100px"></q-spinner-ios>
                    <div class="please-wait"> SAVING INCIDENT REPORT, PLEASE WAIT...</div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>

<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

            <q-dialog v-model="print" style="background-color: rgba(0, 0, 0, 0.9);" persistent>
              <q-card >
                <q-card-section class="IRCON">
                  <div class="IRCONText">PRINT</div>
                </q-card-section>
                <q-card-section>
                  <div>WOULD YOU LIKE TO PRINT THIS INCIDENT REPORT?</div>
                </q-card-section>
                <q-separator style="background-color: #d5d7da; height: 2px; margin: 2px 0;"></q-separator>
                <q-card-actions align="right">
                  <q-btn push label="NO" color="secondary" @click="printClose" />
                  <q-btn push label="YES" color="accent" class="text-black" @click="downloadPDF" />
                </q-card-actions>
              </q-card>
            </q-dialog>

<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

            <q-dialog
              v-model="pdfdialog"
              persistent
              :maximized="maximizedToggle"
              transition-show="slide-up"
              transition-hide="slide-down"
              @show="generatePDF"
              full-width
              full-height
              class="no-scroll-dialog"
            >
              <q-card class="bg-primary text-white no-scroll-content">
                <q-bar>
                  <q-space></q-space>
                  <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                    <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
                  </q-btn>
                  <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                    <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
                  </q-btn>
                  <q-btn dense flat icon="close" @click="onReset" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                  </q-btn>
                </q-bar>

                <q-card-section>
                  <div style="display: flex; justify-content: space-between;">
                    <div class="text-h6">PDF INCIDENT REPORT FORM</div>
                    <q-btn push icon="download" class="downbtn bg-accent shadow-5" @click="downloadPDForm">DOWNLOAD</q-btn>
                  </div>
                </q-card-section>

                <q-separator style="background-color: #FFC619; height: 2px; margin: 5px 0;"></q-separator>
                <q-spinner-ios class="spinner" v-if="loading" size="160px" color="accent" style="margin-left: 43.5%; margin-top: 9%;"></q-spinner-ios>
                <q-card-section v-show="!loading" class="q-pa-md q-gutter-sm flex-center" style="width: 100%; height: 100%;" id="iframeContainer"></q-card-section>
              </q-card>
            </q-dialog>

<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    </q-dialog>

    <footer class="footer">

    </footer>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import pdfMake from 'pdfmake/build/pdfmake'; // Import pdfmake library
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Import vfs_fonts module
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export default {
  data() {
    return {
      basic: false,
      form: false,
      showDatePicker: false,
      showTimePicker: false,
      confirm: false,
      showLoading: false,
      print: false,
      pdfdialog: false,
      maximizedToggle: false,
      loading: false,
      disEmpDep: [],
      disSubName: [],
      disSubCategory: [],
      SubjectCatCode: " ",
      OtherSubject: " ",
      SubCategory: null,
      SubjectCode: null,
      SubjectLoc: " ",
      SubjectDate: " ",
      SubjectTime: " ",
      SubjectNote: " ",
      SubjectCause: " ",
      SubjectResponse: " ",
      IRNo: [],
    }
  },

  computed: {
    ...mapGetters({ getForm: 'ApplyStore/getForm',  getGoogleUser: 'ApplyStore/getGoogleUser',
                    loggedInUser: 'ApplyStore/getUser', getIRForm: 'ApplyStore/getIRForm',
                    subjectname: 'ApplyStore/subjectname', subjectcategory: 'ApplyStore/subjectcategory'}),

    filteredSubjects() {
      if (!this.SubCategory) return [];
      return (this.disSubName || []).filter(subject => subject.SubjectCatCode === this.SubCategory);
    },

    selectedDescription() {
      const selectedOption = this.disSubName.find(option => option.SubjectCode === this.SubjectCode);
      return selectedOption ? selectedOption.SubjectDescription : '';
    },

    employeeCode() {
      return this.loggedInUser.EmployeeCode || this.getGoogleUser.EmployeeCode;
    },

    deptCode() {
      return this.loggedInUser.DeptCode || this.getGoogleUser.DeptCode;
    }

    // matchingDepartments() {
    // return this.disEmpDep.recordsets[0].filter(option => option.EmployeeCode === this.EmployeeCode);
    // }
  },

  watch: {
    SubCategory(newVal) {
      if (!newVal) {
        this.SubjectCode = null;
      }
    },

    SubjectCode(newVal) {
      if (!newVal) {
        this.OtherSubject = '';
      }
    },
  },


  // watch: {
  // EmployeeCode(newValue) {
  //   if (newValue && this.disEmpDep.recordsets[0]) {
  //     const matchingDepartment = this.disEmpDep.recordsets[0].find(option => option.EmployeeCode === newValue);
  //     if (matchingDepartment) {
  //       this.DeptCode = matchingDepartment.DeptCode;
  //         }else {
  //         this.DeptCode = '';
  //       }
  //     } else {
  //       this.DeptCode = '';
  //     }
  //   }
  // },

  created(){
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };

    this.getED();
    this.getSN();
    this.getSC();
    this.$store.dispatch('ApplyStore/initAuth')
  },



  methods:{

///////////////////////////////////////////////////////////////////////////////THE PROCESS////////////////////////////////////////////////////////////////////////////////////////////

    handleFormSubmit() {
      try {
        if (!this.validateForm()) {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'REQUIRED ALL FIELDS',
            icon: 'report_problem',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          return;
        }
        this.confirm = true;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    SubmitForm() {
      try {
        this.addInc(); // Ensure addInc returns a promise if it's async
        this.confirm = false;
        this.showLoading = true;
        setTimeout(() => {
          this.showLoading = false;
          this.clearForm(); // Clear the form after 1 second
          this.print = true;
        }, 3000);
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: 'SUCCESSFULLY SENT THE REPORT TO THE QUALITY OFFICER',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 2000,
          progress: true,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

    async downloadPDF() {
      try {
        await this.generatePDF();
        this.print = false;
        this.pdfdialog = true;
      } catch (error) {
        console.error(error);
      }
    },

    downloadPDForm() {
        const pdfDef = this.getPdfDefinition();
        const pdfDocGenerator = pdfMake.createPdf(pdfDef);
        pdfDocGenerator.download('Incident_Report.pdf');
    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getED() {
      try {
        await this.$store.dispatch("ApplyStore/disEmDept");
        this.disEmpDep = this.getForm;
      } catch (error) {
        console.error("Error Displaying Data:", error);
      }
    },

    async getSN() {
      try {
        await this.$store.dispatch("ApplyStore/disSubName");
        this.disSubName = this.subjectname;
      } catch (error) {
        console.error("Error Displaying Data:", error);
      }
    },

    async getSC() {
      try {
        await this.$store.dispatch("ApplyStore/disSubCategory");
        this.disSubCategory = this.subjectcategory;
      } catch (error) {
        console.error("Error Displaying Data:", error);
      }
    },

    FilterCategory(val, update) {
        if (val === "") {
            update(() => {
              this.disSubCategory = this.subjectcategory;
            });
            return;
        }

        update(() => {
            const needle = val.toLowerCase();
            this.disSubCategory = this.subjectcategory.filter((option) => {
              return option.SubjectCategory.toLowerCase().indexOf(needle) > -1;
            });
        });
    },

    FilterSubIncident(val, update) {
        if (val === "") {
            update(() => {
              this.disSubName = this.subjectname;
            });
            return;
        }

        update(() => {
            const needle = val.toLowerCase();
            this.disSubName = this.subjectname.filter((option) => {
              return option.SubjectName.toLowerCase().indexOf(needle) > -1;
            });
        });
    },



    updateSubjectDate(date){
      this.SubjectDate = date.toISOString().split('T')[0];
      this.showDatePicker = false;
    },

    dateBeforeOrToday(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      // Compare year, month, and day to ensure selectedDate is before or equal to today
      return (
        selectedDate.getFullYear() < today.getFullYear() ||
        (selectedDate.getFullYear() === today.getFullYear() &&
          (selectedDate.getMonth() < today.getMonth() ||
            (selectedDate.getMonth() === today.getMonth() &&
              selectedDate.getDate() <= today.getDate())))
      );
    },

    printClose(){
      this.form = false;
      this.print = false;
    },

    Formaccept(){
      this.basic= false;
      this.form = true;
    },

    clearIRForm(){
      this.form = false;
      this.clearForm();
    },

    async addInc() {
      try {
        const formData = {
            EmployeeCode: this.employeeCode,
            DeptCode: this.deptCode,
            SubjectCode: this.SubjectCode,
            SubjectDate: this.SubjectDate,
            SubjectTime: this.SubjectTime,
            SubjectLoc: this.SubjectLoc,
            SubjectNote: this.SubjectNote,
            SubjectCause: this.SubjectCause,
            SubjectResponse: this.SubjectResponse
          };

          // Conditionally add OtherSubject if SubjectCode is "others"
          if (this.SubjectCode === "others") {
            formData.OtherSubject = this.OtherSubject;
            formData.SubjectCode = null; // Set SubjectCode to null
          }

        console.log(formData);
        const response = await this.$store.dispatch("ApplyStore/addIReport", formData);
        console.log(response);
        console.log("DATA INSERTED SUCCESSFULLY");
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    },

  validateForm() {
    return (
      this.SubjectLoc !== " " &&
      this.SubjectDate !== " " &&
      this.SubjectTime !== " " &&
      this.SubjectNote !== " " &&
      this.SubjectCause !== " " &&
      this.SubjectResponse !== " "
    );
  },

  clearForm() {
      this.SubjectCode = '';
      this.OtherSubject = '';
      this.SubCategory = '';
      this.SubjectDate = '';
      this.SubjectTime = '';
      this.SubjectLoc = '';
      this.SubjectNote = '';
      this.SubjectCause = ' ';
      this.SubjectResponse = ' ';
  },


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  generatePDF() {
    this.loading = true; // Set loading state to true

    const pdfDef = this.getPdfDefinition();

    const pdfDocGenerator = pdfMake.createPdf(pdfDef);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      const targetElement = document.querySelector('#iframeContainer');
      if (targetElement) {
        const iframe = document.createElement('iframe');
        iframe.src = dataUrl;
        iframe.height = '100%';
        iframe.width = '100%';
        iframe.style.cssText = 'z-index: 1; position: relative;';
        targetElement.innerHTML = '';
        targetElement.appendChild(iframe);

        // Hide loading indicator after 2000 milliseconds
        setTimeout(() => {
          this.loading = false; // Clear loading state after 2000 milliseconds
        }, 4000);
      }
    });
  },


  getPdfDefinition() {
    const IRNo = this.getIRForm[0].IRNo; // Accessing IRNo from the getIRForm object
    const SubjectName = this.getIRForm[0].SubjectName;
    const SubjectLoc = this.getIRForm[0].SubjectLoc;
    const SubjectDate = this.FormatDate(this.getIRForm[0].SubjectDate); // Formatting SubjectDate
    const SubjectTime = this.FormatTime(this.getIRForm[0].SubjectTime); // Formatting SubjectTime
    const SubjectNote = this.getIRForm[0].SubjectNote;
    const SubjectCause = this.getIRForm[0].SubjectCause;
    const SubjectResponse = this.getIRForm[0].SubjectResponse;


    return {
      content: [
        {
          text: `IRNo.: ${IRNo}`,
          alignment: 'right',
          style: 's1'
        },
        {
          text: ['UNIVERSITY OF THE EAST\n', 'RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER'],
          style: 'header',
          alignment: 'center'
        },
        {
          text: '#64 Aurora Boulevard, Brgy. Dona Imelda, Quezon City, 1113 Philippines\n',
          bold: false,
          alignment: 'center',
          style: 's2'
        },
        {
          text: 'INCIDENT REPORT FORM',
          bold: true,
          alignment: 'center',
          style: 's3'
        },
        {
          text: 'Instructions:',
          bold: true,
        },
        {
          text: ['Incident reports shall undergo analysis. Any person who may be subjected to liability arising from an incident shall be accorded due process.'
          ],
          style: 's4',
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              ['GENERAL INFORMATION'],
            ]
          }
        },
        {
          style: 'table1',
          table: {
            widths: ['*'],
            body: [
              [{ text: `Subject of the incident: ${SubjectName}` }],
            ]
          }
        },
        {
          style: 'table1',
          table: {
            widths: ['*'],
            body: [
              [{ text: `Location of the incident: ${SubjectLoc}` }],
            ]
          }
        },
        {
          style: 'table1',
          table: {
            widths: ['*', '*'],
            body: [
              [`Date of the incident: ${SubjectDate}`, { text: `Time of the incident: ${SubjectTime}`, noWrap: true }],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              ['NARRATIVE DESCRIPTION OF THE INCIDENT'],
            ]
          }
        },
        {
          style: 's5',
          table: {
            widths: ['*'],
            body: [
              ['Narrate exactly how the incident happened (e.g. sequence of events, factors leading to the incident, other persons involved, etc.). Be specific as possible. Statement may be made in English or Filipino'],
            ]
          }
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 1, 1, 0] }],
              [{ text: `${SubjectNote}`, style: 's6', fillColor: '#FFFFFF', border: [1, 0, 1, 0] }],
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 0, 1, 1] }],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              ['POSSIBLE CAUSES OF THE INCIDENT'],
            ]
          }
        },
        {
          style: 's5',
          table: {
            widths: ['*'],
            body: [
              ['Possible reason on the perspective of the Informant'],
            ]
          }
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 1, 1, 0] }],
              [{ text: `${SubjectCause}`, style: 's6', fillColor: '#FFFFFF', border: [1, 0, 1, 0] }],
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 0, 1, 1] }],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              ['IMMEDIATE RESPONSE'],
            ]
          }
        },
        {
          style: 's5',
          table: {
            widths: ['*'],
            body: [
              ['Action taken by the concerned department or by the Informant to ease the incident.'],
            ]
          }
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 1, 1, 0] }],
              [{ text: `${SubjectResponse}`, style: 's6', fillColor: '#FFFFFF', border: [1, 0, 1, 0] }],
              [{ text: '', style: 's1', fillColor: '#FFFFFF',  border: [1, 0, 1, 1] }],
            ]
          }
        }
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        s1: {
          fontSize: 8,
          bold: true,
          alignment: 'right'
        },
        s2: {
          fontSize: 10,
          margin: [0, 0, 0, 20]
        },
        s3: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [5, 0, 0, 0]
        },
        s4: {
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
        s5: {
          fontSize: 7,
          italics: true,
          alignment: 'center',
          fillColor: '#CCCCCC'
        },
        s6: {
          fontSize: 10,
          bold: true,
          alignment: 'left'
        },
        tableExample: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          fillColor: '#CCCCCC'
        },
        table1: {
          bold: true,
          fontSize: 10,
          alignment: 'left',
        }
      }
    };
  },

  onReset(){
      this.form = false;
      this.pdfdialog = false;
      this.maximizedToggle = false;
      this.IRNo = [];
  },

  mounted() {
    this.generatePDF(); // Call the method to generate and display the PDF when the component is mounted
  }

  },
}
</script>

<style>

.box {
  height: 100%;
  width: 50%;
  background-color: #ffffff;
  align-content: center;
  margin-left: 27%;
  margin-top: 15PX;
  margin-bottom: 15PX;
}

.text1{
  margin-top: 50px;
  font-weight: bold;
  font-family: Arial Black;
  display: flex;
  color: #000000;
  font-size: 50px;
  justify-content: center;
}
.text2{
  margin-top: 30px;
  display: flex;
  color: #000000;
  font-size: 17px;
  text-align: center;
  padding: 25px;
}
.btn{
  margin-top: 8%;
  margin-bottom: 8%;
}
.btn2{
  height: 50px;
  width: 40%;
  font-size: 15px;
  font-weight: bold;
  margin-left: 30%;
}
/*
.box1 {
  height: 100%;
  width: 57%;
}
.people-img {
  height: 100%;
  width: 100%;
}
 */

.footer {
  background-color: #FFC619;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgb(5, 4, 4);
}

/* <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --> */

.IRIMG{
  width: 490px; /* Example width */
  height: 280px; /* Maintain aspect ratio */
  margin-top: 50px; /* Example margin bottom */
  margin-right: 5px;
}
.IRBTN{
  margin-top: 360px;
  height: 50px;
  width: 400px;
  font-size: 20px;
  font-weight: bold;
  background-color: #FFC619;
  font-family:Arial Black;
  position: fixed;
}

/* <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --> */

.TOG{
  background-color: #ffffff;
  height: 255px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  border: 0.2em solid #f3f4f7;
}
.TGHEAD{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.TGTEXT{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 30px;
  padding: 5px;
  justify-content: center;
}
.TGCONTENT{
  display: flex;
  font-size: 17px;
  margin-top: 15px;
  justify-content: center;
}
/* ////////////////////////////////////////////////IRFORM///////////////////////////////////////////////////// */

.IRFORM{
  background-color: white;
  height: 650px; /* You can adjust the units based on your preference, 'vw' for viewport width */
  width: 100%;
  border: 0.2em solid #f3f4f7;
}
.IRHEAD{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
}
.text-h6{
  font-weight: bold;
  font-family: Arial Black;
  display: flex;
  color: #FFC619;
  font-size: 30px;
}
/* ......................................INFORMANT CONTENT ..................................... */
.IRID{
  font-weight: bold;
  /* display: flex; */
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
  display: none;
}
.IRIDC {
    /* display: flex; */
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    height: 80px;
    display: none;
}
/* ......................................GENERAL CONTENT ..................................... */
.IRGI{
  font-weight: bold;
  display: flex;
  padding: 10px;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
}
.IRGC {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    padding: 5px;
}
.IRGCC {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
}
/* ......................................NOTE CONTENT ..................................... */
.IRND{
  font-weight: bold;
  display: flex;
  color: #FFC619;
  font-size: 20px;
  justify-content: center;
}
.IRNDC {
  margin-left: 15px;
  margin-top: 15px;
  width: 97.5%;
  margin-bottom: 20px;
}
/* ......................................SAVE CONTENT ..................................... */
.IRCON{
  height: 75px;
  border: 0.2em solid #f3f4f7;
  background-color: #003566;
  border: 0.6em solid #d5d7da;
}
.IRCONText{
  font-weight: bold;
  font-style: roboto;
  display: flex;
  color: #FFC619;
  font-size: 25px;
  justify-content: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.downbtn{
  padding: 5px;
  width: 15%;
  color:  #003566;
  font-weight: bold;
}
.no-scroll-dialog .q-dialog__inner {
  overflow: hidden !important;
}

.no-scroll-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden !important;
}

.q-card-section {
  flex: 1;
  overflow: auto;
}
 /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

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


