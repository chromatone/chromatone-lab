Vue.prototype.$bus = new Vue ({
  data: {
    channels:{},
  }
})

Vue.prototype.$color = new ColorHash({
  saturation:[0.25, 0.35, 0.5],
  lightness: [0.65, 0.75, 0.85]
});

Vue.prototype.$resume = () => {
  if (Tone.context.state == "suspended") {
    Tone.context.resume();
  }
}
