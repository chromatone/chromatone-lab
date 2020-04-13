export default {
  title:'Container',
  props:['id','title'],
  template: `
  <div class="container">
    <div class="head">
      <span class="handle">&#9776;<h3>{{bigTitle}}</h3></span>
      <div class="" @click="$emit('close')">&times;</div>
      <div class="close" @click="show=!show">&#x21F2;</div>
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
      channel:{},
    };
  },
  methods: {

  },
  created() {
    this.channel = new Tone.Channel().toDestination();
  },
  beforeDestroy() {

  }
};
