<template>
  <div>
    <TaskRow ref=task v-if="!this.isRoot()" :task=node :parentId="$parent.id"/>
    <ul v-if="this.showSubtree" :class="{subtree: !this.isRoot()}">
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
      showSubtree: this.isRoot()
    }
  },
  methods: {
    isRoot () {
      return this.$parent.$options.name !== this.$options.name;
    },
    focus (index) {
      if (index !== undefined && this.showSubtree) {
        this.focusAtSubtree(index)
      }
      else {
        this.$refs['task'].focus()
      }
    },
    focusAtSubtree (index) {
      if (index < this.node.tasks.length) {
        this.$refs[index][0].focus()
      }
      else {
        this.$refs['addTask'].focus()
      }
    },
    toggleShowSubtree () {
      this.showSubtree = !this.showSubtree
      if (!this.showSubtree) {
        this.$nextTick(function(){
          this.$parent.focus(this.index);
        })
      }
    },
    focusNewTaskRow (id, row) {
      if (id !== undefined) {
        row.focus()
      }
    },
    saveFocusedTaskRow (taskRow) {
      this.focusedTaskRow = taskRow;
    },
    getFocusedTaskRow () {
      return this.root.focusedTaskRow
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
    root () {
      return this.isRoot() ? this : this.$parent.root;
    },
    id () {
      return this.node.id;
    }
  },
  destroyed () {
    this.$nextTick(function(){
      this.$parent.focus(this.index);
    })
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

ul.subtree {
  margin: 0;
  margin-left: 5%;
}

li {
  margin: 0;
}

a {
  color: #42b983;
}
</style>
