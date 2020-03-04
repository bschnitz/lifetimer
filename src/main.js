import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  strict: true,
  state: {
    tasks: [
      { id:1, text:"Softwareentwicklung (Aufgabenmanager)"},
      { id:2, text:"Lesen (Asimov, Borderlinebuch, Fahrradbuch)"},
      { id:3, text:"Handyakku testen"},
      { id:4, text:"Fahrradplanung"},
      { id:5, text:"Computerspielen"},
      { id:6, text:"Ringe für die Hochzeit aus Epoxit"},
    ]
  },
  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id)
    },
    getNewTaskId: (state) => () => {
      let ids = state.tasks.map((task) => task.id)
      let maxId = Math.max.apply(null, ids)
      return maxId + 1;
    },
    getTasks: (state) => () => {
      let tasks = state.tasks
      tasks.push({id:this.getters.getNewTaskId(), text: ""})
    }
  },
  actions: {
    addTask (context, task) {
      task.id = context.getters.getNewTaskId();
      context.commit('addTask', task);
      return task.id;
    }
  },
  mutations: {
    addTask (state, task) {
      console.log(task)
      state.tasks.push(task);
    },
    mergeIntoTasks(state, task) {
      let index = state.tasks.findIndex(item => item.id == task.id);
      Object.assign(state.tasks[index], task);
    }
  }
});

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
