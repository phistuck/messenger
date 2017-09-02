/*jslint sloppy: true, browser: true, white: true,
         maxerr: 999, maxlen: 80, indent: 1, devel: true*/
/*global main, webkitNotifications, escape, unescape, goog, Notification */
/*eslint-env browser */
/*eslint-disable no-extra-parens */
/** @define {boolean} */
var MAIN_DEBUG = true;

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
/** @namespace The global main. */
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

/** @type {undefined} */
main.$.notDefined = void 0;
/** @const {string} */
main.urlEncodedMimeType = "application/x-www-form-urlencoded";
/** @type {RegExp} */
main.$.letterPattern = null;
/** @type {RegExp} */
main.$.whitespacePattern = null;
/** @type {RegExp} */
main.$.urlPattern =
 new RegExp("((ftp|https|http)://|www\\.[א-תa-zA-Z])[^ \\n\\r'\"]+", "gi");
/** @type {RegExp} */
main.$.manualURLPattern = null;
/** @type {Array.<RegExp>} */
main.$.englishLetterPatterns = null;
/** @type {Array.<RegExp>} */
main.$.englishSymbolPatterns = null;
/** @type {RegExp} */
main.$.parenthesesPattern = null;
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
 /** @param {*} message
     @param {*=} message2 
     @param {*=} message3 */
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
  return (elementOrDocument === null || !tagName)?
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
    @param {Document=} documentNode
    @returns {Text} */
main.$.createText =
 function (text, documentNode)
 {
  return (documentNode || main.doc).createTextNode(text);
 };
/** @param {string} elementName
    @param {?string=} className
    @param {?string=} text
    @param {Document=} optionalDocumentNode
    @returns {Element} */
main.$.createElement =
 function (elementName, className, text, optionalDocumentNode)
 {
  var documentNode = optionalDocumentNode || main.doc;
  var element = documentNode.createElement(elementName);
  if (className)
  {
   element.className = className;
  }
  if (text)
  {
   element.appendChild(main.$.createText(text, documentNode));
  }
  return element;
 };
/** @param {string} content
    @returns {boolean} */
main.$.isRTL =
 function (content)
 {
  var /** @type {string} */ letters;
  if (!main.$.letterPattern)
  {
   main.$.letterPattern = new RegExp("^[^a-zא-ת]+", "gi");
  }
  letters  = content.replace(main.$.letterPattern, "");
  return letters.length > 0 && letters.charCodeAt(0) > 1487 &&
         letters.charCodeAt(0) < 1515;
 };
/** @param {string} originalText
    @returns {string} */
main.$.translateHebrewToEnglish =
 function (originalText)
 {
  var /** @const {string} */ englishKeys = "azsxedcrfvtgbyhnujmikolp;",
      /** @const {string} */ hebrewKeys = "שזדסקגברכהאענטימוחצןלםךפף",
      /** @const {string} */ englishSymbolKeys = ",.'/qw",
      /** @const {string} */ hebrewSymbolKeys = "תץ,./'",
      /** @type {number} */ letterLength = englishKeys.length,
      /** @type {number} */ symbolLength = englishSymbolKeys.length,
      /** @type {number} */ i,
      /** @type {number} */ j,
      /** @type {string} */ character,
      /** @type {Array<string>} */ texts,
      /** @type {string} */ text,
      /** @type {number} */ textItemCount,
      /** @type {string} */ translatedText;

  /** @param {string} character */
  function reverseParentheses(character)
  {
   return character === "("? ")": "(";
  }
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

  // Support for URLs within these cases.
  if (originalText.match(main.$.urlPattern))
  {
   if (!main.$.manualURLPattern)
   {
    main.$.manualURLPattern =
     new RegExp(
      "ftp://[^ \\n\\r'\"]+|https://[^ \\n\\r'\"]+|" +
      "http://[^ \\n\\r'\"]+|www\\.[א-תa-zA-Z][^ \\n\\r'\"]+", "gi");
   }
   texts = originalText.split(main.$.manualURLPattern);
  }
  else
  {
   texts = /** @type {Array<string>} */ ([originalText]);
  }
  textItemCount = texts.length;
  /*jslint plusplus: true*/
  for (j = 0; j < textItemCount; j++)
  {
  /*jslint plusplus: false*/
   text = texts[j];
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
   if (!main.$.parenthesesPattern)
   {
    main.$.parenthesesPattern = new RegExp("[()]", "g");
   }
   text =
    text.replace(main.$.parenthesesPattern, reverseParentheses);
   translatedText = originalText.replace(texts[j], text);
  }
  return translatedText;
 };
/** @param {Element} element
    @param {function(Element):boolean} isValidElementFilter
    @param {function(Text, Element)} runAction */
main.$.findTextNodes =
 function (element, isValidElementFilter, runAction)
 {
  var /** @type {number} */ i,
      /** @type {NodeList<Element>} */ children =
       /** @type {NodeList<Element>} */ (element.childNodes),
      /** @type {number} */ childCount = children.length,
      /** @type {Node} */ currentNode;
  /*jslint plusplus: true*/
  for (i = 0; i < childCount; i++)
  {
   currentNode = /** @type {Node} */ (children[i]);
  /*jslint plusplus: true*/
   if (currentNode.nodeType === 1)
   {
    if (isValidElementFilter && !isValidElementFilter(element))
    {
     break;
    }
    main.$.findTextNodes(
     /** @type {Element} */ (currentNode), isValidElementFilter, runAction);
   }
   if (currentNode.nodeType === 3)
   {
    runAction(/** @type {Text} */ (currentNode), element);
   }
  }
 };
/** @param {Element} eContent */
main.$.linkifyURLs =
 function (eContent)
 {
  main.$.findTextNodes(
   eContent,
   /** @param {Element} foundElement
       @returns {boolean} */
   function (foundElement)
   {
    return foundElement.tagName !== "A";
   },
   /** @param {Text} textNode
       @param {Element} containingElement */
   function (textNode, containingElement)
   {
    var /** @type {number} */ i,
        /** @type {Array<string>} */ urls,
        /** @type {number} */ urlCount,
        /** @type {string} */ text,
        /** @type {string} */ html,
        /** @type {Element} */ element,
        /** @type {Node} */ linkifiedNode,
        /** @type {string} */ url;

    html = text = textNode.nodeValue;
    urls = html.match(main.$.urlPattern);
    if (urls)
    {
     /*jslint plusplus: true*/
     for (i = 0, urlCount = urls.length; i < urlCount; i++)
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
      linkifiedNode = element = main.$.createElement("span");
      element.innerHTML = html;
      if (element.childNodes.length === 1)
      {
       linkifiedNode = /** @type {Text} */ (element.childNodes[0]);
      }
      containingElement.replaceChild(linkifiedNode, textNode);
     }
    }
   });
 };
/** @returns {!XMLHttpRequest} */
main.$.createRequest =
 function ()
 {
  var /** @type {function(new:XMLHttpRequest)} */
      HTTPRequest = window.XMLHttpRequest,
      /** @type {function(new:XMLHttpRequest, string, string=)} */
      ActiveX;

  if (HTTPRequest)
  {
   return new HTTPRequest();
  }
  ActiveX =
   /** @type {function(new:XMLHttpRequest, string, string=)} */
   (window.ActiveXObject);

  if (ActiveX)
  {
   try
   {
    return new ActiveX("Msxml2.XMLHTTP.6.0");
   }
   catch (e1)
   {
    try
    {
     return new ActiveX("Msxml2.XMLHTTP.3.0");
    }
    catch (e2)
    {
     try
     {
      return new ActiveX("Msxml2.XMLHTTP");
     }
     catch (e3)
     {
      try
      {
       return new ActiveX("Microsoft.XMLHTTP");
      }
      catch (e4)
      {
      }
     }
    }
   }
  }
  alert("You have a weirdly old browser. Sorry, bye.");
  throw new Error("The browser is missing an HTTP request sending method.");
 };
/** @param {string} cookieName
    @returns {?string|undefined} */
main.$.getCookie =
 function (cookieName)
 {
  var /** @type {Array<string>} */ cookie,
      /** @type {Array<string>} */
      cookies = main.doc.cookie.split(/[\s]*;[\s]*/g),
      /** @type {number} */ i,
      /** @type {number} */ cookieCount = cookies.length;
  /*jslint plusplus: true*/
  for (i = 0; i < cookieCount; i++)
  {
  /*jslint plusplus: false*/
   cookie = cookies[i].split("=");
   if (main.$.decode(cookie[0]) === cookieName)
   {
    return main.$.decode(cookie[1]);
   }
  }
  return;
 };
/** @param {?string} text
    @returns {?string} */
main.$.decode =
 function (text)
 {
  return text? decodeURIComponent(text): null;
 };
/** @param {?string} text
    @returns {?string} */
main.$.encode =
 function (text)
 {
  return text? encodeURIComponent(text): null;
 };
/** @param {string} cookieName
    @param {string|number|boolean} value
    @param {Date=} expiration */
main.$.setCookie =
 function (cookieName, value, expiration)
 {
  main.doc.cookie =
   main.$.encode(cookieName) + "=" + main.$.encode(String(value)) + "; " +
   (expiration? "expires=" + expiration.toUTCString() + "; ": "") + "path=/";
 };
/** @param {string} key
    @returns {?string|undefined} */
main.$.load =
 function (key)
 {
  if (main.support.storage)
  {
   if (window.sessionStorage &&
       typeof window.sessionStorage[key] === "string")
   {
    return window.sessionStorage[key];
   }
   if (window.localStorage &&
       typeof window.localStorage[key] === "string")
   {
    return window.localStorage[key];
   }
  }
  return main.$.getCookie(key);
 };
/** @param {string} key
    @param {string|number|boolean} value
    @param {Date=} expiration */
main.$.save =
 function (key, value, expiration)
 {
  var /** @type {Storage} */ storage;
  if (main.support.storage)
  {
   storage = (!expiration && window.sessionStorage) || window.localStorage;
   storage[key] = value;
  }
  else
  {
   main.$.setCookie(key, value, expiration);
  }
 };
/** @param {Event} e */
main.$.preventDefault =
 function (e)
 {
  if (e.preventDefault)
  {
   e.preventDefault();
  }
  else
  {
   e.returnValue = false;
  }
 };
/** @param {!Function} task */
main.$.scheduleTask =
 function (task)
 {
  if (window.requestIdleCallback)
  {
   window.requestIdleCallback(task, {timeout: 1});
  }
  else if (window.setImmediate)
  {
   window.setImmediate(task);
  }
  else if (window.msSetImmediate)
  {
   window.msSetImmediate(task);
  }
  else
  {
   setTimeout(task, 0);
  }
 };
/** @param {string} originalTimestamp
    @return {Date} */
main.$.parseDateString =
 function (originalTimestamp)
 {
  var /** @type {Date} */ timestamp = new Date(originalTimestamp);
  if (!isNaN(timestamp))
  {
   return timestamp;
  }
  timestamp = new Date(originalTimestamp.replace(/\.\d+/g, ""));
  /*jslint regexp: true*/
  timestamp.setMilliseconds(
   parseInt(originalTimestamp.replace(/^.+\.(\d+) .+$/g, "$1"), 10));
  return timestamp;
 };
  /*jslint regexp: false*/
/** @param {string} string
    @returns {Object|Array|string|boolean|number} */
main.$.parseJSON =
 function (string)
 {
  try
  {
   if (window.JSON)
   {
    return /** @type {Object|Array|string|boolean|number} */ (
            JSON.parse(string));
   }
   /*jslint evil: true*/
   return /** @type {Object|Array|string|boolean|number} */ (eval(string));
  }
  catch (e)
  {
   /*jslint evil: false*/
   return "";
  }
 };

/** @type {!Document} */
main.doc = document;

/** @type {Element} */
main.body = main.$.firstTag("body");
/** @type {Element} */
main.dialog = main.$.id("dialog");
/** @type {HTMLFormElement} */
main.form = /** @type {HTMLFormElement} */ (main.doc.forms["messaging-form"]);
/** @type {Element} */
main.html = main.doc.documentElement;
/** @type {string} */
main.version = "";
/** @type {goog.appengine.Socket} */
main.socket = null;
/** @type {string} */
main.channelToken = "";
/** @type {boolean} */
main.atWork = false;
/** @type {HTMLSelectElement} */
main.cannedMessageField =
/** @type {HTMLSelectElement} */ (main.form["canned-message"]);
/** @type {HTMLTextAreaElement} */
main.concealedMessageField =
 /** @type {HTMLTextAreaElement} */ (main.$.id("concealed-message"));
/** @type {boolean} */
main.concealedTyping = false;
/** @type {boolean} */
main.concealment = false;
/** @type {boolean} */
main.wasAtScrollBottom = false;
/** @type {boolean} */
main.normalMessenger = true;
/** @type {boolean} */
main.initialState = false;
/** @type {string} */
main.firstMessageTimestamp = "";
/** @type {string} */
main.lastMessageID = "";
/** @type {string} */
main.originalTitle = main.doc.title || "";
/** @type {string} */
main.lastMessageTimestamp = "";
/** @type {Date} */
main.lastMessageTimestampDate = null;
/** @type {number} */
main.lastTypingIndicationTimestamp = (new Date()).getTime() - 5000;
/** @type {number} */
main.lastConnectivitySignalTimestamp = (new Date()).getTime() - 30000;
/** @type {string} */
main.location = "";
/*jslint sub: true*/
/** @type {!HTMLTextAreaElement} */
main.messageField = main.form["content"];
/** @type {!HTMLButtonElement} */
main.thinkingButton =
 /** @type {!HTMLButtonElement} */ (main.$.id("thinking"));
/*jslint sub: false*/
/** @type {boolean} */
main.newMessages = false;
/** @type {boolean} */
main.noOldMessages = false;
/*jslint sub: true*/
/** @type {!HTMLInputElement} */
main.notifyRecipient = main.form["notify"];
/*jslint sub: false*/
/** @type {!Element} */
main.presenceIndication =
 /** @type {!Element} */ (main.$.id("presence-data"));
/** @type {!Element} */
main.presenceLocation =
 /** @type {!Element} */ (main.$.id("presence-location"));
/** @type {!Element} */
main.presenceStatus =
 /** @type {!Element} */ (main.$.id("presence-state"));
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
/** @type {!Element} */
main.resumeCheckingLink =
 /** @type {!Element} */ (main.$.id("resume-checking"));
/** @type {!Element} */
main.shouldRefreshField =
 /** @type {!Element} */ (main.$.id("should-refresh"));
/** @type {number} */
main.connectivityTimeoutTimer = 0;
/** @type {XMLHttpRequest} */
main.reclaimTokenRequest = null;
/** @type {number} */
main.stalePresenceTextTimer = 0;
/** @type {boolean} */
main.testDatabase = false;
/** @type {boolean} */
main.desktop = false;
/** @type {boolean} */
main.typing = false;
/** @type {boolean} */
main.recipientThinking = false;
/** @type {string} */
main.userName = "";
/** @type {string} */
main.notificationURL = "";
/** @type {string} */
main.getTimeURL = "";
/** @type {string} */
main.removeMessageURL = "";
/** @type {string} */
main.fetchMoreMessagesURL = "";
/** @type {string} */
main.reclaimTokenURL = "";
/** @type {string} */
main.reportURL = "";
/** @type {string} */
main.signOutURL = "";
/** @type {string} */
main.normalIcon = "";
/** @type {string} */
main.newMessageIcon = "";
/** @type {string} */
main.currentIcon = "";
/** @type {HTMLLinkElement} */
main.eIcon = null;
/** @type {Array<string>} */
main.otherConversationDetails = [];
/** @type {Element} */
main.eOtherConversations = main.$.id("other-conversations");
/** @type {boolean} */
main.otherConversations = false;
/** @type {{localTime: number, serverTime: number}} */
main.timeSynchronization =
 {
  localTime: 0,
  serverTime: 0
 };

main.updateSynchronizedTime =
 function ()
 {
  var /** @type {XMLHttpRequest} */ request = main.$.createRequest(),
      /** @type {number} */ timer;

  /** @param {number} local
      @param {number} server */
  function setTime(local, server)
  {
   main.timeSynchronization.localTime = local;
   main.timeSynchronization.serverTime = server;
  }

  request.open("get", main.getTimeURL, true);
  request.timeout = 5000;
  request.onreadystatechange =
   function ()
   {
    if (request.readyState === 4 && request.status === 200)
    {
     clearTimeout(timer);
     setTime(
      (new Date()).getTime(),
      main.$.parseDateString(request.responseText).getTime());
    }
   };
  timer =
   setTimeout(
    function ()
    {
     request.onreadystatechange = null;
     request = null;
     setTime(0, 0);
    },
    5000);
   request.send();
 };
/** @param {boolean} newMessage */
main.updateIcon =
 function (newMessage)
 {
  var /** @type {HTMLLinkElement} */ eIcon;
  if (!newMessage && (main.currentIcon === main.normalIcon))
  {
   return;
  }
  if (!main.eIcon)
  {
   eIcon = /** @type {HTMLLinkElement} */ (main.$.createElement("link"));
   eIcon.setAttribute("rel", "icon");
   eIcon.setAttribute("href", main.currentIcon);
   eIcon.setAttribute("type", "image/x-icon");
   eIcon =
    /** @type {HTMLLinkElement} */
    (main.doc.head.insertBefore(main.eIcon, main.doc.head.firstChild));

   main.eIcon = eIcon;
  }
  main.currentIcon =
   main.eIcon.href = newMessage? main.newMessageIcon: main.normalIcon;
 };
main.resetIcon =
 function ()
 {
  main.updateIcon(false);
 };
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
    main.resizeFields();
   });
 };
main.scrollToBottom =
 function ()
 {
  main.animating = true;
  window.scroll(0, main.body.scrollHeight);
  main.finishAnimation();
 };
/** @param {Event|KeyboardEvent} optionalEvent */
main.handleGlobalShortcuts =
 function (optionalEvent)
 {
  var /** @type {boolean} */ alt,
      /** @type {number} */ key,
      /** @type {boolean} */ control,
      /** @type {Event|KeyboardEvent} */ e;

  e = optionalEvent || /** @type {Event|KeyboardEvent} */ (window.event);

  key = e.keyCode;
  alt = e.altKey;
  control = e.ctrlKey;

  // Ctrl+b or Alt+b toggles the concealment of the content.
  if ((control || alt) && key === 66)
  {
   main.toggleConcealmentMode();
  }
  // F2 toggles new message notifications.
  // A special Nokia phone button toggles them as well.
  else if (key === 113 ||
           (key === 229 &&
            /** @type {KeyboardEvent} */ (e).keyIdentifier === "U+000008"))
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
  var /** @type {Array<string>} */ classList = [];
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
  var /** @type {Array<string>} */ classList = [];
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
   if (main.otherConversations)
   {
    classList.push("other-conversations");
   }
  }
  main.body.className = classList.join(" ");
 };
/** @param {string|number} onlineTimestamp
    @param {number} serverTimestamp */
main.updateRecipientStatus =
 function (onlineTimestamp, serverTimestamp)
 {
  if (onlineTimestamp)
  {
   main.presenceStatus.title = String(new Date(onlineTimestamp));
  }
  main.presenceStatus.className =
    (serverTimestamp - (new Date(onlineTimestamp)).getTime()) < 40000?
    "online":
    "offline";
 };
/** @param {string|number} typingTimestamp
    @param {number=} serverTimestamp */
main.updateRecipientTyping =
 function (typingTimestamp, serverTimestamp)
 {
  var /** @type {boolean} */ typing = false;

  /** @param {boolean=} isTyping */
  function updateTyping(isTyping)
  {
   var isTypingFinal = isTyping || false;
   if (main.typing !== isTypingFinal)
   {
    main.typing = isTypingFinal;
    main.updateBodyIndicator();
   }
  }

  clearTimeout(main.recipientTypingTimeoutTimer);

  if (serverTimestamp &&
      ((serverTimestamp - (new Date(typingTimestamp)).getTime()) < 7000))
  {
   typing = true;
  }
  
  updateTyping(typing);

  if (typing)
  {
   /** @type {number} */
   main.recipientTypingTimeoutTimer = setTimeout(updateTyping, 8000);
  }
 };
/** @param {boolean} thinking */
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
  var /** @type {?XMLHttpRequest} */
      request = main.messages.newRequest, 
      /** @type {string} */ 
      url,
      /** @type {string} */ 
      typing = "",
      /** @type {number} */ 
      now = (new Date()).getTime(),
      /** @type {boolean} */ 
      typedLately = (now - main.lastTypingIndicationTimestamp) < 5000;

  if (indicateTypingState && typedLately)// ||
      //(!indicateTypingState &&
       //(now - main.lastConnectivitySignalTimestamp) < 25000))
  {
   return;
  }
  if (!main.$.whitespacePattern)
  {
   main.$.whitespacePattern = new RegExp("\\n\\s\\t\\r", "g");
  }
  if ((indicateTypingState || typedLately) &&
      main.messageField.value.replace(main.$.whitespacePattern, ""))
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
   // Unusued, meant to disable caching.
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
     main.reopenChannel();
    },
    20000);
 };
/** @param {string} code
    @param {string} value */
main.sendReport =
 function (code, value)
 {
  var /** @type {XMLHttpRequest} */
      request = main.$.createRequest(),
      /** @type {string} */
      parameters =
       "type=" + main.$.encode(code) + "&value=" + main.$.encode(value) +
       (main.testDatabase? "&test=1": "");
  request.open("post", main.reportURL, true);
  request.setRequestHeader(
   "Content-Type", main.urlEncodedMimeType);
  request.send(parameters);
 };
/** @param {{data: Object}} message */
main.handleMessage =
 function (message)
 {
  /*jslint sub: true*/
  var /** @type {Object} */
      data =
      /** @type {Object} */
      (
       /** @type {Object} */
       (main.$.parseJSON(/** @type {string} */ (message["data"])))) ||
       /** @type {Object} */
       ({}),
      /** @type {Object<string, string>|Array<Object>|Object|string} */
      value = data["value"],
      /** @type {string} */
      lastMessageTimestamp,
      /** @type {Date} */
      lastMessageTimestampDate;

  //console.log(message.data);
  /*jslint sub: false*/
  clearTimeout(main.connectivityTimeoutTimer);
  main.lastConnectivitySignalTimestamp = (new Date()).getTime();
  
  if (MAIN_DEBUG)
  {
   /*jslint sub: true, evil: true*/
   if (data["type"] === "command")
   {
    eval(/** @type {string} */ (value));
    return;
   }
   /*jslint sub: false, evil: true*/
  }

  if (!main.settings.waitingForFetch)
  {
   lastMessageTimestamp =
    /** @type {string} */ (data["last-message-timestamp"]);
   if (lastMessageTimestamp &&
       lastMessageTimestamp !== main.lastMessageTimestamp)
   {
    lastMessageTimestampDate =
     new Date(/** @type {string} */ (data["last-message-timestamp-date"]));
    if (lastMessageTimestampDate < main.lastMessageTimestampDate)
    {
     main.lastMessageTimestamp = lastMessageTimestamp;
     main.lastMessageTimestampDate = lastMessageTimestampDate;
    }
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
    main.messages.addOldMessages(
     /** @type {Array<Object<string, string>>} */ (value), data["timestamp"]);
    /*jslint sub: false*/
    break;
   case "queued-messages":
    main.messages.addQueuedMessages(
     /** @type {Array<Object<string, string>>} */ (value));
    break;
   case "message":
    /*jslint sub: true*/
    main.messages.addMessage(
     /** @type {Object<string, string>} */ (value),
     data["key"], data["accurate-timestamp"],
     data["accurate-timestamp-date"], data["unique-id"]);
    main.messages.reportDelays(data["accurate-timestamp-date"]);
    /*jslint sub: false*/
    break;
   case "remove-message":
    main.messages.removeMessageElement(/** @type {string} */ (value));
    break;
   case "presence":
    /*jslint sub: true*/
    main.updatePresence(
     /** @type {Object<string, ?>} */ (value), data["server-timestamp"]);
    /*jslint sub: false*/
    if (main.settings.waitingForPresence)
    {
     main.messages.fetch(null, true);
     main.settings.waitingForPresence = false;
    }
    break;
  }
 };
/** @param {Object<string, ?>} data
    @param {string} serverTimestampText */
main.updatePresence =
 function (data, serverTimestampText)
 {
  /*jslint sub: true*/
  var /** @type {Object<string, ?>} */
      recipientData = /** @type {Object<string, ?>} */ (data[main.recipient]),
       /** @type {number} */
      serverTimestamp = main.$.parseDateString(serverTimestampText).getTime();
  main.updateRecipientThinking(
   recipientData?
    /** @type {boolean} */ (recipientData["thinking"]):
    false);
  main.updateRecipientStatus(
   recipientData?
    /** @type {number} */ (recipientData["timestamp"]):
    0,
   serverTimestamp);
  main.updateRecipientLocation(
   recipientData?
    /** @type {string} */ (recipientData["location"]):
    "");
  main.updateRecipientTyping(
   recipientData?
    /** @type {number} */ (recipientData["typing"]):
    0,
   serverTimestamp);
  /*jslint sub: false*/
 };
/** @param {Element} receptor
    @param {boolean=} before
    @returns {Element} */
main.replaceReceptor =
 function (receptor, before)
 {
  var /** @type {Element} */
      newReceptor = main.doc.createElement("div");
  newReceptor.id = receptor.id;
  newReceptor.className = receptor.className;
  receptor.id = "";
  receptor.className = "";
  return /** @type {Element} */ (
          receptor.parentNode.insertBefore(
           newReceptor,
           before? receptor: receptor.nextSibling));
 };
/** @param {string|Element} htmlOrElements
    @param {boolean=} isAlert */
main.showDialog =
 function (htmlOrElements, isAlert)
 {
  main.dialog.style.display = "block";
  main.dialog.innerHTML =
   "<h2>" + (isAlert? "Hey!": "We are having issues!") + "</h2>";
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
/** @param {Event|KeyboardEvent|MouseEvent=} optionalEvent */
main.clearDialog =
 function (optionalEvent)
 {
  var /** @type {Element} */ source,
      /** @type {Event|KeyboardEvent|MouseEvent|undefined} */ e;
  
  e =
   optionalEvent ||
   /** @type {Event|KeyboardEvent|MouseEvent} */ (window.event);

  if (e)
  {
   source = /** @type {Element} */ (e.target || e.srcElement);

   if ((e.type === "keyup" &&
        /** @type {KeyboardEvent} */ (e).keyCode !== 27) ||
       (e.type === "click" && source.getAttribute("data-keep")))
   {
    return;
   }
  }

  main.dialog.style.display = "none";
  main.dialog.innerHTML = "";
  main.doc[main.$.removeEventString](
   main.$.eventTypePrefix + "keyup", main.clearDialog, false);
 };
/** @param {Event|KeyboardEvent|MouseEvent=} optionalEvent */
main.handleClicks =
 function (optionalEvent)
 {
  var /** @type {string|undefined} */ action,
      /** @type {?Element|undefined} */ source,
      /** @type {Event|KeyboardEvent|MouseEvent|undefined} */ e;

  e =
   optionalEvent ||
   /** @type {Event|KeyboardEvent|MouseEvent} */ (window.event);

  source = /** @type {Element} */ (e.target || e.srcElement);
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
   case "show-other-conversations":
    main.messages.showOtherConversationDialog(e);
  }
 };
main.animateScrollingToTheBottom =
 function ()
 {
  var /** @type {number} */ currentScroll = -1;
  main.animating = true;
  function scrollDown()
  {
   var /** @type {number} */
       scrollTop = (main.body.scrollTop || main.html.scrollTop);
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
  var /** @type {goog.appengine.Channel} */ channel,
      /** @type {goog.appengine.Socket} */ socket,
      /** @type {number} */ interval = main.channelToken? 3e4: 3e5;

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
       main.settings.waitingForPresence = true;
       //main.$.log("open" + Date());
      }
    });
  main.socket = socket;  
  socket.onclose =
   function ()
   {
    main.reopenChannel();
    //main.$.log("close" + Date());
   };
  /** @param {DOMException|DOMError} e
      @param {string} a
      @param {string} b
      @param {string} c */
  socket.onerror =
   function (e, a, b, c)
   {
    var /** @type {string} */
        description =
         e? /** @type {string} */ (e["description"]) || e.message || "": "";
    main.sendReport(
     "channel-error",
     [e, e.code, typeof e.code,
      description, e.message, a, b, c].join(","));
    if (description.replace(/\+/g, " ").indexOf("Token time") > -1)
    {
     main.reclaimToken();
    }
    else
    {
     main.reopenChannel();
    }
   };
  socket.onmessage = main.handleMessage;
 };
main.reopenChannel =
 function ()
 {
  function recreateChannel()
  {
   try
   {
    main.releaseSocket();
    main.socket.close();
   }
   catch (e)
   {
   }

   main.settings.waitingForFetch = false;
   main.settings.offline = true;
   main.updateBodyIndicator();

   main.createChannel();
  }
  main.$.scheduleTask(recreateChannel);
 };
main.reclaimToken =
 function ()
 {
  var /*iFrame = main.$.firstTag("iframe"), */
      /** @type {XMLHttpRequest} */ request;
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
   main.reclaimTokenURL + "?from=" + main.$.encode(main.userName) +
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
   main.handleResize();
  }
 };
main.hideAndFocus =
 function ()
 {
  main.toggleConcealmentMode(true);
  alert("Oops! Something went wrong, please, restart the application.");
  main.doc.location.href = main.signOutURL;
 };
/** @param {Object<string, string>|string} data */
main.dispatchAction =
 function (data)
 {
  /*jslint sub: true*/
  var /** @type {string} */
      action = typeof data === "string"? data: data["action"];
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
  var /** @type {number} */ documentWidth,
      /** @type {number} */ width;

  // While it is a combined assumption, every browser that supports calc(),
  // supports media queries.
  // When media queries kick in, this calculation is redundant.
  if (main.support.calcValue)
  {
   return;
  }

  documentWidth = main.html.clientWidth || (screen.width - 10);
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
 };
main.handleResize =
 function ()
 {
  main.resizeFields();
  if (main.wasAtScrollBottom)
  {
   main.scrollToBottom();
   main.$.scheduleTask(main.hideRedundantOutro);
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
main.hideRedundantOutro =
 function ()
 {
  var /** @type {HTMLFormElement} */ form,
      /** @type {Element} */ element,
      /** @type {number} */ elementTop,
      /** @type {number} */ formTop;

  if (main.support.calcValue)
  {
   return;
  }

  form = main.form;
  element = main.$.id("outro");

  element.style.cssText = "";
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
 };
main.initialize =
 function ()
 {
  /** @param {string} key
      @returns {string} */
  function get(key)
  {
   return main.html.getAttribute("data-" + key);
  }
  function checkLocation()
  {
   /** @param {GeolocationPosition} position */
   function storeLocation(position)
   {
    /** @type {string} */
    var geolocation =
         position.coords.latitude + "," + position.coords.longitude;
    if (main.location !== geolocation)
    {
     main.location = geolocation;
     main.updatePresenceData();
    }
   }
   navigator.geolocation.getCurrentPosition(storeLocation);
  }

  // Initial time synchronization after a minute.
  setTimeout(main.updateSynchronizedTime, (MAIN_DEBUG? 5000: 60000));
  // And then every five minutes.
  setInterval(main.updateSynchronizedTime, 300000);

  main.eIcon = /** @type {HTMLLinkElement} */ (main.$.id("favicon"));
  main.normalIcon =
   get("favicon-url") || (main.eIcon && main.eIcon.href) || "";
  main.newMessageIcon = get("new-message-icon-url");
  main.currentIcon = main.normalIcon;
  main.notifications.soundURL = get("notification-mp3-url");
  main.notificationURL = get("notification-url");
  main.getTimeURL = get("get-time-url");
  main.removeMessageURL = get("remove-message-url");
  main.fetchMoreMessagesURL = get("fetch-more-messages-url");
  main.messages.updatePresenceDataURL =
   get("update-presence-data-url");
  main.reclaimTokenURL = get("reclaim-token-url");
  main.reportURL = get("report-url");
  main.signOutURL = get("sign-out-url");

  main.normalMessenger = get("normal") === "1";

  if (get("new-messages-mode") === "1")
  {
   main.newMessages = true;
   main.initialState = true;
  }

  if (navigator.userAgent.indexOf("Windows") !== -1)
  {
   if (!main.normalMessenger && main.$.getCookie("authenticated") !== "1")
   {
    main.doc.location.reload();
    return;
   }
   main.updateBodyIndicator();
  }
  
  /*jslint sub: true*/
  // If there is no goog object, there is not point in staying here.
  if (!window["goog"])
  {
  /*jslint sub: false*/
   main.showDialog(
    "There is a problem with the service. Please, reload the page.");
   return;
  }
  if (navigator.geolocation)
  {
   checkLocation();
   setInterval(checkLocation, 60000);
  }
  main.handleResize();
  window.onresize = main.handleResize;
  main.handleScroll();
  window.onscroll = main.handleScroll;
  main.lastMessageTimestamp = get("last-message-timestamp");
  main.firstMessageTimestamp = get("first-message-timestamp");

  main.userName = get("user-name");
  main.recipient = get("recipient");
  main.refreshURL = get("current-url");
  main.atWork = get("at-work") === "1";
  main.desktop = get("desktop") === "1";
  /*jslint sub: true*/
  main.testDatabase =
   /** @type {HTMLInputElement} */ (main.form["test"]).value === "1";
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
  main.dialog.onclick = main.clearDialog;
  main.dialog.ontouchend = main.clearDialog;
  window.onerror =
   function ()
   {
    var /** @type {string} */ args = "[",
        /** @type {number} */ i,
        /** @type {number} */ argumentCount = arguments.length,
        /** @type {string|number|DOMError|DOMException} */ argument;
    //if (window.JSON)
    //{
    // args = JSON.stringify(arguments);
    //}
    //else
    //{
     /*jslint plusplus: true*/
     for (i = 0; i < argumentCount; i++)
     {
      argument =
       /** @type {string|number|DOMError|DOMException} */ (arguments[i]);
     /*jslint plusplus: false*/
      try
      {
       args += JSON.stringify(argument);
      }
      catch (e)
      {
       try
       {
        args +=
         /** @type {number} */ (argument["code"]) +
         "," +
         /** @type {string} */ (argument["message"]);
       }
       catch (e1)
       {
        args += argument;
       }
      }
      //if (i !== (argumentCount - 1))
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
  window.onbeforeunload = main.handleExitPreparations;
  window.onload =
   function ()
   {
    setTimeout(
     function ()
     {
      main.scrollToBottom();
      main.handleScroll();
      if (main.wasAtScrollBottom)
      {
       main.hideRedundantOutro();
      }
     },
     100);
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
  if (typeof main.$.createElement("input")["autofocus"] !== "boolean" &&
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

/** @type {?Storage} */
main.support.storage = null;

try
{
 main.support.storage = window.sessionStorage || window.localStorage;
}
catch (ignore)
{
}

/** @type {boolean} */
main.support.desktopNotifications = false;
/** @type {boolean} */
main.support.nativeDesktopNotifications = false;
/** @type {string} */
main.support.screenSize = "";

/** @type {boolean} */
main.support.calcValue =
 (function ()
  {
   // Inspired by Modernizr.
   var /** @type {Element} */ element = document.createElement("div");
   element.style.cssText =
    "width: -webkit-calc(1px); height: -moz-calc(1px); padding-top: calc(1px)";
   return element.style.length > 0;
  }());

if (!main.settings)
{
 /** @namespace Setting properties. */
 main.settings = {};
}

main.settings.savedSettings =
 {
  /** @type {boolean} */
  popups: true,
  /** @type {boolean} */
  desktop: true,
  /** @type {boolean} */
  sound: true
 };
/** @type {boolean} */
main.settings.offline = true;
/** @type {boolean} */
main.settings.waitingForFetch = false;
/** @type {boolean} */
main.settings.waitingForPresence = false;
/** @type {HTMLFormElement} */
main.settings.form =
 /** @type {HTMLFormElement} */ (main.doc.forms["settings-form"]);
/** @type {Element} */
main.settings.widget = main.$.id("settings");

/** @param {string} fieldName
    @param {string} savedSettingName
    @param {boolean=} enable
    @returns {boolean} */
main.settings.getSetSetting =
 function (fieldName, savedSettingName, enable)
 {
  var /** @type {HTMLInputElement} */
      field =
       /** @type {HTMLInputElement} */ (main.settings.form[fieldName]);
  if (typeof enable === "boolean")
  {
   field.checked = enable;
   main.$.save(savedSettingName, enable, new Date());
  }
  return field.checked;
 };
/** @param {boolean=} enable
    @returns {boolean} */
main.settings.nativeDesktopNotifications =
 function (enable)
 {
  return main.settings.getSetSetting(
          "desktop-notification", "show-desktop-notification", enable);
 };
/** @param {boolean=} enable
    @returns {boolean} */
main.settings.soundNotifications =
 function (enable)
 {
  return main.settings.getSetSetting(
          "sound-notification", "play-sound-notification", enable);
 };
/** @param {boolean=} enable
    @returns {boolean} */
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
/** @type {Audio|HTMLAudioElement|HTMLEmbedElement} */
main.notifications.sound = null;
/** @type {string} */
main.notifications.soundURL = "";
/** @type {Element} */
main.notifications.settings = main.$.id("notification-settings");
/** @type {Window} */
main.notifications.notificationPopup = null;

main.notifications.suppress =
 function ()
 {
  main.notifications.enabled = false;
  main.updateBodyIndicator();
 };
main.notifications.play =
 function ()
 {
  var /** @type {HTMLAudioElement|HTMLEmbedElement} */ sound,
      /** @type {string} */ url;
  if (!main.settings.soundNotifications())
  {
   return;
  }
  
  /** @returns {HTMLEmbedElement} */
  function createEmbed()
  {
   var eSoundEmbed =
    /** @type {HTMLEmbedElement} */ (main.doc.createElement("embed"));
   eSoundEmbed.style.position = "absolute";
   eSoundEmbed.width = "1";
   eSoundEmbed.height = "1";
   return eSoundEmbed;   
  }
  function append()
  {
   main.notifications.sound = sound =
    /** @type {HTMLAudioElement|HTMLEmbedElement} */
    (main.body.appendChild(sound));
  }

  sound = main.notifications.sound;
  url = main.notifications.soundURL;

  if (!/** @type {boolean} */ (sound["flash"]) &&
      (sound.parentNode ||
       /** @type {boolean} */ (sound["html5"])))
  {
   try
   {
    sound.src = url;
    sound["vol" + "ume"] =
     parseFloat(
      /** @type {HTMLInputElement} */
      (main.settings.form["sound-notification-volume"]).value) || 1;
    sound["pl" + "ay"]();
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
   if (!sound["html5"])
   {
    sound = createEmbed();
    sound.src = url;
    append();
    if (!sound["play"])
    {
     sound.parentNode.removeChild(sound);
     sound = createEmbed();
     sound.style.position = "absolute";
     sound.id = "audible-notification";
     sound.name = "audible-notification";
     sound["flash"] = true;
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
  var /** @type {Notification} */ notification,
      /** @type {Window} */ notificationPopup,
      /** @type {boolean} */ blockedPopups = false;
  if (!main.settings.showNotifications())
  {
   return;
  }
  if (main.desktop)
  {
   main.doc.title = "New Message - Notify";
  }
  else if (!main.settings.nativeDesktopNotifications())
  {
   notificationPopup = main.notifications.notificationPopup;
   if (!notificationPopup)
   {
    main.notifications.notificationPopup =
     window.open(
      (main.notificationURL + "?from=" + main.userName +
       (main.normalMessenger? "&normal=1": "")),
      "Notification",
      "width=400, height=80, left=" + (screen.availWidth - 400) + "," +
      "top=" + (screen.availHeight - 100));
    notificationPopup = main.notifications.notificationPopup;
    try
    {
     if (!notificationPopup || notificationPopup.closed)
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
   if (notificationPopup)
   {
    notificationPopup.onclose =
     function ()
     {
      main.notifications.notificationPopup = null;
     };
   }
  }
  else
  {
   notification = main.notifications.notification;
   if (!notification)
   {
    main.notifications.notification =
     main.notifications.create(
      "Messenger", main.recipient + " sent a message.");
    notification = main.notifications.notification;
    if (!main.normalMessenger)
    {
     notification.onclick =
      function ()
      {
       window.focus();
      };
    }
   }
  }
  if (notification)
  {
   notification.onclose =
    function ()
    {
     main.notifications.notification = null;
    };
  }
 };
main.notifications.hide =
 function ()
 {
  var /** @type {Notification} */
      notification = main.notifications.notification,
      /** @type {Window} */ notificationPopup;
  if (notification)
  {
   if (window.Notification)
   {
    notification.close();
   }
   else
   {
    notification.cancel();
   }
  }
  notificationPopup = main.notifications.notificationPopup;
  if (notificationPopup)
  {
   notificationPopup.close();
   main.notifications.notificationPopup = null;
  }
  if (main.notifications.showArrow)
  {
   main.notifications.showArrow = false;
   main.updateBodyIndicator();
  }
 };
main.notifications.addListeners =
 function ()
 {
  function alwaysHide()
  {
   if (main.normalMessenger)
   {
    main.messages.confirmRead();
   }
   else
   {
    main.notifications.hide();
   }
  }
  function hide()
  {
   if (main.initialState)
   {
    return;
   }
   alwaysHide();
  }
  /** @param {string} type
      @param {boolean=} always */
  function add(type, always)
  {
   main.doc[main.$.addEventString](
    main.$.eventTypePrefix + type, (always? alwaysHide: hide), false);
   window[main.$.addEventString](
    main.$.eventTypePrefix + type, (always? alwaysHide: hide), false);
  }
  add("resize");
  add("focus");
  if (!main.normalMessenger)
  {
   add("mousemove");
  }
  add("keydown", true);
 };
main.notifications.initialize =
 function ()
 {
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
  main.notifications.addListeners();
 };
/** @param {string} title
    @param {string} content
    @return {Notification} */
main.notifications.create =
 function (title, content)
 {
  var /** @type {Notification} */ notification;
  if (window.Notification)
  {
   return new Notification(title, {body: content});
  }
  
  if (window.webkitNotifications)
  {
   notification =
    /** @type {Notification} */
    (webkitNotifications.createNotification(main.normalIcon, title, content));
   notification.show();
   return notification;
  }

  return null;
 };
main.notifications.prepare =
 function ()
 {
  /** @param {?string=} permission
      @param {boolean=} doNotSet
      @returns {boolean} */
  function checkPermission(permission, doNotSet)
  {
   if (permission === "granted" ||
       // Standard API.
       (window.Notification && "permission" in Notification &&
        Notification.permission === "granted") ||
       // Old API, for older Chrome or maybe also Safari.
       (window.webkitNotifications &&
        webkitNotifications.checkPermission() === 0))
   {
    main.support.nativeDesktopNotifications = true;
    if (!doNotSet)
    {
     main.settings.nativeDesktopNotifications(true);
    }
    return true;
   }
   return false;
  }
  
  if (!window.Notification && !window.webkitNotifications)
  {
   return;
  }
  main.support.desktopNotifications = true;
  main.updateHTMLIndicator();
  /** @this {HTMLInputElement} */
  main.settings.form["desktop-notification"].onclick =
   function ()
   {
    if (!main.support.nativeDesktopNotifications &&
        !checkPermission(null, true))
    {
     if (window.Notification)
     {
      Notification.requestPermission(checkPermission);
     }
     else if (window.webkitNotifications)
     {
      webkitNotifications.requestPermission(checkPermission);
     }
    }
    else
    {
     main.settings.getSetSetting(
      "desktop-notification", "show-desktop-notification", this.checked);
    }
   };
   if (checkPermission(null, true) && main.settings.savedSettings.desktop)
   {
    main.settings.nativeDesktopNotifications(true);
   }
 };
main.notifications.initializeSound =
 function ()
 {
  var /** @type {HTMLAudioElement} */
      sound =
       /** @type {HTMLAudioElement} */
       (main.doc.createElement("audio"));

  if (sound.canPlayType &&
      (sound.canPlayType("audio/mp3") || sound.canPlayType("audio/mpeg")))
  {
   sound["html5"] = true;
   sound = /** @type {HTMLAudioElement} */ (main.body.appendChild(sound));
  }
  main.notifications.sound = sound;
 };

if (!main.messages)
{
 /** @namespace Message related functions. */
 main.messages = {};
}

/** @type {string} */
main.messages.lastTypedMessage = "";
/** @type {HTMLButtonElement} */
main.messages.confirmReadButton =
 /** @type {HTMLButtonElement} */ (main.$.id("confirm-read-messages"));
/** @const {string} */
main.messages.cannedIndicesCookieName = "canned-indices";
/** @type {?number} */
main.messages.checkerTimer = null;
/** @type {?number} */
main.messages.checkerTimeoutTimer = null;
/** @type {string} */
main.messages.updatePresenceDataURL = "";
/** @type {?number} */
main.messages.glowTimer = null;
/** @type {?XMLHttpRequest} */
main.messages.newRequest = null;
/** @type {number} */
main.messages.newRequestRetries = 1;
/** @type {Element} */
main.messages.receptor = main.$.id("message-receptor");
/** @type {Element} */
main.messages.olderMessageReceptor = main.$.id("older-message-receptor");
//** @type {Element} */
//main.messages.offlineReceptor = main.$.id("offline-message-receptor");
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
 new RegExp(
  "\\b(h+m+|g+r+|w+t+f+|sms|mms|ll|(https?://|www)[^ \"]+)\\b", "gi");
/** @type {RegExp} */
main.messages.onlyHebrewLettersPattern = new RegExp("[א-ת]", "g");
/** @type {Object.<function()>} */
main.messages.sendMessageCallbacks = {};

main.messages.clearAll =
 function ()
 {
  main.messages.iterateThroughMessages(
   /** @param {Element} element */
   function (element)
   {
    element.className += " hidden";
   });
 };
/** @param {Event} e
    @param {HTMLAnchorElement|Element|Node} dismissLink
    @param {!Element=} eUndeliveredMessage */
main.messages.removeUndelivered =
 function (e, dismissLink, eUndeliveredMessage)
 {
  /** @type {Element|undefined} */
  var eMessage = eUndeliveredMessage;
  if (!eMessage)
  {
   main.$.preventDefault(e);
   eMessage = /** @type {!Element} */ (dismissLink.parentNode.parentNode);
  }
  if (eMessage.className.indexOf("system-message") === -1)
  {
   return;
  }
  eMessage.parentNode.removeChild(eMessage);
 };
/** @param {Event} e
    @param {HTMLAnchorElement|Element|Node} resendLink */
main.messages.resendUndelivered =
 function (e, resendLink)
 {
  var /** @type {Element} */ message;
  main.$.preventDefault(e);
  message = /** @type {Element} */ (resendLink.parentNode.parentNode);
  if (message.className.indexOf("system-message") === -1)
  {
   return;
  }
  if (main.messageField.value &&
      !confirm("You started typing a message. This will overwrite it. Right?"))
  {
   return;
  }
  main.messageField.value = /** @type {string} */ (message["originalMessage"]);
  if (/** @type {boolean} */ (message["notify"]))
  {
   message["notify"] = main.notifyRecipient.checked;
  }
  main.messages.send();
  main.messages.removeUndelivered(e, resendLink, message);
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
  var /** @type {HTMLButtonElement} */ button = main.messages.confirmReadButton;
  if (main.messages.glowTimer)
  {
   clearInterval(main.messages.glowTimer);
   main.messages.glowTimer = null;
  }
  main.initialState = false;
  main.newMessages = false;
  main.updateBodyIndicator();
  main.notifications.hide();
  main.messages.receptor = main.replaceReceptor(main.messages.receptor);
  main.doc.title = main.originalTitle;
  main.resetIcon();
  if (this === button)
  {
   main.messageField.focus();
  }
  return false;
 };
main.messages.glow =
 function ()
 {
  // var number = parseInt(main.doc.title, 10);
  // main.doc.title = String(number + 1);
  // if (number % 3 === 0)
  // {
   // main.updateIcon(main.currentIcon === main.normalIcon);
  // }
  if (!main.normalMessenger)
  {
   main.doc.title = String(parseInt(main.doc.title, 10) + 1);
  }
  main.updateIcon(main.currentIcon === main.normalIcon);
 };
main.messages.copyConcealedMessage =
 function ()
 {
  main.messageField.value = main.concealedMessageField.value;
 };
main.messages.handleMessageFieldKeyUp =
 function ()
 {
  var /** @type {HTMLTextAreaElement} */
      eMessage =
       /** @type {HTMLTextAreaElement} */ (main.messageField),
      /** @type {string} */ message = eMessage.value,
      /** @type {string} */ lastMessage = main.messages.lastTypedMessage;
  if (!lastMessage || lastMessage !== message.substring(0, lastMessage.length))
  {
   eMessage.style.direction = main.$.isRTL(message)? "rtl": "ltr";
  }
  if (message.length)
  {
   main.updatePresenceData(true);
  }
  main.messages.lastTypedMessage = main.messageField.value;
 };
/** @param {Event} optionalEvent
    @return {?boolean|undefined} */
main.messages.handleMessageFieldKeys =
 function (optionalEvent)
 {
  var /** @type {HTMLTextAreaElement} */
      concealed = main.concealedMessageField,
      /** @type {number} */ key,
      /** @type {boolean} */ mobileEnter,
      /** @type {HTMLTextAreaElement} */ message = main.messageField,
      /** @type {Element} */ source;
  /*
  /** @param {Event} e * /
  function cancelMeOnce(e)
  {
   if (!e)
   {
    e = /** @type {Event} * / (window.event);
   }
   if (e.keyCode === 13 || e.keyCode === 229)
   {
    main.$.preventDefault(e);
    source.onkeypress = null;
   }
  }*/
  var /** @type {Event} */ e = optionalEvent;
  if (!e)
  {
   e = /** @type {Event} */ (window.event);
  }
  source = /** @type {Element} */ (e.target || e.srcElement);
  key = e.keyCode;

  if (source !== message && source !== concealed)
  {
   return;
  }
  
  // Nokia phones apparently have a weird key code for the Enter key,
  // which is actually shared between several keys (Enter, Backspace and more).
  // The Enter key has a specific keyIdentifier, so we use that to
  // know the real Enter key was pressed.
  mobileEnter =
   key === 229 &&
   /** @type {KeyboardEvent} */ (e).keyIdentifier === "MSK";

  if (e.altKey && key === 66)
  {
   return false;
  }
  if ((key === 13 || mobileEnter) && !e.shiftKey)
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
  var /** @type {?string|undefined} */
      rawCannedIndices =
       main.$.load(main.messages.cannedIndicesCookieName),
      /** @type {Array<string>} */ cannedIndices,
      /** @type {Array<!HTMLOptionElement>} */ cannedMessages = [],
      /** @type {HTMLSelectElement} */ field = main.cannedMessageField,
      /** @type {number} */ i = 0,
      /** @type {number} */ cannedMessageCount;
  if (!rawCannedIndices)
  {
   return;
  }
  cannedIndices = rawCannedIndices.split(",");
  cannedMessages = /** @type {Array<!HTMLOptionElement>} */ ([]);
  /*jslint plusplus: true*/
  for (cannedMessageCount = cannedIndices.length; i < cannedMessageCount; i++)
  {
  /*jslint plusplus: false*/
   cannedMessages.push(
    /** @type {!HTMLOptionElement} */
    (main.cannedMessageField.options[cannedIndices[i]]));
  }
  while (cannedMessages.length)
  {
   field.insertBefore(
    /** @type (!HTMLOptionElement) */ (cannedMessages.pop()),
    /** @type (!HTMLOptionElement) */ (field.options[1]));
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
   main.doc.title = "New Message";
  }
  else
  {
   if (main.normalMessenger)
   {
    main.doc.title = main.recipient + " says...";
   }
   else
   {
    main.doc.title = "1";
   }
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
  var /** @type {?string|undefined} */ rawCannedIndices,
      /** @type {Array.<string>} */ cannedIndices,
      /** @type {Date} */ expiration,
      /** @type {number} */ i = 0,
      /** @type {number} */ cannedMessageCount,
      /** @type {string} */ key = main.messages.cannedIndicesCookieName;
  rawCannedIndices = main.$.load(key);
  cannedIndices = rawCannedIndices? rawCannedIndices.split(","): [];
  /*jslint plusplus: true*/
  for (cannedMessageCount = cannedIndices.length; i < cannedMessageCount; i++)
  {
  /*jslint plusplus: false*/
   if (parseInt(cannedIndices[i], 10) === parseInt(index, 10))
   {
    cannedIndices.splice(i, 1);
   }
  }
  cannedIndices.unshift(index);
  rawCannedIndices = cannedIndices.join(",");
  expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  main.$.save(key, rawCannedIndices, expiration);
};
main.messages.sendManually =
 function ()
 {
  main.form.submit();
 };
/** @returns {?boolean|undefined} */
main.messages.send =
 function ()
 {
  var /** @type {string} */ message = main.messageField.value,
      /** @type {string} */ parameters,
      /** @type {number} */ requestTimeout,
      /** @type {function():undefined} */ indicateUndeliveredMessage,
      /** @type {string} */ uniqueID,
      /** @type {string} */ notify,
      /** @type {XMLHttpRequest} */ request,
      /** @type {number} */retry = 0,
      /** @type {function():undefined} */ resetTimer,
      /** @type {function(boolean=):undefined} */ resend,
      /** @type {function():undefined} */ cleanup,
      /** @type {function():undefined} */ sendMessage,
      /** @type {function():undefined} */ stopRequest,
      /** @type {string} */ translatedMessage,
      /** @type {function():undefined} */ prepareMessage,
      /** @type {function():undefined} */ showConfirmationBox,
      /** @type {string} */ messageKey,
      /*translateDecision, */
      /** @type {?number} */ undeliveredTimeout;
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
    var /** @type {Element} */ header,
        /** @type {Element} */ receptor = main.messages.receptor,
        /** @type {Element} */ element,
        /** @type {Element} */
        container = main.$.createElement("div", "system-message message");

        container.id = uniqueID;
        container["originalMessage"] = message;
        container["notify"] = Boolean(notify);
        header =
         /** @type {Element} */
         (container.appendChild(
          main.$.createElement(
           "span", null,
           "The following message might have not been delievered (")));
        element = main.$.createElement("a", null, "dismiss");
        header.appendChild(element);
        element.setAttribute("data-action", "remove-undelivered");
        element.href = "#";
        header.appendChild(main.$.createText(" or "));
        element =
         /** @type {Element} */
         (header.appendChild(main.$.createElement("a", null, "resend")));
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
     "Content-Type", main.urlEncodedMimeType);
    request.onreadystatechange =
     function ()
     {
      var /** @type {string} */ key;
      if (!undeliveredTimeout)
      {
       return;
      }
      if (request && request.readyState !== 4)
      {
       return;
      }
      /*jslint sub: true*/
      key =
       /** @type {string} */
       (/** @type {Object} */
        (main.$.parseJSON(request.responseText))["key"]);
      /*jslint sub: false*/
      if ((request && request.status !== 200) || !key)
      {
       resend(true);
      }
      else
      {
       cleanup();
       resetTimer();
       messageKey = key;
       main.messages.sendMessageCallbacks[messageKey] =
        main.messages.sendMessageCallbacks[uniqueID];
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
       var /** @type {Element} */ undeliveredMessageElement;
       resetTimer();
       clearTimeout(undeliveredTimeout);
       undeliveredTimeout = null;

       delete main.messages.sendMessageCallbacks[uniqueID];
       delete main.messages.sendMessageCallbacks[messageKey];

       // Removing any left overs.
       undeliveredMessageElement = main.$.id(uniqueID);
       
       cleanup();
       
       if (undeliveredMessageElement && undeliveredMessageElement.parentNode)
       {
        undeliveredMessageElement.parentNode.removeChild(
         undeliveredMessageElement);
       }
      };
    }
    main.form.reset();
   };
  showConfirmationBox =
   function ()
   {
    var /** @type {HTMLButtonElement} */ defaultButton,
        /** @type {HTMLButtonElement} */ button,
        /** @type {Element} */ element,
        /** @type {function():undefined} */ focusElement,
        /** @type {Element} */ activeElement = main.doc.activeElement;
    focusElement =
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
     /** @type {HTMLButtonElement} */
     (main.$.createElement("button", null, "Fix & Send"));
    element.appendChild(defaultButton);
    defaultButton.onclick =
     function ()
     {
      main.clearDialog();
      message = translatedMessage;
      prepareMessage();
      focusElement();
     };
    button =
     /** @type {HTMLButtonElement} */
     (element.appendChild(
      /** @type {HTMLButtonElement} */
      (main.$.createElement("button", null, "Just Send"))));
    button.onclick =
     function ()
     {
      main.clearDialog();
      main.sendReport("invalid-hebrew-english-detection", message);
      prepareMessage();
      focusElement();
     };
    button =
     /** @type {HTMLButtonElement} */
     (element.appendChild(
      /** @type {HTMLButtonElement} */
      (main.$.createElement("button", null, "Cancel"))));
    button.onclick =
     function ()
     {
      main.clearDialog();
      focusElement();
     };
    main.showDialog(element, true);
    defaultButton.focus();
   };

  main.messages.lastTypedMessage = "";

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
  var /** @type {HTMLOptionElement} */
      cannedMessage,
      /** @type {HTMLSelectElement} */
      cannedMessageField = main.cannedMessageField,
      /** @type {HTMLTextAreaElement} */
      message = main.messageField,
      /** @type {number} */
      cannedMessageIndex = cannedMessageField.selectedIndex;

  if (cannedMessageIndex === 0)
  {
   return;
  }
  cannedMessage =
   /** @type {HTMLOptionElement} */
   (cannedMessageField.options[cannedMessageIndex]);
  message.value =
   cannedMessage.value + (message.value? " - " + message.value: "");
  main.messages.saveCannedMessageOrder(
   parseInt(cannedMessage.getAttribute("data-index"), 10));
  cannedMessageField.selectedIndex = 0;
  main.messages.send();
 };
main.messages.startCheckerTimer =
 function ()
 {
  clearInterval(main.messages.checkerTimer);
  main.messages.checkerTimer =
   setInterval(main.updatePresenceData, main.pingInterval);
 };
/** @this {Element}
    @param {Event|MouseEvent} e */
main.messages.removeMessage =
 function (e)
 {
  var /** @type {Element} */ element,
      /** @type {Element} */ messageContainer,
      /** @type {XMLHttpRequest} */ request,
      /** @type {string} */ url;
  function showError()
  {
   element.removeAttribute("data-state");
   main.showDialog(
    "The message could not be deleted. :( Try again soon, though!");
  }
  /** @param {string} key
      @returns {string} */
  function get(key)
  {
   return main.$.encode(messageContainer.getAttribute("data-" + key)) || "";
  }

  main.$.preventDefault(e);

  element = this;
  messageContainer = /** @type {Element} */ (element.parentNode.parentNode);

  if (element.getAttribute("data-state") === "in-progress")
  {
   return;
  }
  request = main.$.createRequest();
  url =
   main.removeMessageURL + "?key=" + get("key") +
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
  var /** @type {XMLHttpRequest} */ request,
      /** @type {string} */ url;
  if (e)
  {
   main.$.preventDefault(e);
  }
  request = main.$.createRequest();
  url = main.fetchMoreMessagesURL + "?from=" + main.$.encode(main.userName);
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
  request.send(null);
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
  var /** @type {number} */ i = 0,
      /** @type {number} */ messageCount,
      /** @type {Object<string, ?>} */ message;
  /*jslint plusplus: true*/
  for (messageCount = messageList.length; i < messageCount; i++)
  {
  /*jslint plusplus: false*/
  /*jslint sub: true*/
   message = /** @type {Object<string, ?>} */ (messageList[i]);
   main.messages.addMessage(
    /** @type {Object<string, string>} */ (message["value"]),
    /** @type {string} */ (message["key"]),
    /** @type {string} */ (message["accurate-timestamp"]),
    /** @type {string} */ (message["accurate-timestamp-date"]),
    null, old, i !== messageCount - 1);
  /*jslint sub: false*/
  }
 };
/** @param {Array.<Object>} messageList */
main.messages.addQueuedMessages =
 function (messageList)
 {
  var /** @type {number} */ i;
  main.settings.offline = false;
  main.updateBodyIndicator();
  //main.messages.offlineReceptor.innerHTML = "";
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
    @param {string} accurateTimestamp
    @param {string} accurateTimestampDate
    @param {?string=} uniqueID
    @param {boolean=} old
    @param {boolean=} doNotNotify */
main.messages.addMessage =
 function (
  messageData, key, accurateTimestamp, accurateTimestampDate, uniqueID,
  old, doNotNotify)
 {
  /*jslint sub: true*/
  var /** @type {Element} */
      headers,
      /** @type {Element} */
      messageContent,
      /** @type {HTMLAnchorElement} */ 
      deleteLink,
      /** @type {string} */
      content = messageData["content"],
      /** @type {HTMLFormElement} */
      form = main.form,
      /** @type {Element} */
      message = main.doc.createElement("div"),
      /** @type {string} */
      sender = messageData["sender"],
      /** @type {string} */
      originalTimestamp = messageData["timestamp"],
      /** @type {boolean} */
      received = true,
      /** @type {Date} */
      timestamp = new Date(originalTimestamp),
      /** @type {string} */
      timestampString =
       timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1)+ "-" +
       timestamp.getDate() + " " + timestamp.toLocaleTimeString(),
      /** @type {Element} */
      receptor = main.messages.receptor;
  /*jslint sub: false*/

  function changeLastMessageTimestamp()
  {
   if (old || main.settings.offline)
   {
    return;
   }

   // Setting the last message timestamp.
   main.lastMessageTimestamp = accurateTimestamp;
   main.lastMessageTimestampDate =
    main.$.parseDateString(accurateTimestampDate);
  }


  // Accept the message as a received message.
  if (key && main.messages.sendMessageCallbacks[key])
  {
   main.messages.sendMessageCallbacks[key]();
  }
  else if (uniqueID && main.messages.sendMessageCallbacks[uniqueID])
  {
   main.messages.sendMessageCallbacks[uniqueID]();
  }

  // Ignoring messages sent from the user
  // to other people in other conversations.
  if (sender === main.userName &&
      /** @type {string} */ (messageData["recipient"]) !== main.recipient)
  {
   changeLastMessageTimestamp();
   return;
  }

  // Ignoring messages sent from other recipients (but notifying the user).
  if (sender !== main.userName && sender !== main.recipient)
  {
   main.messages.showOtherConversationNotification(sender);
   changeLastMessageTimestamp();
   return;
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
   /** @type {Element} */
   (message.appendChild(
     main.$.createElement(
      "div", "message-headers",
      "From " + sender + " (" + timestampString + ")")));
  /*jslint sub: true*/
  if (/** @type {HTMLInputElement} */ (form["manage"]).value === "1")
  {
  /*jslint sub: false*/
   headers.appendChild(main.$.createText(" ("));
   deleteLink =
    /** @type {HTMLAnchorElement} */
    (main.$.createElement("a", null, "delete"));
   deleteLink.href = "#";
   deleteLink.setAttribute("data-action", "remove");
   headers.appendChild(deleteLink);
   headers.appendChild(main.$.createText(")"));
  }

  messageContent =
   /** @type {Element} */
   (message.appendChild(main.$.createElement("div", null)));
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
  // We are offline.
  //else if (main.settings.offline)
  //{
   // New messages in offline mode go to the offline receptor.
   //receptor = main.messages.offlineReceptor;
  //}
  // Normal message.
  // else
  // {
  changeLastMessageTimestamp();
  // }

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
/** @param {function(Element)} runAction */
main.messages.iterateThroughMessages =
 function (runAction)
 {
  var /** @type {NodeList} */ elements,
      /** @type {number} */ i,
      /** @type {number} */ messageCount;
  if (main.messages.messagePane.querySelectorAll)
  {
   elements = main.messages.messagePane.querySelectorAll(".message");
   messageCount = elements.length;
   /*jslint plusplus: true*/
   for (i = 0; i < messageCount; i++)
   {
   /*jslint plusplus: false*/
    runAction(elements[i]);
   }
  }
  else
  {
   elements = main.$.tag("div", main.messages.messagePane);
   messageCount = elements.length;
   /*jslint plusplus: true*/
   for (i = 0; i < messageCount; i++)
   {
   /*jslint plusplus: false*/
    if (/** @type {Element} */ (elements[i]).className === "message")
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
  var /** @type {NodeList} */ messages,
      /** @type {number} */ i,
      /** @type {number} */ messageCount;
  if (main.messages.messagePane.querySelector)
  {
   return main
           .messages.messagePane.querySelector("[data-key=\"" + key + "\"]");
  }
  messages = main.$.tag("div", main.messages.messagePane);
  messageCount = messages.length;
  /*jslint plusplus: true*/
  for (i = 0; i < messageCount; i++)
  {
  /*jslint plusplus: false*/
   if (/** @type {Element} */ (messages[i]).getAttribute("data-key") === key)
   {
    return messages[i];
   }
  }
  return null;
 };
/** @param {string} key */
main.messages.removeMessageElement =
 function (key)
 {
  var /** @type {Element} */ message = main.messages.findMessageByKey(key);
  if (message)
  {
   message.parentNode.removeChild(message);
  }
 };
/** @param {string} sender */
main.messages.showOtherConversationNotification =
 function (sender)
 {
  main.otherConversationDetails.push(sender);
  main.eOtherConversations.innerHTML =
   main.otherConversationDetails.length + " other message" +
   (main.otherConversationDetails.length > 1? "s": "");
  main.otherConversations = true;
  main.updateBodyIndicator();
 };
/** @param {Event} optionalEvent */
main.messages.showOtherConversationDialog =
 function (optionalEvent)
 {
  var /** @type {string} */
      url = main.eOtherConversations.getAttribute("data-url"),
      /** @type {Array<string>} */
      details = main.otherConversationDetails,
      /** @type {Array<string>} */
      conversationLinks = [],
      /** @type {Object<string, boolean>} */
      senderMap = {},
      /** @type {string} */
      sender,
      /** @type {number} */
      i = 0,
      /** @type {number} */
      messageSenderCount,
      /** @type {Event} */
      e = optionalEvent;

  if (!e)
  {
   e = window.event;
  }

  main.$.preventDefault(e);

  for (messageSenderCount = details.length; i < messageSenderCount; i++)
  {
   sender = details[i];
   if (!senderMap[sender])
   {
    conversationLinks.push(
     "<a href=\"" + url.replace("$name$", sender) + "\" data-keep=\"1\" " +
     "target=\"_blank\">" + sender + "</a>");
    senderMap[sender] = true;
   }
  }

  main.otherConversations = false;
  main.updateBodyIndicator();

  main.showDialog(
   "You received messages from other people. " +
   "Click on name to open your conversation.<br/>" +
   conversationLinks.join("<br/>"),
   true);
 };
/** @param {string} messageTimestampString */
main.messages.reportDelays =
 function (messageTimestampString)
 {
  var /** @type {Date} */
      messageTimestamp,
      /** @type {number} */
      relativeTimeDrift,
      /** @type {number} */
      serverTime = main.timeSynchronization.serverTime,
      /** @type {string} */
      delay;

      //* @type {number} */
      //relativeTimeFromSubmission =
       //main.$.parseDateString(messageTimestamp) -
       //main.timeSynchronization.serverTime;

  if (!serverTime)
  {
   return;
  }

  messageTimestamp = main.$.parseDateString(messageTimestampString);
  relativeTimeDrift = serverTime - main.timeSynchronization.localTime;

  delay =
   String(
    Math.abs(messageTimestamp - ((new Date().getTime()) + relativeTimeDrift)));

  //console.log(
   //messageTimestamp, serverTime, main.timeSynchronization.localTime,
   //relativeTimeDrift, delay);

  if (delay > 10000)
  {
   main.sendReport("delayed-message", delay);
  }
 };
/** @param {string} action */
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
/** @namespace The public API. */
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
