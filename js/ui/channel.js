import sqnob from './sqnob.js'

export default {
  title:'Channel',
  props:['id','title','group'],
  components: {
    sqnob
  },
  data() {
    return {
      show:true,
      volume:1,
      channel:new Tone.Channel(),
      sender: new Tone.Channel(),
      receiver: new Tone.Channel(),
      sends:{},
      sendVolume:1,
    };
  },
  template: `
  <div class="channel">

    <header>
      <span class="handle">
        &#9776;
        <h3  @click="show=!show">{{title.toUpperCase()}}</h3>
      </span>
      <sqnob v-model="volume" unit="" param="DRY" :step="0.01" :min="0" :max="1"></sqnob>
      <sqnob v-model="channel.pan.value" unit="" param="PAN" :step="0.01" :min="-1" :max="1"></sqnob>
      <div class="spacer"></div>
      <sqnob v-model="sendVolume" unit="" param="SEND" :step="0.01" :min="0" :max="1"></sqnob>
      <sqnob v-model="sender.pan.value" unit="" param="PAN" :step="0.01" :min="-1" :max="1"></sqnob>
      <div class="close" @click="$emit('close')">
        &times;
      </div>
    </header>

    <div>
      <slot :show="show" :ch="{channel,sender,receiver}"></slot>
    </div>
    <footer>

      <sqnob
        v-for="(send, key) in sends" :key="key"
        v-model="send._gainNode.gain.value" :param="key" :step="0.01" :min="0" :max="1"></sqnob>

      <button
        v-for="effect in $root.ch.receivers"
        :key="effect.id"
        v-if="effect.id!=id && !sends[effect.id]"
        @click="send(effect.id)">
        {{effect.id}}
      </button>

    </footer>

  </div>
  `,
  created() {
    this.channel = this.createChannel(this.group).toDestination();
    this.sender = this.createChannel('senders');
    this.receiver = this.createChannel('receivers');
    this.receiver.receive(this.id);
  },
  watch: {
    volume(val) {
      this.channel.volume.value = Tone.gainToDb(this.volume)
    },
    sendVolume(val) {
      this.sender.volume.value = Tone.gainToDb(this.volume)
    },
  },
  computed: {

  },
  methods: {
    createChannel(group) {
      let channel = new Tone.Channel();
      channel.id = this.id;
      channel.group = this.group;
      this.$set(
        this.$root.ch[group],
        this.id,
        channel
      )
      return channel
    },
    send(id) {
      let send = this.sender.send(id)
      this.$set(
        this.sends,
        id,
        send
      )
    }
  },
  beforeDestroy() {
    this.channel.dispose()
    this.$delete(this.$root.ch[this.group],this.id)
    this.$delete(this.$root.ch.senders,this.id)
  }
};
