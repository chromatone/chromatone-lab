
// https://tonejs.github.io/docs/13.8.25/AMSynth#modulation
// https://tonejs.github.io/docs/14.5.46/AMSynth#modulation

const AMSynth = new Tone.AMSynth()

export const amSynth = {
  title:'AM Synth',
  name:'am-synth',
  props:['id','ch'],
  data() {
    return {
      options:  AMSynth.get(),
      types: {
        pulse: 'pulse',
        fatcustom: 'fat',
        white: 'white'
      },
      active: false,
      synth: AMSynth,
      send: {},
      note:'C2',
    }
  },
  template: `
    <div class="am-synth row">
      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>
      <toggle v-model="active" @attack="attack" @release="release"></toggle>
      <knob :id="id" v-model="options.harmonicity" :signal="synth.harmonicity" :step="0.001" :min="0.125" :max="8">Harm</knob>
      <envelope :id="id" v-model="synth.envelope">main</envelope>
      <envelope :id="id" v-model="synth.modulationEnvelope">modulation</envelope>
      {{options}}
    </div>
  `,
  mounted() {
    this.synth.set(this.options);
    this.synth.connect(this.ch.channel);
    this.synth.connect(this.ch.sender);
  },
  methods: {
    attack(msg) {
      this.$resume();
      this.synth.triggerAttack('C2');
    },
    release(msg) {
      this.active=false;
      this.synth.triggerRelease();
    }
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
