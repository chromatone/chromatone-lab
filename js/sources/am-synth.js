
// https://tonejs.github.io/docs/13.8.25/AMSynth#modulation
// https://tonejs.github.io/docs/14.5.46/AMSynth#modulation

export const amSynth = {
  title:'AM Synth',
  name:'am-synth',
  props:['id','ch'],
  data() {
    return {
      options:  {
        harmonicity : 3 ,
        detune : 0 ,
        oscillator : {
          type : 'sine'
        },
        envelope : {
          attack : 0.01 ,
          decay : 0.01 ,
          sustain : 1 ,
          release : 0.5,
        },
        modulation : {
          type : 'square'
        },
        modulationEnvelope : {
          attack : 0.5 ,
          decay : 0 ,
          sustain : 1 ,
          release : 0.5,
        }
      },
      types: {
        pulse: 'pulse',
        fatcustom: 'fat',
        white: 'white'
      },
      active: false,
      synth: new Tone.NoiseSynth(),
      send: {},
    }
  },
  template: `
    <div class="noise-generator row">

      <toggle v-model="active">Noise</toggle>

      <choice v-model="synth.noise.type" :options="types">Noise type</choice>

      <knob v-model="synth.noise.playbackRate" unit="" :step="0.005" :min="0.1" :max="4">speed</knob>

      <div class="button-group">
        <span class="title">Envelope</span>
        <knob v-model="synth.envelope.attack"
          :min="0.005" :max="4">A</knob>
        <knob v-model="synth.envelope.decay"
          :min="0.001" :max="6">D</knob>
        <knob v-model="synth.envelope.sustain"
          :min="0.001" :max="1">S</knob>
        <knob v-model="synth.envelope.release"
          :min="0.001" :max="50">R</knob>
      </div>

    </div>
  `,
  mounted() {
    this.synth.set(this.options);
    this.synth.connect(this.ch.channel);
    this.synth.connect(this.ch.sender);
    this.$root.$on('control', trigger);
  },
  methods: {
    trigger(message) {
      console.log('message')
      this.active = !this.active;
    }
  },
  watch: {
    active(val) {
      if (val) {
        this.$resume();
        this.synth.triggerAttack();
      } else {
        this.synth.triggerRelease();
      }
    },
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
