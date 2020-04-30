Vue.prototype.$bus = new Vue({  // CONTROL BUS
  el:"#bus",
  data: {
    from:{},
    to:{},
    assign:{},
    assigning:false,
    active:false,
    shiftPressed:false,
  },
  watch: {
    assigning(val) {
      if (!val) {
        this.assign = {}
      }
    }
  },
  methods: {
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
  },
});
