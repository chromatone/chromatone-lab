export const sourcesChannel = {
  title:'Sources Channel',
  props:['id','title','group'],
  data() {
    return {
      show:true,
      volume:1,
      channel:{},
      sender: {},
      receiver: {},
      sends:{},
      sendEnabled:false,
      addSend:false,
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
      <knob :id="id" v-if="group=='effects'" v-model="receiveLevel" :volume="receiver.volume">RECEIVE</knob>
      <knob :id="id" v-model="volume" :volume="channel.volume">VOL</knob>
      <knob :id="id" v-model="channel.pan.value" :min="-1" >PAN</knob>


      <div v-if="Object.entries(sends).length>0" class="button-group">
        <span class="title" >SENDS</span>
        <knob :id="id" v-model="sendLevel" :volume= "sender.volume">ALL</knob>
        <knob
          v-for="(send, key) in sends" :key="key"
          :sendColor="$color.hex(key)"
          v-model="send._gainNode.gain.value" :step="0.01" :min="0" :max="1">{{send.title}}</knob>
      </div>
      <toggle name="sends"
        v-model="addSend">
      </toggle>
      <div class="button-group" v-if="addSend && Object.entries(receivers).length>0">
        <span class="title">Add</span>
        <button
          v-for="effect in receivers"
          :style="{backgroundColor:$color.hex(effect.id)}"
          :key="effect.id"
          v-if="effect.id!=id && !sends[effect.id]"
          @click="send(effect.id)">
          {{effect.title}}
        </button>
      </div>
      <div class="spacer"></div>
      <div class="close" @click="$emit('close')">
        &times;
      </div>
    </header>

    <section class="module">
      <slot :show="show" :ch="{channel,sender,receiver}"></slot>
    </section>

    <footer v-if="sendEnabled && receivers.length>0">

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
    this.$root.$on('unsend', this.delSend)
  },
  computed:{
    receivers() {
      let receivers = []
      for (let i in this.$ch.receivers) {
        let receiver = this.$ch.receivers[i]
        if (receiver.id != this.id && !this.sends[receiver.id]) {
          receivers.push(receiver)
        }
      }
      return receivers
    }
  },
  methods: {
    delSend(id) {
      this.$delete(this.sends,id)
    },
    createChannel(group) {
      let channel = new Tone.Channel();
      channel.id = this.id;
      channel.group = this.group;
      channel.title = this.title;
      this.$set(
        this.$ch[group],
        this.id,
        channel
      )
      return channel
    },
    send(id) {
      let send = this.sender.send(id);
      send.title = this.$ch.receivers[id].title;
      this.$set(this.sends, id, send)
    }
  },
  beforeDestroy() {
    this.channel.dispose()
    this.sender.dispose()
    this.$delete(this.$ch[this.group],this.id)
    this.$delete(this.$ch.senders,this.id)
    if (this.receiver.dispose) {
      this.receiver.dispose()
      this.$delete(this.$ch.receivers,this.id)
      this.$root.$emit('unsend',this.id)
    }
  }
};
