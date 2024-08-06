export default {

  ///////// GOOGLE //////////////

  SET_GOOGLEUSER(state, getGoogleUser){
    state.getGoogleUser = getGoogleUser;
  },

  ////////////////////////////////////////////

   ////////////////////////////////////////////
  GET_EmpDept(state, getForm){
    state.getForm = getForm;
  },

  GET_SubName(state, getForm){
    state.getForm = getForm;
  },

  GET_SubCategory(state, getForm){
    state.getForm = getForm;
  },

  SET_USER(state, getUser) {
    state.getUser = getUser;
  },


  ///////// DASHBOARD //////////////
  GET_DASH(state, getDash){
    state.getDash = getDash;
  },
  ////////////////////////////////////////////

  ///////// DIRECTOR TABLE //////////////
  GET_DIRECTOR(state, getDirector){
    state.getDirector = getDirector;
  },

  GET_DIRECTIR(state, getDirector){
    state.getDirector = getDirector;
  },

  ////////////////////////////////////////////


  ///////// REPORT TABLE //////////////
  GET_CountSub(state, getCountSubs){
    state.getCountSubs = getCountSubs;
  },
  ////////////////////////////////////////////


  ///////// IRFORM //////////////
  ADD_IRFORM(state, getIRForm){
    state.getIRForm = getIRForm;
  },


  ////////////////////////////////////////////

  ///////// QATABLE //////////////
  GET_QAFORM(state, getQAForm){
    state.getQAForm = getQAForm;
  },

  GET_QAIR(state, getQACon){
    state.getQACon = getQACon;
  },

  GET_QA(state, getQA){
    state.getQA = getQA;
  },

  SET_DEPARTMENTS(state, data) {
    state.departments = data; //
  },

  GET_ACTION(state, getActionItem){
    state.getActionItem = getActionItem;
  },

  GET_PENREMARKS(state, getRemarks){
    state.getRemarks = getRemarks;
  },





////////////////////////////////////////////

  GET_EMFORM(state, getQAForm){
    state.getQAForm = getQAForm;
  },

  ADD_QAFORM(state, getQAForm){
    state.getQAForm = getQAForm;
  },
  ////////////////////////////////////////////

  ///////// HRTABLE //////////////
  GET_FORM(state, getForm){
    state.getForm = getForm;
  },

  SET_EMPLOYEES(state, data) {
    state.employees = data; // Assuming `data` is an array of department objects
  },
  ////////////////////////////////////////////

  ////HRDEMERIT/////
  EMPLOYEE_FORM(state, getForm){
    state.getForm = getForm;
  },

  DEPT_FORM(state, getForm){
    state.getForm = getForm;
  },
  ////////////////////////////////////////

  GET_EMPLOYEES(state, getForm){
    state.getForm = getForm;
  },

  DEMERIT_FORM(state, demerit){
    state.demerit = demerit;
  },
  ////////////////////////////////////////


  /////////////Audit///////////////////////
  AUDIT_FORM(state, getAudit){
    state.getAudit = getAudit;
  },

  GET_SUBJECTFORM(state, getSubject){
    state.getSubject = getSubject;
  },





  UPDATE_NOTE(state, updatedNote){
    state.getAudit, state.getAudit.map(getAudit => getAudit.Id === updatedNote.Id ? updatedNote : getAudit)
  },


}
