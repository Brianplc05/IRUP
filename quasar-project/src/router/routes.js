const routes = [
  {
    path: "/IRLogin",
    component: () => import("pages/IRLogin.vue"),
  },
  {
    path: "/ir-authload",
    component: () => import("components/LoadingPage/IRAuthLoading.vue"),
  },

  {
    path: "/GoogleAuth",
    component: () => import("src/pages/GoogleLoginAuth.vue"),
  },
  {
    path: "/google-authload",
    component: () => import("components/LoadingPage/GoogleAuthLoading.vue"),
  },
  {
    path: "/Main",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/UserInt.vue") }],
  },
  {
    path: "/IRLogout",
    component: () => import("components/LoadingPage/IRLogout.vue"),
  },
  {
    path: "/google-authlogout",
    component: () => import("components/LoadingPage/GoogleAuthLogout.vue"),
  },

  {
    path: "/Login",
    component: () => import("pages/LogIn.vue"),
  },
  {
    path: "/auth-loading",
    component: () => import("components/LoadingPage/AuthLoading.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/HRAdmin.vue"),
    children: [
      {
        path: "/Dashboard",
        component: () => import("pages/DashboardTab.vue"),
      },
      {
        path: "/DirectorTable",
        component: () => import("pages/DirectorTable.vue"),
      },
      {
        path: "/AssistantQATable",
        component: () => import("pages/AssistantQATab.vue"),
      },
      {
        path: "/HRTable",
        component: () => import("pages/HRTable.vue"),
      },
      {
        path: "/AuditTable",
        component: () => import("pages/AuditTab.vue"),
      },
      {
        path: "/QATable",
        component: () => import("pages/QATab.vue"),
      },
      {
        path: "/EmployeeTab",
        component: () => import("pages/EmployeeTable.vue"),
      },
      {
        path: "/ReportTable",
        component: () => import("pages/ReportTab.vue"),
      },
    ],
  },
  {
    path: "/LogoutPage",
    component: () => import("components/LoadingPage/LogoutPage.vue"),
  },

  {
    path: "/HRDemerit",
    component: () => import("pages/HRDemerit.vue"),
  },
];

export default routes;
