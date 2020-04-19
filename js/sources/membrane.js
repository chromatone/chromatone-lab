export const membrane = {
  title:'Membrane',
  name:'membrane',

  props:['id','ch'],
  data() {
    return {
      options: {
        octaves:10,
        pitchDecay:0.05,
        envelope: {
          attack: 0.5,
          decay: 1,
          sustain: 0.8,
          release: 1,
        },
        volume: 1,
      },
      active: false,
      synth: new Tone.MembraneSynth(),
      send: {},
    }
  },
  template: `
    <div class="noise-generator row">

      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>

      <toggle assignable v-model="active"></toggle>

      <knob v-model="synth.octaves" :step="0.5" :min="0" :max="12">octaves</knob>
      <knob v-model="synth.pitchDecay" :step="0.005" :min="0.001" :max="0.2">decay</knob>

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
    attack(msg) {
      if (!msg) {return}
      let freq = this.$noteFreq(msg.pitch,msg.octave)
      this.$resume();
      this.active=true;
      this.synth.triggerAttack(freq);
    },
    release(msg) {
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
