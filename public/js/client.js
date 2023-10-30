// Here, we will do the socket coding for client (not for server, it is done in server.js)

const socket = io();

// Now, when our web application opens, we need to ask the user for his username by opening a prompt window
let username;

let chats=document.querySelector(".chats");  // getting the chats from html with class name "chats"
let users_list=document.querySelector(".users-list");
let users_count=document.querySelector(".users-count");
let user_msg=document.querySelector("#user-msg");
let msg_send=document.querySelector("#msg-send");

do{     // this will run until a user not enter his name
    username = prompt("Enter your name: ");
}while(!username);

// it will be called when user will join
socket.emit("new-user-joined", username);      


// notify that user has joined
socket.on("user-connected", (socket_name)=>{ 
    userJoinLeft(socket_name, "joined");
});    
// notify that user has left
socket.on("user-disconnected", (socket_name)=>{  
    userJoinLeft(socket_name, "left");
}); 

// function to create join/left status
function userJoinLeft(name, status){
    let div = document.createElement("div");    
    div.classList.add("user-join");             
    let content=`<p><b>${name}</b> ${status} the chat</p>`;    
    div.innerHTML = content;                    
    chats.appendChild(div);                     

    chats.scrollTop=chats.scrollHeight;      // to make app auto-scrollable if new message comes 
}


// to update users list and count
socket.on("user-list", (users)=>{
    users_list.innerHTML="";          
    users_arr=Object.values(users);  
    for(i=0; i<users_arr.length; i++) {
        let p=document.createElement("p");   
        p.innerHTML=users_arr[i];           
        users_list.appendChild(p);     
    }

    users_count.innerHTML=users_arr.length;
});


// to send messsage
msg_send.addEventListener('click', ()=>{
    let data={      
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=""){
        appendMessage(data, "outgoing");     // outgoing message only show on sender window
        socket.emit("message", data);
        user_msg.value="";
    }
});

function appendMessage(data, status) {
    let div1=document.createElement("div");
    div1.classList.add("names");   
    let content1=`
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;
    div1.innerHTML=content1;

    let div2=document.createElement("div");
    div2.classList.add("time");
    const date = new Date(); 
    const timing = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
    });   
    let content2=`
        <p>${timing}</p>
    `;
    div2.innerHTML=content2;
    
    let div3=document.createElement("div");
    div3.classList.add("message", status);  
    div3.appendChild(div1); 
    div3.appendChild(div2);  

    chats.appendChild(div3); 

    chats.scrollTop=chats.scrollHeight;      // to make app auto-scrollable if new message comes 
};

socket.on('message', (data)=>{
    appendMessage(data, "incoming");
});


