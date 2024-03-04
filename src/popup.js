const { SUCCESS, UNAUTHORIZED, LOGGEDIN } = require("./consts");
{
    // is loggedon toggle
    let isLoggedOn = false;
    let loginDiv = document.getElementById('login');
    let loggedDiv = document.getElementById('logged');
    let errorDiv = document.getElementById('error');
    
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
}