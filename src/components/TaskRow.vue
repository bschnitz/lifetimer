<template>
  <div>
    <input ref="text" type='text' :value="this.text" @input="onInput" />
    <input type="submit" tabindex="-1" :value="button" />
  </div>
</template>

<script>
export default {
  name: 'TaskRow',
  props: {
    task: {
      type: Object,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  },
  methods: {
    onInput (e) {
      if (this.id === undefined) {
        this.$emit('addTask', {text: e.data})
        this.$refs['text'].value = ''
      }
      else if (e.target.value === "") {
        this.$emit('removeTask', this.id)
      }
      else {
        this.$emit('changeTask', {id: this.id, text: e.target.value})
      }
    },
    focus () {
      this.$refs['text'].focus()
    }
  },
  computed: {
    id () {
      return this.task === undefined ? undefined : this.task.id
    },
    text () {
      return this.task === undefined ? '' : this.task.text;
    },
    button () {
      return "+";
    }
  },
  mounted() {
    this.$emit('newTaskRow', this.id, this)
  },
  destroyed() {
    this.$emit('destroyed', this.index)
  }
}
</script>

<style scoped>
input[type='submit'] {
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-left: 0;
  border-radius: 0 .5em .5em 0;
}

input[type='submit']:focus {
  outline: none;
}

input[type='submit']:hover {
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
}

input[type='text'] {
  flex-grow: 1;
  font-family: sans-serif;
  display: block;
  padding: .5em;
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-radius: .5em 0 0 .5em;
}

input[type='text']:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

div {
  display: flex;
  justify-content:  space-between;
}
</style>
