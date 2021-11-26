const socket = io("http://localhost:3000");

let room_id = ''

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');
  const avatar = urlParams.get('avatar');

  document.querySelector('.user_logged').innerHTML += `
    <img
      class="avatar_user_logged"
      src="${avatar}"
    />
    <strong id="user_logged">${name}</strong>
  `


  socket.emit('start', {
    name,
    email,
    avatar
  });

  socket.on('new_user', user => {
    const userAlreadyExists = document.querySelector(`#user_${user._id}`);
    if (!userAlreadyExists) {
      addUser(user);
    }
  })


  socket.emit('load_users', users => {

    users.forEach(user => {
      if (user.email !== email) {
        addUser(user);
      }
    })
  })

  socket.on('new_message', data => {
    if (data.message.room_id === room_id) {
      addMessage(data)
    }
  })

  socket.on('notification', data => {
    if (data.room_id !== room_id) {
      document.querySelector(`#user_${data.from._id}`).insertAdjacentHTML('afterbegin', `
        <div class='notification'></div>
      `)
    }
  })
}

function addMessage(data) {
  document.querySelector('#message_user').innerHTML += `
    <span class="user_name user_name_date">
      <img
        class="img_user"
        src="${data.user_send.avatar}"
      />
      <strong>${data.user_send.name} &nbsp;</strong>
      <span>${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm')}</span>
    </span>
    <div class="messages">
      <span class="chat_message"> ${data.message.text}</span>
    </div>
  `
}


function addUser(user) {
  document.querySelector('#users_list').innerHTML += `
    <li
      class="user_name_list"
      id="user_${user._id}"
      idUser="${user._id}"
    >
    <img
      class="nav_avatar"
      src="${user.avatar}"
    />
     ${user.name}
    </li>
    `
}

document.querySelector('#users_list').addEventListener('click', e => {
  document.querySelector('#user_message').classList.remove('hidden');

  document.querySelector('#message_user').innerHTML = '';

  document.querySelectorAll('li.user_name_list').forEach(item => item.classList.remove('user_in_focus'));

  if (e.target && e.target.matches('li.user_name_list')) {
    const user_id = e.target.getAttribute('idUser');

    e.target.classList.add('user_in_focus')

    document.querySelector(`#user_${user_id} .notification`)?.remove()


    socket.emit('start_chat', { user_id }, ({ chatRoom, messages }) => {
      room_id = chatRoom.id;

      messages.forEach(message => {
        addMessage({
          message,
          user_send: message.to
        })
      })
    })
  }
})

document.querySelector('#user_message').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const message = e.target.value;

    e.target.value = '';

    socket.emit('send_message', {
      message,
      room_id
    })
  }
})

onLoad()