export const lfo = {
  title:'LFO',
  name:'lfo',
  props: ['id','ch'],
  data() {
    return {
      options: new Tone.LFO().get(),
      lfo: new Tone.LFO(),
      meter: new Tone.DCMeter(),
      level:0,
      play:false,
    }
  },
  template:`
    <section class="row">
      <toggle v-model="play"></toggle>
      <knob :id="id" v-model="options.frequency" :signal="lfo.frequency" :step="0.01" :min="0.01" :max="6">FREQ</knob>
      <knob :id="id" v-model="options.amplitude" :signal="lfo.amplitude" :step="0.01" :min="0" :max="1">AMP</knob>
      <knob :id="id" v-model="lfo.phase" :step="1" :min="0" :max="360">phase</knob>
      <knob :id="id" v-model="lfo.min" :step="0.01" :min="0" :max="1">min</knob>
      <knob :id="id" v-model="lfo.max" :step="0.01" :min="0" :max="1">max</knob>
      <dc-meter :id="id" :value="level"></dc-meter>
    </section>
  `,
  watch: {
    play(val) {
      if (val) {
        this.lfo.start();
        this.setLevel();
      } else {
        this.lfo.stop();
        this.level=this.meter.getValue();
      }
    }
  },
  mounted() {
    this.lfo.connect(this.meter);
    this.setLevel();
  },
  methods: {
    setLevel(level) {
      this.level=this.meter.getValue();
      if (this.play) {
        requestAnimationFrame(this.setLevel)
      }
    }
  },
}
