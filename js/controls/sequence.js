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
      sequence: {},
      stepObj: {
        pos:0,
        active:false,
        pitch:0,
        octave:3,
      },
      options:{
        subdivision:'8n',
        events:[],
      },
      steps:[],
      activeStep:0,
      sequenceLength:8,
      subdivision:'8n',
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

        <button
          :class="{active:step.pos == activeStep}"
          v-for="(step,key) in sequence.events" :key="key"
          @click="act(step)">
          <div class="dot" :style="{backgroundColor: step.active ? 'grey' : 'transparent'}">
          </div>
        </button>
      </div>
    </section>
  `,
  created() {
    this.initSequence();
    this.sequence = new Tone.Sequence(this.beats, this.options.events, this.options.subdivision)
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
        this.sequence.start('@1m')
      } else {
        this.sequence.stop();
        this.beat=false;
      }
    },
  },
  methods: {
    act(step) {
      step.active = !step.active
    },
    beats(time,val,key) {
      this.activeStep=val.pos;
      if (val.active) {
        this.beat=true;
        Tone.Draw.schedule(() => {
          this.beat=false
        }, '+'+this.message.duration)
      } else {
        this.beat=false
      }
    },
    initSequence() {
      for (let i=0; i<this.sequenceLength; i++) {
        let step = {...this.stepObj};
        step.pos=i
        this.options.events.push(step)
      }
    }
  },
}
