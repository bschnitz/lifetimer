import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Shortkey from 'vue-shortkey'
import { TaskTree } from './js/tasktree.js'

Vue.use(Vuex)
Vue.use(Shortkey)

Vue.config.productionTip = false

const store = new Vuex.Store({
  strict: true,
  state: { tree: TaskTree.loadFromLocalStorage('tasktree') },
  getters: {
    getRootNode: (state) => () => {
      return state.tree.getRootNode()
    },
    getTaskTree : (state) => () => {
      return state.tree;
    },
  },
  mutations: {
    changeTask(state, payload) {
      let node   = payload.node;
      let parent = payload.parent;
      let data   = payload.data;

      if (!node.hasId()) {
        state.tree.addTask(parent, data);
      }
      else if (data.text === "") {
        parent.removeChildNode(node);
      }
      else {
        node.setData(data);
      }
    }
  },
  setTaskTree(state, tree) {
    state.tree = tree;
  },
  toggleCompleteTask(state, node) {
    node.toggleComplete();
  }
});

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
