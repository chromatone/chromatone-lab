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
    <button class="toggle" :class="{active:value, 'blink-to':assignable && $root.assign.type=='toggle'}"
      @click="press()"><div class="toggler"><slot></slot></div></button>
  `,
  methods: {
    press() {
      if (!this.assignable || !this.$root.assign.id) {
        this.$emit('input', !this.value);
      } else {
        if (this.$root.assign.type=='trigger') {

        }
      }
    }
  },
}
