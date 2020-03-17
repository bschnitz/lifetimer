import Vue from 'vue'
import App from './App.vue'
import Shortkey from 'vue-shortkey'

Vue.use(Shortkey)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
