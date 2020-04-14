import channel from './channel.js'
import * as filters from '../filters/all.js'
import * as synths from '../synths/all.js'

const all = {
  filters,
  synths,
}

export default {
  title:'Channels',
  props:['type'],
  components:{
    channel,
    ...filters,
    ...synths,
  },
  template: `
    <section class="channels" >

      <header>
        <h2>{{type.toUpperCase()}}</h2>
        <button @click="add(ch)" v-for="ch in channels">
          + {{ch.title}}
        </button>
      </header>

      <draggable class="container" v-model="activeChannels" handle=".handle">
        <transition-group name="fade">
            <channel
             :style="{backgroundColor:$color.hex(ch.id)}"
              v-for="ch in activeChannels"
              :key="ch.id"
              :id="ch.id"
              :title="ch.title"
              @close="remove(ch)"
              v-slot="chParams">
              <transition name="fade">
                <component
                  v-show="chParams.show"
                  :is="ch.name"
                  :id="ch.id"
                  >
                </component>
              </transition>
          </channel>
        </transition-group>
      </draggable>
    </section>
  `,
  created() {
    for (let key in all[this.type]) {
      let ch = all[this.type][key];
      this.$set(
        this.channels,
        ch.name,
        ch
      )
    }
//    this.activeChannels = Object.values(this.channels) //temporary for check
  },
  data() {
    return {
      channels:{},
      activeChannels:[],
    };
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
  },
  beforeDestroy() {

  }
};
