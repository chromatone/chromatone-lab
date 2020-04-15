import knob from '../ui/knob.js'

export const autoFilter = {
  title:'Auto filter',
  props: ['id','ch'],
  name:'auto-filter',
  components:{
    knob
  },
  data() {
    return {
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

        <knob v-model="filter.baseFrequency" unit="" param="FREQ" :step="1" :min="10" :max="1000"></knob>
        <knob v-model="filter.octaves" unit="" param="OCT" :step="0.01" :min="0.1" :max="7"></knob>
        <knob v-model="filter.filter.Q.value" unit="" param="Q" :step="0.01" :min="0" :max="10"></knob>
        <knob v-model="filter.wet.value" unit="" param="WET" :step="0.01" :min="0" :max="1"></knob>

        <div class="button-group">
          <span class="title">Filter type</span>
          <button :class="{active:filter.filter.type==type.type}" @click="filter.filter.type=type.type" :key="type.name" v-for="type in types">
            {{type.name}}
          </button>
        </div>
            <button class="line-button" :class="{active:playing}" @click="lfo()">LFO</button>
            <knob v-model="filter.depth.value" unit="" param="DEP" :step="0.01" :min="0.1" :max="1"></knob>

            <knob v-model="filter.frequency.value" unit="" param="RATE" :step="0.01" :min="0.1" :max="60"></knob>

    </div>
  `,
  created() {
    this.filter.set(this.options);
    this.filter.connect(this.ch.channel);
    this.filter.connect(this.ch.sender);
    this.ch.receiver.connect(this.filter);
  },
  methods: {
    lfo() {
      if (!this.playing) {
        this.filter.start();
      } else {
        this.filter.stop();
      }
      this.playing = !this.playing
    }
  },
  beforeDestroy() {

  }
}
