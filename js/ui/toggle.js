export const toggle = {
  name:'toggle',
  props: {
    value: Boolean,
    id:String,
    name:String,
  },
  template:`
    <button class="toggle"
      :class="{active:value, 'blink-to': $bus.assign.type=='toggle'}"
      :style="{backgroundColor:bgColor}"
      @touchstart.stop.prevent="press()"
      @mousedown.stop.prevent="press()"><div class="led"></div><span v-if="name">{{name}}</span></button>
  `,
  computed: {
    bgColor() {
      if (this.value && this.id) {
        return this.$color.hex(this.id)
      }
    }
  },
  methods: {
    press() {
      if (!this.value) {
        this.$emit('attack',{time:Tone.now()})
      } else {
        this.$emit('release',{time:Tone.now()})
      }
      this.$emit('input', !this.value);
    }
  },
}
