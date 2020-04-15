import channel from './channel.js'
import * as effects from '../effects/all.js'
import * as sources from '../sources/all.js'

export default {
  title:'Channels',
  props:['group'],
  components:{
    channel,
    ...effects,
    ...sources,
  },
  template: `
    <section class="channels" >

      <header>
        <h2>{{group.toUpperCase()}}</h2>
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
              :group="group"
              :title="ch.title"
              @close="remove(ch)"
              v-slot="chParams">
              <transition name="fade">
                <component
                  v-show="chParams.show"
                  :ch="chParams.ch"
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
    for (let key in this.allChannels[this.group]) {
      let ch = this.allChannels[this.group][key];
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
      allChannels:{
        effects,
        sources,
      },
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
