import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

Vue.config.productionTip = false

class TaskTree {
  constructor(tasks) {
    this.root = {
      tasks: tasks
    };
    this.maxId = this.getMaxId();
  }

  getMaxId() {
    let maxId = -Infinity;
    for (let task of this.getRecursiveNodeIterator()) {
      maxId = Math.max(maxId, task.id);
    }
    return maxId === -Infinity ? 0 : maxId;
  }

  getNewTaskId() {
    return this.maxId++;
  }

  *getRecursiveNodeIterator(root) {
    root = root === undefined ? this.root : root
    for (let node of root.tasks)
    {
      yield node;
      if (Array.isArray(node.tasks)) {
        yield* this.getRecursiveNodeIterator(node);
      }
    }
  }

  getNodeById(id) {
    if (id === undefined) {
      return this.root;
    }

    for (let node of this.getRecursiveNodeIterator()) {
      if (node.id == id) {
        return node;
      }
    }
  }

  getRawData() {
    return this.root;
  }

  addTask(task) {
    let node = this.getNodeById(task.parentId);
    task.id = this.getNewTaskId();
    node.tasks = Array.isArray(node.tasks) ? node.tasks : [];
    node.tasks.push(task);
  }

  removeTask(id, parentId) {
    let parent = this.getNodeById(parentId);
    parent.tasks = parent.tasks.filter(child => child.id != id)
  }

  changeTask(id, data) {
    let task = this.getNodeById(id);
    Object.assign(task, data)
  }
}

const store = new Vuex.Store({
  strict: true,
  state: { tree: new TaskTree([]) },
  getters: {
    getTasks: (state) => () => {
      return state.tree.getRawData().tasks
    },
  },
  mutations: {
    addTask (state, task) {
      state.tree.addTask(task);
    },
    removeTask (state, task) {
      state.tree.removeTask(task.id, task.parentId);
    },
    changeTask(state, task) {
      state.tree.changeTask(task.id, task);
    },
  }
});

/*let tasks = JSON.parse(localStorage.getItem('tasks'));
tasks = tasks !== null ? tasks : [];
store.commit('initTasks', tasks);*/

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
