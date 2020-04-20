export const autoPanner = {
  title:'Auto panner',
  name:'auto-panner',
  props: {
    id: [Number, String],
    ch: Object,
  },
  template: `
  <div id="autoPanner" class="row">

    <toggle v-model="playing">PANNER</toggle>
    <knob :id="id"v-model="panner.frequency.value" param="FREQ" :step="0.1" :min="0.1" :max="30"></knob>
    <knob :id="id"v-model="panner.depth.value" param="DEP"  :min="0.1"></knob>

</div>
  `,
  data() {
    return {
      panner: new Tone.AutoPanner(),
      receive:true,
      playing:false,
      options: {
        frequency : 0.5 ,
        type : 'sine' ,
        depth : 0.2 ,
      }
    }
  },
	watch: {
    playing(val) {
      if (val) {
        this.panner.start();
      } else {
        this.panner.stop();
      }
    }
	},
  created() {
    console.log(this.ch.channel.channelCount)
    this.panner.set(this.options);
    this.panner.connect(this.ch.channel,0,0);
    this.panner.connect(this.ch.sender);
    this.ch.receiver.connect(this.panner);
  },

  beforeDestroy() {
    this.panner.dispose()
  }
}
