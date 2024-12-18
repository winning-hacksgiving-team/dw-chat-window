// import QrScanner from 'qr-scanner';

///// Text Message \\\\\
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

function appendHistory(identifier,content) {
    let chatHistory = sessionStorage.getItem("chatHistoryAssistant");
    let chatParsed = JSON.parse(chatHistory);
    chatParsed[chatParsed.length] = {
        "role": identifier,
        "content": content
    };
    sessionStorage.setItem("chatHistoryAssistant", JSON.stringify(chatParsed));
};

async function sendMessage(identifier, content) {
    const chatWindow = document.getElementById("chat-box-window");
    let messageClass;
    const lastMessages = document.getElementsByClassName("last-message");
    if (lastMessages[1]) {
        lastMessages[1].classList.add("normal-message");
        lastMessages[1].classList.remove("last-message");
    };
    if (identifier == "user") {
        messageClass = "user-message";
        let richMessage = content.replace(/(?:\r\n|\r|\n)/g,"<br>");
        if (firstMessage){
            chatWindow.innerHTML = `<div id="first-message" class="last-message ${messageClass}">\n<p>\n${richMessage}\n</p>\n</div>\n${chatWindow.innerHTML}`;
            sessionStorage.setItem("chatHistoryAssistant", JSON.stringify([
                {
                    "role": "user",
                    "content": content
                }
            ]));
            return firstMessage = false;
        };
        chatWindow.innerHTML = `<div class="last-message ${messageClass}">\n<p>\n${richMessage}\n</p>\n</div>\n${chatWindow.innerHTML}`;
        appendHistory("user", content);
    } else if (identifier == "assistantProcessing") {
        messageClass = "assistant-message";
        chatWindow.innerHTML = `<div id="assistant-processing" class="last-message ${messageClass}">\n<p>\n\n</p>\n</div>\n${chatWindow.innerHTML}`;
        const messageBox = document.getElementById("assistant-processing");
        if (lastMessages[1]) {
            lastMessages[1].classList.add("normal-message");
            lastMessages[1].classList.remove("last-message");
        };
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
        if (!document.getElementById("assistant-processing")) {
            chatWindow.innerHTML = `<div id="assistant-processing" class="last-message ${messageClass}">\n<p>\n\n</p>\n</div>\n${chatWindow.innerHTML}`;
        };
        let richMessage = content.replace(/(?:\r\n|\r|\n)/g,"<br>");
        const messageBox = document.getElementById("assistant-processing");
        messageBox.innerHTML = `<p>\n${richMessage}\n</p>`;
        messageBox.removeAttribute('id');
        if (firstMessage){
            messageBox.id = "first-message"
            sessionStorage.setItem("chatHistoryAssistant", JSON.stringify([
                {
                    "role": "assistant",
                    "content": content
                }
            ]));
            return firstMessage = false;
        };
        appendHistory("assistant", content);
    };
};

async function generateText(prompt, isQR) {
    if (msgCD) {
        return;
    }  else msgCD = true;
    llmProccessing = true;
    sendMessage("assistantProcessing")
    if (isQR) {
        let chatHistory = sessionStorage.getItem("chatHistoryAssistant");
        let historyLength;
        try { historyLength = chatParsed.length; } catch(err) { historyLength=0; };
        let chatParsed = JSON.parse(chatHistory);
        chatParsed[chatParsed.length] = {
            "role": "user",
            "content": prompt
        };
        sessionStorage.setItem("chatHistoryAssistant", JSON.stringify(chatParsed));
    };
    try {
        let promptMessage = sessionStorage.getItem("chatHistoryAssistant");
        console.log(promptMessage);
        const response = await fetch('https://pika-engaging-preferably.ngrok-free.app/processprompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: promptMessage
        });
        const data = await response.json();
        const output = data.text;
        sendMessage("assistant", output);
    } catch(err) {
        sendMessage("assistant", "Error: Attempt to process prompt failed.");
    };
    msgCD = false;
    llmProccessing = false;
};

function processPrompt(){
    const textArea = document.getElementById("user-text-input");
    if(!textArea.value || msgCD) return;
    sendMessage("user", textArea.value);
    generateText(textArea.value);
    // testResponse(textArea.value)
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
    if (e.shiftKey) return;
    if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("send-btn").click();
    };
};

///// Voice Dictation \\\\\
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const voiceButton = document.querySelector("#voice-btn");

const recognition = new SpeechRecognition();
recognition.continuous = true;

voiceButton.addEventListener("click", voiceBtnClick);
function voiceBtnClick() {
    if(voiceButton.classList.contains("voice-dctn")) {
        recognition.start();
    } else {
        recognition.stop();
    };
};
recognition.addEventListener("start", startSpeechRecognition);
function startSpeechRecognition() {
    voiceButton.classList.add('voice-on');
    voiceButton.classList.remove('voice-dctn');
    console.log("Voice dictation started!");
};

recognition.addEventListener("end", endSpeechRecognition);
function endSpeechRecognition() {
    voiceButton.classList.add('voice-dctn');
    voiceButton.classList.remove('voice-on');
    console.log("Voice dictation ended!");
};

recognition.addEventListener("result", resultOfSpeechRecognition);
function resultOfSpeechRecognition(event) {
    console.log(event);
    const userTextarea = document.getElementById("user-text-input");
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    userTextarea.value = transcript;
}

//Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis iaculis mauris nibh, ac pharetra urna ultricies sit amet. Cras bibendum pretium tellus. Nulla enim purus, fermentum eget orci vitae, pretium aliquet metus. Curabitur sagittis purus nisi, et ultrices tellus eleifend quis. Pellentesque nisi eros, ornare nec mattis nec, elementum ac odio. Donec at bibendum tellus, eget mattis justo. Donec id varius felis. Pellentesque sit amet egestas nunc. Vivamus a urna consequat, volutpat lectus ac, tincidunt dui. Duis sed urna luctus, imperdiet mauris sit amet, volutpat turpis. Nullam auctor mi eget turpis vestibulum, nec ultrices augue sodales. Vivamus at lobortis orci. Phasellus vel augue id elit maximus bibendum. Interdum et malesuada fames ac ante ipsum primis in faucibus.