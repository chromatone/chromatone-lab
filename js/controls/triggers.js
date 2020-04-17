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
        @attack="attack(trig)" @release="release(trig)">TRIGGER
      </trigger>
    </section>
  `,
  methods: {
    addTrigger() {
      let trigger = {
        id: this.$hash(),
        velocity:1,
        type:undefined,
      }
      this.triggers.push(trigger)
    },
    attack(trig) {
      if (this.$root.assignMode) { this.assign(trig); return }
      trig.type="attack"
      this.$root.$emit(trig.id,trig);
    },
    release(trig) {
      if (this.$root.assignMode) { return }
      trig.type="release"
      this.$root.$emit(trig.id,trig);
    },
    assign(trig) {
      if (this.$root.assign != trig) {
        this.$root.assign = trig;
      } else {
        this.$root.assign = {}
      }
    },
  },
  computed: {

  }
}
