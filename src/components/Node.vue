<template>
  <div>
    <TaskRow ref=task v-if="!this.isRoot" :task=node :parentId="$parent.id"/>
    <ul v-if="this.isRoot || this.showSubtree">
      <li v-for="(task, index) in node.tasks" :key="task.id">
        <Node :node=task :index=index :ref=index />
      </li>
      <li><TaskRow :parentId=node.id ref=addTask /></li>
    </ul>
  </div>
</template>

<script>
import TaskRow from './TaskRow.vue'

export default {
  name: 'Node',
  props: {
    node: { // is a task, if this Node is not the root node
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: false // root has no index
    }
  },
  components: {
    TaskRow
  },
  data () {
    return {
      focusedTaskRow: undefined,
      showSubtree: false
    }
  },
  methods: {
    focus () {
      this.$refs['task'].focus()
    },
    toggleShowSubtree () {
      this.showSubtree = !this.showSubtree
    },
    focusNewTaskRow (id, row) {
      if (id !== undefined) {
        row.focus()
      }
    },
    saveFocusedTaskRow (taskRow) {
      this.focusedTaskRow = taskRow;
    },
    focusNextTaskRow () {
      let inputs = document.getElementsByTagName("input");
      let focusedInput = this.focusedTaskRow.getInputElement();

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === focusedInput) {
          if (inputs[i+1] !== undefined) {
            inputs[i+1].focus();
            return;
          }
        }
      }
    },
    focusPreviousTaskRow () {
      let inputs = document.getElementsByTagName("input");
      let focusedInput = this.focusedTaskRow.getInputElement();

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === focusedInput) {
          if (inputs[i-1] !== undefined) {
            inputs[i-1].focus();
            return;
          }
        }
      }
    },
  },
  computed: {
    isRoot () {
      return this.$parent.$options.name !== this.$options.name;
    },
    root () {
      return this.isRoot ? this : this.$parent.root;
    },
    id () {
      return this.node.id;
    }
  },
  destroyed () {
    this.$nextTick(function(){
      if (this.index < this.$parent.node.tasks.length) {
        this.$parent.$refs[this.index][0].focus()
      }
      else {
        this.$parent.$refs['addTask'].focus()
      }
    })
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 2em;
}

ul.subtree {
  margin: 0;
  margin-left: 10%;
}

li {
  margin: 0;
}

a {
  color: #42b983;
}
</style>
