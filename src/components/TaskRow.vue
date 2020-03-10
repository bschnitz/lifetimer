<template>
  <div>
    <div class='row' :class="rowClass">
      <div class='status'>
          ✔
      </div>
      <input
        ref="text"
        type='text'
        :value="this.task.text"
        @input="onInput"
        @focus="onFocus"
        v-shortkey="getShortkeys()"
        @shortkey="handleShortkey"
        />
      <button type="submit" @click="showSubtree">
        {{countSubtasks}}
        <div class=arrow :class="arrowType"></div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TaskRow',
  props: {
    task: {
      type: Object,
      required: false,
      default () {return {
        id:        undefined,
        tasks:     [],
        text:      "",
        completed: false
      };}
    },
    parentId: {
      type: Number,
      required: false // childs of root node have no parentId
    }
  },
  methods: {
    getShortkeys () {
      return {
        focusNext:     ['ctrl', 'j'],
        focusPrevious: ['ctrl', 'k'],
        unfoldSubtree: ['ctrl', 'l'],
        foldSubtree:   ['ctrl', 'h'],
        toggleCompleteTask:  ['enter'],
      };
    },
    ...mapMutations([
      'changeTask',
      'removeTask',
      'addTask',
      'toggleCompleteTask',
    ]),
    onFocus () {
      this.root.saveFocusedTaskRow(this);
    },
    onInput (e) {
      let task = {
        id: this.task.id,
        parentId: this.parentId,
        text: e.target.value
      }
      if (this.task.id === undefined) {
        this.addTask(task)
        this.$refs['text'].value = ''
      }
      else if (task.text === "") {
        this.removeTask(task);
      }
      else {
        this.changeTask(task);
      }
    },
    focus () {
      this.$refs['text'].focus()
    },
    getInputElement () {
      return this.$refs['text'];
    },
    handleShortkey (event) {
      // the shortkey works globally, but is bound to an arbitrary TaskRow. This
      // is why the focused TaskRow must be determined and used
      let taskRow = this.root.getFocusedTaskRow();
      switch (event.srcKey) {
        case 'focusNext':
          this.root.focusNextTaskRow();
          break;
        case 'focusPrevious':
          this.root.focusPreviousTaskRow();
          break;
        case 'unfoldSubtree':
          taskRow.showSubtree()
          break;
        case 'foldSubtree':
          taskRow.hideSubtree()
          break;
        case 'toggleCompleteTask':
          taskRow.toggleCompleteTask(taskRow.task.id)
          break;
      }
    },
    showSubtree () {
      if (this.task.id !== undefined) {
        this.$parent.toggleShowSubtree()
      }
    },
    hideSubtree () {
      if (this.$parent === this.root) {
        return;
      }

      if (this.$parent.showSubtree) {
        this.$parent.toggleShowSubtree()
      }
      else if (this.$parent.$parent !== this.root) {
        this.$parent.$parent.toggleShowSubtree()
      }
    },
  },
  computed: {
    root () {
      return this.$parent.root;
    },
    countSubtasks () {
      return this.task.tasks.length > 0 ? this.task.tasks.length : "";
    },
    arrowType () {
      return this.$parent.showSubtree ? 'down' : 'right';
    },
    rowClass () {
      return {
        'without-subtasks': this.task.tasks.length === 0,
        'without-task':     this.task.id === undefined,
        'completed':        this.task.completed === true
      }
    }
  },
  mounted() {
    this.focus()
  },
}
</script>

<style scoped>
div.status {
  border-radius: .5em 0 0 .5em;
  padding-left: .5em;
  padding-right: .5em;
  position: relative;
  background-color: #E1FA71;
  display: none;
}

div.completed div.status {
  display: flex;
  align-items: center;
}


.arrow.right {
  position: absolute;
  box-shadow: 2px 2px #000;
  top: .75em;
  right: .675em;
  width: .5em;
  height: .5em;
  display: block;
  -moz-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
}

.arrow.down {
  position: absolute;
  box-shadow: 2px 2px #000;
  top: .5em;
  right: .375em;
  width: .5em;
  height: .5em;
  display: block;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
}

button {
  border: 0;
  border-radius: 0 .5em .5em 0;
  position: relative;
  padding-right: 1.25em;
}

.row.without-subtasks button {
  padding-right: .75em;
}

.row.without-task button {
  display: none;
}

button:focus {
  outline: none;
}

button:hover {
  background-color: #E1FA71;
}

input {
  flex-grow: 1;
  font-family: sans-serif;
  display: block;
  height: 1em;
  padding: .5em;
  border: 0;
  border-radius: .5em 0 0 .5em;
}

div.completed input {
  border-radius: 0;
}

input:focus {
  outline: none;
  background-color: #E1FA71;
}

.row.without-task input {
  border-radius: .5em;
}

div.row {
  display: flex;
  align-items: stretch;
  justify-content:  space-between;
  border: 2px solid #62E200;
  border-radius: .5em;
  margin-bottom: .5em;
}

div.row:focus-within {
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  color: #AA00A2;
}
</style>
