import Interface from './interface';
import SubsctiptionApi from './api';
import WS from './ws';

const container = document.querySelector('.container');
const interface_ = new Interface(container);
// let host = 'localhost:7200/' || 'ahj-sse-ws-backend-yz4j.onrender.com';
// let host = 'ahj-sse-ws-backend-1.onrender.com';
const host = 'ahj-sse-ws-backend-1.onrender.com';
const authApi = new SubsctiptionApi(`https://${host}`);
const ws = new WS(interface_, host);

document.addEventListener('click', async (e) => {
  if ((e.target.id === 'modal_Ok') && (e.target.textContent === 'Confirm')) {
    const modal = document.body.querySelector('.modal');
    if (modal != null) {
      const nickName = document.querySelector('[data-id="nickname"]');
      const password = document.querySelector('[data-id="descr"]');
      const user = { name: (nickName.value).trim(), password: (password.value).trim() };

      const res = await authApi.check(user);
      const auth = interface_.autorization(res);
      console.log(res, auth);
      if (auth) {
        if (interface_.auth === 'Register') {
          authApi.add(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        modal.remove();
        container.style.visibility = 'visible';
      }
      const authData = localStorage.getItem('user');
      if (authData != null) {
        console.log('Here', authData);
        ws.send(JSON.stringify({ auth: { name: JSON.parse(authData).name } }));
      }
    }
  }
});

// window.api = new SubsctiptionApi('http://localhost:7200/');
