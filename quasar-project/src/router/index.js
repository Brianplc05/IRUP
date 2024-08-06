import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const loginPages = ['/Main'];
    const IRLoginPages = ['/', '/Dashboard', '/DirectorTable', '/HRTable', '/Audit', '/QATable', '/EmploTab', '/ReportTable'];

    const loggedIn = localStorage.getItem('user');

    const authlogRequired = loginPages.some(page => page === to.path);
    const authIRlogRequired = IRLoginPages.some(page => page === to.path);

    if (authlogRequired && !loggedIn) {
      return next('/Login');
    }

    if (authIRlogRequired && !loggedIn) {
      return next('/IRLogin');
    }
    next();
  });


  return Router;
});
