<template>
  <div>
    <div class='row' :class="rowClass">
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
      default () {return {id: undefined, tasks: [], text: ""};}
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
        foldSubtree:   ['ctrl', 'h']
      };
    },
    ...mapMutations([
      'changeTask',
      'removeTask',
      'addTask'
    ]),
    onFocus () {
      this.$parent.root.saveFocusedTaskRow(this);
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
      switch (event.srcKey) {
        case 'focusNext':
          this.root.focusNextTaskRow();
          break;
        case 'focusPrevious':
          this.root.focusPreviousTaskRow();
          break;
        case 'unfoldSubtree':
          this.root.getFocusedTaskRow().showSubtree()
          break;
        case 'foldSubtree':
          this.root.getFocusedTaskRow().hideSubtree()
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
    }
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
        'without-task':     this.task.id === undefined
      }
    }
  },
  mounted() {
    this.focus()
  },
}
</script>

<style scoped>
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
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-left: 0;
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
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
}

input {
  flex-grow: 1;
  font-family: sans-serif;
  display: block;
  height: 1em;
  padding: .5em;
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-radius: .5em 0 0 .5em;
}

input:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

.row.without-task input {
  border-radius: .5em;
}

div.row {
  display: flex;
  justify-content:  space-between;
}
</style>
