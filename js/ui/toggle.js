export const toggle = {
  name:'toggle',
  props: {
    value: Boolean,
    assignable: {
      type: Boolean,
      default: false,
    }
  },
  template:`
    <button class="toggle" :class="{active:value, 'blink-to':assignable && $bus.assign.type=='toggle'}"
      @click="press()"><div class="toggler"><slot></slot></div></button>
  `,
  methods: {
    press() {
      this.$emit('input', !this.value);
    }
  },
}
