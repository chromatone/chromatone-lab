import knob from './knob.js'

export default {
  title:'Channel',
  props:['id','title','group'],
  components: {
    knob
  },
  data() {
    return {
      show:true,
      volume:1,
      channel:{},
      sender: {},
      receiver: {},
      sends:{},
      sendEnabled:false,
      receiveLevel:1,
      sendLevel:1,
    };
  },
  template: `
  <div class="channel">

    <header>
      <span class="handle">
        &#9776;
        <h3  @click="show=!show">{{title.toUpperCase()}}</h3>
      </span>
      <knob v-if="group=='effects'" v-model="receiveLevel">RECEIVE</knob>
      <knob v-model="volume">VOL</knob>
      <knob v-model="channel.pan.value" :min="-1" >PAN</knob>
      <button
        v-if="!sendEnabled"
        @click="sendEnabled=true">
        SEND
      </button>
      <div class="spacer"></div>
      <div class="close" @click="$emit('close')">
        &times;
      </div>
    </header>

    <section class="module">
      <slot :show="show" :ch="{channel,sender,receiver}"></slot>
    </section>

    <footer v-if="sendEnabled">

      <knob v-model="sendLevel">SEND</knob>

      TO

      <knob
        v-for="(send, key) in sends" :key="key"
        :color="$color.hex(key)"
        v-model="send._gainNode.gain.value" :step="0.01" :min="0" :max="1">{{send.title}}</knob>

      <button
        v-for="effect in $root.ch.receivers"
        :style="{backgroundColor:$color.hex(effect.id)}"
        :key="effect.id"
        v-if="effect.id!=id && !sends[effect.id]"
        @click="send(effect.id)">
        {{effect.title}}
      </button>

    </footer>

  </div>
  `,
  created() {
    this.channel = this.createChannel(this.group).toDestination();
    this.sender = this.createChannel('senders');
    if (this.group == 'effects') {
      this.receiver = this.createChannel('receivers');
      this.receiver.receive(this.id);
    }
    this.$root.$on('unreceive', this.delSend)
  },
  watch: {
    receiveLevel(val) {
      this.setVolume('receiver', val)
    },
    volume(val) {
      this.setVolume('channel', val)
    },
    sendLevel(val) {
      this.setVolume('sender', val)
    },
  },
  methods: {
    delSend(id) {
      this.$delete(this.sends,id)
    },
    setVolume(channel, val) {
      this[channel].volume.value = Tone.gainToDb(val)
    },
    createChannel(group) {
      let channel = new Tone.Channel();
      channel.id = this.id;
      channel.group = this.group;
      channel.title = this.title;
      this.$set(
        this.$root.ch[group],
        this.id,
        channel
      )
      return channel
    },
    send(id) {
      let send = this.sender.send(id);
      send.title = this.$root.ch.receivers[id].title;
      this.$set(
        this.sends,
        id,
        send
      )
    }
  },
  beforeDestroy() {
    this.channel.dispose()
    this.sender.dispose()
    this.$delete(this.$root.ch[this.group],this.id)
    this.$delete(this.$root.ch.senders,this.id)
    if (this.receiver.dispose) {
      this.receiver.dispose()
      this.$delete(this.$root.ch.receivers,this.id)
      this.$root.$emit('unreceive',this.id)
    }
  }
};
