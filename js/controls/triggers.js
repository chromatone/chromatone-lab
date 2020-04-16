export const triggers = {
  title:'Triggers',
  name:'triggers',
  props: ['id','ch'],
  data() {
    return {
      triggers:[],
    }
  },
  template:`
    <section class="row">
      <trigger @attack="addTrigger()">+</trigger>
      <trigger
        v-for="trig in triggers"
        :key="trig.id"
        :style="{backgroundColor:$color.hex(trig.id)}"
        :class="{'alt-active':$root.assignMode, 'blink-from':$root.assign==trig}"
        @attack="attack(trig.id)" @release="release(trig.id)">TRIGGER
      </trigger>
    </section>
  `,
  methods: {
    addTrigger() {
      let trigger = {
        id: ''+this.$hash(),
        type: 'trigger',
      }
      this.triggers.push(trigger)
    },
    attack(id) {
      console.log(id)
    },
    release(id) {
      console.log(id)
    },
    trigger(trig) {
      console.log(trig.id)
      if (!this.$root.assignMode) {
        this.$root.$emit(trig.id,trig);
        return
      }
      if (this.$root.assign != trig) {
        this.$root.assign = trig;
      } else {
        this.$root.assign = {}
      }
    }
  },
  computed: {

  }
}
