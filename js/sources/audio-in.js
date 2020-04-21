export const audioIn = {
  title:'Audio in',
  name:'audioIn',
  props:['id','ch'],
  template: `
    <div class="audio-in row">
      <trigger :inId="id" @attack="active=true" @release="active=false" v-if="open"></trigger>
      <toggle name="input" v-model="active" v-if="open"></toggle>
    </div>
  `,
  data() {
    return {
      active: false,
      input:{},
      open:false,
      error:undefined,
    };
  },
  mounted() {
    this.input = new Tone.UserMedia({mute:true});
    this.input.connect(this.ch.channel);
    this.input.connect(this.ch.sender);
    this.openInput()
  },
  filters: {

  },
  methods: {
    openInput() {
      this.$resume;
      this.input.open().then(() => {
        this.open = true;
      }).catch((e) => {this.error = e.message})
    }
  },
  watch: {
    active(val) {
      if (val) {
        this.input.mute=false
      } else {
        this.input.mute=true
      }
    }
  },
  beforeDestroy() {

  }
};
