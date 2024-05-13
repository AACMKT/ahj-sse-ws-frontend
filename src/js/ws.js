export default class WS {
  constructor(interface_, url) {
    this.interface_ = interface_;
    this.element = this.interface_.element;
    this.chat = this.element.querySelector('.chat');
    this.chatMessage = this.element.querySelector('.chat-inpt');
    this.chatSend = this.element.querySelector('.chat-send');
    this.subscriptions = document.querySelector('.subscriptions');
    this.ws = new WebSocket(`wss://${url}`);
    this.init();
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('ru', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Moscow',
    }).format(new Date(date));
  }

  init() {
    this.chatSend.addEventListener('click', () => {
      let message = false;
      const authData = localStorage.getItem('user');
      if (authData != null) {
        const date = WS.formatDate(Date.now());
        const userMsg = this.chatMessage.value;
        message = JSON.stringify({ user: JSON.parse(authData).name, dt: date, text: userMsg });
      } else {
        message = this.chatMessage.value;
      }

      if (!message) return;
      if ((this.chatMessage.value.trim()).length > 0) {
        this.ws.send(message);
      }

      this.chatMessage.value = '';
    });

    this.ws.addEventListener('open', () => {
      const authData = localStorage.getItem('user');
      if (authData != null) {
        this.ws.send(JSON.stringify({ auth: { name: JSON.parse(localStorage.getItem('user')).name } }));
      } else {
        console.log('here');
        this.ws.send(JSON.stringify({ conn: 'authentication' }));
      }
      console.log('ws open');
    });

    this.ws.addEventListener('close', (e) => {
      console.log(e);
      console.log('ws close');
    });

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      const { chat: messages } = data;
      const { activeUsers: users } = data;
      if (users !== undefined && users !== null) {
        this.subscriptions.innerHTML = '';
        if (this.interface_.userData != null) {
          this.interface_.usersHandler(users);
        }
      }
      if (this.chat !== null && messages !== undefined) {
        this.interface_.messagesHandler(messages);

        this.chat.scrollTop = this.chat.scrollHeight;
      }

      console.log('ws message');
    });
  }

  send(data) {
    this.ws.send(data);
  }

  close() {
    this.ws.close();
  }
}
