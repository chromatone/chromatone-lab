
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
    }
  },
  template: `
    <div class="am-synth row">
      <trigger :inId="id" :activated="active" @attack="attack()" @release="release()"> </trigger>
      <toggle v-model="active"></toggle>
      <knob v-model="options.harmonicity" :signal="synth.harmonicity" :step="0.001" :min="0.125" :max="8">Harm</knob>
      {{options}}



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
      this.synth.triggerAttack('C2');
    },
    release() {
      this.active=false;
      this.synth.triggerRelease();
    }
  },
  watch: {
    options: {
      deep:true,
      handler(val) {
        this.synth.set(val)
      }
    },
    active(val) {
      if (val) {
        this.$resume();
        this.synth.triggerAttack('C2');
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
