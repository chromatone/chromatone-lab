export const membrane = {
  title:'Membrane',
  name:'membrane',

  props:['id','ch'],
  data() {
    return {
      options: new Tone.MembraneSynth().get(),
      active: false,
      synth: new Tone.MembraneSynth(),
      send: {},
    }
  },
  template: `
    <div class="membrane-synth row">

      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>

      <toggle assignable v-model="active"></toggle>

      <knob :id="id"v-model="synth.octaves" :step="0.5" :min="0" :max="12">octaves</knob>
      <knob :id="id"v-model="synth.pitchDecay" :step="0.005" :min="0.001" :max="0.2">decay</knob>

      <div class="button-group">
        <span class="title">Envelope</span>
        <knob :id="id"v-model="synth.envelope.attack"
          :min="0.005" :step="0.01" :max="1">A</knob>
        <knob :id="id"v-model="synth.envelope.decay"
          :min="0.005" :max="6">D</knob>
        <knob :id="id"v-model="synth.envelope.sustain"
          :min="0.005" :max="1">S</knob>
        <knob :id="id"v-model="synth.envelope.release"
          :min="0.005" :max="50">R</knob>
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
        this.attack({pitch:0, octave:1});
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
