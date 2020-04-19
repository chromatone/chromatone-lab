export const octave = {
  title:'octave',
  name:'octave',
  props: ['id','ch'],
  data() {
    return {
      octave:2,
      notes:['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'],
    }
  },
  template:`
    <section class="row">
      <button  @click="minusOctave()">-</button>
      <span>{{octave}}</span>
      <button  @click="plusOctave()">+</button>
      <trigger
        v-for="(note, key) in notes"
        :outId="id"
        :pitch="key"
        :octave="octave"
        :key="key">
      </trigger>
    </section>
  `,
  methods: {
    plusOctave() {
      if (this.octave<8) {
        this.octave++
      }
    },
    minusOctave() {
      if (this.octave>0) {
        this.octave--
      }
    },
  },
}
