export const autoFilter = {
  title:'Auto filter',
  name:'auto-filter',
  props: {
    id: [Number, String],
    ch: Object,
  },
  data() {
    return {
      filter: new Tone.AutoFilter(),
      types: {
        lowpass:'LP',
        highpass:'HP',
        bandpass:'BP',
      },
      playing:false,
      receive:1,
      options: {
        frequency : 0.5 ,
        type : 'sine' ,
        depth : 0.2 ,
        baseFrequency : 200 ,
        octaves : 5 ,
        filter : {
          type : 'lowpass' ,
          rolloff : -48 ,
          Q : 0
        }
      }
    }
  },
  template: `
      <div id="autoFilter" class="row">

        <knob :id="id"v-model="filter.baseFrequency" :step="1" :min="10" :max="1000">FREQ</knob>
        <knob :id="id"v-model="filter.octaves" :min="0.1" :max="7">OCT</knob>
        <knob :id="id"v-model="filter.filter.Q.value"  :max="10">Q</knob>
        <knob :id="id"v-model="filter.wet.value">WET</knob>

        <choice v-model="filter.filter.type"
          :options="types">Noise type</choice>

        <toggle v-model="playing">PLAY</toggle>

        <knob :id="id"v-model="filter.depth.value">DEP</knob>

        <knob :id="id"v-model="filter.frequency.value" :min="0.1" :max="60">RATE</knob>

    </div>
  `,
  created() {
    this.filter.set(this.options);
    this.filter.connect(this.ch.channel);
    this.filter.connect(this.ch.sender);
    this.ch.receiver.connect(this.filter);
  },
  watch: {
    playing(val) {
      if (val) {
        this.filter.start();
      } else {
        this.filter.stop();
      }
    }
  },
  beforeDestroy() {
    this.ch.receiver.disconnect();
    this.filter.disconnect();
  }
}
