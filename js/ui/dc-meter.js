
export const dcMeter = {
  title: 'DCMeter',
  name:'dc-meter',
  props: {
    min:{
      type: Number,
      default:0,
    },
    max:{
      type: Number,
      default:1,
    },
    value:{
      type: Number,
      default:1,
    },
    step:{
      type: Number,
      default:0.01,
    },
    id: String,
    signal:Object,
    volume:Object,
  },
  data() {
    return {
      active: false,
      message: {
        id: this.id,
        type:'knob',
      },
      controlled:undefined,
    }
  },
  template: `
  <div
    :class="{active:active}"
    @touchstart.stop.prevent="active=!active"
    @mousedown.stop.prevent="active=!active"
    class="knob dc-meter">
      <div v-if="active" class="num">{{value.toFixed(0)}}</div>
      <div class="info">
        <slot></slot>
      </div>
      <div class="value" :style="{height:internalValue+'%', backgroundColor:color}"></div>
      <div
        @touchstart.stop.prevent="assign()"
        @mousedown.stop.prevent="assign()"
        v-if="$bus.assigning"
        :class="{'blink-from':$bus.assign.id && $bus.assign.id==id}"
        class="assigner"></div>
  </div>
  `,
  created() {
    this.$bus.$on('connectFrom/'+this.id, this.connect)
  },
  computed: {
    color() {
      if (this.controlled) {
        return this.$color.hex(this.controlled)
      }
    },
    internalValue() {
      return this.mapInput(this.value)
    },
    output() {
      return this.mapOutput(this.internalValue)
    }
  },
  watch: {
    value(val) {
      if (this.id) {
        this.$bus.$emit('knob/'+this.id,val)
      }
    }
  },
  methods: {
    connect(id) {
      this.controlled = id
    },
    assign() {
      if (this.$bus.assign != this.message) {
        this.$bus.assign = this.message;
      } else {
        this.$bus.assign = {}
      }
    },
    mapInput(value) {
      return mapNumber(value, this.min, this.max, 0, 100, this.step)
    },
    mapOutput(value) {
      let output = mapNumber(value, 0, 100, this.min, this.max, this.step);
      return output
    },
  },
}

function mapNumber(value, inputmin=0, inputmax=100, rangemin=0, rangemax=100, step=1) {
  rangemax = parseFloat(rangemax);
  rangemin = parseFloat(rangemin);
  inputmax = parseFloat(inputmax);
  inputmin = parseFloat(inputmin);
  let result = (value - inputmin) * (rangemax - rangemin) / (inputmax - inputmin) + rangemin;
  return Math.round(result / step)  * step;
}
