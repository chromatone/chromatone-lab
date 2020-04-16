export const controlsChannel = {
  title:'Controls channel',
  props:['id','title','group'],
  data() {
    return {
      show:true,
    };
  },
  template: `
  <div class="channel">

    <header>
      <span class="handle">
        &#9776;
        <h3  @click="show=!show">{{title.toUpperCase()}}</h3>
      </span>  
        <div class="spacer"></div>
    </header>

    <section class="module">
      <slot :show="show" ></slot>
    </section>

  </div>
  `,
  methods: {

  },
  beforeDestroy() {

  }
};
