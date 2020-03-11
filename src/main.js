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
    addTask (state, args) {
      state.tree.addTask(args.parent, args.data);
    },
    removeTask (state, node) {
      node.getParent().removeChildNode(node);
    },
    changeTask(state, args) {
      args.node.setData(args.data);
    },
    setTaskTree(state, tree) {
      state.tree = tree;
    },
    toggleCompleteTask(state, node) {
      node.toggleComplete();
    }
  }
});

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
