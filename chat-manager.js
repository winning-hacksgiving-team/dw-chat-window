let msgCD = false;
let llmProccessing = false;
let firstMessage = true;

function resizeTextarea(elem) {
    if (!elem.style.height) return elem.style.height = "1.2em";
    const textbox = document.getElementById("user-text-box")
    const chatWindow = document.getElementById("chat-box-window")
    if (!chatWindow.style.height) return chatWindow.style.height = "89.75vh";
    if (elem.clientHeight < elem.scrollHeight) {
        if (textbox.style.flexDirection == "column") {
            let rescale = true
            while (rescale) {
                if (elem.style.height == "9.6em") return;
                elem.style.height = `${Number(elem.style.height.substr(0,elem.style.height.indexOf("em")))+1.2}em`;
                chatWindow.style.height = `calc(${chatWindow.style.height} - 1.75em)`
                if (elem.clientHeight < elem.scrollHeight){} else return;
            };
        } else {
            textbox.style.flexDirection = "column";
            chatWindow.style.height = `calc(${chatWindow.style.height} - 4.5em)`;
            if (elem.clientHeight < elem.scrollHeight){} else return;
            let rescale = true
            while (rescale) {
                if (elem.style.height == "9.6em") return;
                elem.style.height = `${Number(elem.style.height.substr(0,elem.style.height.indexOf("em")))+1.2}em`;
                chatWindow.style.height = `calc(${chatWindow.style.height} - 1.75em)`
                if (elem.clientHeight < elem.scrollHeight){} else return;
            };
        };
    } else {
        if (elem.style.height == "1.2em") {
            textbox.style.flexDirection = "row";
            if (elem.clientHeight < elem.scrollHeight) {
                textbox.style.flexDirection = "column";
            } else  chatWindow.style.height = " h";
        };
        let rescale = true;
        while (rescale) {
            let initHeight = Number(elem.style.height.substr(0,elem.style.height.indexOf("em")));
            elem.style.height = `${initHeight-1.2}em`;
            chatWindow.style.height = `calc(${chatWindow.style.height} + 1.75em)`;
            if (elem.clientHeight < elem.scrollHeight) {
                elem.style.height = `${initHeight}em`;
                chatWindow.style.height = `calc(${chatWindow.style.height} - 1.75em)`;
                rescale = false;
            };
            if (elem.style.height == "1.2em") {
                textbox.style.flexDirection = "row";
                if (elem.clientHeight < elem.scrollHeight) {
                    textbox.style.flexDirection = "column";
                } else chatWindow.style.height = "89.75vh";
            };
        };
    };
};

async function sendMessage(identifier, content) {
    const chatWindow = document.getElementById("chat-box-window");
    let messageClass;
    if (identifier == "user") {
        messageClass = "user-message";
        if (firstMessage){
            chatWindow.innerHTML = `<div id="first-message" class="${messageClass}">\n<p>\n${content}\n</p>\n</div>\n${chatWindow.innerHTML}`;
            return firstMessage = false;
        };
        chatWindow.innerHTML = `<div class="${messageClass}">\n<p>\n${content}\n</p>\n</div>\n${chatWindow.innerHTML}`;
    } else if (identifier == "assistantProcessing") {
        messageClass = "assistant-message";
        chatWindow.innerHTML = `<div id="assistant-processing" class="${messageClass}">\n<p>\n\n</p>\n</div>\n${chatWindow.innerHTML}`;
        const messageBox = document.getElementById("assistant-processing");
        while (llmProccessing) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!llmProccessing) return;
            messageBox.innerHTML = `<p>.</p>`;
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!llmProccessing) return;
            messageBox.innerHTML = `<p>..</p>`;
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!llmProccessing) return;
            messageBox.innerHTML = `<p>...</p>`;
        };
    } else if (identifier == "assistant") {
        messageClass = "assistant-message";
        const messageBox = document.getElementById("assistant-processing");
        messageBox.innerHTML = `<p>\n${content}\n</p>`;
        messageBox.removeAttribute('id');
    };
};

async function generateText(prompt) {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
  
    const data = await response.json();
    console.log(data.text);   
    sendMessage("assistant", data.text);
};

function processPrompt(){
    const textArea = document.getElementById("user-text-input");
    if(!textArea.value || msgCD) return;
    msgCD = true;
    sendMessage("user", textArea.value);
    //generateText(textArea.value);
    testResponse(textArea.value)
    textArea.value = null;
    resizeTextarea(textArea);
};

async function testResponse(prompt) {
    llmProccessing = true;
    sendMessage("assistantProcessing")
    setTimeout(()=>{ sendMessage("assistant", prompt) },5000);
    setTimeout(()=>{
        msgCD = false;
        llmProccessing = false;
    },5000);
};

function textareaKeyPressed(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        if (e.shiftKey || msgCD) return;
        document.getElementById("send-btn").click();
    };
};

//Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis iaculis mauris nibh, ac pharetra urna ultricies sit amet. Cras bibendum pretium tellus. Nulla enim purus, fermentum eget orci vitae, pretium aliquet metus. Curabitur sagittis purus nisi, et ultrices tellus eleifend quis. Pellentesque nisi eros, ornare nec mattis nec, elementum ac odio. Donec at bibendum tellus, eget mattis justo. Donec id varius felis. Pellentesque sit amet egestas nunc. Vivamus a urna consequat, volutpat lectus ac, tincidunt dui. Duis sed urna luctus, imperdiet mauris sit amet, volutpat turpis. Nullam auctor mi eget turpis vestibulum, nec ultrices augue sodales. Vivamus at lobortis orci. Phasellus vel augue id elit maximus bibendum. Interdum et malesuada fames ac ante ipsum primis in faucibus.