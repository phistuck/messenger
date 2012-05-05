/*jslint maxlen: 180*/
// ==ClosureCompiler==
// @output_file_name default.js
// @js_externs var goog = {}; goog.appengine = {};
// @js_externs /** @constructor @param {string} str */ goog.appengine.Channel = function (str) {};
// @js_externs /** @constructor @param {string} str */ goog.appengine.Socket = function () {};
// @js_externs goog.appengine.Socket.prototype.close = function () {};
// @js_externs goog.appengine.Socket.prototype.onclose = function () {};
// @js_externs goog.appengine.Socket.prototype.onopen = function () {};
// @js_externs goog.appengine.Socket.prototype.onerror = function () {};
// @js_externs goog.appengine.Socket.prototype.onmessage = function () {};
// @js_externs /** @param {Object} obj @return {goog.appengine.Socket} */ goog.appengine.Channel.prototype.open = function (obj) {};
// @js_externs /** @typedef {HTMLAudioElement} */ var Audio;
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// ==/ClosureCompiler==
/*jslint sloppy: true, browser: true, white: true,
         maxerr: 999, maxlen: 80, indent: 1, devel: true*/
/*global main, webkitNotifications, escape, unescape, goog */
//(function () {
/*pr1operties
    $, ActiveXObject, XMLHttpRequest, abort, abortCheckerRequest, action, add,
    addEventListener, altKey, appendChild, atWork, blur, body,
    canPlayType, cancel, 'canned-message', cannedIndicesCookieName,
    cannedMessageField, charCodeAt, checkPermission, checked, checker,
    checkerTimer, checkerTimeoutTimer, className, concealedMessageField,
    concealedTyping, concealment, confirmContinueChecking, confirmNew,
    confirmRead, confirmReadButton, confirmSent, console, cookie,
    copyConcealedMessage, createElement, createNotification, createRequest,
    ctrlKey, documentElement, enabled, event, firstTag, flash, focus, form,
    getAttribute, getCookie, getElementById, getElementsByTagName, glow,
    glowTimer, handleGlobalShortcuts, handleMessageFieldKeys, height, href,
    html5, id, initialize, initializeSound, innerHTML, insertBefore, keyCode,
    lastMessageID, letterPattern, load, loadCannedMessageOrder, location, log,
    main, match, message, messageField, messages, name, newMessages,
    newRequest, newRequestRetries, newURL, notification, notifications, notify,
    notifyRecipient, onchange, onclick, onerror, onkeydown, onkeyup,
    onreadystatechange, onsubmit, open, options, originalMessage,
    originalTitle, parentNode, play, prepare, presenceIndication, presenceText,
    preventDefault, process, readyState, receptor, recipient, refreshArea,
    refreshLink, refreshURL, removeChild, replace, reply, requestPermission,
    requestPermissionLink, responseText, resumeCheckingLink,
    saveCannedMessageOrder, selectedIndex, send, sendManually, sendRequest,
    sendURL, setAttribute, setCookie, setRequestHeader, settings, shiftKey,
    shouldRefreshField, show, showingPresence, sound, soundURL, split, src,
    srcElement, stalePresenceTextTimer, startCheckerTimer, status, statusText,
    submit, tag, target, testDatabase, title, toGMTString, toggleField, type,
    typing, updateBodyIndicator, updatePresenceText, useCannedMessage,
    userName, value, webkitNotifications, width, location, doc, html,
    coords, latitude, longitude, geolocation, getCurrentPosition,
    presenceLocation, statusMessage, updatePresenceLocation, isRTL,
    originalChecked, style, direction, handleMessageKeyUp
*/
var /** @const */ MAIN_DEBUG = true;

/*jslint sub: true*/
if (MAIN_DEBUG)
{
 if (!window["console"])
 {
  window["console"] =
   {
    "log":
     function ()
     {
     }
   };
 }
}
/*jslint sub: false*/
/** @namespace The main and only global. */
var main = {};
//if (!window.main)
//{
//* @namespace The main and only global. */
// window.main = {};
//}
if (!main.$)
{
 /** @namespace Utility functions. */
 main.$ = {};
}

/** @type {RegExp} */
main.$.letterPattern = new RegExp("^[^a-zא-ת]+", "gi");
/** @type {RegExp} */
main.$.whitespacePatten = new RegExp("\\n\\s\\t\\r", "g");
/** @type {RegExp} */
main.$.urlPattern =
 new RegExp("((ftp|https|http)://|www\\.[א-תa-zA-Z])[^ \\n\\r'\"]+", "gi");
/** @type {Array.<RegExp>} */
main.$.englishLetterPatterns = null;
/** @type {Array.<RegExp>} */
main.$.englishSymbolPatterns = null;
/** @type {RegExp} */
main.$.parenthesesPattern = new RegExp("[()]", "g");
/** @type {string} */
main.$.addEventString = "addEventListener";
/** @type {string} */
main.$.removeEventString = "removeEventListener";
/** @type {string} */
main.$.eventTypePrefix = "";
if (!window.addEventListener && window.attachEvent)
{
 main.$.addEventString = "attachEvent";
 main.$.removeEventString = "detachEvent";
 main.$.eventTypePrefix = "on";
}

if (MAIN_DEBUG)
{
 /** @param {*} message */
 main.$.log =
  function (message, message2, message3)
  {
   console.log(message, message2, message3);
  };
}
/** @param {string} id
    @return {Element} */
main.$.id =
 function (id)
 {
  return main.doc.getElementById(id);
 };
/** @param {string} tagName
    @param {(Element|Document)=} elementOrDocument
    @return {NodeList} */
main.$.tag =
 function (tagName, elementOrDocument)
 {
  return (typeof elementOrDocument === null || !tagName)?
          null:
          (elementOrDocument || main.doc).getElementsByTagName(
           (tagName || "").toUpperCase());
 };
/** @param {string} tagName
    @param {(Element|Document)=} elementOrDocument
    @return {Element} */
main.$.firstTag =
 function (tagName, elementOrDocument)
 {
  return (main.$.tag(tagName, elementOrDocument) || [null])[0];
 };
/** @param {string} text
    @param {Document=} document */
main.$.createText =
 function (text, document)
 {
  return (document || main.doc).createTextNode(text);
 };
/** @param {string} name
    @param {?string=} className
    @param {?string=} text
    @param {Document=} document */
main.$.createElement =
 function (name, className, text, document)
 {
  document = document || main.doc;
  var element = document.createElement(name);
  if (className)
  {
   element.className = className;
  }
  if (text)
  {
   element.appendChild(main.$.createText(text, document));
  }
  return element;
 };
/** @param {string} content */
main.$.isRTL =
 function (content)
 {
  var letters = content.replace(main.$.letterPattern, "");
  return letters.length > 0 && letters.charCodeAt(0) > 1487 &&
         letters.charCodeAt(0) < 1515;
 };
main.$.translateHebrewToEnglish =
 function (text)
 {
  var englishKeys = "azsxedcrfvtgbyhnujmikolp;",
      hebrewKeys = "שזדסקגברכהאענטימוחצןלםךפף",
      englishSymbolKeys = ",.'/qw",
      hebrewSymbolKeys = "תץ,./'",
      letterLength = englishKeys.length,
      symbolLength = englishSymbolKeys.length, i, character;
  if (!main.$.englishLetterPatterns)
  {
   main.$.englishLetterPatterns = [];
   /*jslint plusplus: true*/
   for (i = 0; i < letterLength; i++)
   {
   /*jslint plusplus: false*/
    main.$.englishLetterPatterns.push(new RegExp(englishKeys.charAt(i), "gi"));
   }
   main.$.englishSymbolPatterns = [];
   /*jslint plusplus: true*/
   for (i = 0; i < symbolLength; i++)
   {
   /*jslint plusplus: false*/
    character = englishSymbolKeys.charAt(i);
    main.$.englishSymbolPatterns.push(
     new RegExp((character === "."? "\\.": character), "g"));
   }
  }
  /*jslint plusplus: true*/
  for (i = 0; i < letterLength; i++)
  {
  /*jslint plusplus: false*/
   text =
    text.replace(main.$.englishLetterPatterns[i], hebrewKeys.charAt(i));
  }
  /*jslint plusplus: true*/
  for (i = 0; i < letterLength; i++)
  {
  /*jslint plusplus: false*/
   text =
    text.replace(main.$.englishSymbolPatterns[i], hebrewSymbolKeys.charAt(i));
  }
  return text.replace(
          main.$.parenthesesPattern,
          function (character)
          {
           return character === "("? ")": "(";
          });
 };
main.$.findTextNodes =
 function (element, isValidElementFilter, runAction)
 {
  var i, length = element.childNodes.length;
  /*jslint plusplus: true*/
  for (i = 0; i < length; i++)
  {
  /*jslint plusplus: true*/
   if (element.childNodes[i].nodeType === 1)
   {
    if (isValidElementFilter && !isValidElementFilter(element))
    {
     break;
    }
    main.$.findTextNodes(
     element.childNodes[i], isValidElementFilter, runAction);
   }
   if (element.childNodes[i].nodeType === 3)
   {
    runAction(element.childNodes[i], element);
   }
  }
 };
main.$.linkifyURLs =
 function (element)
 {
  main.$.findTextNodes(
   element,
   function (element)
   {
    return element.tagName !== "A";
   },
   function (textNode, containingElement)
   {
    var i, urls, length, text, html, element, url;
    html = text = textNode.nodeValue;
    urls = html.match(main.$.urlPattern);
    if (urls)
    {
     /*jslint plusplus: true*/
     for (i = 0, length = urls.length; i < length; i++)
     {
      url = (urls[i].indexOf("www") === 0? "http://": "") + urls[i];
     /*jslint plusplus: false*/
      html =
       html.replace(
        urls[i],
        "<a href=\"" + url + "\" target=\"_blank\">" + urls[i] + "</a>");
     }
     if (text !== html)
     {
      element = main.$.createElement("span");
      element.innerHTML = html;
      if (element.childNodes.length === 1)
      {
       element = element.childNodes[0];
      }
      containingElement.replaceChild(element, textNode);
     }
    }
   });
 };
main.$.createRequest =
 function ()
 {
  var Request = window.XMLHttpRequest;
  if (Request)
  {
   return new Request();
  }
  Request = window.ActiveXObject;
  if (Request)
  {
   try
   {
    return new Request("Msxml2.XMLHTTP.6.0");
   }
   catch (e1)
   {
    try
    {
     return new Request("Msxml2.XMLHTTP.3.0");
    }
    catch (e2)
    {
     try
     {
      return new Request("Msxml2.XMLHTTP");
     }
     catch (e3)
     {
      try
      {
       return new Request("Microsoft.XMLHTTP");
      }
      catch (e4)
      {
      }
     }
    }
   }
  }
  alert("You have a weirdly old browser. Sorry, bye.");
 };
/** @param {string} name */
main.$.getCookie =
 function (name)
 {
  var cookie, cookies = main.doc.cookie.split(/[\s]*;[\s]*/g),
      i = 0, length;
  /*jslint plusplus: true*/
  for (length = cookies.length; i < length; i++)
  {
  /*jslint plusplus: false*/
   cookie = cookies[i].split("=");
   if (main.$.decode(cookie[0]) === name)
   {
    return main.$.decode(cookie[1]);
   }
  }
 };
/** @param {?string} text
    @return {?string} */
main.$.decode =
 function (text)
 {
  return text? decodeURIComponent(text): null;
 };
/** @param {?string} text
    @return {?string} */
main.$.encode =
 function (text)
 {
  return text? encodeURIComponent(text): null;
 };
/** @param {string} name
    @param {string} value
    @param {Date=} expiration */
main.$.setCookie =
 function (name, value, expiration)
 {
  main.doc.cookie =
   main.$.encode(name) + "=" + main.$.encode(value) + "; " +
   (expiration? "expires=" + expiration.toGMTString() + "; ": "") + "path=/";
 };
main.$.load =
 function (name)
 {
  if (main.support.storage)
  {
   if (window.sessionStorage &&
       typeof window.sessionStorage[name] !== "undefined")
   {
    return window.sessionStorage[name];
   }
   if (window.localStorage &&
       typeof window.localStorage[name] !== "undefined")
   {
    return window.localStorage[name];
   }
  }
  return main.$.getCookie(name);
 };
main.$.save =
 function (name, value, expiration)
 {
  var storage;
  if (main.support.storage)
  {
   storage = (!expiration && window.sessionStorage) || window.localStorage;
   storage[name] = value;
  }
  else
  {
   main.$.setCookie(name, value, expiration);
  }
 };
main.$.preventDefault =
 function (e)
 {
  e.returnValue = false;
  if (e.preventDefault)
  {
   e.preventDefault();
  }
 };
main.$.scheduleTask =
 function (task)
 {
  if (window.setImmediate)
  {
   window.setImmediate(task);
  }
  else
  {
   setTimeout(task, 0);
  }
 };

/** @type {Document} */
main.doc = document;

/** @type {Element} */
main.body = main.$.firstTag("body");
/** @type {Element} */
main.dialog = main.$.id("dialog");
/** @type {Element} */
main.form = main.doc.forms["messaging-form"];
/** @type {Element} */
main.html = main.doc.documentElement;
/** @type {string} */
main.version = "";
/** @type {goog.appengine.Socket} */
main.socket = null;
/** @type {string} */
main.channelToken = "";
/** @type {?boolean} */
main.atWork = null;
/** @type {Element} */
main.cannedMessageField = main.form["canned-message"];
/** @type {Element} */
main.concealedMessageField = main.$.id("concealed-message");
/** @type {boolean} */
main.concealedTyping = false;
/** @type {boolean} */
main.concealment = false;
/** @type {boolean} */
main.wasAtScrollBottom = false;
/** @type {?string} */
main.firstMessageTimestamp = null;
/** @type {?string} */
main.lastMessageID = null;
/** @type {?string} */
main.lastMessageTimestamp = null;
/** @type {number} */
main.lastTypingIndicationTimestamp = (new Date()).getTime() - 5000;
/** @type {number} */
main.lastConnectivitySignalTimestamp = (new Date()).getTime() - 30000;
/** @type {?string} */
main.location = null;
/*jslint sub: true*/
/** @type {Element} */
main.messageField = main.form["content"];
/** @type {Element} */
main.thinkingButton = main.$.id("thinking");
/*jslint sub: false*/
/** @type {boolean} */
main.newMessages = false;
/** @type {boolean} */
main.noOldMessages = false;
/*jslint sub: true*/
/** @type {Element} */
main.notifyRecipient = main.form["notify"];
/*jslint sub: false*/
/** @type {Element} */
main.presenceIndication = main.$.id("presence-data");
/** @type {Element} */
main.presenceLocation = main.$.tag("span", main.presenceIndication)[1];
/** @type {Element} */
main.presenceStatus = main.$.firstTag("span", main.presenceIndication);
/** @type {number} */
main.pingInterval = 30000;
/** @type {boolean} */
main.thinking = false;
/** @type {number} */
main.channelCount = 1;
/** @type {number} */
main.channelCountStartTime = (new Date()).getTime();
/** @type {string} */
main.recipient = "";
/** @type {Element} */
main.resumeCheckingLink = main.$.id("resume-checking");
/** @type {Element} */
main.shouldRefreshField = main.$.id("should-refresh");
/** @type {?number} */
main.connectivityTimeoutTimer = null;
/** @type {XMLHttpRequest|ActiveXObject} */
main.reclaimTokenRequest = null;
/** @type {?number} */
main.stalePresenceTextTimer = null;
/** @type {Element} */
main.statusMessage = main.$.firstTag("div", main.form);
/** @type {boolean} */
main.testDatabase = false;
/** @type {boolean} */
main.desktop = false;
/** @type {boolean} */
main.typing = false;
/** @type {boolean} */
main.recipientThinking = false;
/** @type {?string} */
main.userName = null;

main.toggleThinkingMode =
 function ()
 {
  main.thinking = !main.thinking;
  main.updatePresenceData();
  main.thinkingButton.className = main.thinking? "activated": "";
 };
main.finishAnimation =
 function ()
 {
  main.$.scheduleTask(
   function ()
   {
    main.animating = false;
    main.wasAtScrollBottom = true;
   });
 };
main.scrollToBottom =
 function ()
 {
  main.animating = true;
  window.scroll(0, main.body.scrollHeight);
  main.finishAnimation();
 };
/** @param {Event} e */
main.handleGlobalShortcuts =
 function (e)
 {
  var alt, key, control;
  if (!e)
  {
   e = window.event;
  }
  key = e.keyCode;
  alt = e.altKey;
  control = e.ctrlKey;

  // Alt+b toggles the concealment of the content.
  if ((control || alt) && key === 66)
  {
   main.toggleConcealmentMode();
  }
  // F2 toggles new message notifications.
  else if (key === 113)
  {
   if (main.newMessages)
   {
    main.messages.confirmRead();
   }
   else
   {
    main.messageField.focus();
   }
  }
  else if (key === 119)
  {
   main.toggleThinkingMode();
  }
  // Ctrl+Alt+s toggles message typing mode.
  else if (main.concealment && key === 83 && alt && e.ctrlKey)
  {
   main.concealedTyping = !main.concealedTyping;
   main.updateBodyIndicator();
   if (main.concealedTyping)
   {
    main.concealedMessageField.focus();
   }
   else
   {
    main.concealedMessageField.blur();
   }
  }
 };
main.focusMessageField =
 function ()
 {
  if (!main.concealment)
  {
   main.messageField.focus();
  }
 };
main.updateHTMLIndicator =
 function ()
 {
  var classList = [];
  if (main.support.desktopNotifications)
  {
   classList.push("desktop-notifications");
  }
  if (main.support.screenSize)
  {
   classList.push(main.support.screenSize);
  }
  main.html.className = classList.join(" ");
 };
main.updateBodyIndicator =
 function ()
 {
  var classList = [];
  if (main.concealment)
  {
   classList.push("concealment");
   if (main.concealedTyping)
   {
    classList.push("concealed-typing");
   }
  }
  else
  {
   if (main.newMessages)
   {
    classList.push("new-messages");
   }
   if (main.typing)
   {
    classList.push("typing");
   }
   if (!main.notifications.enabled)
   {
    classList.push("notifications-disabled");
   }
   if (main.noOldMessages)
   {
    classList.push("no-old-messages");
   }
   if (main.settings.offline)
   {
    classList.push("offline-mode");
   }
   if (main.notifications.showArrow)
   {
    classList.push("show-arrow");
   }
   if (main.recipientThinking)
   {
    classList.push("thinking");
   }
  }
  main.body.className = classList.join(" ");
 };
/** @param {string|number} onlineTimestamp */
main.updateRecipientStatus =
 function (onlineTimestamp)
 {
  if (onlineTimestamp)
  {
   main.presenceStatus.title = String(new Date(onlineTimestamp));
  }
  main.presenceStatus.className =
   ((new Date()).getTime() - (new Date(onlineTimestamp)).getTime()) < 30000?
    "online":
    "offline";
 };
/** @param {string|number} typingTimestamp */
main.updateRecipientTyping =
 function (typingTimestamp)
 {
  var typing;
  function updateTyping(typing)
  {
   typing = typing || false;
   if (main.typing !== typing)
   {
    main.typing = typing;
    main.updateBodyIndicator();
   }
  }

  clearTimeout(main.recipientTypingTimeoutTimer);
  
  typing =
   ((new Date()).getTime() - (new Date(typingTimestamp)).getTime()) < 7000;
  
  updateTyping(typing);

  if (typing)
  {
   main.recipientTypingTimeoutTimer = setTimeout(updateTyping, 8000);
  }
 };
main.updateRecipientThinking =
 function (thinking)
 {
  if (main.recipientThinking !== thinking)
  {
   main.recipientThinking = thinking;
   main.updateBodyIndicator();
  }
 };
/** @param {?string} presenceLocation */
main.updateRecipientLocation =
 function (presenceLocation)
 {
  if (presenceLocation)
  {
   main.presenceLocation.innerHTML = " (" + presenceLocation + ")";
  }
  else
  {
   main.presenceLocation.innerHTML = "";
  }
 };
main.showBlockedPopupMessage =
 function ()
 {
  main.showDialog(
   "Popups are being blocked. :(<br/>" +
   "Please, allow popups to open automatically.");
 };
/** @param {boolean=} indicateTypingState */
main.updatePresenceData =
 function (indicateTypingState)
 {
  
  var /** @type {XMLHttpRequest|ActiveXObject} */
      request = main.messages.newRequest, 
      url, typing = "", now = (new Date()).getTime(),
      typedLately = (now - main.lastTypingIndicationTimestamp) < 5000;
  if (indicateTypingState && typedLately)// ||
      //(!indicateTypingState &&
       //(now - main.lastConnectivitySignalTimestamp) < 25000))
  {
   return;
  }
  if ((indicateTypingState || typedLately) &&
      main.messageField.value.replace(main.$.whitespacePatten, ""))
  {
   main.lastTypingIndicationTimestamp = now;
   typing = "&typing=1";
  }
  if (request && request.readyState !== 4)
  {
   return;
  }
  url =
   main.messages.updatePresenceDataURL + "?from=" +
   main.$.encode(main.userName) + "&to=" + main.$.encode(main.recipient) +
   "&last-message-timestamp=" + main.$.encode(main.lastMessageTimestamp) +
   (main.thinking? "&thinking=1": "") + typing + (main.atWork? "&work=1": "") +
   (main.location? "&location=" + main.$.encode(main.location): "") +
   (main.testDatabase? "&test=1": "") +
   "&now=" + (new Date().getTime());
  request = main.messages.newRequest = main.$.createRequest();
  request.onreadystatechange =
   function ()
   {
    if (request.readyState !== 4 || request.status !== 200)
    {
     return;
    }
    clearTimeout(main.messages.checkerTimeoutTimer);
    request.onreadystatechange = null;
    request = main.messages.newRequest = null;
   };
  request.open("get", url, true);
  request.send(null);
  main.messages.checkerTimeoutTimer =
   setTimeout(main.messages.abortCheckerRequest, 10000);
  main.connectivityTimeoutTimer =
   setTimeout(
    function ()
    {
     main.reclaimToken();
    },
    20000);
 };
main.sendReport =
 function (code, value)
 {
  var request = main.$.createRequest(),
      parameters =
       "type=" + main.$.encode(code) + "&value=" + main.$.encode(value) +
       (main.testDatabase? "&test=1": "");
  request.open("post", "/report", true);
  request.setRequestHeader(
   "Content-Type", "application/x-www-form-urlencoded");
  request.send(parameters);
 };
main.handleMessage =
 function (message)
 {
  /*jslint sub: true*/
  var data = ((window.JSON && JSON.parse) || eval)(message["data"] || "{}"),
      value = data["value"];
  //console.log(message.data);
  /*jslint sub: false*/
  clearTimeout(main.connectivityTimeoutTimer);
  main.lastConnectivitySignalTimestamp = (new Date()).getTime();
  if (!main.settings.waitingForFetch)
  {
   if (data["last-message-timestamp"] &&
       data["last-message-timestamp"] !== main.lastMessageTimestamp)
   {
    main.settings.offline = true;
    main.updateBodyIndicator();
   }
   if (main.settings.offline)
   {
    main.messages.fetch(null, true);
   }
  }

  /*jslint sub: true*/
  switch (data["type"])
  {
   case "dispatch":
  /*jslint sub: false*/
    main.dispatchAction(value);
    break;
   case "old-messages":
    /*jslint sub: true*/
    main.messages.addOldMessages(value, data["timestamp"]);
    /*jslint sub: false*/
    break;
   case "queued-messages":
    main.messages.addQueuedMessages(value);
    break;
   case "message":
    /*jslint sub: true*/
    main.messages.addMessage(
     value, data["key"], data["accurate-timestamp"], data["unique-id"]);
    /*jslint sub: false*/
    break;
   case "remove-message":
    /*jslint sub: true*/
    main.messages.removeMessageElement(value);
    /*jslint sub: false*/
    break;
   case "presence":
    main.updatePresence(value);
    break;
  }
 };
main.updatePresence =
 function (data)
 {
  /*jslint sub: true*/
  var recipientData = data[main.recipient];
  main.updateRecipientThinking(recipientData? recipientData["thinking"]: false);
  main.updateRecipientStatus(recipientData? recipientData["timestamp"]: 0);
  main.updateRecipientLocation(recipientData? recipientData["location"]: "");
  main.updateRecipientTyping(recipientData? recipientData["typing"]: 0);
  /*jslint sub: false*/
 };
/** @param {Element} receptor
    @param {boolean=} before */
main.replaceReceptor =
 function (receptor, before)
 {
  var newReceptor = main.doc.createElement("div");
  newReceptor.id = receptor.id;
  newReceptor.className = receptor.className;
  receptor.id = "";
  // TODO - Perhaps make this more general.
  receptor.className = "";
  return receptor.parentNode.insertBefore(
          newReceptor,
          before? receptor: receptor.nextSibling);
 };
/** @param {string|Element} htmlOrElements
    @param {boolean=} alert */
main.showDialog =
 function (htmlOrElements, alert)
 {
  main.dialog.style.display = "block";
  main.dialog.innerHTML =
   "<h2>" + (alert? "Hey!": "We are having issues!") + "</h2>";
  if (typeof htmlOrElements === "string")
  {
   main.dialog.innerHTML += htmlOrElements + "<h3>(Click to dismiss)</h3>";
  }
  else
  {
   main.dialog.appendChild(htmlOrElements);
  }
  main.doc[main.$.addEventString](
   main.$.eventTypePrefix + "keyup", main.clearDialog, false);
 };
/** @param {Event|KeyboardEvent|MouseEvent=} e */
main.clearDialog =
 function (e)
 {
  if (!e)
  {
   e = window.event;
  }
  if (e && e.type === "keyup" && e.keyCode !== 27)
  {
   return;
  }
  main.dialog.style.display = "none";
  main.dialog.innerHTML = "";
  document[main.$.removeEventString](
   main.$.eventTypePrefix + "keyup", main.clearDialog, false);
 };
main.handleClicks =
 function (e)
 {
  var action, source;
  if (!e)
  {
   e = window.event;
  }
  source = e.target || e.srcElement;
  action = source.getAttribute && source.getAttribute("data-action");
  if (!action)
  {
   /*main.messageField.value =
    e.target.tagName + " " + e.target.className + " " + e.target.id;
   main.messages.send();
   if (e.target.parentNode.className === "message")
   {
    main.messageField.value =
     e.target.parentNode.outerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    main.messages.send();
   }*/
   return;
  }
  switch (action)
  {
   case "remove":
    main.messages.removeMessage.call(source, e);
    break;
   case "exit-application":
    main.doc.title = "exit";
    return false;
   case "settings":
    main.settings.toggleWidget();
    return false;
   case "clear-conversation":
    main.messages.clearAll();
    return false;
   case "fetch-more-messages":
    main.messages.fetch(e);
    break;
   case "re-enable-notifications":
    main.notifications.enabled = true;
    main.updateBodyIndicator();
    break;
   case "remove-undelivered":
    main.messages.removeUndelivered(e, source);
    break;
   case "resend-undelivered":
    main.messages.resendUndelivered(e, source);
    break;
  }
 };
main.animateScrollingToTheBottom =
 function ()
 {
  var currentScroll = -1;
  main.animating = true;
  function scrollDown()
  {
   var scrollTop = (main.body.scrollTop || main.html.scrollTop);
   if (currentScroll !== scrollTop)
   {
    currentScroll = scrollTop;
    window.scrollBy(0, 5);
    setTimeout(scrollDown, 50);
   }
   else
   {
    window.scrollBy(0, 1000);
    main.finishAnimation();
   }
  }
  scrollDown();
 };
main.createChannel =
 function ()
 {
  var channel, socket, interval = main.channelToken? 3e4: 3e5;

  if (interval !== main.pingInterval)
  {
   main.pingInterval = interval;
   main.messages.startCheckerTimer();
  }
  
  if (!main.channelToken)
  {
   return;
  }
  channel = new goog.appengine.Channel(main.channelToken);
  socket =
   channel.open(
    {
     "onopen":
      function ()
      {
       main.messages.fetch(null, true);
       //main.$.log("open" + Date());
      }
    });
  main.socket = socket;  
  socket.onclose =
   function ()
   {
    main.reclaimToken();
    //main.$.log("close" + Date());
   };
  socket.onerror =
   function ()
   {
    main.reclaimToken();
    //main.$.log("error" + Date());
   };
  socket.onmessage = main.handleMessage;
 };
main.reclaimToken =
 function ()
 {
  var /*iFrame = main.$.firstTag("iframe"), */request;
  /*jslint plusplus: true*/
  if (main.channelCount === 21)
  {
   clearInterval(main.messages.checkerTimer);
   return;
  }
  if (main.channelCount === 20)
  {
   if (((new Date()).getTime() - main.channelCountStartTime) < 54e5)
   {
    main.showDialog(
     "Sorry, your internet connection may be too flaky, " +
     "which causes us to break over our limits, thus making everyone, " +
     "everywhere else unhappy. Please, do not refresh...");
    main.sendReport("too-many-channels", navigator.userAgent);
   }
   else
   {
    main.channelCount = 1;
    main.channelCountStartTime = (new Date()).getTime();
   }
  }
  main.channelCount++;
  /*jslint plusplus: false*/
  /*if (!iFrame)
  {
   main.sendReport("reclaim-token-iframe-deletion", "no-iframe");
  }
  else
  {
   iFrame.parentNode.removeChild(iFrame);
  }*/
  try
  {
   main.releaseSocket();
   main.socket.close();
  }
  catch (e)
  {
  }
  request = main.reclaimTokenRequest;
  if (request && request.readyState !== 4)
  {
   return;
  }
  main.settings.waitingForFetch = false;
  main.settings.offline = true;
  main.updateBodyIndicator();
  main.reclaimTokenRequest = request = main.$.createRequest();
  request.onreadystatechange =
   function ()
   {
    if (request.readyState !== 4 || request.status !== 200)
    {
     return;
    }
    if (((new Date()).getTime() - main.lastConnectivitySignalTimestamp) > 25000)
    {
     main.channelToken = request.responseText;
     main.createChannel();
    }
    request.onreadystatechange = null;
    request = main.reclaimTokenRequest = null;
   };
  request.open(
   "get",
   "/reclaim-channel-token?from=" + main.$.encode(main.userName) +
   (main.testDatabase? "&test=1": ""),
   true);
  request.send(null);
 };
main.handleExitPreparations =
 function ()
 {
  if (main.messageField.value)
  {
   return "The last message you wrote/tried to send was not sent (yet?).\n" +
          "Quit anyway?";
  }
 };
main.handleExit =
 function ()
 {
  main.notifications.hide();
  main.releaseSocket();
 };
main.releaseSocket =
 function ()
 {
  function f()
  {
  }
  if (main.socket)
  {
   main.socket.onclose = f;
   main.socket.onerror = f;
   main.socket.onmessage = f;
   main.socket.onopen = f;
  }
 };
/** @param {boolean=} force */
main.toggleConcealmentMode =
 function (force)
 {
  if (main.concealment && force)
  {
   return;
  }
  if (!main.concealment)
  {
   main.messageField.blur();
  }
  main.concealment = force || !main.concealment;
  if (!force && main.concealedTyping)
  {
   main.concealedTyping = false;
   main.concealedMessageField.blur();
  }
  main.updateBodyIndicator();
  if (!main.concealment)
  {
   if (main.wasAtScrollBottom)
   {
    main.scrollToBottom();
    //main.wasAtScrollBottom = false;
   }
   main.resizeFields();
  }
 };
main.hideAndFocus =
 function ()
 {
  main.toggleConcealmentMode(true);
  alert("Oops! Something went wrong, please, restart the application.");
  main.doc.location.href = "/sign-out";
 };
main.dispatchAction =
 function (data)
 {
  /*jslint sub: true*/
  var action = typeof data === "string"? data: data["action"];
  /*jslint sub: false*/
  switch (action)
  {
   case "stop-notifying":
    main.notifications.suppress();
    break;
   case "hide-and-focus":
    main.hideAndFocus();
    break;
   // case "eval":
    // try
    // {
     // /*jslint evil: true, sub: true*/
     // eval(data["evaluate"]);
     // /*jslint evil: false, sub: false*/
    // }
    // catch (e)
    // {
    // }
    // break;
  }
 };
main.resizeFields =
 function ()
 {
  var documentWidth = main.html.clientWidth || (screen.width - 10), width;
  if (documentWidth < 300)
  {
   main.support.screenSize = "small-mobile";
  }
  else if (documentWidth < 800)
  {
   main.support.screenSize = "medium-mobile";
  }
  else
  {
   main.support.screenSize = "";
  }
  width = documentWidth - 75 - 5;
  main.cannedMessageField.style.width = (width - 5) + "px";
  main.messageField.style.width = width  + "px";
  main.updateHTMLIndicator();
  if (main.wasAtScrollBottom)
  {
   main.scrollToBottom();
  }
 };
main.handleScroll =
 function ()
 {
  if (!main.animating)
  {
   main.wasAtScrollBottom =
    ((main.body.scrollTop || main.html.scrollTop) +
     main.html.clientHeight) >
    (main.html.scrollHeight - 5);
  }
 };
main.initialize =
 function ()
 {
  function get(name)
  {
   return main.html.getAttribute("data-" + name);
  }
  function checkLocation()
  {
   function storeLocation(position)
   {
    var location = position.coords.latitude + "," + position.coords.longitude;
    if (main.location !== location)
    {
     main.location = location;
     main.updatePresenceData();
    }
   }
   navigator.geolocation.getCurrentPosition(storeLocation);
  }
  function hideRedundantOutro()
  {
   var form = main.form, element = main.$.id("outro"), elementTop, formTop;
   if (element.getBoundingClientRect &&
       form.getBoundingClientRect)
   {
    elementTop = parseInt(element.getBoundingClientRect().top, 10);
    formTop = parseInt(form.getBoundingClientRect().top, 10);
    if (elementTop < formTop)
    {
     element.style.height =
      (parseInt(window.getComputedStyle(element, null).height, 10) -
       (formTop - elementTop)) + "px";
    }
   }
  }
  if (navigator.geolocation)
  {
   checkLocation();
   setInterval(checkLocation, 60000);
  }
  main.resizeFields();
  window.onresize = main.resizeFields;
  main.handleScroll();
  window.onscroll = main.handleScroll;
  main.lastMessageTimestamp = get("last-message-timestamp");
  main.firstMessageTimestamp = get("first-message-timestamp");
  main.newMessages = get("new-messages-mode") === "1";
  main.userName = get("user-name");
  main.recipient = get("recipient");
  main.refreshURL = get("current-url");
  main.atWork = get("at-work") === "1";
  main.desktop = get("desktop") === "1";
  /*jslint sub: true*/
  main.testDatabase = main.form["test"].value === "1";
  /*jslint sub: false*/
  main.notifications.prepare();
  main.cannedMessageField.onchange = main.messages.useCannedMessage;
  main.messages.confirmReadButton.onclick = main.messages.confirmRead;
  main.thinkingButton.onclick =
   function ()
   {
    main.toggleThinkingMode();
    return false;
   };
  main.loadSettings();
  main.messageField.onkeydown = main.messages.handleMessageFieldKeys;
  main.messageField.onkeyup = main.messages.handleMessageFieldKeyUp;
  main.concealedMessageField.onkeydown = main.messages.handleMessageFieldKeys;
  main.concealedMessageField.onkeyup = main.messages.copyConcealedMessage;
  main.form.onsubmit = main.messages.send;
  main.notifications.initialize();
  main.html.onkeydown = main.handleGlobalShortcuts;
  main.doc.onclick = main.handleClicks;
  main.doc.onbeforeunload = main.handleExit;
  main.doc.originalTitle = main.doc.title;
  main.dialog.onclick = main.clearDialog;
  main.dialog.ontouchend = main.clearDialog;
  window.onerror =
   function ()
   {
    var args = "[", i, length;
    //if (window.JSON)
    //{
    // args = JSON.stringify(arguments);
    //}
    //else
    //{
     /*jslint plusplus: true*/
     for (i = 0, length = arguments.length; i < length; i++)
     {
     /*jslint plusplus: false*/
      args += arguments[i];
      //if (i !== (length - 1))
      //{
       args += ",";
      //}
     }
     args += navigator.userAgent + "]";
     //args += "]";
    //}
    main.sendReport("javascript-error", args);
   };
  main.version = get("version");
  if (main.version.indexOf("dev") === 0)
  {
   main.version = String(new Date());
  }
  main.notifications.notificationURL +=
   "from=" + main.$.encode(main.userName) +
   "&v=" + main.$.encode(main.version);
  window.onload =
   function ()
   {
    main.scrollToBottom();
    main.handleScroll();
    if (main.wasAtScrollBottom)
    {
     hideRedundantOutro();
    }
   };
  main.channelToken = get("channel-name");
  main.createChannel();
  if (!main.channelToken)
  {
   main.showDialog(
    "We are over the limits... :(<br/>" +
    "Try again after 10:00 in the morning<br/>" +
    "Or refresh manually to get new messages.");
  }
  else
  {
   main.messages.startCheckerTimer();
  }
  /*jslint sub: true*/
  if (typeof main.$.createElement("input")["autofocus"] === "undefined" &&
      !main.desktop)
  {
  /*jslint sub: false*/
   main.focusMessageField();
  }
  main.messages.iterateThroughMessages(main.$.linkifyURLs);
 };
main.loadSettings =
 function ()
 {
  main.messages.loadCannedMessageOrder();
  main.settings.savedSettings.popups =
   main.$.load("show-popup-notification") !== "false";
  main.settings.savedSettings.desktop =
   main.$.load("show-desktop-notification") !== "false";
  main.settings.savedSettings.sound =
   main.$.load("play-sound-notification") !== "false";
 };
/** @namespace Browser capabilities. */
main.support = {};
(function ()
 {
  //var element;
  try
  {
   main.support.storage = window.sessionStorage || window.localStorage;
  }
  catch (e)
  {
   main.support.storage = false;
  }
  //element = main.$.createElement("div");
  //element.style.position = "fixed";
  //main.support.fixedPosition = element.style.position === "fixed";
 }());
main.support.desktopNotifications = false;
main.support.nativeDesktopNotifications = false;
main.support.screenSize = "";

if (!main.settings)
{
 /** @namespace Setting properties. */
 main.settings = {};
}

main.settings.savedSettings =
 {
  popups: true,
  desktop: true,
  sound: true
 };
main.settings.offline = true;
main.settings.waitingForFetch = false;
main.settings.form = main.doc.forms["settings-form"];
main.settings.widget = main.$.id("settings");

/** @param {string} fieldName
    @param {boolean=} enable */
main.settings.getSetSetting =
 function (fieldName, savedSettingName, enable)
 {
  var field = main.settings.form[fieldName];
  if (typeof enable !== "undefined")
  {
   field.checked = enable;
   main.$.save(savedSettingName, enable, new Date());
  }
  return field.checked;
 };
/** @param {boolean=} enable */
main.settings.nativeDesktopNotifications =
 function (enable)
 {
  return main.settings.getSetSetting(
          "desktop-notification", "show-desktop-notification", enable);
 };
/** @param {boolean=} enable */
main.settings.soundNotifications =
 function (enable)
 {
  return main.settings.getSetSetting(
          "sound-notification", "play-sound-notification", enable);
 };
/** @param {boolean=} enable */
main.settings.showNotifications =
 function (enable)
 {
  return main.settings.getSetSetting(
          "visual-notification", "show-popup-notification", enable);
 };
main.settings.toggleWidget =
 function ()
 {
  main.settings.widget.className =
   main.settings.widget.className? "": "hidden";
 };

if (!main.notifications)
{
 /** @namespace Notification related functions. */
 main.notifications = {};
}

/** @type {boolean} */
main.notifications.showArrow = false;
/** @type {boolean} */
main.notifications.enabled = true;
/** @type {Notification} */
main.notifications.notification = null;
/** @type {Audio|HTMLAudioElement|Element} */
main.notifications.sound = null;
/** @type {string} */
main.notifications.notificationURL = "notification?";
/** @type {string}
    @const */
main.notifications.soundURL = "/resources/notification.mp3";
/** @type {Element} */
main.notifications.settings = main.$.id("notification-settings");

main.notifications.suppress =
 function ()
 {
  main.notifications.enabled = false;
  main.updateBodyIndicator();
 };
main.notifications.play =
 function ()
 {
  var sound, url;
  if (!main.settings.soundNotifications())
  {
   return;
  }
  function createEmbed()
  {
   var sound = main.doc.createElement("embed");
   sound.style.position = "absolute";
   sound.width = 1;
   sound.height = 1;
   return sound;   
  }
  function append()
  {
   main.notifications.sound = sound = main.body.appendChild(sound);
  }

  sound = main.notifications.sound;
  url = main.notifications.soundURL;

  if (!sound.flash &&
      (sound.parentNode ||
       sound.html5))
  {
   try
   {
    sound.src = url;
    sound.volume =
     parseFloat(main.settings.form["sound-notification-volume"].value) || 1;
    sound.play();
   }
   catch (e)
   {
   }
  }
  else
  {
   try
   {
    sound.parentNode.removeChild(sound);
   }
   catch (e1)
   {
   }
   if (!sound.html5)
   {
    sound = createEmbed();
    sound.src = url;
    append();
    if (!sound.play)
    {
     sound.parentNode.removeChild(sound);
     sound = createEmbed();
     sound.style.position = "absolute";
     sound.id = "audible-notification";
     sound.name = "audible-notification";
     sound.flash = true;
     sound.type = "application/x-shockwave-flash";
     sound.setAttribute(
      "flashvars", "file=" + url + "&autostart=true");
     sound.setAttribute("allowscriptaccess", "always");
     sound.src = "resources/player.swf";
     append();
    }
   }
  }
 };
main.notifications.show =
 function ()
 {
  var notification, blockedPopups = false;
  if (!main.settings.showNotifications())
  {
   return;
  }
  if (main.desktop)
  {
   document.title = "New Message - Notify";
  }
  else if (!main.settings.nativeDesktopNotifications())
  {
   notification = main.notifications.notificationPopup;
   if (!notification)
   {
    main.notifications.notificationPopup =
     window.open(
      "/notification", "Notification",
     "width=400, height=80, left=" + (screen.availWidth - 400) + "," +
     "top=" + (screen.availHeight - 100));
    notification = main.notifications.notificationPopup;
    try
    {
     if (!notification || notification.closed)
     {
      blockedPopups = true;
     }
    }
    catch (e)
    {
     blockedPopups = true;
    }
    if (blockedPopups)
    {
     main.showBlockedPopupMessage();
    }
   }
   notification = main.notifications.notificationPopup;
  }
  else
  {
   notification = main.notifications.notification;
   if (!notification)
   {
    notification =
     webkitNotifications.createHTMLNotification(
      main.notifications.notificationURL);
    notification.show();
    main.notifications.notification = notification;
   }
  }
  if (notification)
  {
   notification.onclose =
    function ()
    {
     main.notifications.notification = null;
     main.notifications.notificationPopup = null;
    };
  }
 };
main.notifications.hide =
 function ()
 {
  var notification = main.notifications.notification;
  if (notification)
  {
    notification.cancel();
    main.notifications.notification = null;
  }
  notification = main.notifications.notificationPopup;
  if (notification)
  {
   notification.close();
   main.notifications.notificationPopup = null;
  }
  if (main.notifications.showArrow)
  {
   main.notifications.showArrow = false;
   main.updateBodyIndicator();
  }
 };
main.notifications.initialize =
 function ()
 {
  function add(type)
  {
   main.doc[main.$.addEventString](
    main.$.eventTypePrefix + type, main.notifications.hide, false);
   window[main.$.addEventString](
    main.$.eventTypePrefix + type, main.notifications.hide, false);
  }
  /** @this {HTMLInputElement} */
  main.settings.form["visual-notification"].onclick =
   function ()
   {
    main.settings.getSetSetting(
     "visual-notification", "show-popup-notification", this.checked);
   };
  /** @this {HTMLInputElement} */
  main.settings.form["sound-notification"].onclick =
   function ()
   {
    main.settings.getSetSetting(
     "sound-notification", "play-sound-notification", this.checked);
   };
  main.notifications.initializeSound();
  if (main.settings.savedSettings.sound)
  {
   main.settings.soundNotifications(true);
  }
  if (navigator.userAgent.indexOf("Mobile") !== -1)
  {
   return;
  }
  if (main.settings.savedSettings.popups)
  {
   main.settings.showNotifications(true);
  }
  add("resize");
  add("focus");
  add("mousemove");
  add("keydown");
 };
main.notifications.prepare =
 function ()
 {
  /** @param {boolean=} doNotSet */
  function checkPermission(doNotSet)
  {
   if (webkitNotifications.checkPermission() === 0)
   {
    main.support.nativeDesktopNotifications = true;
    if (!doNotSet)
    {
     main.settings.nativeDesktopNotifications(true);
    }
    return true;
   }
  }
  
  if (!window.webkitNotifications)
  {
   return;
  }
  main.support.desktopNotifications = true;
  main.updateHTMLIndicator();
  /** @this {Element} */
  main.settings.form["desktop-notification"].onclick =
   function ()
   {
    if (!main.support.nativeDesktopNotifications && !checkPermission(true))//xxx
    {
     webkitNotifications.requestPermission(checkPermission);
    }
    else
    {
     main.settings.getSetSetting(
      "desktop-notification", "show-desktop-notification", this.checked);
    }
   };
   if (checkPermission(true) && main.settings.savedSettings.desktop)
   {
    main.settings.nativeDesktopNotifications(true);
   }
 };
main.notifications.initializeSound =
 function ()
 {
  var sound = main.doc.createElement("audio");
  if (sound.canPlayType &&
      sound.canPlayType("audio/mp3") !== "")
  {
   sound.html5 = true;
   sound = main.body.appendChild(sound);
  }
  main.notifications.sound = sound;
 };

if (!main.messages)
{
 /** @namespace Message related functions. */
 main.messages = {};
}
/** @type {Element} */
main.messages.confirmReadButton = main.$.id("confirm-read-messages");
/** @type {string}
    @const */
main.messages.cannedIndicesCookieName = "canned-indices";
/** @type {?number} */
main.messages.checkerTimer = null;
/** @type {?number} */
main.messages.checkerTimeoutTimer = null;
/** @type {string} */
main.messages.updatePresenceDataURL = "/update-presence-data";
/** @type {?number} */
main.messages.glowTimer = null;
/** @type {XMLHttpRequest|ActiveXObject} */
main.messages.newRequest = null;
/** @type {number} */
main.messages.newRequestRetries = 1;
/** @type {Element} */
main.messages.receptor = main.$.id("message-receptor");
/** @type {Element} */
main.messages.olderMessageReceptor = main.$.id("older-message-receptor");
/** @type {Element} */
main.messages.offlineReceptor = main.$.id("offline-message-receptor");
/** @type {Element} */
main.messages.messagePane = main.$.id("message-pane");
/** @type {XMLHttpRequest|ActiveXObject} */
main.messages.sendRequest = null;
/** @type {string} */
main.messages.sendURL = main.form.action;
/** @type {RegExp} */
main.messages.normalHebrewAsEnglishPattern =
 new RegExp(
  "\\b(fi|yuc|vh+|[bcdfghjklmnpqrstvwxz]{2,})\\b|[a-zA-Z],[a-zA-Z]", "g");
/** @type {RegExp} */
main.messages.whitelistEnglishPattern =
 new RegExp("\\b(h+m+|g+r+|w+t+f+|sms|mms|ll|(https?://|www)[^ \"]+)\\b", "gi");
/** @type {RegExp} */
main.messages.onlyHebrewLettersPattern = new RegExp("[א-ת]", "g");

main.messages.clearAll =
 function ()
 {
  main.messages.iterateThroughMessages(
   function (element)
   {
    element.className += " hidden";
   });
 };
main.messages.removeUndelivered =
 function (e, dismissLink)
 {
  var message;
  main.$.preventDefault(e);
  message = dismissLink.parentNode.parentNode;
  if (message.className.indexOf("system-message") !== -1)
  {
   message.parentNode.removeChild(message);
  }
 };
main.messages.resendUndelivered =
 function (e, resendLink)
 {
  var message;
  main.$.preventDefault(e);
  message = resendLink.parentNode.parentNode;
  if (message.className.indexOf("system-message") !== -1)
  {
   if (main.messageField.value &&
       !confirm("You started typing a message. This will overwrite it. Right?"))
   {
    return;
   }
   main.messageField.value = message.originalMessage;
   if (message.notify)
   {
    message.notify = main.notifyRecipient.checked;
   }
   main.messages.send();
  }
 };
main.messages.abortCheckerRequest =
 function ()
 {
  if (main.messages.newRequest)
  {
   try
   {
    main.messages.newRequest.onreadystatechange = null;
    main.messages.newRequest.abort();
   }
   catch (e)
   {
   }
  }
  main.messages.newRequest = null;
 };
/** @this {HTMLButtonElement} */
main.messages.confirmRead =
 function ()
 {
  var button = main.messages.confirmReadButton;
  if (main.messages.glowTimer)
  {
   main.messages.glowTimer = clearInterval(main.messages.glowTimer);
  }
  main.newMessages = false;
  main.updateBodyIndicator();
  main.notifications.hide();
  button.className = "hidden";
  main.messages.receptor = main.replaceReceptor(main.messages.receptor);
  main.doc.title = main.doc.originalTitle;
  /*jslint eqeq: true*/
  if (this === button)
  {
  /*jslint eqeq: false*/
   main.messageField.focus();
  }
  return false;
 };
main.messages.glow =
 function ()
 {
  main.doc.title = String((parseInt(main.doc.title, 10) || 0) + 1);
 };
main.messages.copyConcealedMessage =
 function ()
 {
  main.messageField.value = main.concealedMessageField.value;
 };
main.messages.handleMessageFieldKeyUp =
 function ()
 {
  var message = main.messageField;
  message.style.direction = main.$.isRTL(message.value)? "rtl": "ltr";
  if (main.messageField.value.length)
  {
   main.updatePresenceData(true);
   main.messages.lastTypedMessage = main.messageField.value;
  }
 };
/** @param {Event} e
    @return {?boolean|undefined} */
main.messages.handleMessageFieldKeys =
 function (e)
 {
  var concealed = main.concealedMessageField, key, mobileEnter,
      message = main.messageField, source;
  /*function cancelMeOnce(e)
  {
   if (!e)
   {
    e = window.event;
   }
   if (e.keyCode === 13 || e.keyCode === 229)
   {
    main.$.preventDefault(e);
    source.onkeypress = null;
   }
  }*/
  if (!e)
  {
   e = window.event;
  }
  source = e.target || e.srcElement;
  key = e.keyCode;

  if (source !== message && source !== concealed)
  {
   return;
  }
  
  // Nokia phones apparently have a weird key code for the Enter key,
  // which is actually shared between several keys (Enter, Backspace and more).
  // The Enter key has a specific keyIdentifier, so we use that to
  // know the real Enter key was pressed.
  mobileEnter = key === 229 && e.keyIdentifier === "MSK";

  if (e.altKey && key === 66)
  {
   return false;
  }
  if ((key === 13 || mobileEnter) &&
      !e.shiftKey)
  {
   if (e.ctrlKey)
   {
    main.notifyRecipient.checked = true;
   }
   if (source === concealed)
   {
    message.value = concealed.value;
    concealed.value = "";
   }
   if (navigator.userAgent.indexOf("MSIE") !== -1)
   {
    // Makes Internet Explorer actually prevent the key down.
    e.keyCode = 0;
   }
   else if (mobileEnter)
   {
    main.messageField.value = main.messages.lastTypedMessage;
   }
   main.$.preventDefault(e);
   //source.onkeypress = cancelMeOnce;
   return main.messages.send();
  }
 };
main.messages.loadCannedMessageOrder =
 function ()
 {
  var cannedIndices = main.$.load(main.messages.cannedIndicesCookieName),
      cannedMessages = [], field = main.cannedMessageField, i = 0, length;
  if (!cannedIndices)
  {
   return;
  }
  cannedIndices = cannedIndices.split(",");
  cannedMessages = [];
  /*jslint plusplus: true*/
  for (length = cannedIndices.length; i < length; i++)
  {
  /*jslint plusplus: false*/
   cannedMessages.push(main.cannedMessageField.options[cannedIndices[i]]);
  }
  while (cannedMessages.length)
  {
   field.insertBefore(cannedMessages.pop(), field.options[1]);
  }
 };
/** @param {boolean=} showArrow */
main.messages.notify =
 function (showArrow)
 {
  if (showArrow)
  {
   main.notifications.showArrow = true;
   main.updateBodyIndicator();
  }
  if (main.desktop)
  {
   document.title = "New Message";
  }
  else
  {
   main.doc.title = "1";
   if (!main.messages.glowTimer)
   {
    main.messages.glowTimer = setInterval(main.messages.glow, 1000);
   }
  }
  if (main.notifications.enabled)
  {
   main.notifications.show();
   main.notifications.play();
  }
  main.newMessages = true;
  main.updateBodyIndicator();
 };
/** @param {number} index */
main.messages.saveCannedMessageOrder =
 function (index)
 {
  var cannedIndices, expiration, i = 0, length,
      name = main.messages.cannedIndicesCookieName;
  cannedIndices = main.$.load(name);
  cannedIndices = cannedIndices? cannedIndices.split(","): [];
  /*jslint plusplus: true*/
  for (length = cannedIndices.length; i < length; i++)
  {
  /*jslint plusplus: false*/
   if (parseInt(cannedIndices[i], 10) === parseInt(index, 10))
   {
    cannedIndices.splice(i, 1);
   }
  }
  cannedIndices.unshift(index);
  cannedIndices = cannedIndices.join(",");
  expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  main.$.save(name, cannedIndices, expiration);
};
main.messages.sendManually =
 function ()
 {
  main.form.submit();
 };
main.messages.sendMessageCallbacks = {};

main.messages.send =
 function ()
 {
  var message = main.messageField.value, parameters, requestTimeout,
      indicateUndeliveredMessage, uniqueID, notify, request, retry = 0,
      resetTimer, resend, cleanup, sendMessage, stopRequest, translatedMessage,
      prepareMessage, showConfirmationBox,
      /*translateDecision, */undeliveredTimeout;
  cleanup =
   function ()
   {
    if (!request)
    {
     return;
    }
    request.onreadystatechange = null;
    request.onerror = null;
    try
    {
     request.abort();
    }
    catch (e)
    {
    }
    request = null;
   };
  resetTimer =
   function ()
   {
    clearTimeout(requestTimeout);
   };
  /** @param {boolean=} delay */
  resend =
   function (delay)
   {
    cleanup();
    resetTimer();
    if (retry < 3)
    {
     /*jslint plusplus: true*/
     retry++;
     if (delay)
     {
      setTimeout(sendMessage, 3000);
     }
     else
     {
      sendMessage();
     }
    }
   };
  indicateUndeliveredMessage =
   function ()
   {
    var header, receptor = main.messages.receptor, element,
        container = main.$.createElement("div", "system-message message");
        container.originalMessage = message;
        container.notify = !!notify;
        header = container.appendChild(
         main.$.createElement(
          "span", null,
          "The following message might have not been delievered ("));
        element =
         header.appendChild(main.$.createElement("a", null, "dismiss"));
        element.setAttribute("data-action", "remove-undelivered");
        element.href = "#";
        header.appendChild(main.$.createText(" or "));
        element =
         header.appendChild(main.$.createElement("a", null, "resend"));
        element.setAttribute("data-action", "resend-undelivered");
        element.href = "#";
        header.appendChild(main.$.createText(") - "));
        container.appendChild(
         main.$.createElement("span", "actual-message", message));
    if (receptor.children.length)
    {
     receptor.appendChild(container);
    }
    else
    {
     main.messages.messagePane.insertBefore(container, receptor);
    }
    main.sendReport(
     "undelivered-message",
     "from = " + main.userName + ", to = " + main.recipient);
    if (main.wasAtScrollBottom)
    {
     main.animateScrollingToTheBottom();
    }
    else
    {
     main.showDialog(
      "The message you sent might not have been delivered.<br/>" +
      "Scroll to the bottom to see it.");
    }
   };
  sendMessage =
   function ()
   {
    resetTimer();
    requestTimeout = setTimeout(stopRequest, 10000);
    request = main.$.createRequest();
    request.open("post", main.messages.sendURL, true);
    request.setRequestHeader(
     "Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange =
     function ()
     {
      if (request && request.readyState !== 4)
      {
       return;
      }
      if (request && request.status !== 200)
      {
       resend(true);
      }
      else
      {
       cleanup();
       resetTimer();
      }
     };
    //request.onerror = main.messages.sendManually;
    request.onerror =
     function ()
     {
      resend();
     };
    request.send(parameters);
   };
  stopRequest =
   function ()
   {
    cleanup();
    resend();
   };
  prepareMessage =
   function ()
   {
    notify = main.notifyRecipient.checked? "&notify=on": "";
    if (!message && !notify)
    {
     return false;
    }
    if (main.thinking)
    {
     main.toggleThinkingMode();
    }
    /*jslint plusplus: true*/
    uniqueID = main.channelToken + "-" + (new Date()).getTime();
    /*jslint plusplus: false*/
    parameters =
     "from=" + main.$.encode(main.userName) +
     "&to=" + main.$.encode(main.recipient) +
     "&last-message-timestamp=" + main.$.encode(main.lastMessageTimestamp) +
     notify + "&unique-id=" + main.$.encode(uniqueID) +
     (main.testDatabase? "&test=1": "") + "&dynamic=1" +
     "&content=" + (main.$.encode(message) || "");
    sendMessage();
    if (message)
    {
     undeliveredTimeout = setTimeout(indicateUndeliveredMessage, 33000);
     main.messages.sendMessageCallbacks[uniqueID] =
      function ()
      {
       resetTimer();
       clearTimeout(undeliveredTimeout);
       main.messages.sendMessageCallbacks[uniqueID] = undefined;
      };
    }
    main.form.reset();
   };
  showConfirmationBox =
   function ()
   {
    var defaultButton, button, element, focus,
        activeElement = main.doc.activeElement;
    focus =
     function ()
     {
      if (activeElement && activeElement.tagName !== "BODY")
      {
       activeElement.focus();
      }
      else
      {
       main.focusMessageField();
      }
     };
    element =
     main.$.createElement(
      "small",
      null,
      "Looks like you meant to type in Hebrew.");
     element.appendChild(main.$.createElement("br"));
     element.appendChild(main.$.createText("Here is what I managed to fix -"));
     element.appendChild(main.$.createElement("br"));
     element.appendChild(main.$.createText(translatedMessage));
     element.appendChild(main.$.createElement("br"));
    defaultButton =
     element.appendChild(main.$.createElement("button", null, "Fix & Send"));
    defaultButton.onclick =
     function ()
     {
      main.clearDialog();
      message = translatedMessage;
      prepareMessage();
      focus();
     };
    button =
     element.appendChild(main.$.createElement("button", null, "Just Send"));
    button.onclick =
     function ()
     {
      main.clearDialog();
      main.sendReport("invalid-hebrew-english-detection", message);
      prepareMessage();
      focus();
     };
    button =
     element.appendChild(main.$.createElement("button", null, "Cancel"));
    button.onclick =
     function ()
     {
      main.clearDialog();
      focus();
     };
    main.showDialog(element, true);
    defaultButton.focus();
   };
  if (!message.match(main.messages.onlyHebrewLettersPattern) &&
      message.replace(main.messages.whitelistEnglishPattern, "")
      .match(main.messages.normalHebrewAsEnglishPattern))
  {
   translatedMessage = main.$.translateHebrewToEnglish(message);
   showConfirmationBox();
   /*translateDecision =
    confirm(
     "Looks like you meant to type in Hebrew. \n" +
     "Here is what I managed to fix -\n" +
     translatedMessage +"\n\n" +
     "Should I send the fixed message?\n\n" +
     "(Clicking Cancel will not send the message at all!\n" +
     "Pressing Escape/clicking on the X button will send the " +
     "original message!)");
   if (translateDecision)
   {
    message = translatedMessage;
   }
   else
   {
    if (translateDecision === false)
    {
     return false;
    }
   }*/
  }
  else
  {
   prepareMessage();
  }
  return false;
 };
main.messages.useCannedMessage =
 function ()
 {
  var cannedMessage, cannedMessageField = main.cannedMessageField,
      message = main.messageField,
      cannedMessageIndex = cannedMessageField.selectedIndex;
  if (cannedMessageIndex === 0)
  {
   return;
  }
  cannedMessage = cannedMessageField.options[cannedMessageIndex];
  message.value =
   cannedMessage.value + (message.value? " - " + message.value: "");
  main.messages.saveCannedMessageOrder(
   cannedMessage.getAttribute("data-index"));
  cannedMessageField.selectedIndex = 0;
  /*jslint sub: true*/
  main.form["notify"].checked = true;
  /*jslint sub: true*/
  main.messages.send();
 };
main.messages.startCheckerTimer =
 function ()
 {
  clearInterval(main.messages.checkerTimer);
  main.messages.checkerTimer =
   setInterval(main.updatePresenceData, main.pingInterval);
 };
/** @this {Element} */
main.messages.removeMessage =
 function (e)
 {
  var element, messageContainer, request, url;
  function showError()
  {
   element.removeAttribute("data-state");
   main.showDialog(
    "The message could not be deleted. :( Try again soon, though!");
  }
  function get(name)
  {
   return main.$.encode(messageContainer.getAttribute("data-" + name));
  }

  main.$.preventDefault(e);

  element = this;
  messageContainer = element.parentNode.parentNode;

  if (element.getAttribute("data-state") === "in-progress")
  {
   return;
  }
  request = main.$.createRequest();
  url =
   "/remove-message?key=" + get("key") +
   "&sender=" + get("sender") + "&recipient=" + get("recipient") +
   (main.testDatabase? "&test=1": "") +
   "&dynamic=1";
  request.open("get", url, true);
  request.onreadystatechange =
   function ()
   {
    if (request.readyState === 4)
    {
     if (request.status === 500)
     {
      showError();
     }
     request.onerror = null;
     request.onreadystatechange = null;
     request = null;
    }
   };
  request.onerror = showError;
  request.send();
  element.setAttribute("data-state", "in-progress");
 };
/** @param {Event} e
    @param {boolean=} queued */
main.messages.fetch =
 function (e, queued)
 {
  var request, url;
  if (e)
  {
   main.$.preventDefault(e);
  }
  request = main.$.createRequest();
  url = "/fetch-more-messages?from=" + main.$.encode(main.userName);
  if (queued)
  {
   url += "&queued=1&timestamp=" + main.$.encode(main.lastMessageTimestamp);
  }
  else
  {
   url += "&timestamp=" + main.$.encode(main.firstMessageTimestamp);
  }
  if (main.testDatabase)
  {
   url += "&test=1";
  }
  request.open("get", url, true);
  request.send({});
  setTimeout(
   function ()
   {
    main.settings.waitingForFetch = false;
   },
   10000);
  main.settings.waitingForFetch = true;
  main.focusMessageField();
 };
/** @param {Array} messageList
    @param {string} firstMessageTimestamp */
main.messages.addOldMessages =
 function (messageList, firstMessageTimestamp)
 {
  if (!messageList.length)
  {
   main.noOldMessages = true;
   main.updateBodyIndicator();
   main.showDialog("There are no older messages.", true);
  }
  main.firstMessageTimestamp = firstMessageTimestamp;
  main.messages.addMultipleMessages(messageList, true);
  main.messages.olderMessageReceptor =
   main.replaceReceptor(main.messages.olderMessageReceptor, true);
 };
/** @param {Array} messageList
    @param {boolean=} old */
main.messages.addMultipleMessages =
 function (messageList, old)
 {
  var i = 0, length;
  /*jslint plusplus: true*/
  for (length = messageList.length; i < length; i++)
  {
  /*jslint plusplus: false*/
  /*jslint sub: true*/
   main.messages.addMessage(
    messageList[i]["value"], messageList[i]["key"],
    messageList[i]["accurate-timestamp"], null, old, i !== length - 1);
  /*jslint sub: false*/
  }
 };
/** @param {Array.<Object>} messageList */
main.messages.addQueuedMessages =
 function (messageList)
 {
  var i;
  main.settings.offline = false;
  main.updateBodyIndicator();
  main.messages.offlineReceptor.innerHTML = "";
  if (main.wasAtScrollBottom)
  {
   window.scrollBy(0, -1);
  }
  /*jslint plusplus: true*/
  for (i = 0; i < messageList.length; i++)
  {
  /*jslint plusplus: false*/
  /*jslint sub: true*/
   if (main.messages.findMessageByKey(messageList[i]["key"]))
   {
  /*jslint sub: false*/
    messageList.splice(i, 1);
    /*jslint plusplus: true*/
    i--;
    /*jslint plusplus: false*/
   }
  }
  main.messages.addMultipleMessages(messageList);
  if (main.wasAtScrollBottom)
  {
   window.scroll(0, main.html.scrollHeight);
  }
 };
/** @param {Object.<string, string>} messageData
    @param {string} key
    @param {?string=} uniqueID
    @param {boolean=} old
    @param {boolean=} doNotNotify */
main.messages.addMessage =
 function (messageData, key, accurateTimestamp, uniqueID, old, doNotNotify)
 {
  /*jslint sub: true*/
  var deleteLink, content = messageData["content"], form = main.form,
      headers, message = main.doc.createElement("div"),
      received = true, sender = messageData["sender"],
      originalTimestamp = messageData["timestamp"],
      timestamp = new Date(originalTimestamp),
      timestampString =
       timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1)+ "-" +
       timestamp.getDate() + " " + timestamp.toLocaleTimeString(),
      messageContent, receptor = main.messages.receptor;
  /*jslint sub: false*/

  if (uniqueID && main.messages.sendMessageCallbacks[uniqueID])
  {
   main.messages.sendMessageCallbacks[uniqueID]();
  }
  received = main.userName !== sender;
  if (sender === main.recipient)
  {
   main.updateRecipientTyping(-1);
  }

  message = main.$.createElement("div", "message" + (!received? " m": ""));
  message.setAttribute("data-key", key);
  message.setAttribute("data-sender", sender);
  /*jslint sub: true*/
  message.setAttribute("data-recipient", messageData["recipient"]);
  /*jslint sub: false*/

  headers =
   message.appendChild(
    main.$.createElement(
     "div", "message-headers",
     "From " + sender + " (" + timestampString + ")"));
  /*jslint sub: true*/
  if (form["manage"].value === "1")
  {
  /*jslint sub: false*/
   headers.appendChild(main.$.createText(" ("));
   deleteLink = main.$.createElement("a", null, "delete");
   deleteLink.href = "#";
   deleteLink.setAttribute("data-action", "remove");
   headers.appendChild(deleteLink);
   headers.appendChild(main.$.createText(")"));
  }

  messageContent =
   message.appendChild(
    main.$.createElement("div", null));
  if (main.$.isRTL(content))
  {
   messageContent.dir = "rtl";
  }
  messageContent.innerHTML = content;
  main.$.linkifyURLs(messageContent);
  // This is a previous message.
  if (old)
  {
   // Previous messages go to the previous message receptor.
   receptor = main.messages.olderMessageReceptor;
  }
  // This stupid feature is suspected to have eaten messages.
  // We cannot really know that no other message was supposed to be received.
  /*// This message was sent by the current user
  // and no other message was recieved yet.
  else if (!received &&
           !receptor.children.length &&
           !main.messages.offlineReceptor.children.length)
  {
   // Inserting the message above the receptor.
   main.messages.messagePane.insertBefore(message, receptor);
   // Removing the reference to the receptor in order not to add to it.
   receptor = null;
   // Setting the last message timestamp.
   main.lastMessageTimestamp = accurateTimestamp;
  }*/
  // We are offline.
  else if (main.settings.offline)
  {
   // New messages in offline mode go to the offline receptor.
   receptor = main.messages.offlineReceptor;
  }
  // Normal message.
  else
  {
   // Setting the last message timestamp.
   main.lastMessageTimestamp = accurateTimestamp;
  }
  // The receptor was not reset.
  if (receptor)
  {
   // Add the message to the receptor.
   receptor.appendChild(message);
  }
  if (!old)
  {
   if (received && !doNotNotify)
   {
    main.messages.notify(!main.wasAtScrollBottom);
   }
   if (main.wasAtScrollBottom)
   {
    main.animateScrollingToTheBottom();
    //main.body.scrollTop = main.html.scrollHeight;
   }
  }
 };
main.messages.iterateThroughMessages =
 function (runAction)
 {
  var elements, i, length;
  if (main.messages.messagePane.querySelectorAll)
  {
   elements = main.messages.messagePane.querySelectorAll(".message");
   /*jslint plusplus: true*/
   for (i = 0, length = elements.length; i < length; i++)
   {
   /*jslint plusplus: false*/
    runAction(elements[i]);
   }
  }
  else
  {
   elements = main.$.tag("div", main.messages.messagePane);
   /*jslint plusplus: true*/
   for (i = 0, length = elements.length; i < length; i++)
   {
   /*jslint plusplus: false*/
    if (elements[i].className === "message")
    {
     runAction(elements[i]);
    }
   }
  }
 };
/** @param {string} key
    @return {Element} */
main.messages.findMessageByKey =
 function (key)
 {
  var messages, i, length;
  if (main.doc.querySelector)
  {
   return main.doc.querySelector("[data-key=\"" + key + "\"]");
  }
  messages = main.$.tag("div", main.messages.messagePane);
  length = messages.length;
  /*jslint plusplus: true*/
  for (i = 0; i < length; i++)
  {
  /*jslint plusplus: false*/
   if (messages[i].getAttribute("data-key") === key)
   {
    return messages[i];
   }
  }
  return null;
 };
main.messages.removeMessageElement =
 function (key)
 {
  var message = main.messages.findMessageByKey(key);
  if (message)
  {
   message.parentNode.removeChild(message);
  }
 };
main.processDesktopCall =
 function (action)
 {
  if (action === "focus")
  {
   main.focusMessageField();
  }
 };
main.initialize();
/*jslint sub: true*/
window["mainAPI"] = {};
window["mainAPI"]["dispatchNotificationAction"] = main.dispatchAction;
window["mainAPI"]["indicateBlockedPopups"] = main.showBlockedPopupMessage;
window["mainAPI"]["hidePopup"] = main.notifications.hide;
if (main.desktop)
{
 window["process"] = main.processDesktopCall;
}
/*jslint sub: false*/
if (MAIN_DEBUG)
{
 main.$.log("Questions & answers?");
 main.$.log("Implement the iPhone audio playback workaround?");
}
// }());