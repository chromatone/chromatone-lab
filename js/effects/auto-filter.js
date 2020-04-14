import sqnob from '../ui/sqnob.js'

export const autoFilter = {
  title:'Auto filter',
  props: ['id'],
  name:'auto-filter',
  components:{
    sqnob
  },
  data() {
    return {
      receiver: new Tone.Channel(),
      filter: new Tone.AutoFilter(),
      types:[
        {type:'lowpass', name:'LP'},
        {type:'highpass', name:'HP'},
        {type:'bandpass', name:'BP'},
      ],
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
        <sqnob v-model="receive" unit="" param="RECEIVE" :step="0.01" :min="0" :max="1"></sqnob>

        <sqnob v-model="filter.baseFrequency" unit="" param="FREQ" :step="1" :min="10" :max="1000"></sqnob>
        <sqnob v-model="filter.octaves" unit="" param="OCT" :step="0.01" :min="0.1" :max="7"></sqnob>
        <sqnob v-model="filter.filter.Q.value" unit="" param="Q" :step="0.01" :min="0" :max="10"></sqnob>
        <sqnob v-model="filter.wet.value" unit="" param="WET" :step="0.01" :min="0" :max="1"></sqnob>

        <div class="button-group">
          <span class="title">Filter type</span>
          <button :class="{active:filter.filter.type==type.type}" @click="filter.filter.type=type.type" :key="type.name" v-for="type in types">
            {{type.name}}
          </button>
        </div>
            <button class="line-button" :class="{active:playing}" @click="playing=!playing">AUTO</button>
            <sqnob v-model="filter.depth.value" unit="" param="DEP" :step="0.01" :min="0.1" :max="1"></sqnob>

            <sqnob v-model="filter.frequency.value" unit="" param="RATE" :step="0.01" :min="0.1" :max="60"></sqnob>

    </div>
  `,
  created() {
    this.filter.set(this.options);
    this.filter.connect(this.$root.effects[this.id]);
  },
  mounted() {
    this.receiver.id = this.id;
    this.receiver.type = 'Auto Filter';
    this.receiver.connect(this.filter);
    this.receiver.receive(this.id);
    this.$set(
      this.$root.receivers,
      this.id,
      this.receiver
    )
  },
	watch: {
    receive(val) {
      this.receiver.volume.value=Tone.gainToDb(val)
    },
    playing(val) {
      if (val) {
        this.filter.start();
      } else {
        this.filter.stop();
      }
    }
	},
  beforeDestroy() {

  }
}
