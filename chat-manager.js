function resizeTextarea(elem) {
    if (!elem.style.height) return elem.style.height = "1.2em";
    const textbox = document.getElementById("user-text-box")
    const chatWindow = document.getElementById("chat-box-window")
    console.log(chatWindow.style.height)
    if (!chatWindow.style.height) return chatWindow.style.height = "89.75vh";
    if (elem.clientHeight < elem.scrollHeight) {
        if (textbox.style.flexDirection == "column") {
            if (elem.style.height == "9.6em") return;
            elem.style.height = `${Number(elem.style.height.substr(0,elem.style.height.indexOf("em")))+1.2}em`;
            chatWindow.style.height = `calc(${chatWindow.style.height} - 1.75em)`
        } else {
            textbox.style.flexDirection = "column";
            chatWindow.style.height = `calc(${chatWindow.style.height} - 4.5em)`;
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

function sendMessage() {
    s
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
  
}