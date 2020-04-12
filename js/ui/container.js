export default {
  title:'Container',
  props:['id','title'],
  template: `
  <div class="container">
    <div class="head">
      <span class="handle">&#9776;<h3>{{bigTitle}}</h3></span>
      <div class="close" @click="$emit('close')">&times;</div>
    </div>
    <div>
      <slot></slot>
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
    };
  },
  methods: {

  },
  watch: {

  },
  beforeDestroy() {

  }
};
