const _registerEvent = (target, eventType, cb) => {
  if (target.addEventListener) {
    target.addEventListener(eventType, cb);
    return {
      remove: function() {
        target.removeEventListener(eventType, cb);
      }
    };
  } else {
    target.attachEvent(eventType, cb);
    return {
      remove: function() {
        target.detachEvent(eventType, cb);
      }
    };
  }
};

const _createHiddenIframe = (target, uri) => {
  let iframe = document.createElement("iframe");
  iframe.src = uri;
  iframe.id = "hiddenIframe";
  iframe.style.display = "none";
  target.appendChild(iframe);

  return iframe;
};

const openUriWithHiddenFrame = (uri, failCb, successCb) => {
  const timeout = setTimeout(function() {
    failCb();
    handler.remove();
  }, 1000);

  let iframe = document.querySelector("#hiddenIframe");
  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }

  onBlur = () => {
    clearTimeout(timeout);
    handler.remove();
    successCb();
  };

  let handler = _registerEvent(window, "blur", onBlur);

  iframe.contentWindow.location.href = uri;
};

const openUriWithTimeoutHack = (uri, failCb, successCb) => {
  const timeout = setTimeout(function() {
    failCb();
    handler.remove();
  }, 1000);

  //handle page running in an iframe (blur must be registered with top level window)
  let target = window;
  while (target != target.parent) {
    target = target.parent;
  }

  onBlur = () => {
    clearTimeout(timeout);
    handler.remove();
    successCb();
  };

  let handler = _registerEvent(target, "blur", onBlur);

  window.location = uri;
};

const openUriUsingFirefox = (uri, failCb, successCb) => {
  let iframe = document.querySelector("#hiddenIframe");

  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }

  try {
    iframe.contentWindow.location.href = uri;
    successCb();
  } catch (e) {
    if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
      failCb();
    }
  }
};

const openUriUsingIEInOlderWindows = (uri, failCb, successCb) => {
  if (getInternetExplorerVersion() === 10) {
    openUriUsingIE10InWindows7(uri, failCb, successCb);
  } else if (
    getInternetExplorerVersion() === 9 ||
    getInternetExplorerVersion() === 11
  ) {
    openUriWithHiddenFrame(uri, failCb, successCb);
  } else {
    openUriInNewWindowHack(uri, failCb, successCb);
  }
};

const openUriUsingIE10InWindows7 = (uri, failCb, successCb) => {
  const timeout = setTimeout(failCb, 1000);
  window.addEventListener("blur", function() {
    clearTimeout(timeout);
    successCb();
  });

  let iframe = document.querySelector("#hiddenIframe");
  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }
  try {
    iframe.contentWindow.location.href = uri;
  } catch (e) {
    failCb();
    clearTimeout(timeout);
  }
};

const openUriInNewWindowHack = (uri, failCb, successCb) => {
  let myWindow = window.open("", "", "width=0,height=0");

  myWindow.document.write("<iframe src='" + uri + "'></iframe>");

  setTimeout(function() {
    try {
      myWindow.location.href;
      myWindow.setTimeout("window.close()", 1000);
      successCb();
    } catch (e) {
      myWindow.close();
      failCb();
    }
  }, 1000);
};

const openUriWithMsLaunchUri = (uri, failCb, successCb) => {
  navigator.msLaunchUri(uri, successCb, failCb);
};

const checkBrowser = () => {
  const isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
  const ua = navigator.userAgent.toLowerCase();
  return {
    isOpera: isOpera,
    isFirefox: typeof InstallTrigger !== "undefined",
    isSafari:
      (~ua.indexOf("safari") && !~ua.indexOf("chrome")) ||
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf("Constructor") > 0,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isChrome: !!window.chrome && !isOpera,
    isIE: /*@cc_on!@*/ false || !!document.documentMode // At least IE6
  };
};

const getInternetExplorerVersion = () => {
  let rv = -1,
    ua,
    re;
  if (navigator.appName === "Microsoft Internet Explorer") {
    ua = navigator.userAgent;
    re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
  } else if (navigator.appName === "Netscape") {
    ua = navigator.userAgent;
    re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
};

const getBrowserVersion = () => {
  const ua = navigator.userAgent;
  let tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return parseInt(tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) {
      return parseInt(tem[2]);
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return parseInt(M[1]);
};

const protocolCheck = (uri, failCb, successCb, unsupportedCb) => {
  function failCallback() {
    failCb && failCb();
  }

  function successCallback() {
    successCb && successCb();
  }

  function unsupportedCallback() {
    unsupportedCb && unsupportedCb();
  }

  if (navigator.msLaunchUri) {
    //for IE and Edge in Win 8 and Win 10
    openUriWithMsLaunchUri(uri, failCb, successCb);
  } else {
    let browser = checkBrowser();
    if (browser.isFirefox) {
      const browserVersion = getBrowserVersion();
      if (browserVersion >= 64) {
        openUriWithHiddenFrame(uri, failCallback, successCallback);
      } else {
        openUriUsingFirefox(uri, failCallback, successCallback);
      }
    } else if (browser.isChrome || browser.isIOS) {
      openUriWithTimeoutHack(uri, failCallback, successCallback);
    } else if (browser.isIE) {
      openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
    } else if (browser.isSafari) {
      openUriWithHiddenFrame(uri, failCallback, successCallback);
    } else {
      //not supported, implement please
      unsupportedCallback();
    }
  }
};

module.exports = protocolCheck;
