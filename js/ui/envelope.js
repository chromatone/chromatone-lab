export const envelope = {
  title:'Envelope',
  name:'envelope',
  props: {
    value:Object,
    id:String,
  },
  data() {
    return {
      envelope: this.value,
    }
  },
  template:`
    <div class="button-group">
      <span  class="title"><slot>Envelope</slot></span>
        <knob :id="id" v-model="envelope.attack"
          :min="0.005" :max="2">A</knob>
        <knob :id="id" v-model="envelope.decay"
          :min="0.001" :max="2">D</knob>
        <knob :id="id" v-model="envelope.sustain"
          :min="0.001" :max="1">S</knob>
        <knob :id="id" v-model="envelope.release"
          :min="0.001" :max="5">R</knob>
    </div>
  `,
  watch: {
    envelope:{
      deep:true,
      handler(env) {
        this.$emit('input', env)
      }
    }
  }
}
