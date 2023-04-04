// based on https://www.w3schools.com/howto/howto_html_include.asp
async function includeHTML() {
  const w3elements = [];
  let elmnt;
  let file;
  const elmnts = document.getElementsByTagName("*"); // get all HTML elements
  console.log("include invoked");
  /* loop through a collection of all HTML elements and prepare
  collection of elements with w3-include-html tags */
  for (let i = 0; i < elmnts.length; i++) {
    elmnt = elmnts[i];
    if (elmnt.hasAttribute("w3-include-html")) {
      w3elements.push(elmnt);
    }
  }

  while (w3elements.length !== 0) {
    const fetchElement = w3elements.pop();
    file = fetchElement.getAttribute("w3-include-html"); // get a value of the w3-include-html tag
    if (file) {
      try {
        const response = await fetch(file);
        const responseText = await response.text();
        fetchElement.innerHTML = responseText;
        fetchElement.removeAttribute("w3-include-html");
      } catch (error) {
        console.error(`The attempt to get ${file}-file is rejected!`, error);
      }
    }
  }
}
