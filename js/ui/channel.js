export default {
  title:'Channel',
  props:['id','title'],
  template: `
  <div class="channel">
    <div class="head">
      <span class="handle">&#9776;<h3  @click="show=!show">{{bigTitle}}</h3></span>
      <div class="spacer"></div>
      <div class="close" @click="$emit('close')">&times;</div>
    </div>
    <div>
      <slot :show="show"></slot>
    </div>
  </div>
  `,
  computed: {
    bigTitle() {
      return this.title.toUpperCase();
    }
  },
  data() {
    return {
      show:true,
    };
  },
  methods: {

  },
  created() {
    this.$bus.channels[this.id] = new Tone.Channel().toDestination();
  },
  beforeDestroy() {

  }
};
