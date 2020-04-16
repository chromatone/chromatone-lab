import channels from './channels/channels.js'
import * as ui from './ui/all.js'
import './bus.js'

Object.entries(ui).forEach((el) => {
  Vue.component(el[0],el[1])
})



const app = new Vue({
  el:"#lab-app",
  components:{
    channels,
  },
  data: {
    assignMode:false,
    assign:{},
    control:{
      from:{},
      to:{},
    },
    ch:{
      sources:{},
      effects:{},
      senders:{},
      receivers:{},
    }
  },
  watch: {
    assignMode(val) {
      if (!val) {
        this.assign = {};
      }
    }
  },
  methods: {

  }
})
