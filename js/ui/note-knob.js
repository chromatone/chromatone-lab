import knobControl from './knob-control.js'


export const noteKnob = {
  props: {
    value:{
      type: Number,
      default:0,
    },
    id: String,
    sendColor:String,
  },
  components: {
    knobControl
  },
  data() {
    return {
      pitch:0,
      output:0,
      intValue: 0,
      initValue: 0,
      active: false,
      initX: undefined,
      initY: undefined,
      initDragValue: undefined,
      activeTouch:undefined,
      controller:undefined,
      diff:10,
      note:'A',
      octave:3,
      prevOctave:3,
      activated:false,
      notes:['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'],
    };
  },
  template: `
  <div
    :class="{active:active}"
    @mousedown.stop.prevent="mouseDown"
    @touchstart.stop.prevent="activate"
    @dblclick="reset()"
    class="knob note-knob"
    :style="{backgroundColor:color}">

    <div class="output">{{note}}{{octave}}</div>

    <div class="value" :style="{height:7.7+intValue*7+'%'}"></div>

    <knob-control
      :id="id"
      v-model="controller"
      @react="react"
      v-show="$bus.assigning && $bus.assign.id != id && ($bus.assign.type=='knob' || controller)"
      ></knob-control>

  </div>
  `,
  computed: {
    color() {
      return this.$noteColor(this.intValue,this.octave)
    },
    bgColor() {
      if (this.sendColor) {
        return this.sendColor;
      }
      if (this.controller) {
        return this.$color.hex(this.controller)
      }
    }
  },
  watch: {
    intValue(out) {
      this.note=this.notes[out];
      this.$emit('input', out)
    },
    octave(oct) {
      this.$emit('octave', this.octave)
    }
  },
  methods: {

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
      this.intValue = this.remainder(value);
      let octave = value > 0 ? Math.floor(value/12) : Math.ceil(value/12);
      if (this.prevOctave+octave !=this.octave) {
        this.prevOctave = this.octave
        this.octave = this.prevOctave+octave
      }
    },
    reset() {
      this.intValue=this.initValue;
    },
    remainder(value) {
      let pitch;
      if (value >= 0) {
        pitch = Math.floor(value)%12;
      } else {
        pitch = 11+Math.floor(value+1)%12
      }
      return pitch
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
      this.intValue = Math.floor(ev*11)
    },
  },
}
