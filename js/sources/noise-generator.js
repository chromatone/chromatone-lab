import knob from "../ui/knob.js"
import choice from '../ui/choice.js'
import toggle from '../ui/toggle.js'

export const noiseGenerator = {
  title:'Noise',
  name:'noise-generator',
  components: {
    knob,
    choice,
    toggle,
  },
  props:['id','ch'],
  data() {
    return {
      options: {
        noise: {
          type: "brown"
        },
        envelope: {
          attack: 1,
          decay: 0.1,
          sustain: 0.9,
          release: 4
        },
        volume: 1,
      },
      types: {
        brown: 'brown',
        pink: 'pink',
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
