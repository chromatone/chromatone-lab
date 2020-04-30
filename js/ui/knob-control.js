export default {
  name:'knob-control',
  props: {
    value: String,
    id: String,
  },
  template:`
    <div
      @touchstart.stop.prevent="assign()"
      @mousedown.stop.prevent="assign()"
      :class="{'blink-to':$bus.assign.type=='knob', cancel: value}"
      :style="{backgroundColor:value ? $color.hex(value) : 'hsla(0,0%,50%,0.3)'}"
      class="assigner">
    </div>
  `,
  methods: {
    assign() {
      if (this.value) {
        this.disconnect()
        return
      }
      this.connect();
    },
    connect() {
      this.$emit('input',this.$bus.assign.id)
      Vue.nextTick(() => {
        this.$bus.$emit('connectFrom/'+this.value, this.id);
        this.$bus.$on('knob/'+this.value, this.react);
        this.$bus.assigning=false;
      })

    },
    disconnect() {
      this.$emit('input', undefined)
      this.$bus.$off('knob/'+this.value, this.react);
      this.$bus.$emit('connectFrom/'+this.value);
    },
    react(ev) {
      this.$emit('react',ev)
    },
  },
  beforeDestroy() {
    this.disconnect();
  }
}
