import knob from './knob.js'

export const bitCrusher = {
  title:'Bit crusher',
  name:'bit-crusher',
  components:{
    knob
  },
  template: `
  <div id="bitCrusher" class="row">

      <button :class="{active:receive}"  @click="receive=!receive">BITCRUSHER</button>

      <knob v-model="crusher.bits" unit="" param="BITS" :step="0.1" :min="0.1" :max="16"></knob>

      <knob v-model="crusher.wet.value" unit="" param="WET" :step="0.05" :min="0" :max="1"></knob>


  </div>
  `,
  data() {
    return {
      crusher: new Tone.BitCrusher(),
      playing:false,
      receive:false,
      options: {
        bits:4,
      }
    }
  },
	watch: {
    receive(val) {
      if(val) {
        this.crusher.toMaster();
      } else {
        this.crusher.disconnect();
      }
    }
	},
  created() {
    this.crusher.set(this.options);
    this.crusher.receive('filter')
  },

  beforeDestroy() {

  }
}
