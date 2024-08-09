import state from "./state";

export default {
  getGoogleUser: (state) => state.getGoogleUser,
  getDash: (state) => state.getDash,
  getDirector: (state) => state.getDirector,
  getCountSubs: (state) => state.getCountSubs,
  getIRForm: (state) => state.getIRForm,
  getQAForm: (state) => state.getQAForm,
  getQACon: (state) => state.getQACon,
  getQA: (state) => state.getQA,
  getActionItem: (state) => state.getActionItem,
  getRemarks: (state) => state.getRemarks,
  getForm: (state) => state.getForm,
  getAudit: (state) => state.getAudit,
  getSubject: (state) => state.getSubject,
  getUser: (state) => state.getUser,
  isLoggedIn: state => !!state.user,
  departments: (state) => state.departments,
  subjectcategory:(state) => state.subjectcategory,
  subjectname:(state) => state.subjectname,
  getRisk:(state) => state.getRisk,
  employees: (state) => state.employees,
  demerit: (state) => state.demerit
}
