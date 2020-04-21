Vue.prototype.$noteFreq =  (pitch=0, octave = 3) => {
    return Number(440 * Math.pow(2, octave - 4 + pitch / 12));
}

Vue.prototype.$noteColor = (pitch, octave = 3) => {
  return `hsla(${pitch*30},100%,${(octave+5)*8}%,1)`
}

Vue.prototype.$color = new ColorHash({
  saturation:[0.25, 0.35, 0.5],
  lightness: [0.65, 0.75, 0.85]
});

Vue.prototype.$resume = () => {
  if (Tone.context.state == "suspended") {
    Tone.context.resume();
  }
  if (Tone.Transport.state != "started") {
    Tone.Transport.start();
  }
}

Vue.prototype.$hash = () => {
  return String(Math.floor( Math.random() * Date.now()));
}
