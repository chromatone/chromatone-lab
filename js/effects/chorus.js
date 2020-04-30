export const chorus = {
  title:'Chorus',
  name:'chorus',
  props: {
    id: [Number, String],
    ch: Object,
  },
  data() {
    return {
      chorus: new Tone.Chorus(),
      options: new Tone.Chorus().get(),
    }
  },
  template: `
  <div class="chorus row" >

      <knob :id="id" v-model="chorus.delayTime" :min="1" :max="5000">Time</knob>
      <knob :id="id" v-model="chorus.depth">DEPTH</knob>
      <knob :id="id" v-model="chorus.feedback.value">Feedback</knob>
      <knob :id="id" v-model="chorus.spread" :step="1" :max="360">Spread</knob>

  </div>
  `,
  created() {
    this.chorus.set(this.options);
    this.chorus.connect(this.ch.channel);
    this.chorus.connect(this.ch.sender);
    this.ch.receiver.connect(this.chorus);
  },
  beforeDestroy() {
    this.ch.receiver.disconnect();
    this.chorus.dispose();
  }
}
