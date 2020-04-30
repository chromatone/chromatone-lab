import channels from './channels/channels.js'
import * as ui from './ui/all.js'
import './utility.js'
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
    frequency:220,
    transport: Tone.Transport,
  },
})


Vue.prototype.$ch = new Vue({  // AUDIO BUS
  data: {
    sources:{},
    effects:{},
    senders:{},
    receivers:{},
  }
});
