<template>
  <div id="app">
    <HelloWorld v-bind:store="store" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

class Store {
  get tasks() {
    let tasks = localStorage.getItem("store.tasks");
    return tasks === null ? [] : JSON.parse(tasks);
  }
  set tasks(tasks) {
    localStorage.setItem("store.tasks", JSON.stringify(tasks));
  }
}

//let store = new Store();
//store.tasks = [
//  "Softwareentwicklung (Aufgabenmanager)",
//  "Lesen (Asimov, Borderlinebuch, Fahrradbuch)",
//  "Handyakku testen",
//  "Fahrradplanung",
//  "Computerspielen",
//  "Ringe für die Hochzeit aus Epoxit",
//];

export default {
  data: function() {
    return {
      store: new Store()
    }
  },
  name: 'App',
  components: {
    HelloWorld
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
