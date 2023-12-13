const socket = io();

const form = document.getElementById("chat-form");
const textarea = document.getElementById("textarea");
const chat_messages = document.querySelector(".chat-messages");
const rec_audio = new Audio("./audio/receive.mp3");
const send_audio = new Audio("./audio/send.mp3");
const user = document.getElementById("userhead").textContent;

function display_msg(messages, position) {
  const chat_messages = document.querySelector(".chat-messages");
  const msg = document.createElement("div");
  msg.classList.add(position);
  dates = `<div class='text-muted small text-center align-items-end' > ${moment().format(
    "LT"
  )}</div>`;
  msg.innerHTML = messages + dates;
  msg.style.overflowWrap = "break-word";
  chat_messages.append(msg);

  if (position == "chat-message-left") {
    rec_audio.play();
  } else if (position == "chat-message-right") {
    send_audio.play();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const send_message = textarea.value;
  if (send_message) {
    display_msg(
      `<strong>You</strong>: ${send_message}&nbsp`,
      "chat-message-right"
    );
    socket.emit("chat-send", send_message);
    textarea.value = "";
    textarea.focus();
    scrolls();
  }
});

function scrolls() {
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

// typing status
textarea.addEventListener("keydown", (e) => {
  socket.emit("typing", user);
});

let typingele = document.getElementById("typing");
let timerid = null;

function debounce(func, timer) {
  if (timerid) {
    clearTimeout(timerid);
  }
  timerid = setTimeout(() => {
    func();
  }, timer);
}

socket.emit("user-joins", user);

socket.on("welcome-msg", (msg) => {
  display_msg(
    `<div style="font-weight: 600;">${msg}</div>`,
    "chat-message-center"
  );
});

socket.on("user-joined", (user) => {
  display_msg(`<div style="font-weight: 600;">${user} joined the chat.</div>`,"chat-message-center");
  
});


socket.on("userslist",(contacts)=>{
  userjoined(contacts)
})


// socket.on("users-left", (contacts) => {
//   userjoined(contacts)

// });

socket.on("left-chat", (user) => {
  display_msg(
    `<div style="font-weight: 600;">${user} left the chat.</div>`,
    "chat-message-center"
  );
});


socket.on("typing", (user) => {
  typingele.innerText = `${user} is typing...`;
  debounce(function () {
    typingele.innerText = "";
  }, 5000);
});



socket.on("chat-recieve", (data) => {
  // display_left(`${data.user} : ${data.message}`);
  display_msg(
    `<strong>${data.user}</strong> : ${data.message}&nbsp`,
    "chat-message-left"
  );
  scrolls();
});




function userjoined(contacts){
  const contactdiv=document.getElementById("contacts")
  contactdiv.innerHTML=''
  contacts.forEach((contact) => {
    const users= document.createElement('div');
     users.innerHTML=`
    <a href="#" class="list-group-item list-group-item-action border-0 ">
    <div class="d-flex align-items-start">
                                <img src="/images/avatar.jpg" class="rounded-circle mr-1" width="40" height="40">
                                <div class="flex-grow-1 ml-3 px-1">
                                    ${contact.username}
                                    <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
                                </div>
                            </div></a>`
     contactdiv.appendChild(users)
  });
}
