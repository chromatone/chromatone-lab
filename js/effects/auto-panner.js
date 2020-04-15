import knob from './knob.js'

export const autoPanner = {
  title:'Auto panner',
  name:'auto-panner',
  components:{
    knob
  },
  template: `
  <div id="autoPanner" class="row">

      <button :class="{active:receive}"  @click="receive=!receive">PANNER</button>

          <knob v-model="panner.frequency.value" unit="" param="FREQ" :step="0.1" :min="0.1" :max="30"></knob>
          <knob v-model="panner.depth.value" unit="" param="DEP" :step="0.01" :min="0.1" :max="1"></knob>

          <knob v-model="panner.wet.value" unit="" param="WET" :step="0.01" :min="0" :max="1"></knob>


</div>
  `,
  data() {
    return {
      panner: new Tone.AutoPanner(),
      playing:false,
      receive:false,
      options: {
        frequency : 0.5 ,
        type : 'sine' ,
        depth : 0.2 ,
      }
    }
  },
	watch: {
    receive(val) {
      if(val) {
        this.panner.toMaster();
        this.panner.start();
      } else {
        this.panner.disconnect();
        this.panner.stop();
      }
    }
	},
  created() {
    this.panner.set(this.options);
    this.panner.receive('panner')
  },

  beforeDestroy() {

  }
}
