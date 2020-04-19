Vue.prototype.$bus = new Vue({  // CONTROL BUS
  el:"#bus",
  data: {
    from:{},
    to:{},
    assign:{},
    assigning:false,
    active:false,
  },
  watch: {
    assigning(val) {
      if (!val) {
        this.assign = {}
      }
    }
  },
});

Vue.prototype.$ch = new Vue({  // AUDIO BUS
  data: {
    sources:{},
    effects:{},
    senders:{},
    receivers:{},
  }
});


Vue.prototype.$color = new ColorHash({
  saturation:[0.25, 0.35, 0.5],
  lightness: [0.65, 0.75, 0.85]
});

Vue.prototype.$resume = () => {
  if (Tone.context.state == "suspended") {
    Tone.context.resume();
  }
}

Vue.prototype.$hash = () => {
  return String(Math.floor( Math.random() * Date.now()));
}
