import * as filters from './filters/all.js'
import * as synths from './synths/all.js'
import channel from './ui/channel.js'


const channels = {
    ...filters,
    ...synths,
  }

const ct = new Vue({
  el:"#lab-app",
  components:{
    ...channels,
    channel,
  },
  data: {
    strips:[],
    channels,
    activeChannels:[
      synths.noiseGenerator,
    ],
    colorHash: new ColorHash({
      saturation:[0.25, 0.35, 0.5],
      lightness: [0.65, 0.75, 0.85],
    }),
  },
  computed: {
    moduleList() {

    }
  },
  methods: {
    add(mod) {
      let theMod = {...mod}
      theMod.id = Math.floor( Math.random() * Date.now());
      this.activeChannels.push(theMod)
    },
    remove(mod) {
      this.activeChannels.splice(
        this.activeChannels.indexOf(mod), 1
      )
    },
    resume() {
      if (Tone.context.state == "suspended") {
        Tone.context.resume();
      }
    }
  }
})
