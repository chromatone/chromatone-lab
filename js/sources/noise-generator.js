export const noiseGenerator = {
  title:'Noise',
  name:'noise-generator',

  props:['id','ch'],
  data() {
    return {
      options: new Tone.NoiseSynth().get(),
      types: {
        brown: 'brown',
        pink: 'pink',
        white: 'white'
      },
      active: false,
      activated:false,
      synth: new Tone.NoiseSynth(),
      send: {},
    }
  },
  template: `
    <div class="noise-generator row">

      <trigger :inId="id" :activated="active" @attack="attack" @release="release"> </trigger>

      <toggle v-model="active" @attack="attack" @release="release"></toggle>

      <choice v-model="synth.noise.type" :options="types">Noise type</choice>

      <knob :id="id" v-model="synth.noise.playbackRate" unit="" :step="0.005" :min="0.1" :max="4">speed</knob>

      <envelope :id="id" v-model="synth.envelope"></envelope>

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
      if (msg.duration) {
        this.synth.triggerAttackRelease(msg.duration,msg.time);
        return
      }
      this.synth.triggerAttack(msg.time);
    },
    release(msg) {
      this.active=false;
      this.synth.triggerRelease(msg.time);
    }
  },
  beforeDestroy() {
    this.synth.triggerRelease();
    this.synth.dispose();
  }
};
