import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const loginPages = ["/Main"];
    const IRLoginPages = [
      "/",
      "/Dashboard",
      "/DirectorTable",
      "/HRTable",
      "/Audit",
      "/QATable",
      "/EmploTab",
      "/ReportTable",
      "/AssistantQATable",
    ];

    const loggedIn = localStorage.getItem("user");

    const authRequired = loginPages.includes(to.path);
    const IRAuthRequired = IRLoginPages.includes(to.path);

    // Check if the user is logging out and allow them to go to the login page
    if (to.path === "/Login" || to.path === "/IRLogin") {
      return next(); // Allow navigation to the login page without restriction
    }

    // Redirect if authentication is required and user is not logged in
    if (!loggedIn) {
      if (authRequired) {
        return next("/IRLogin");
      } else if (IRAuthRequired) {
        return next("/Login");
      }
    }
    next(); // Proceed to the route if no redirection is needed
  });

  return Router;
});
