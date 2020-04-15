export default {
  name:'toggle',
  props: ['value'],
  template:`
    <button :class="{active:value}"
      @touchstart.stop.prevent="$emit('input',!value)" @mousedown="$emit('input',!value)"><slot></slot></button>
  `,

}
