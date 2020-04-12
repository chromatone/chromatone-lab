import * as filters from './filters/all.js'
import * as synths from './synths/all.js'
import container from './ui/container.js'


const modules = {
    ...filters,
    ...synths,
  }

const ct = new Vue({
  el:"#lab-app",
  components:{
    ...modules,
    container,
  },
  data: {
    channels:[],
    modules,
    activeModules:[],
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
      this.activeModules.push(theMod)
    },
    remove(mod) {
      this.activeModules.splice(
        this.activeModules.indexOf(mod), 1
      )
    },
    resume() {
      if (Tone.context.state == "suspended") {
        Tone.context.resume();
      }
    }
  }
})
