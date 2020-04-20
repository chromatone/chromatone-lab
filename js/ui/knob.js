
export const knob = {
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
    sendColor:String,
  },
  template: `
  <div
    :class="{active:active}"
    @mousedown.stop.prevent="mouseDown"
    @touchstart.stop.prevent="activate"
    @dblclick="reset()"
    class="knob">
    <div class="num">{{output.toFixed(1)}}</div>
    <div class="info">
      <slot></slot>
    </div>
    <div class="value" :style="{height:internalValue+'%', backgroundColor:color}"></div>
    <div
      @touchstart.stop.prevent="assign()"
      @mousedown.stop.prevent="assign()"
      v-if="$bus.assigning && $bus.assign.id != id && ($bus.assign.type=='knob' || controller)"
      :class="{'blink-to':$bus.assign.type=='knob', cancel: controller}"
      class="assigner"></div>
  </div>
  `,
  data() {
    return {
      internalValue: this.mapInput(this.value),
      initialValue: this.mapInput(this.value),
      logValue: 0,
      active: false,
      initialX: undefined,
      initialY: undefined,
      initialDragValue: undefined,
      shiftPressed: false,
      activeTouch:undefined,
      controller:undefined,
    };
  },
  watch: {
    value(newVal) {
      this.internalValue = this.mapInput(newVal)
    }
  },
  computed: {
    output() {
      return this.mapOutput(this.internalValue)
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
    assign() {
      if (this.$bus.assign.type!='knob' && this.controller) {
        this.disconnect();
        return
      }
      if (this.controller) {
        this.$bus.$off('knob/'+this.controller, this.react);
        this.$bus.$emit('connectFrom/'+this.controller);
      }
      this.connect();
    },
    connect() {
      this.controller = this.$bus.assign.id;
      this.$bus.$emit('connectFrom/'+this.controller, this.id);
      this.$bus.$on('knob/'+this.controller, this.react);
      this.$bus.assigning=false;
    },
    disconnect() {
      this.$bus.$off('knob/'+this.controller, this.react);
      this.$bus.$emit('connectFrom/'+this.controller);
      this.controller=undefined;
      this.$bus.assigning=false;
    },
    react(ev) {
      this.internalValue = ev*100
      this.outputValue(this.output)
    },
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
    mouseDown(ev) {
			this.initialX=ev.pageX;
			this.initialY=ev.pageY;
      this.active = true;
      this.initialDragValue = this.internalValue;
			document.onmousemove = this.mouseMove;
			document.onmouseup = this.mouseUp;
		},
		mouseMove(ev) {
			let {pageY} = ev;
			let diff = 2;
      if (this.shiftPressed) { diff=10 }
      this.internalValue = this.initialDragValue + (this.initialY - pageY) / diff;
      if (this.internalValue > 100) this.internalValue = 100;
      if (this.internalValue < 0) this.internalValue = 0;
      if (isNaN(this.internalValue)) this.internalValue = this.initialDragValue;
      this.outputValue(this.output);
		},
		mouseUp(ev){
			document.onmouseup = undefined;
      document.onmousemove = undefined;
      this.active = false;
		},
    reset() {
      this.internalValue=this.initialValue;
      this.outputValue(this.output);
    },
    mapInput(value) {
      return mapNumber(value, this.min, this.max, 0, 100, this.step)
    },
    mapOutput(value) {
      let output = mapNumber(value, 0, 100, this.min, this.max, this.step);
      return output
    },
    activate(ev) {
      this.activeTouch = ev.changedTouches[0].identifier
      this.initialY = ev.changedTouches[0].pageY;
      this.active = true;
      this.initialDragValue = this.internalValue;
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
      let diff = 2;
      if (this.shiftPressed) { diff=10 }
      this.internalValue = this.initialDragValue + (this.initialY - pageY) / diff;
      if (this.internalValue > 100) this.internalValue = 100;
      if (this.internalValue < 0) this.internalValue = 0;
      if (isNaN(this.internalValue)) this.internalValue = this.initialDragValue;
      this.outputValue(this.output);
    },
    deactivate() {
      document.removeEventListener("touchmove", this.dragHandler);
      document.removeEventListener("touchend", this.deactivate);
      this.active = false;
    },
    pressed(e) {
        if (e.key == "Shift") this.shiftPressed = true;
    },
    unpressed(e) {
      if (e.key == "Shift") this.shiftPressed = false;
    }
  },
  created() {
    document.addEventListener("keydown", this.pressed);
    document.addEventListener("keyup", this.unpressd);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.pressed)
    document.removeEventListener('keyup', this.unpressed)
  }
}

function mapNumber(value, inputmin=0, inputmax=100, rangemin=0, rangemax=100, step=1) {
  rangemax = parseFloat(rangemax);
  rangemin = parseFloat(rangemin);
  inputmax = parseFloat(inputmax);
  inputmin = parseFloat(inputmin);
  let result = (value - inputmin) * (rangemax - rangemin) / (inputmax - inputmin) + rangemin;
  return Math.round(result / step)  * step;
}
