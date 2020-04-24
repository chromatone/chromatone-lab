export const sequence = {
  title:'Sequence',
  name:'sequence',
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
      sequence: new Tone.Sequence(),
      steps:[true,false,false,false,true,false,false,true],
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
      <toggle name="play" v-model="play" ></toggle>
      <toggle name="mute" v-model="sequence.mute"></toggle>
      <toggle name="human" v-model="sequence.humanize"></toggle>
      <knob :id="id" v-model="sequence.playbackRate" :min="1" :max="8" :step="0.1">Rate</knob>
      <knob :id="id" v-model="sequence.probability" :min="0" :max="1" :step="0.01">chance</knob>
      <div class="row">
        <trigger :activated="step" :outId="id" v-for="(step,key) in steps" :key="key"></trigger>
      </div>
    </section>
  `,
  created() {
    this.$bus.$on('connectFrom/'+this.id, this.connect);
    this.sequence.events=this.steps;
    this.sequence.callback = this.beats;
    this.sequence.start();
  },
  computed: {
    progress() {
      return this.sequence.progress
    },
    innerColor() {
      if (this.controlled) {
        return this.$color.hex(this.controlled)
      }
      return '#fefefe'
    },
  },
  watch: {
    play(val) {
      this.$resume();
      if (val) {
        this.sequence.start()
      } else {
        this.sequence.stop();
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
    beats(time,val) {
      this.message.time=time;
      if (val) {
        this.beat=true;
        Tone.Draw.schedule(() => {
          this.beat=false
        }, '+'+this.message.duration)
      } else {
        this.beat=false
      }
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
