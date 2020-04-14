import sqnob from "../ui/sqnob.js"

export const mic = {
  title:'Mic',
  name:'mic',
  props:['id'],
  template: `
    <div class="audio-in row">
      <button v-if="open" :class="{'active': active}"
      @mousedown="active=true"
      @mouseup="active=false"
      @touchstart.stop.prevent="active=true"
      @touchstop="active=false"
      @touchcancel="active=false"
      >
          INPUT
      </button>

    </div>
  `,
  components: {
    sqnob
  },
  data() {
    return {
      active: false,
      mic:{},
      open:false,
    };
  },
  mounted() {
    this.mic = new Tone.UserMedia({mute:true});
    this.mic.connect(this.$root.sources[this.id])
    this.mic.open().then(() => {
      this.open = true;
    })
  },
  filters: {

  },
  methods: {

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
