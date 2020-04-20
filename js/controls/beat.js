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
      loop: new Tone.Loop(this.beats, "4n"),
      message: {
        id: this.id,
        velocity:1,
        type:'trigger',
        action:'attack',
        time:undefined,
      }
    }
  },
  template:`
    <section class="row">
      <trigger v-model="beat" :activated="beat" :outId="id"></trigger>
      <toggle v-model="play">Beat</toggle>
      <toggle v-model="loop.mute">mute</toggle>
      <toggle v-model="loop.humanize">human</toggle>
      <knob :id="id" v-model="transport.bpm.value" :min="30" :max="240" :step="1">BPM</knob>
      <knob :id="id" v-model="loop.playbackRate" :min="1" :max="8" :step="0.1">Rate</knob>
      <knob :id="id" v-model="loop.probability" :min="0" :max="1" :step="0.01">chance</knob>
      <dc-meter :id="id" :value="progress"></dc-meter>
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
      this.$bus.$emit(this.id,this.message);
    },
  },
  methods: {
    beats(time) {
      this.message.time=time;
      this.beat=!this.beat;
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
