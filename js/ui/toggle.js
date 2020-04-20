export const toggle = {
  name:'toggle',
  props: {
    value: Boolean,
  },
  template:`
    <button class="toggle" :class="{active:value, 'blink-to': $bus.assign.type=='toggle'}"
      @click="press()"><div class="toggler"><slot></slot></div></button>
  `,
  methods: {
    press() {
      this.$emit('input', !this.value);
    }
  },
}
