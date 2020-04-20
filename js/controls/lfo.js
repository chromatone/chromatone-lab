const LFO = new Tone.LFO();

export const lfo = {
  title:'LFO',
  name:'lfo',
  props: ['id','ch'],
  data() {
    return {
      options: LFO.get(),
      lfo: LFO,
      meter: new Tone.DCMeter(),
      level:0,
      play:false,
    }
  },
  template:`
    <section class="row">
      <toggle v-model="play"></toggle>
      <knob v-model="options.frequency" :signal="lfo.frequency" :step="0.1" :min="0.1" :max="30">FREQ</knob>
      <knob v-model="level" :step="0.1" :min="0" :max="1">LFO</knob>
    </section>
  `,
  watch: {
    play(val) {
      val ? this.lfo.start() : this.lfo.stop();
    }
  },
  mounted() {
    this.lfo.connect(this.meter);
    this.setLevel();
  },
  methods: {
    setLevel(level) {
      this.level=this.meter.getValue();
      requestAnimationFrame(this.setLevel)
    }
  },
}
