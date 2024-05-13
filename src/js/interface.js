import autosize from 'autosize';

export default class Interface {
  constructor(element) {
    this.element = element;
    this.auth = null;
    this.userData = null;
    this.emoji = ['&#128512', '&#128515', '&#128516', '&#128513', '&#128518', '&#128517', '&#129315', '&#128514',
      '&#128578', '&#128579', '&#128521', '&#128522', '&#128519', '&#129392', '&#128525', '&#129321', '&#128536',
      '&#128538', '&#128523', '&#128539', '&#128540', '&#129322', '&#128541', '&#129300', '&#129296', '&#129303',
      '&#128527', '&#128530', '&#128580', '&#128556'];
    this.init();
  }

  init() {
    const user = localStorage.getItem('user');
    this.messenger();
    if (user != null) {
      this.userData = JSON.parse(user);
      this.element.style.visibility = 'visible';
    } else {
      this.modal();
    }
  }

  messenger() {
    const contacts = document.createElement('div');
    contacts.classList.add('subscriptions');
    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    const chat = document.createElement('div');
    chat.classList.add('chat');
    const chatControls = document.createElement('div');
    chatControls.classList.add('chat-controls');
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('chat-inpt-container');

    const chatInput = document.createElement('textarea');
    chatInput.classList.add('chat-inpt');
    const emojiBtn = document.createElement('div');
    emojiBtn.classList.add('emoji-btn');
    emojiBtn.innerHTML = '&#128578';

    inputContainer.appendChild(emojiBtn);
    inputContainer.appendChild(chatInput);

    const chatEmjContainer = document.createElement('div');
    chatEmjContainer.classList.add('chat-emoji-box');

    this.emoji.forEach((el) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('emoji-wrapper');
      wrapper.innerHTML = el;
      chatEmjContainer.appendChild(wrapper);
    });
    chatEmjContainer.classList.add('disabled');
    const chatButton = document.createElement('button');
    chatButton.classList.add('chat-send');
    chatButton.innerHTML = '\u{27A4}';
    autosize(chatInput);
    chatContainer.appendChild(chat);
    chatControls.appendChild(inputContainer);
    chatControls.appendChild(chatButton);
    chatContainer.appendChild(chatControls);
    chatContainer.appendChild(chatEmjContainer);
    this.element.appendChild(contacts);
    this.element.appendChild(chatContainer);
    this.element.style.visibility = 'hidden';
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji-btn')) {
        chatEmjContainer.classList.toggle('disabled');
      }
      if (e.target.classList.contains('emoji-wrapper')) {
        chatInput.value += e.target.innerHTML;
      }
      if (e.target.classList.contains('chat-inpt')) {
        chatEmjContainer.classList.add('disabled');
      }
      if (e.target.classList.contains('chat-send')) {
        chatEmjContainer.classList.add('disabled');
      }
    });
  }

  modal() {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal');
    const modal = document.createElement('div');
    modal.classList.add('modal__box');
    const title = document.createElement('p');
    title.classList.add('modal_title');
    title.textContent = 'Login or Register';
    const btnOk = document.createElement('button');
    const btnEsc = document.createElement('button');
    btnOk.classList.add('modal_button');
    btnEsc.classList.add('modal_button');
    btnEsc.textContent = 'Login';
    btnOk.textContent = 'Register';
    btnEsc.id = 'modal_esc';
    btnOk.id = 'modal_Ok';
    const btnHolder = document.createElement('div');
    btnHolder.classList.add('modal_button__holder');
    modal.appendChild(title);
    btnHolder.appendChild(btnEsc);
    btnHolder.appendChild(btnOk);

    const nicknameTitle = document.createElement('p');
    nicknameTitle.textContent = 'Nick-name';
    const nicknameBox = document.createElement('input');
    nicknameBox.classList.add('modal_inpt-draft');
    nicknameBox.dataset.id = 'nickname';

    const passwordTitle = document.createElement('p');
    passwordTitle.textContent = 'Password';
    const passwordBox = document.createElement('input');
    passwordBox.type = 'password';
    passwordBox.classList.add('modal_inpt-details');
    passwordBox.dataset.id = 'descr';
    modal.addEventListener('click', (e) => {
      if (e.target.textContent === 'Login' || e.target.textContent === 'Register') {
        if (e.target.textContent === 'Login') {
          this.auth = 'Login';
        }
        if (e.target.textContent === 'Register') {
          this.auth = 'Register';
        }

        modal.insertBefore(nicknameTitle, btnHolder);
        modal.insertBefore(nicknameBox, btnHolder);
        modal.insertBefore(passwordTitle, btnHolder);
        modal.insertBefore(passwordBox, btnHolder);
        if (e.target.textContent === 'Register') {
          const confirmationTitle = document.createElement('p');
          confirmationTitle.textContent = 'Confirm password';
          const confirmation = document.createElement('input');
          confirmation.type = 'password';
          confirmation.classList.add('modal_inpt-details');
          confirmation.dataset.id = 'conf';
          modal.insertBefore(confirmationTitle, btnHolder);
          modal.insertBefore(confirmation, btnHolder);
        }

        btnOk.disabled = true;
        btnEsc.textContent = 'Back';
        setTimeout(() => { btnOk.textContent = 'Confirm'; }, 100);
      } else if (e.target.textContent === 'Back') {
        Array.from(modal.children).forEach((el) => {
          if (el.tagName === 'INPUT') {
            el.value = '';
          }
          if (!(el.classList.contains('modal_title') || el.classList.contains('modal_button__holder'))) {
            modal.removeChild(el);
          }
        });

        btnEsc.textContent = 'Login';
        btnOk.textContent = 'Register';
        btnOk.disabled = false;
        const toolTips = Array.from(document.body.querySelectorAll('.tooltip'));
        if (toolTips.length > 0) {
          toolTips.forEach((toolTip) => toolTip.remove());
        }
      }
    });

    modal.addEventListener('input', (e) => {
      const toolTip = document.body.querySelector(`[data-id=${e.target.dataset.id}].tooltip`);
      //  const nicknameBox = document.body.querySelector('.modal_inpt-draft');
      //  const passwordBox = document.body.querySelector('.modal_inpt-details');
      if (toolTip != null) {
        toolTip.remove();
      }
      if (nicknameBox != null && passwordBox != null) {
        btnOk.disabled = true;
        if (nicknameBox.value.length > 3 && passwordBox.value.length > 3) {
          btnOk.disabled = false;
        }
      }
    });

    modal.addEventListener('change', (e) => {
      if (e.target.value.length <= 3) {
        const text = 'Input at least 4 chars!';
        console.log(e.target);
        this.toolTip(e.target, text);
      } else if ((e.target.dataset.id !== 'nickname') && (passwordBox.value.length > 3)) {
        const confirmation = modal.querySelector('[data-id=conf]');
        const toolTips = Array.from(document.body.querySelectorAll('.tooltip'));
        if (confirmation != null
                        && ((confirmation.value).trim() !== (passwordBox.value).trim())
                        && (confirmation.value.length > 3)) {
          const text = 'Passwords do not match';
          if (toolTips.length > 0) {
            toolTips.forEach((toolTip) => toolTip.remove());
          }
          this.toolTip(e.target, text);
        }
      }
    });
    window.addEventListener('resize', () => {
      if (document.body.querySelector('.tooltip') != null) {
        Array.from(document.body.querySelectorAll('.tooltip')).forEach((el) => {
          const parent = modal.querySelector(`[data-id=${el.dataset.id}]`);
          const { right, top } = parent.getBoundingClientRect();
          el.style.left = `${right + 5}px`;
          el.style.top = `${top + parent.offsetHeight / 2 - el.offsetHeight / 2}px`;
        });
      }
    });

    modal.appendChild(btnHolder);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
  }

  toolTip(el, text) {
    const { right, top } = el.getBoundingClientRect();

    const toolTip = document.createElement('div');
    toolTip.style.zIndex = 1010;
    toolTip.classList.add('tooltip');
    if (el.dataset.id) {
      toolTip.dataset.id = el.dataset.id;
    }
    document.body.appendChild(toolTip);

    toolTip.innerText = String(text);

    toolTip.style.position = 'absolute';
    toolTip.style.zIndex = 1010;
    toolTip.style.left = `${right + 5}px`;
    toolTip.style.top = `${top + el.offsetHeight / 2 - toolTip.offsetHeight / 2}px`;
  }

  autorization(res) {
    if (this.userData === null) {
      const toolTip = document.querySelector('.tooltip');
      if (toolTip === null) {
        const nickName = document.querySelector('[data-id="nickname"]');
        const password = document.querySelector('[data-id="descr"]');
        console.log(this.auth);
        if (this.auth === 'Login') {
          if ((nickName != null) && (password != null)) {
            if (res.status === 'exists') {
              this.userData = { name: nickName.value, password: password.value };
              const user = JSON.stringify(this.userData);
              localStorage.setItem('user', user);
              return true;
            }
            if (res.status === 'Nick-name not found') {
              this.toolTip(nickName, 'Incorrect nick-name');
            } else if (res.status === 'Password not found') {
              this.toolTip(password, 'Incorrect password');
            }
            return false;
          }
        } else if (this.auth === 'Register') {
          if (res.status === 'exists') {
            this.toolTip(nickName, 'This nick-name is already in use');
            return false;
          }
          if (res.status === 'Nick-name not found') {
            this.userData = { name: nickName.value, password: password.value };
            const user = JSON.stringify(this.userData);
            localStorage.setItem('user', user);
            this.userData = JSON.parse(user);
            return true;
          }
        }
      }
      return false;
    }
    return true;
  }

  messagesHandler(messages) {
    const chat = this.element.querySelector('.chat');
    if (chat != null) {
      messages.forEach((msg) => {
        const msgBox = document.createElement('div');
        msgBox.classList.add('chat-message-box');
        const msgInfo = document.createElement('span');
        msgInfo.classList.add('chat-message-info');

        const msgText = document.createElement('div');
        msgText.classList.add('chat-message-text');
        if (this.userData != null && msg.user === this.userData.name) {
          msgBox.classList.add('user-msg');
          msgText.classList.add('user-msg');
          msgInfo.style.color = '#f36969';
          msgText.style.backgroundColor = '#b0e6b0';
          msgInfo.innerText = `You, ${msg.dt}`;
        } else if (msg.user === 'chatBot') {
          msgText.style.backgroundColor = '#d5c9ed';
          msgInfo.innerText = '<<< Chat bot >>>';
        } else {
          msgText.style.backgroundColor = '#d5c9ed';
          msgInfo.innerText = `${msg.user}, ${msg.dt}`;
        }
        msgText.textContent = msg.text;
        msgText.style.overflowWrap = 'break-word';
        msgBox.appendChild(msgInfo);
        msgBox.appendChild(msgText);
        chat.appendChild(msgBox);
      });
    }
  }

  usersHandler(users) {
    const subscriptions = document.querySelector('.subscriptions');
    if (subscriptions != null) {
      users.forEach((el) => {
        const username = document.createElement('span');
        username.classList.add('userbox-text');
        if (el !== this.userData.name) {
          username.textContent = el;
        } else if (el === this.userData.name) {
          username.textContent = 'You';
          username.style.color = '#f36969';
        }

        const userBox = document.createElement('div');
        userBox.classList.add('userbox');
        const round = document.createElement('div');
        round.classList.add('userbox-decor');
        userBox.appendChild(round);
        userBox.appendChild(username);
        subscriptions.appendChild(userBox);
      });
    }
  }
}
