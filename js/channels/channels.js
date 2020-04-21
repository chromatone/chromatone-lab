import * as channels from './all.js'
import * as effects from '../effects/all.js'
import * as sources from '../sources/all.js'
import * as controls from '../controls/all.js'

export default {
  title:'Channels',
  props:['group'],
  components:{
    ...channels,
    ...effects,
    ...sources,
    ...controls,
  },
  data() {
    return {
      open:true,
      adding: false,
      channels:{},
      allChannels:{
        effects,
        sources,
        controls,
      },
      activeChannels:[],
    };
  },
  template: `
    <section class="channels" >

      <header>
        <h2>{{group}}</h2>

        <transition-group name="fade">
          <button :key="ch.title" @click="add(ch)" v-for="ch in channels">
            {{ch.title}}
          </button>
        </transition-group>
        <div class="spacer"></div>
        <toggle name="Assign"
          v-if="group=='controls' && activeChannels.length>0"
          v-model="$bus.assigning"
          :id="$bus.assign.id"
          ></toggle>
      </header>

      <draggable class="container" v-if="activeChannels.length>0" v-model="activeChannels" handle=".handle">
        <transition-group name="fade">
            <component
              v-for="ch in activeChannels"
              :is="group+'-channel'"
              :style="{backgroundColor:$color.hex(ch.id)}"
              :key="ch.id"
              :id="ch.id"
              :group="group"
              :title="ch.title"
              @close="remove(ch)"
              v-slot="{show,ch:chan}">
              <transition name="fade">
                <component
                  v-show="open && show"
                  :ch="chan"
                  :is="ch.name"
                  :id="ch.id"
                  >
                </component>
              </transition>
          </component>
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
  methods: {
    add(mod) {
      let theMod = {...mod}
      theMod.id = this.$hash();
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
