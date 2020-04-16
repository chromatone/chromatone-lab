export const trigger = {
  title:'Trigger',
  name:'trigger',
  props: ['id','ch'],
  data() {
    return {
      counter:0,
    }
  },
  template:`
    <button
      @touchstart.stop.prevent="trigger()" @mousedown="trigger()">TRIGGER {{id}}
    </button>
  `,
  methods: {
    trigger() {
      this.counter++;
      this.$root.$emit('trigger',this.id)
    }
  },

}
