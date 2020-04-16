import channels from './channels/channels.js'
import * as ui from './ui/all.js'
import './bus.js'


Vue.component('choice',ui.choice);
Vue.component('toggle',ui.toggle);
Vue.component('knob',ui.knob);


const app = new Vue({
  el:"#lab-app",
  components:{
    channels,
  },
  data: {
    assignMode:false,
    ch:{
      controls:{},
      sources:{},
      effects:{},
      senders:{},
      receivers:{},
    }
  },
  methods: {

  }
})
