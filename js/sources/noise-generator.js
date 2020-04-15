import sqnob from "../ui/sqnob.js"

export const noiseGenerator = {
  title:'Noise',
  name:'noise-generator',
  props:['id','ch'],
  template: `
    <div class="noise-generator row">

      <button :class="{'active': active}"
      @mousedown="playNoise()"
      @touchstart.stop.prevent="playNoise()">
          NOISE
      </button>

      <div class="button-group">
        <span class="title">Noise type</span>
        <button :class="{active:synth.noise.type==type}" @click="synth.noise.type=type" :key="type" v-for="type in types">
        {{type}}
        </button>
      </div>

      <sqnob v-model="synth.noise.playbackRate" unit="" param="SPEED" :step="0.005" :min="0.1" :max="4"></sqnob>

      <div class="button-group">
        <span class="title">Envelope</span>
        <sqnob v-model="synth.envelope.attack" unit="" param="ATT" :step="0.01" :min="0.005" :max="4"></sqnob>
        <sqnob v-model="synth.envelope.decay" unit="" param="DEC" :step="0.01" :min="0.001" :max="6"></sqnob>
        <sqnob v-model="synth.envelope.sustain" unit="" param="SUS" :step="0.01" :min="0.001" :max="1"></sqnob>
        <sqnob v-model="synth.envelope.release" unit="" param="REL" :step="0.01" :min="0.001" :max="12"></sqnob>
      </div>

      <sqnob v-model="volume" unit="" param="VOL" :step="0.01" :min="0" :max="1"></sqnob>

    </div>
  `,
  components: {
    sqnob
  },
  data() {
    return {
      noiseOptions: {
        noise: {
          type: "brown"
        },
        envelope: {
          attack: 1,
          decay: 0.1,
          sustain: 0.9,
          release: 4
        },
        volume: 0,
      },
      volume:1,
      types: ["brown", "pink", "white"],
      active: false,
      synth: new Tone.NoiseSynth(),
      send: {},
    };
  },
  mounted() {
    this.synth.set(this.noiseOptions);
    this.synth.connect(this.ch.channel);
    this.synth.connect(this.ch.sender);
  },
  methods: {
    playNoise() {
      this.$resume();
      if (this.active) {this.stopNoise(); return}
      this.active = true;
      this.synth.triggerAttack();
    },
    stopNoise() {
      this.synth.triggerRelease();
      this.active = false;
    }
  },
  watch: {
    volume(val) {
      this.synth.volume.value=Tone.gainToDb(val);
    },
    "noiseOptions.volume"(val) {
      this.synth.volume.setValueAtTime(val);
    }
  },
  beforeDestroy() {
    this.synth.triggerRelease();
  }
};
