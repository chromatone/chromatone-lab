export const choice = {
  name:'choice',
  props: ['value','options'],
  template:`
    <div class="button-group">
      <span  class="title"><slot></slot></span>
      <button
        v-for="(option, key) in options"
        :class="{active:value==key}" @click="$emit('input',key)" :key="key">
        {{option}}
      </button>
    </div>
  `,

}
