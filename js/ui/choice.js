export const choice = {
  name:'choice',
  props: {
    value: String,
    options: Object,
    icons: Boolean,
  },
  template:`
    <div class="button-group">
      <span  class="title"><slot></slot></span>
      <button
        v-for="(option, key) in options"
        :class="{active:value==key, inactive:value!=key}" @click="$emit('input',key)" :key="key">
        <span :title="key" v-if="!icons">{{option}}</span>
        <img v-if="icons" :title="key" height="16" :src="'images/icons/'+option+'.svg'">
      </button>
    </div>
  `,
}
