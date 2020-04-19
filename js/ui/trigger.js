export const trigger = {
  name:'trigger',
  props: {
    inId: String,
    outId: String,
    activated: Boolean,
  },
  data() {
    return {
      controller:undefined,
      controlled:undefined,
      active:false,
      message: {
        id: this.outId,
        velocity:1,
        type:'trigger',
        action:'attack',
      }
    }
  },
  template:`
    <button class="trigger"
      :class="{'active': active || activated}"
      :style="{backgroundColor:outerColor}"
      @touchstart.stop.prevent="activate()"
      @touchmove.stop.prevent="enter()"
      @mousedown.stop.prevent="activate()"
      @mouseover="enter()"
      @mouseleave="stop()">
      <slot><div :style="{backgroundColor: innerColor}" class="dot"></div></slot>
      <div
         @touchstart.stop.prevent="startAssign()"
         @mousedown.stop.prevent="startAssign()"
         v-if="$bus.assigning && (inId || outId)"
         :style="{backgroundColor:outerColor}"
         :class="{'blink-to': $bus.assign.id && $bus.assign.type == 'trigger','blink-from':$bus.assign==message}"
         class="assigner">
       </div>
    </button>
  `,
  created() {
    this.$bus.$on('connectFrom/'+this.outId,this.connect)
  },
  methods: {
    enter() {
      console.log('enter')
      if(this.$bus.active && !this.active) {
        this.play()
      }
    },
    connect(id) {
      this.controlled = id
    },
    play() {
      this.active=true;
      this.$emit('attack')
      if (this.outId) {
        this.message.action = 'attack'
        this.$bus.$emit(this.outId,this.message);
      }
    },
    stop() {
      this.active=false;
      this.$emit('release')
      if (this.outId) {
        this.message.action = 'release'
        this.$bus.$emit(this.outId,this.message);
      }
    },
    activate() {
      this.$bus.active = true;
      document.onmouseup = this.deactivate;
      document.addEventListener("touchend", this.deactivate);
      document.addEventListener("touchcancel", this.deactivate);
      this.play();
    },
    deactivate() {
      this.$bus.active = false;
      this.stop();
      document.onmouseup = undefined;
      document.removeEventListener("touchcancel", this.deactivate);
      document.removeEventListener("touchend", this.deactivate);
    },
    startAssign() {
      if (this.inId) {
        this.assignTo(); return
      }
      if (this.outId) {
        this.assignFrom(); return }
    },
    assignTo() {
      if (this.$bus.assign.type=='trigger') {
        this.$bus.$off(this.controller, this.react);
        this.$bus.$emit('connectFrom/'+this.controller);
        this.controller = this.$bus.assign.id;
        this.$bus.$emit('connectFrom/'+this.controller, this.inId);
        this.$bus.$on(this.controller, this.react);
        this.$bus.assigning=false;
      }
    },
    assignFrom() {
      if (this.$bus.assign != this.message) {
        this.$bus.assign = this.message;
      } else {
        this.$bus.assign = {}
      }
    },
    react(val) {
      this.$emit(val.action, val)
    }
  },
  computed: {
    outerColor() {
      if (this.outId) {
        return this.$color.hex(this.outId)
      }
      if (this.controller) {
        return this.$color.hex(this.controller)
      }
      return '#fefefe'
    },
    innerColor() {
      if (this.inId) {
        return this.$color.hex(this.inId)
      }
      if (this.controlled) {
        return this.$color.hex(this.controlled)
      }
      return '#fefefe'
    }
  },
  beforeDestroy() {
    this.$bus.$off(this.controller, this.react)
  },
}
