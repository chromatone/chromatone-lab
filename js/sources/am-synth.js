
// https://tonejs.github.io/docs/13.8.25/AMSynth#modulation
// https://tonejs.github.io/docs/14.5.46/AMSynth#modulation

export const amSynth = {
  title:'AM Synth',
  name:'am-synth',
  props:['id','ch'],
  data() {
    return {
      options: new Tone.AMSynth().get(),
      osc: {
        sine: 'sine',
        square: 'square',
        sawtooth: 'saw',
        pwm: 'pwm',
      },
      active: false,
      synth: new Tone.AMSynth(),
      send: {},
      frequency:220,
    }
  },
  template: `
    <div class="am-synth row">
      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>
      <toggle v-model="active" @attack="attack" @release="release"></toggle>
      <frequency v-model="frequency"></frequency>
      <knob :id="id" v-model="options.harmonicity" :signal="synth.harmonicity" :step="0.001" :min="0.125" :max="8">Harm</knob>
      <choice v-model="synth.oscillator.type" :options="osc">oscillator</choice>
      <envelope :id="id" v-model="synth.envelope">osc waveform</envelope>
      <choice v-model="synth.modulation.type" :options="osc">mod waveform</choice>
      <envelope :id="id" v-model="synth.modulationEnvelope">modulation</envelope>
    </div>
  `,
  methods: {
    attack(msg) {
      this.$resume();
      let freq = this.frequency
      if (msg.pitch && msg.octave) {
        freq = this.$noteFreq(msg.pitch,msg.octave)
      }
      if (msg.duration) {
        this.synth.triggerAttackRelease(freq,msg.duration,msg.time);
        return
      }
      this.synth.triggerAttack(freq);
    },
    release(msg) {
      this.synth.triggerRelease(msg.time ||'+0.1');
    }
  },
  mounted() {
    this.synth.set(this.options);
    this.synth.connect(this.ch.channel);
    this.synth.connect(this.ch.sender);
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
