import channels from './ui/channels.js'
import './bus.js'

const app = new Vue({
  el:"#lab-app",
  components:{
    channels,
  },
  data: {
    ch:{
      sources:{},
      effects:{},
      senders:{},
      receivers:{},
    }
  },
  methods: {

  }
})
