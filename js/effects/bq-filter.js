export const bqFilter = {
  title:'Filter',
  name:'bq-filter',
  props: {
    id: [Number, String],
    ch: Object,
  },
  data() {
    return {
      filter: new Tone.Filter(),
      types: {
        lowpass:'LP',
        highpass:'HP',
        bandpass:'BP',
      },
      playing:false,
      receive:1,
      options: new Tone.Filter(400,'lowpass').get(),
    }
  },
  template: `
    <div id="autoFilter" class="row">
      <knob :id="id" v-model="options.frequency" :signal="filter.frequency" :step="1" :min="10" :max="20000">FREQ</knob>
      <knob :id="id" v-model="options.Q" :signal="filter.Q"  :max="30">Q</knob>
      <choice v-model="filter.type"
        :options="types">type</choice>
    </div>
  `,
  created() {
    this.filter.set(this.options);
    this.filter.connect(this.ch.channel);
    this.filter.connect(this.ch.sender);
    this.ch.receiver.connect(this.filter);
  },
  beforeDestroy() {
    this.ch.receiver.disconnect();
    this.filter.disconnect();
  }
}
