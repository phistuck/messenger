/*jslint sloppy: true, browser: true, white: true,
         maxerr: 999, maxlen: 80, indent: 1, devel: true*/
/*global main, webkitNotifications, escape, unescape*/
/*properties
    $, ActiveXObject, XMLHttpRequest, abort, abortCheckerRequest, action, add,
    addEventListener, altKey, appendChild, atWork, blur, body,
    canPlayType, cancel, 'canned-message', cannedIndicesCookieName,
    cannedMessageField, charCodeAt, checkPermission, checked, checker,
    checkerTimer, checkerTimoutTimer, className, concealedMessageField,
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
    originalChecked, style, direction, handleMessageDirection,
    onkeypressed
*/
if (!window.console)
{
 window.console = {log: function(){}};
}
/** @namespace The main and only global. */
if (!window.main)
{
 window.main = {};
}
/** @namespace Utility functions. */
if (!main.$)
{
 main.$ = {};
}

/** @type {RegExp} */
main.$.letterPattern = new RegExp("^[^a-zA-Z�-�]+", "g");

/** @param {string} id
    @return {Element} */
main.$.id =
 function (id)
 {
  return main.doc.getElementById(id);
 };
/** @param {string} tagName
    @param {Element=} element
    @return {NodeList} */
main.$.tag =
 function (tagName, element)
 {
  return (element || main.doc).getElementsByTagName(
          (tagName || "").toUpperCase());
 };
/** @param {string} tagName
    @param {Element=} element
    @return {Element} */
main.$.firstTag =
 function (tagName, element)
 {
  return main.$.tag(tagName, element)[0] || null;
 };
main.$.isRTL =
 function (content)
 {
  var letters = content.replace(main.$.letterPattern, "");
  return letters.length > 0 && letters.charCodeAt(0) > 1487 &&
         letters.charCodeAt(0) < 1515;
 };
main.$.createRequest =
 function()
 {
  var Request = window.XMLHttpRequest;
  if (Request)
  {
   return new Request();
  }
  else
  {
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
   if (unescape(cookie[0]) === name)
   {
    return unescape(cookie[1]);
   }
  }
 };
/** @param {string} name
    @param {string} value
    @param {Date} expiration */
main.$.setCookie =
 function (name, value, expiration)
 {
  main.doc.cookie =
   escape(name) + "=" + escape(value) + "; expires=" +
   expiration.toGMTString() + "; path=/";
 };

/** @type {Document} */
main.doc = document;

/** @type {Element} */
main.body = main.$.firstTag("body");
/** @type {Element} */
main.form = main.$.firstTag("form");
/** @type {Element} */
main.html = main.doc.documentElement;

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
/** @type {?string} */
main.lastMessageID = null;
/** @type {?string} */
main.location = null;
/*jslint sub: true*/
/** @type {Element} */
main.messageField = main.form["message"];
/*jslint sub: false*/
/** @type {boolean} */
main.newMessages = false;
/*jslint sub: true*/
/** @type {Element} */
main.notifyRecipient = main.form["notify"];
/*jslint sub: false*/
/** @type {Element} */
main.presenceIndication = main.$.id("presence-text");
/** @type {Element} */
main.presenceLocation = main.$.tag("span", main.presenceIndication)[1];
/** @type {Element} */
main.presenceText = main.$.firstTag("span", main.presenceIndication);
/** @type {Element} */
main.refreshArea = main.$.id("refresh-area");
/** @type {Element} */
main.refreshLink = main.$.id("refresh-link");
/** @type {?string} */
main.refreshURL = null;
/** @type {Element} */
main.resumeCheckingLink = main.$.id("resume-checking");
/** @type {Element} */
main.shouldRefreshField = main.$.id("should-refresh");
/** @type {?boolean} */
main.showingPresence = null;
/** @type {?number} */
main.stalePresenceTextTimer = null;
/** @type {Element} */
main.statusMessage = main.$.firstTag("div", main.form);
/** @type {?boolean} */
main.testDatabase = null;
/** @type {boolean} */
main.typing = false;
/** @type {?string} */
main.userName = null;

/** @param {Event} e */
main.handleGlobalShortcuts =
 function (e)
 {
  var alt, key;
  if (!e)
  {
   e = window.event;
  }
  key = e.keyCode;
  alt = e.altKey;

  // Alt+b toggles the concealment of the content.
  if (alt && key === 66)
  {
   main.concealment = !main.concealment;
   if (main.concealedTyping)
   {
    main.concealedTyping = false;
    main.concealedMessageField.blur();
   }
   main.updateBodyIndicator();
  }
  // F2 toggles new message notifications.
  else if (main.newMessages && key === 113)
  {
   main.messages.confirmRead();
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
main.reply =
 function ()
 {
  main.messageField.focus();
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
  }
  main.body.className = classList.join(" ");
 };
/** @param {?string} presenceText */
main.updatePresenceText =
 function (presenceText)
 {
  function markPresenceTextAsStale()
  {
   main.presenceText.innerHTML +=
    " (<ins>inaccurate</ins>)";
  }
  if (main.stalePresenceTextTimer)
  {
   clearTimeout(main.stalePresenceTextTimer);
  }
  if (presenceText)
  {
   main.presenceText.innerHTML = presenceText;
   main.stalePresenceTextTimer =
    setTimeout(
     markPresenceTextAsStale,
     (presenceText.match("is here now")? 10000: 100000));
   if (!main.showingPresence)
   {
    main.showingPresence = true;
    main.presenceIndication.className = "";
   }
  }
 };
/** @param {?string} presenceLocation */
main.updatePresenceLocation =
 function (presenceLocation)
 {
  if (presenceLocation)
  {
   main.presenceLocation.innerHTML = " (" + presenceLocation + ")";
  }
 };
if (!main.notifications)
{
 main.notifications = {};
}
/** @type {boolean} */
main.notifications.enabled = false;
/** @type {Notification} */
main.notifications.notification = null;
/** @type {Element} */
main.notifications.requestPermissionLink =
 main.$.id("request-notification-permission");
/** @type {Object|Element} */
main.notifications.sound = null;
/** @type {string}
    @const */
main.notifications.soundURL = "/notification.mp3";
/** @type {Element} */
main.notifications.settings = main.$.id("notification-settings");
/** @type {Element} */
main.notifications.toggleField = main.$.id("show-notifications");

main.notifications.play =
 function ()
 {
  var sound = main.notifications.sound, url = main.notifications.soundURL;
  if (!sound.flash &&
      (sound.parentNode ||
       sound.html5))
  {
   sound.play();
  }
  else
  {
   if (!sound.html5)
   {
    sound = main.notifications.sound = main.doc.createElement("embed");
    sound.width = 1;
    sound.height = 1;
    sound.src = url;
    sound = main.notifications.sound = main.body.appendChild(sound);
    if (!sound.play)
    {
     sound.parentNode.removeChild(sound);
     sound = main.notifications.sound = main.doc.createElement("embed");
     sound.id = "audible-notification";
     sound.name = "audible-notification";
     sound.width = 1;
     sound.height = 1;
     sound.flash = true;
     sound.type = "application/x-shockwave-flash";
     sound.setAttribute(
      "flashvars", "file=" + url + "&autostart=true");
     sound.setAttribute("allowscriptaccess", "always");
     sound.src = "player.swf";
     sound = main.notifications.sound = main.body.appendChild(sound);
    }
   }
  }
 };
main.notifications.initialize =
 function ()
 {
  function cancel()
  {
   main.notifications.notification.cancel();
  }
  function toggle()
  {
   if (main.notifications.toggleField.checked)
   {
    main.notifications.enabled = true;
   }
   else
   {
    main.notifications.enabled = false;
   }
  }
  main.notifications.notification =
   webkitNotifications.createNotification(
    "", "Messenger", "A message was received.");
  main.doc.addEventListener("scroll", cancel, true);
  main.doc.addEventListener("resize", cancel, true);
  main.doc.addEventListener("UIEvent", cancel, true);
  main.doc.addEventListener("KeyEvent", cancel, true);
  main.doc.addEventListener("MouseEvent", cancel, true);
  main.notifications.toggleField.addEventListener("click", toggle, true);
  main.notifications.settings.className = "";
  main.notifications.requestPermissionLink.className = "hidden";
 };
main.notifications.prepare =
 function ()
 {
  function checkNotificationPermission()
  {
   if (webkitNotifications.checkPermission() === 0)
   {
    main.notifications.toggleField.checked = true;
    main.notifications.enabled = true;
    main.notifications.initialize();
    return true;
   }
  }
  if (window.webkitNotifications)
  {
   if (!checkNotificationPermission())
   {
    main.notifications.requestPermissionLink.className = "";
    main.notifications.requestPermissionLink.onclick =
     function ()
     {
      webkitNotifications.requestPermission(checkNotificationPermission);
      return false;
     };
   }
  }
  else
  {
   main.notifications.settings.className = "hidden";
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
   sound.src = main.notifications.soundURL;
   sound.load();
  }
  main.notifications.sound = sound;
 };

if (!main.messages)
{
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
main.messages.checkerTimoutTimer = null;
/** @type {?number} */
main.messages.glowTimer = null;
/** @type {XMLHttpRequest|ActiveXObject} */
main.messages.newRequest = null;
/** @type {number} */
main.messages.newRequestRetries = 1;
/** @type {string}
    @const */
main.messages.newURL = "IM/get-unread-messages.asp";
/** @type {Element} */
main.messages.receptor = main.$.id("message-receptor");
/** @type {XMLHttpRequest|ActiveXObject} */
main.messages.sendRequest = null;
/** @type {string} */
main.messages.sendURL = main.form.action;

/** @param {string} messageID
    @param {string} sender
    @param {string} content
    @param {boolean} received */
main.messages.add =
 function (messageID, sender, messageDate, content, received)
 {
  var receptor, messageContainer, messagePrefix = "", messageSuffix = "";
      
  if (main.$.isRTL(content))
  {
   messagePrefix = "<span dir=\"rtl\">";
   messageSuffix = "</span>";
  }
  if (received)
  {
   main.lastMessageID = messageID;
  }
  receptor = main.messages.receptor;
  messageContainer = main.doc.createElement("DIV");
  if (!received)
  {
   messageContainer.className = "m";
  }
  messageContainer.innerHTML =
   "From " + sender + " (" + messageDate + ")<br/>" +
   messagePrefix + content + messageSuffix +
   '<br/><a onclick="reply()" href="#top">Reply</a> ' +
   '<a href="' + main.refreshURL + (new Date().getTime()) + '">Refresh</a>';
  receptor.insertBefore(messageContainer, main.$.firstTag("div", receptor));
 };
main.messages.checker =
 function ()
 {
  /** @type {XMLHttpRequest|ActiveXObject} */
  var request = main.messages.newRequest;
  if (!request || request.readyState === 4)
  {
   request = main.messages.newRequest = main.$.createRequest();
   request.onerror = main.messages.confirmContinueChecking;
   request.onreadystatechange = main.messages.confirmNew;
   request.open(
    "GET",
    main.messages.newURL + "?mid=" + escape(String(main.lastMessageID)) +
    "&user=" + escape(String(main.userName)) +
    (main.messageField.value.length? "&typing=1": "") +
    (main.atWork? "&work=1": "") + "&partner=" + escape(main.recipient) +
    (main.location? "&location=" + escape(String(main.location)): "") +
    (main.testDatabase? "&testdb=yes": "") +
    "&now=" + (new Date().getTime()),
    true);
   request.send(null);
   main.messages.checkerTimoutTimer =
    setTimeout(main.messages.abortCheckerRequest, 10000);
  }
 };
main.messages.abortCheckerRequest =
 function ()
 {
  main.messages.newRequest.abort();
  main.messages.newRequest = null;
  main.messages.confirmContinueChecking();
 };
main.messages.confirmContinueChecking =
 function ()
 {
  /*jslint plusplus: true*/
  main.messages.newRequestRetries++;
  /*jslint plusplus: false*/
  if (main.messages.newRequestRetries > 4)
  {
   main.messages.newRequestRetries = 1;
   clearInterval(main.messages.checkerTimer);
   if (!confirm(
         "There was a network error. Do you want to continue checking?\n\n" +
         "No worries, you can resume at any time."))// and if you forget, " +
         //"I will try again within 5 minutes."))
   {
    main.resumeCheckingLink.className = "";
   }
   else
   {
    main.messages.startCheckerTimer();
   }
  }
 };
main.messages.confirmNew =
 function ()
 {
  var recipientTyping, request = main.messages.newRequest, state;
  if (request.readyState > 1)
  {
   clearTimeout(main.messages.checkerTimoutTimer);
   if (request.readyState === 4)
   {
    if (request.status !== 200 && request.status !== 304)
    {
     main.messages.confirmContinueChecking();
    }
    else
    {
     if (request.status === 200)
     {
      main.messages.process(request.responseText, true);
      main.messages.notify();
     }
     state = request.statusText.split("|");
     main.updatePresenceText(state[1]);
     main.updatePresenceLocation(state[2]);
     recipientTyping = state[0] === "1";
     if (main.typing !== recipientTyping)
     {
      main.typing = recipientTyping;
      main.updateBodyIndicator();
     }
     main.messages.newRequestRetries = 1;
    }
    main.messages.newRequest = null;
   }
  }
 };
main.messages.confirmRead =
 function ()
 {
  var newReceptor;
  if (main.messages.glowTimer)
  {
   main.messages.glowTimer = clearInterval(main.messages.glowTimer);
  }
  main.newMessages = false;
  main.updateBodyIndicator();
  if (main.notifications.enabled)
  {
   main.notifications.notification.cancel();
  }
  main.messages.confirmReadButton.className = "hidden";
  main.messages.receptor.id = "";
  newReceptor = main.doc.createElement("DIV");
  newReceptor.id = "message-receptor";
  main.messages.receptor =
   main.messages.receptor.parentNode.insertBefore(
    newReceptor, main.messages.receptor);
  main.doc.title = main.doc.originalTitle;
  return false;
 };
main.messages.confirmSent =
 function ()
 {
  var request = main.messages.sendRequest;
  if (request.readyState === 4)
  {
   if (request.status === 200)
   {
    main.messages.process(request.responseText, false);
    if (!main.newMessages)
    {
     main.messages.confirmRead();
    }
    if (request.originalMessage === main.messageField.value)
    {
     main.messageField.value = "";
    }
    if (main.notifyRecipient.checked === main.notifyRecipient.originalChecked)
    {
     main.notifyRecipient.checked = false;
    }
    main.statusMessage.innerHTML = request.statusText;
    main.messages.sendRequest = null;
   }
   else
   {
    main.messages.sendManually();
   }
  }
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
main.messages.handleMessageDirection =
 function ()
 {
  var message = main.messageField;
  message.style.direction = main.$.isRTL(message.value)? "rtl": "ltr";
 };
/** @param {Event} e
    @return {?boolean|undefined} */
main.messages.handleMessageFieldKeys =
 function (e)
 {
  var concealed = main.concealedMessageField, key,
      message = main.messageField, source;
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
  if (e.altKey && key === 66)
  {
   return false;
  }
  else if (key === 13 && !e.shiftKey)
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
   main.messages.send();
   if (e.preventDefault)
   {
    e.preventDefault();
   }
   return false;
  }
 };
main.messages.loadCannedMessageOrder =
 function ()
 {
  var cannedIndices = main.$.getCookie(main.messages.cannedIndicesCookieName),
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
main.messages.notify =
 function ()
 {
  if (main.messageField.value.length === 0 &&
      main.shouldRefreshField.checked)
  {
   window.location.href = main.refreshURL + "&refresh=on";
  }
  else
  {
   if (!main.messages.glowTimer)
   {
    main.messages.glowTimer = setInterval(main.messages.glow, 1000);
   }
   if (main.notifications.enabled)
   {
    main.notifications.notification.cancel();
    main.notifications.notification.show();
   }
   main.notifications.play();
   main.newMessages = true;
   main.updateBodyIndicator();
   main.refreshLink.className = "";
   main.doc.title = "1";
   main.messages.confirmReadButton.className = "";
  }
 };
main.messages.process =
 function (messages, received)
 {
  var i = 0, length, messageData;
  messages = messages.split("``");
  /*jslint plusplus: true*/
  for (length = messages.length; i < length - 1; i++)
  {
  /*jslint plusplus: false*/
   messageData = messages[i].split("`");
   main.messages.add(
    messageData[0], messageData[1], messageData[2], messageData[3], received);
  }
 };
/** @param {number} index */
main.messages.saveCannedMessageOrder =
 function (index)
 {
  var cannedIndices, expiration, i = 0, length,
      name = main.messages.cannedIndicesCookieName;
  cannedIndices = main.$.getCookie(name);
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
  main.$.setCookie(name, cannedIndices, expiration);
};
main.messages.sendManually =
 function ()
 {
  main.form.submit();
 };
main.messages.send =
 function ()
 {
  var message = main.messageField.value,
      notify = main.notifyRecipient.checked, request;
  if (message || notify)
  {
   request = main.messages.sendRequest = main.$.createRequest();
   request.originalMessage = message;
   request.open("POST", main.messages.sendURL, true);
   request.setRequestHeader(
    "Content-Type", "application/x-www-form-urlencoded");
   request.onreadystatechange = main.messages.confirmSent;
   request.onerror = main.messages.sendManually;
   request.send(
    "from=" + escape(String(main.userName)) + "&to=" + escape(main.recipient) +
    (notify? "&notify=on": "") +
    "&message=" + encodeURIComponent(request.originalMessage) +
    (main.location? "&location=" + main.location: "") +
    "&dynamic=1");
   main.notifyRecipient.originalChecked = main.notifyRecipient.checked;
   main.statusMessage.innerHTML = "";
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
  //main.form.notify.checked = true;
  main.messages.send();
 };
main.messages.startCheckerTimer =
 function ()
 {
  main.messages.checkerTimer =
   setInterval(main.messages.checker, 3000 * main.messages.newRequestRetries);
  main.resumeCheckingLink.className = "hidden";
  return false;
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
    main.location = position.coords.latitude + "," + position.coords.longitude;
   }
   navigator.geolocation.getCurrentPosition(storeLocation);
  }
  if (navigator.geolocation)
  {
   checkLocation();
   setInterval(checkLocation, 60000);
  }
  main.lastMessageID = get("last-message-id");
  main.userName = get("user-name");
  main.recipient = get("recipient");
  main.refreshURL = get("current-url");
  main.atWork = get("at-work") === "1";
  main.testDatabase = get("test-database") === "yes";
  main.notifications.prepare();
  main.cannedMessageField.onchange = main.messages.useCannedMessage;
  main.messages.confirmReadButton.onclick = main.messages.confirmRead;
  main.resumeCheckingLink.onclick = main.messages.startCheckerTimer;
  main.messages.startCheckerTimer();
  main.messages.loadCannedMessageOrder();
  main.messageField.onkeydown = main.messages.handleMessageFieldKeys;
  main.messageField.onkeyup = main.messages.handleMessageDirection;
  main.concealedMessageField.onkeyup = main.messages.copyConcealedMessage;
  main.form.onsubmit = main.messages.send;
  main.notifications.initializeSound();
  main.html.onkeydown = main.handleGlobalShortcuts;
  main.doc.originalTitle = main.doc.title;
 };
//main.initialize();
console.log(
 "Do not forget to automatically notify when using a canned message!");
/*jslint sub: true*/
window["reply"] = main.reply;
/*jslint sub: false*/

var newMessageInterval, channel;
function removeMessage(element, key)
{
 function showError()
 {
  document.getElementById("error").innerHTML =
  "The message could not be deleted. :( Try again soon, though!";
 }
 var request = new XMLHttpRequest();
 request.open(
  "get",
  "/remove-message?key=" + element.parentNode.parentNode.getAttribute("data-key") +
  "&test=" + encodeURIComponent(document.forms[0].test.value) +
  "&dynamic=1", true);
 request.onreadystatechange =
  function ()
  {
   if (request.readyState === 4)
   {
    if (request.status === 200)
    {
     element.parentNode.parentNode.parentNode.removeChild(
      element.parentNode.parentNode);
    }
    else if (request.status === 500)
    {
     showError()
    }
    request = null;
   }
  };
 request.onerror = showError;
 request.send();
}
function handleMessage(message)
{
 var data = ((window.JSON && JSON.parse) || eval)(message.data);
 switch (data.type)
 {
  case "message":
   addNewMessage(data.message);
 }
}
function addNewMessage(messageData)
{
 var message = document.createElement("div"),
     receptor = document.getElementById("receptor"),
     timestamp = new Date(messageData.timestamp),
     timestampString =
      timestamp.getFullYear() + "-" + timestamp.getMonth() + "-" +
      timestamp.getDate() + " " + timestamp.toLocaleTimeString();
 message.className =
  document.forms[0].from.value === messageData.sender? "m": "";
 message.innerHTML =
  "From " + messageData.sender + " (" + timestampString + ")<br/>" +
  messageData.content;
 receptor.insertBefore(message, receptor.firstChild);
 if (!newMessageInterval && message.className !== "m")
 {
  newMessageInterval =
   setInterval(
    function ()
    {
     document.title = (parseInt(document.title, 10) || 0) + 1;
    }, 1000);
  document.body.className = "new";
 }
 if (message.className !== "m")
 {
  sound.play();
 }
}
var sound = document.createElement("audio");
if (sound.canPlayType &&
    sound.canPlayType("audio/mp3") !== "")
{
 sound.html5 = true;
 sound = document.body.appendChild(sound);
 sound.src = "/notification.mp3";
 sound.load();
}

document.onkeydown =
 function (e)
 {
  if (document.body.className === "new" && (e || event).keyCode === 113)
  {
   confirmRead();
  }
 };
function confirmRead()
{
 newMessageInterval = clearInterval(newMessageInterval);
 document.title = "Blank";
 document.body.className = "";
 var receptor = document.getElementById("receptor")
 receptor.id = "";
 var newReceptor = document.createElement("div");
 newReceptor.id = "receptor";
 receptor.parentNode.insertBefore(newReceptor, receptor);
}
document.forms[0].onsubmit =
 function ()
 {
  sendMessage(
   this.from.value, this.to.value, this.content.value,
   (this.notify.checked? "on": "off"), this.test.value, this.manage.value);
  return false;
 };
function sendMessage(from, to, content, notify, test, manage, retry)
{
 function again()
 {
  setTimeout(
   function ()
   {
    sendMessage(from, to, content, notify, test, manage, retry + 1);
   },
   1000);
 }
 var request = new XMLHttpRequest();
 retry = retry || 0;
 if (retry > 2)
 {
  document.getElementById("error").innerHTML =
   "Sorry, the message could not be sent. :(";
  return;
 }
 else
 {
  document.getElementById("error").innerHTML = "";
 }
 request.open("post", "/send-message", true)
 request.setRequestHeader(
  "Content-Type", "application/x-www-form-urlencoded");
 request.onreadystatechange =
  function ()
  {
   if (request.readyState === 4)
   {
    if (request.status === 200)
    {
     if (content === document.forms[0].content.value)
     {
      document.forms[0].content.value = "";
     }
     if (document.forms[0].notify.checked === (notify === "on"))
     {
      document.forms[0].notify.checked = false;
     }
    }
    else if (request.status === 500)
    {
     again();
    }
    request = null;
   }
  };
 request.onerror = again;
 request.send(
  "from=" + encodeURIComponent(from) +
  "&to=" + encodeURIComponent(to) +
  "&content=" + encodeURIComponent(content) +
  "&notify=" + encodeURIComponent(notify) +
  "&test=" + encodeURIComponent(test) +
  "&manage=" + encodeURIComponent(manage) +
  "&dynamic=1");
 return false;
}
function reclaimToken()
{
 var request = new XMLHttpRequest();
 request.onreadystatechange =
  function ()
  {
   if (request.readyState === 4 && request.status === 200)
   {
    createChannel(request.responseText);
    request = null;
   }
  };
 request.open(
  "get",
  "/reclaim-channel-token?from=" +
  encodeURIComponent(document.forms[0].from.value),
  true);
 request.send(null);
}
function createChannel(token)
{
 channel = new goog.appengine.Channel(token);
 channel.open(
  {
   onopen:
    function ()
    {
     console.log("open");
    },
   onclose:
    function ()
    {
     console.log("close");
    },
   onerror: reclaimToken,
   onmessage: handleMessage
  });
}
createChannel(document.documentElement.getAttribute("data-channel-name"));