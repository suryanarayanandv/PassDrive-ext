const { SUCCESS, UNAUTHORIZED, LOGGEDIN } = require("./consts");
{
    // is loggedon toggle
    let isLoggedOn = false;
    let loginDiv = document.getElementById('login');
    let loggedDiv = document.getElementById('logged');
    let errorDiv = document.getElementById('error');
    let saveIgnoreDiv = document.getElementById('save_ignore');
    let acceptIgnoreDiv = document.getElementById('accept_ignore');
    
    if (!isLoggedOn) {
        loginDiv.style.display = 'block';
    }

    if ( errorDiv.style.display === 'block' && loginDiv.getElementById('masterp').value !== "" ) {
        errorDiv.style.display = 'none';
    }
    // login button
    let loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', () => {
        let master = document.getElementById('masterp').value;

        // Native app call
        let port = chrome.runtime.connectNative("com.passdrive-service");
        port.postMessage({ data: JSON.stringify({ "type": "POST_login", "data": { master } }) });

        port.onMessage.addListener(function (msg) {
            let data = JSON.parse(msg);
            console.log(data);
        if (data.status === LOGGEDIN) {
                isLoggedOn = true;
                loginDiv.style.display = 'none';
                loggedDiv.style.display = 'block';
            } else if (data.status == UNAUTHORIZED) {
                isLoggedOn = false;
                document.getElementById('masterp').value = "";
                errorDiv.style.display = 'block';
            }
        });
    });

    // save / ignore model
    let saveBtn = document.getElementById('save-btn');
    let ignoreBtn = document.getElementById('ignore-btn');
    let acceptBtn = document.getElementById('accept-btn');
    let ignoreB = document.getElementById('ignore-b');

    chrome.storage.sync.set({ "save": "default" });
    chrome.storage.sync.set({ "accept": "default" });
    chrome.storage.sync.set({ "detected": "default" });

    saveBtn.addEventListener('click', () => {
        chrome.storage.sync.set({ "save": true });
    });

    ignoreBtn.addEventListener('click', () => {
        chrome.storage.sync.set({ "save": false });
    });

    acceptBtn.addEventListener('click', () => {
        chrome.storage.sync.set({ "accept": true });
    });

    ignoreB.addEventListener('click', () => {
        chrome.storage.sync.set({ "accept": false });
    })
    
    let isDetected = "default";
    while ( isDetected === "default" ) {
        let temp = await chrome.storage.sync.get("detected");
        isDetected = temp.detected;
    }

    if ( isDetected ) {
        acceptIgnoreDiv.style.display = 'block';
    } else {
        saveIgnoreDiv.style.display = 'block';
    }

    // when and how to enable display: block for the ignore model and save model = done
}