export const bitCrusher = {
  title:'Bit crusher',
  name:'bit-crusher',
  props: {
    id: [Number, String],
    ch: Object,
  },
  data() {
    return {
      crusher: new Tone.BitCrusher(),
      options: {
        bits:4,
      }
    }
  },
  template: `
  <div class="bitCrusher row" >

      <knob :id="id"v-model="crusher.bits.value" :step="1" :min="1" :max="16">BITS</knob>

  </div>
  `,
  created() {
    this.crusher.set(this.options);
    this.crusher.connect(this.ch.channel);
    this.crusher.connect(this.ch.sender);
    this.ch.receiver.connect(this.crusher);
  },
  beforeDestroy() {
    this.ch.receiver.disconnect();
    this.crusher.dispose();
  }
}
