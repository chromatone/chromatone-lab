export const phaser = {
  title:'Phaser',
  name:'phaser',
  props: {
    id: [Number, String],
    ch: Object,
  },
  data() {
    return {
      phaser: new Tone.Phaser(),
      options: new Tone.Phaser().get(),
    }
  },
  template: `
  <div class="phaser row" >

    <knob :id="id" unit="hz" v-model="phaser.baseFrequency"  :min="30" :max="3000">baseFreq</knob>

    <knob :id="id" v-model="options.frequency" :signal="phaser.frequency" :step="0.001" :max="4">freq</knob>

    <knob :id="id" :min="1" :max="8" v-model="phaser.octaves">Octaves</knob>

    <knob :id="id" :min="1" :max="20"  v-model="phaser.stages">stages</knob>

    <knob :id="id" v-model="options.Q" :signal="phaser.Q" :min="0" :max="20">Q</knob>




  </div>
  `,
  created() {
    this.phaser.set(this.options);
    this.phaser.connect(this.ch.channel);
    this.phaser.connect(this.ch.sender);
    this.ch.receiver.connect(this.phaser);
  },
  beforeDestroy() {
    this.ch.receiver.disconnect();
    this.phaser.dispose();
  }
}
