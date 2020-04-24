export const beat = {
  title:'Beat',
  name:'beat',
  props: ['id','ch'],
  data() {
    return {
      bpm:120,
      play:false,
      beating:false,
      beat:false,
      controlled:undefined,
      transport: Tone.Transport,
      position:'',
      interval:'1m',
      loop: new Tone.Loop(this.beats, '2n'),
      message: {
        id: this.id,
        velocity:1,
        type:'trigger',
        action:'attack',
        time:undefined,
        duration:'16n',
      }
    }
  },
  template:`
    <section class="row">
      <trigger v-model="beat" :activated="beat" :outId="id"></trigger>
      <toggle name="Beat" v-model="play" ></toggle>
      <toggle name="mute" v-model="loop.mute"></toggle>
      <toggle name="human" v-model="loop.humanize"></toggle>
  
      <knob :id="id" v-model="loop.playbackRate" :min="1" :max="8" :step="0.1">Rate</knob>
      <knob :id="id" v-model="loop.probability" :min="0" :max="1" :step="0.01">chance</knob>
    </section>
  `,
  created() {
    this.$bus.$on('connectFrom/'+this.id, this.connect)
  },
  computed: {
    progress() {
      return this.loop.progress
    },
    innerColor() {
      if (this.controlled) {
        return this.$color.hex(this.controlled)
      }
      return '#fefefe'
    }
  },
  watch: {
    play(val) {
      this.$resume();
      if (val) {
        this.loop.start()
      } else {
        this.loop.stop();
        this.beat=false;
      }
    },
    beat(val) {
      if (val) {
        this.message.action='attack'
      } else {
        this.message.action='release'
      }
  //    this.$bus.$emit(this.id,this.message);
    },
  },
  methods: {
    beats(time) {
      this.message.time=time;
      this.beat=true;
      Tone.Draw.schedule(() => {
        this.beat=false
      }, '+'+this.message.duration)
    },
    connect(id) {
      this.controlled = id
    },
    assignFrom() {
      if (!this.$bus.assigning) {return}
      if (this.$bus.assign != this.message) {
        this.$bus.assign = this.message;
      } else {
        this.$bus.assign = {}
      }
    },
  },

}
