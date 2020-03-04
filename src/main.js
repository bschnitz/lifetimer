import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  strict: true,
  state: {},
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
      state.tasks.push(task);
    },
    mergeIntoTasks(state, task) {
      let index = state.tasks.findIndex(item => item.id == task.id);
      Object.assign(state.tasks[index], task);
    },
    initTasks (state, tasks) {
      state.tasks = tasks;
    }
  }
});

let tasks = JSON.parse(localStorage.getItem('tasks'));
store.commit('initTasks', tasks);

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
