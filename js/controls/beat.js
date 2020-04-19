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
      loop: new Tone.Loop(this.beats, "8n"),
      message: {
        id: this.id,
        velocity:1,
        type:'trigger',
        action:'attack',
      }
    }
  },
  template:`
    <section class="row">
      <trigger v-model="beat" :beat="beat" :outId="id"></trigger>
      <toggle v-model="play">Beat</toggle>
      <knob v-model="transport.bpm.value" :min="30" :max="240" :step="1">BPM</knob>
      <knob v-model="loop.playbackRate" :min="1" :max="8" :step="1">Rate</knob>
      <knob v-model="loop.probability" :min="0" :max="1" :step="0.01">chance</knob>
    </section>
  `,
  created() {
    this.$bus.$on('connectFrom/'+this.id, this.connect)
  },
  watch: {
    play(val) {
      if (Tone.Transport.state != "started") {Tone.Transport.start();}
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
      this.beat=!this.beat
    },
    connect(id) {
      console.log(id)
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
  computed: {
    innerColor() {
      if (this.controlled) {
        return this.$color.hex(this.controlled)
      }
      return '#fefefe'
    }
  },
}
