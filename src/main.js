import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  strict: true,
  state: { tasks: [] },
  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id)
    },
    getNewTaskId: (state) => () => {
      let ids = state.tasks.map((task) => task.id)
      ids.push(0)
      let maxId = Math.max.apply(null, ids)
      return maxId + 1;
    },
    getTasks: (state) => () => {
      let tasks = state.tasks
      tasks.push({id:this.getters.getNewTaskId(), text: ""})
    }
  },
  mutations: {
    addTask (state, task) {
      task.id = this.getters.getNewTaskId();
      state.tasks.push(task);
    },
    removeTask (state, id) {
      state.tasks = state.tasks.filter(item => item.id != id)
    },
    changeTask(state, task) {
      let index = state.tasks.findIndex(item => item.id == task.id)
      Object.assign(state.tasks[index], task)
    },
    initTasks (state, tasks) {
      state.tasks = tasks;
    }
  }
});

let tasks = JSON.parse(localStorage.getItem('tasks'));
tasks = tasks !== null ? tasks : [];
store.commit('initTasks', tasks);

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
