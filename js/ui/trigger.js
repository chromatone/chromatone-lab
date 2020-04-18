export const trigger = {
  name:'trigger',
  props: {
    assignable: {
      type: Boolean,
      default: false,
    },
    activated: Boolean,
  },
  data() {
    return {
      controls:{},
      active:false,
      id:this.$hash(),
    }
  },
  template:`
    <button class="trigger" :class="{'active': active || activated,'blink-to':assignable && $root.assign.id && $root.assign.type == 'trigger'}"
      @touchstart.stop.prevent="activate()"
      @mousedown.stop.prevent="activate()">
      <slot><div :style="{backgroundColor:$color.hex(id)}" class="dot"></div></slot>
    </button>
  `,
  watch: {
    '$root.control'(val) {
      console.log(val)
    }
  },
  computed: {

  },
  methods: {
    play() {
      this.active=true;
      this.$emit('attack')
    },
    stop() {
      this.active=false;
      this.$emit('release')
    },
    activate() {
      if (this.assignable && this.$root.assignMode && this.$root.assign.id) {
        this.assign(); return
      }
      document.onmouseup = this.deactivate;
      document.addEventListener("touchend", this.deactivate);
      document.addEventListener("touchcancel", this.deactivate);
      this.play();
    },
    deactivate() {
      this.stop();
      document.onmouseup = undefined;
      document.removeEventListener("touchcancel", this.deactivate);
      document.removeEventListener("touchend", this.deactivate);
    },
    assign() {
      let {assign, control} = this.$root
      if (assign.type=='trigger') {
        this.$set(control.from, assign.id, this.id);
        this.$set(control.to, this.id, assign);
        this.$root.$on(assign.id, this.press);
        this.$root.assignMode=false;
      }
    },
  },
}
