export const controlsChannel = {
  title:'Controls channel',
  props:['id','title','group'],
  data() {
    return {

    };
  },
  template: `
  <div class="channel">

    <header>
      <span class="handle">
        &#9776;
        <h3 >{{title.toUpperCase()}}</h3>
      </span>

    </header>

    <section class="module">
      <slot :show="true"></slot>
    </section>

    <footer>
      <toggle v-model="$root.assignMode">ASSIGN</toggle>
    </footer>

  </div>
  `,
  created() {

  },
  computed:{

  },
  watch: {

  },
  methods: {

  },
  beforeDestroy() {

  }
};
