// Function to notify user that cookies are not enabled
function cookiesNotEnabled() {
};

// Function to set cookies
function setCookies(name, value, exp) {
    if (!exp) {
        const date =  new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        exp = date.toUTCString();
    };
    document.cookie = `${name}=${value}; expires=${exp}`;
};

// Function to get cookies
function getCookies(name) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result;
    cArray.forEach(element => {
        if (element.indexOf(name) == 0) {
            result = element.substring(name.length + 1);
        };
    });
    return result;
};

// Function to delete cookies
function delCookies(name) {
    setCookies(name, null, "Thu, 01 Jan 1970 00:00:00 UTC");
};

// Function to clear cookies (mainly for testing)
function clrCookies() {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    cArray.forEach(element => {
        delCookies(element.substring(0, element.indexOf("=")));
    });
};

// Test for cookies
if (navigator.cookieEnabled) {
    setCookies("testCookies","testPositive");
    if (getCookies("testCookies") == "testPositive") {
        delCookies("testCookies")
    } else cookiesNotEnabled();
} else cookiesNotEnabled();
