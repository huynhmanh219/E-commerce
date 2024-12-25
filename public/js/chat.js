import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';
//file-upload-with-preview
const upload = new FileUploadWithPreview('upload-images',{
    multiple:true,
    maxFileCount:6
});
//end file-upload-with-preview

//Client_send_Message
console.log("ok");

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;
        console.log(images);
        
        if (content ){
            socket.emit("CLIENT_SEND_MESSAGE",{
                content:content,
                images:images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING","hidden");
        } 
    });
}

//End Client_send_Message

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

    const body = document.querySelector(".chat .inner-body");

    const div = document.createElement("div");
    let htmlFullname = "";
    let htmlContent = "";
    let htmlImages = "";
    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullname = `<div class="inner-name"> ${data.fullname} </div>`;
        div.classList.add("inner-incoming");
    }

    if(data.content)
    {
      htmlContent = `
        <div class="inner-content"> ${data.content} </div>
        `
    }
    if(data.images.length > 0)
        {
          htmlImages = `<div class="inner-images">`;
          for (const image of data.images) {
            htmlImages += `<img src=${image}>`
          }
          htmlImages += `</div>`;
        }
    div.innerHTML = ` 
    ${htmlFullname}
    ${htmlContent}
    ${htmlImages}
    `;

    body.insertBefore(div,boxTyping);

    body.scrollTop = body.scrollHeight;
});
//end SERVER_RETURN_MESSAGE

//scroll chat to botoom 
const bodyChat = document.querySelector(".chat .inner-body");

if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//end scroll chat to botoom 

//show icon chat
//show pop up
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon)
{
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
      }
}
//end show pop up

//SHOW TYPING
const showTyping = ()=>{
    socket.emit("CLIENT_SEND_TYPING","show");
    
    clearTimeout(timeOut);  

    timeOut = setTimeout(() =>{
        socket.emit("CLIENT_SEND_TYPING","hidden");
    },3000);

}

//END SHOW TYPING





//INSERT ICON IN TO INPUT
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker)
{
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click",(event)=>{
       const icon = event.detail.unicode;
       inputChat.value = inputChat.value + icon;
       
       const end = inputChat.value.length;
       inputChat.setSelectionRange(end,end);
       inputChat.focus();

       showTyping();

    })
}
//END INSERT ICON IN INPUT


//input keyup 
var timeOut;

const inputChat = document.querySelector(".chat .inner-form input[name='content']");
inputChat.addEventListener("keyup",() =>{
    showTyping();
})
//end input keyup

//end show icon chat


//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
const bodyLoad = document.querySelector(".chat .inner-body");
if(elementListTyping)
{
    socket.on("SERVER_RETURN_TYPING",(data)=>{
    console.log(data);
    if(data.type == "show")
    {
        const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
        if(!existTyping)
        {
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id",data.userId);

            boxTyping.innerHTML=`
            <div class="inner-name">${data.fullname}</div>
                <div class="inner-dots">
                    <span></span> 
                    <span></span> 
                    <span></span>
                </div>
            `;
            elementListTyping.appendChild(boxTyping);
            bodyLoad.scrollTop=bodyLoad .scrollHeight;
        }

    }
    else
    {
        const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
        if(boxTypingRemove)
        {
            elementListTyping.removeChild(boxTypingRemove);
        }
    }
});

}


//END SERVER_RETURN_TYPING


