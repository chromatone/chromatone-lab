export const membrane = {
  title:'Membrane',
  name:'membrane',

  props:['id','ch'],
  data() {
    return {
      options: new Tone.MembraneSynth().get(),
      active: false,
      synth: new Tone.MembraneSynth(),
      pitch:0,
      octave:1,
    }
  },
  template: `
    <div class="membrane-synth row">

      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>

      <toggle v-model="active" @attack="attack" @release="release"></toggle>

      <knob :id="id" v-model="synth.octaves" :step="0.5" :min="0" :max="12">octaves</knob>
      <knob :id="id" v-model="synth.pitchDecay" :step="0.005" :min="0.001" :max="0.2">decay</knob>

    <envelope :id="id" v-model="synth.envelope"></envelope>

    </div>
  `,
  mounted() {
    this.synth.set(this.options);
    this.synth.connect(this.ch.channel);
    this.synth.connect(this.ch.sender);
  },
  computed: {
    freq() {
      return this.$noteFreq(this.pitch,this.octave);
    }
  },
  methods: {
    attack(msg) {
      this.$resume();
      let freq = this.freq
      if (msg.pitch && msg.octave) {
        freq = this.$noteFreq(msg.pitch,msg.octave)
      }
      if (msg.duration) {
        this.synth.triggerAttackRelease(freq,msg.duration,msg.time);
        return
      }
      this.synth.triggerAttack(freq, msg.time);
    },
    release(msg) {
      this.synth.triggerRelease(msg.time);
    }
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
