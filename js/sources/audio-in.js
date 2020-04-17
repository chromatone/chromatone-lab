export const audioIn = {
  title:'Audio in',
  name:'audioIn',
  props:['id','ch'],
  template: `
    <div class="audio-in row">
      <trigger @attack="active=true" @release="active=false"></trigger>
      <toggle v-model="active" v-if="open">INPUT</toggle>
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
