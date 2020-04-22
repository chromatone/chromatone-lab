import assigner from './knob-assigner.js'


export const knob = {
  props: {
    value:{
      type: Number,
      default:1,
    },
    min:{
      type: Number,
      default:0,
    },
    max:{
      type: Number,
      default:1,
    },
    step:{
      type: Number,
      default:0.01,
    },
    accuracy: {
      type:Number,
      default:1,
    },
    id: String,
    signal:Object,
    volume:Object,
    sendColor:String,
  },
  components: {
    assigner
  },
  data() {
    return {
      intValue: this.mapInput(this.value),
      initValue: this.mapInput(this.value),
      active: false,
      initX: undefined,
      initY: undefined,
      initDragValue: undefined,
      activeTouch:undefined,
      controller:undefined,
      diff:2,
    };
  },
  template: `
  <div
    :class="{active:active}"
    @mousedown.stop.prevent="mouseDown"
    @touchstart.stop.prevent="activate"
    @dblclick="reset()"
    class="knob">
    <div class="num">{{output.toFixed(accuracy)}}</div>
    <div class="info">
      <slot></slot>
    </div>
    <div class="value" :style="{height:intValue+'%', backgroundColor:color}"></div>
    <assigner
      :id="id"
      v-model="controller"
      @react="react"
      v-show="$bus.assigning && $bus.assign.id != id && ($bus.assign.type=='knob' || controller)"
      ></assigner>
  </div>
  `,
  watch: {
    value(newVal) {
      this.intValue = this.mapInput(newVal)
    },
    '$bus.shiftPressed'(val) {
      if (val) {
        this.diff = 10
      } else {
        this.diff = 2
      }
    },
  },
  computed: {
    output() {
      return this.mapOutput(this.intValue)
    },
    color() {
      if (this.sendColor) {
        return this.sendColor;
      }
      if (this.controller) {
        return this.$color.hex(this.controller)
      }
      return '#eee'
    }
  },
  methods: {

    // MAIN OUTPUT FUNCTION

    outputValue(val) {
      if (this.signal) {
        this.signal.targetRampTo(val,1);
        return
      };
      if (this.volume) {
        this.volume.targetRampTo(Tone.gainToDb(val),1);
        return
      };
      this.$emit('input', val)
    },

    // MOUSE EVENT HANDLERS

    mouseDown(ev) {
			this.initX=ev.pageX;
			this.initY=ev.pageY;
      this.active = true;
      this.initDragValue = this.intValue;
			document.onmousemove = this.mouseMove;
			document.onmouseup = this.mouseUp;
		},
		mouseMove(ev) {
			let {pageY} = ev;
			this.change(pageY)
		},
    mouseUp(ev){
      document.onmouseup = undefined;
      document.onmousemove = undefined;
      this.active = false;
    },

    // VALUE CONVERSION

    change(pageY) {
      let value = this.initDragValue + (this.initY - pageY) / this.diff;
      if (value > 100) value = 100;
      if (value < 0) value = 0;
      if (isNaN(value)) value = this.initDragValue;
      this.intValue = value;
      this.outputValue(this.output);
    },
    reset() {
      this.intValue=this.initValue;
      this.outputValue(this.output);
    },
    mapInput(value) {
      return mapNumber(value, this.min, this.max, 0, 100, this.step)
    },
    mapOutput(value) {
      return mapNumber(value, 0, 100, this.min, this.max, this.step)
    },

    // TOUCH EVENT HANDLERS

    activate(ev) {
      this.activeTouch = ev.changedTouches[0].identifier
      this.initY = ev.changedTouches[0].pageY;
      this.active = true;
      this.initDragValue = this.intValue;
      document.addEventListener("touchend", this.deactivate);
      document.addEventListener("touchmove", this.dragHandler);
    },
    dragHandler(ev) {
      let theTouch;
      for (let touch of ev.changedTouches) {
        if (touch.identifier==this.activeTouch) {
          theTouch=touch
        }
      }
      let {pageY} = theTouch;
      this.change(pageY)
    },
    deactivate() {
      document.removeEventListener("touchmove", this.dragHandler);
      document.removeEventListener("touchend", this.deactivate);
      this.active = false;
    },

    // INTERCONNECTING WITH ASSIGN

    react(ev) {
      this.intValue = ev*100
      this.outputValue(this.output)
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
