// Run this in a console of a browser or any other ECMAScript
// runner that supports the copy() function.
// This creates the content of canned_messages.py
// while supporting non-US-ASCII characters
// and copies it to the clipboard.
var list =
     [
      "On my way",
      "Almost home",
      "In a meeting",
      "בפגישה"
     ];
var pythonList = [];
for (var i = 0, count = list.length; i < count; i++)
{
  pythonList.push([]);
  for (var j = 0, characterCount = list[i].length; j < characterCount; j++)
  {
    pythonList[i].push("unichr(" + list[i][j].charCodeAt() + ")");
  }
  pythonList[i] = pythonList[i].join(" + ")
};
copy("list = \\\n [\n  " + pythonList.join(",\n  ") + "\n ]");