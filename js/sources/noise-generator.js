export const noiseGenerator = {
  title:'Noise',
  name:'noise-generator',

  props:['id','ch'],
  data() {
    return {
      options: {
        noise: {
          type: "brown"
        },
        envelope: {
          attack: 0.5,
          decay: 1,
          sustain: 0.8,
          release: 1,
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

      <trigger :activated="active" assignable @attack="attack()" @release="release()"> </trigger>

      <toggle assignable v-model="active"></toggle>

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
  methods: {
    attack() {
      this.$resume();
      this.active=true;
      this.synth.triggerAttack();
    },
    release() {
      this.active=false;
      this.synth.triggerRelease();
    }
  },
  watch: {
    active(val) {
      if (val) {
        this.attack();
      } else {
        this.release();
      }
    },
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
