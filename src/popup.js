{
    // is loggedon toggle
    let isLoggedOn = false;
    let loginDiv = document.getElementById('login');
    
    if (!isLoggedOn) {
        loginDiv.style.display = 'block';
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
            if (data.status === "success") {
                isLoggedOn = true;
                loginDiv.style.display = 'none';
            }
        });
    });
}