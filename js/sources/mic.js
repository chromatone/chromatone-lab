export const mic = {
  title:'Mic',
  name:'mic',
  props:['id','ch'],
  template: `
    <div class="audio-in row">
      <button v-if="open" :class="{'active': active}"
      @mousedown="active=!active"
      @touchstart.stop.prevent="active=!active"
      >INPUT</button>
      {{error}}
    </div>
  `,
  data() {
    return {
      active: false,
      mic:{},
      open:false,
      error:undefined,
    };
  },
  mounted() {
    this.mic = new Tone.UserMedia({mute:true});
    this.mic.connect(this.ch.channel);
    this.mic.connect(this.ch.sender);
    this.openMic()
  },
  filters: {

  },
  methods: {
    openMic() {
      this.$resume;
      this.mic.open().then(() => {
        this.open = true;
      }).catch((e) => {this.error = e.message})
    }
  },
  watch: {
    active(val) {
      if (val) {
        this.mic.mute=false
      } else {
        this.mic.mute=true
      }
    }
  },
  beforeDestroy() {

  }
};
