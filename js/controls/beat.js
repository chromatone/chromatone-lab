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
      <button @click="addTrigger()">+</button>
      <trigger
        v-for="trig in triggers"
        :outId="trig.id"
        :key="trig.id">
      </trigger>
    </section>
  `,
  methods: {
    addTrigger() {
      this.triggers.push({
        id: this.$hash(),
      })
    },
  },
}
