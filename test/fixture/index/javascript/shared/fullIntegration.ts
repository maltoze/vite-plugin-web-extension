function getOptionsHtml() {
  return `import { l as logo } from "../../../../../../../../../logo.js";
const style = "";
const imageUrl = new URL(logo, import.meta.url).href;
document.querySelector("#app").innerHTML = \`
  <img src="\${imageUrl}" height="45" alt="" />
  <h1>Options</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Docs</a>
\`;
`;
}

function getPrimaryJS() {
  return `import { l as logo } from "../../../../../../../../../../logo.js";
async function renderContent(cssPaths, render = (_appRoot) => {
}) {
  console.log("renderContent", cssPaths);
}
const style = "";
renderContent(["assets/main.css"], (appRoot) => {
  const logoImageUrl = new URL(logo, import.meta.url).href;
  appRoot.innerHTML = \`
    <div class="logo">
      <img src="\${logoImageUrl}" height="50" alt="" />
    </div>
  \`;
});
console.log(chrome.runtime.getURL("src/lib.js"));
`;
}

function getLibJS() {
  return 'console.log("lib.js");\n';
}

function getBackgroundJS(manifestVersion: 2 | 3) {
  return `browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
browser.action.onClicked.addListener(async () => {
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: ${
      manifestVersion === 2 ? `tab == null ? void 0 : tab.id` : `tab?.id`
    } },
    files: ["src/lib.js"]
  });
});
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
`;
}

export function getExpectedCode(resourceDir: string, manifestVersion: 2 | 3) {
  const chunkCode = {
    [`assets/${resourceDir}/src/entries/options/index.js`]: getOptionsHtml(),
    [`assets/${resourceDir}/src/entries/contentScript/primary/main.js`]:
      getPrimaryJS(),
    [`assets/${resourceDir}/src/lib.js`]: getLibJS(),
    [`assets/logo.js`]: `const logo = "/assets/logo.svg";
export {
  logo as l
};
`,
  };

  if (manifestVersion === 2) {
    chunkCode[`assets/background.js`] = getBackgroundJS(manifestVersion);
  }

  if (manifestVersion === 3) {
    chunkCode[`assets/${resourceDir}/src/entries/background/main.js`] =
      getBackgroundJS(3);
  }

  const assetCode = {
    [`assets/logo.svg`]: `{"type":"Buffer","data":[60,63,120,109,108,32,118,101,114,115,105,111,110,61,34,49,46,48,34,63,62,10,60,115,118,103,32,119,105,100,116,104,61,34,52,52,51,34,32,104,101,105,103,104,116,61,34,54,56,49,34,32,120,109,108,110,115,61,34,104,116,116,112,58,47,47,119,119,119,46,119,51,46,111,114,103,47,50,48,48,48,47,115,118,103,34,32,120,109,108,110,115,58,115,118,103,61,34,104,116,116,112,58,47,47,119,119,119,46,119,51,46,111,114,103,47,50,48,48,48,47,115,118,103,34,62,10,32,60,103,32,99,108,97,115,115,61,34,108,97,121,101,114,34,62,10,32,32,60,116,105,116,108,101,62,76,97,121,101,114,32,49,60,47,116,105,116,108,101,62,10,32,32,60,112,97,116,104,32,100,61,34,109,48,46,48,55,53,55,51,52,44,48,99,57,44,50,54,46,53,53,32,49,56,46,56,52,44,53,50,46,56,49,32,50,56,46,50,52,44,55,57,46,50,50,99,51,48,46,51,51,44,56,52,46,54,32,54,49,46,51,44,49,54,56,46,57,55,32,57,49,46,50,50,44,50,53,51,46,55,50,99,49,51,46,50,53,44,51,54,46,55,51,32,50,54,46,50,57,44,55,51,46,53,51,32,51,57,46,54,51,44,49,49,48,46,50,51,99,45,49,48,46,48,56,44,49,56,46,52,51,32,45,50,49,46,56,50,44,51,53,46,56,57,32,45,51,50,46,51,57,44,53,52,46,48,52,99,45,49,49,46,52,52,44,49,56,46,56,57,32,45,50,51,46,48,57,44,51,55,46,54,53,32,45,51,52,46,51,53,44,53,54,46,54,52,99,45,53,46,51,51,44,45,52,46,56,57,32,45,57,46,56,44,45,49,48,46,54,49,32,45,49,52,46,53,52,44,45,49,54,46,48,53,99,45,49,50,46,55,51,44,45,49,52,46,56,56,32,45,50,54,46,49,53,44,45,50,57,46,49,54,32,45,51,56,46,56,50,44,45,52,52,46,48,57,99,45,54,46,50,56,44,45,55,46,48,56,32,45,49,50,46,52,51,44,45,49,52,46,50,57,32,45,49,56,46,57,51,44,45,50,49,46,49,56,99,45,49,46,52,57,44,45,49,46,51,57,32,45,50,46,48,50,44,45,51,46,51,56,32,45,49,46,57,51,44,45,53,46,51,54,99,45,48,46,49,52,44,45,49,50,46,55,50,32,45,49,46,50,49,44,45,50,53,46,52,32,45,49,46,51,51,44,45,51,56,46,49,51,99,45,49,46,48,53,44,45,49,48,46,53,50,32,45,48,46,52,49,44,45,50,49,46,49,51,32,45,49,46,52,55,44,45,51,49,46,54,52,99,45,49,46,54,54,44,45,52,57,46,49,50,32,45,52,44,45,57,56,46,50,32,45,53,46,54,54,44,45,49,52,55,46,51,50,99,45,48,46,56,51,44,45,55,46,57,55,32,45,48,46,52,53,44,45,49,54,32,45,49,46,48,53,44,45,50,51,46,57,56,99,45,48,46,56,51,44,45,57,46,48,51,32,45,48,46,51,54,44,45,49,56,46,49,51,32,45,49,46,48,57,44,45,50,55,46,49,55,99,45,48,46,55,49,44,45,57,46,50,56,32,45,48,46,51,44,45,49,56,46,54,49,32,45,49,46,50,49,44,45,50,55,46,56,56,99,45,48,46,52,49,44,45,56,46,48,56,32,45,48,46,49,53,44,45,49,54,46,49,57,32,45,48,46,57,53,44,45,50,52,46,50,52,99,45,48,46,52,55,44,45,55,46,50,57,32,45,48,46,49,57,44,45,49,52,46,54,32,45,48,46,56,53,44,45,50,49,46,56,56,99,45,48,46,54,44,45,57,46,54,50,32,45,48,46,51,51,44,45,49,57,46,50,56,32,45,49,46,49,53,44,45,50,56,46,56,57,99,45,48,46,52,51,44,45,56,46,52,50,32,45,48,46,50,44,45,49,54,46,56,55,32,45,49,46,48,56,44,45,50,53,46,50,55,99,45,48,46,51,51,44,45,54,46,53,53,32,45,48,46,50,44,45,49,51,46,49,50,32,45,48,46,54,54,44,45,49,57,46,54,55,99,45,48,46,55,57,44,45,57,46,54,51,32,45,48,46,51,55,44,45,49,57,46,51,50,32,45,49,46,50,53,44,45,50,56,46,57,53,99,45,48,46,49,54,44,45,55,46,51,56,32,45,48,46,54,52,44,45,49,52,46,55,55,32,45,48,46,51,56,44,45,50,50,46,49,53,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,51,34,47,62,10,32,32,60,112,97,116,104,32,100,61,34,109,52,52,48,46,54,56,53,55,51,52,44,56,46,54,51,99,48,46,53,55,44,45,49,46,54,57,32,49,46,52,50,44,45,51,46,50,50,32,50,46,53,53,44,45,52,46,54,99,48,46,50,52,44,49,49,46,54,56,32,45,48,46,50,57,44,50,51,46,51,56,32,45,48,46,57,52,44,51,53,46,48,52,99,45,48,46,55,51,44,51,48,46,55,32,45,50,46,55,53,44,54,49,46,51,51,32,45,51,46,53,44,57,50,46,48,50,99,45,48,46,57,56,44,57,46,56,53,32,45,48,46,52,50,44,49,57,46,55,55,32,45,49,46,51,55,44,50,57,46,54,50,99,45,51,46,50,53,44,56,49,46,54,55,32,45,54,46,54,52,44,49,54,51,46,51,53,32,45,57,46,56,51,44,50,52,53,46,48,51,99,45,48,46,56,44,56,46,55,55,32,45,48,46,51,44,49,55,46,54,32,45,49,46,50,51,44,50,54,46,51,54,99,45,48,46,51,56,44,49,50,46,56,50,32,45,48,46,56,54,44,50,53,46,54,52,32,45,49,46,53,53,44,51,56,46,52,51,99,45,50,46,49,56,44,51,46,51,52,32,45,53,46,49,50,44,54,46,49,32,45,55,46,55,53,44,57,46,48,56,99,45,49,48,46,55,50,44,49,49,46,54,51,32,45,50,48,46,54,51,44,50,51,46,57,56,32,45,51,49,46,52,50,44,51,53,46,53,51,99,45,49,49,46,53,51,44,49,50,46,56,57,32,45,50,50,46,55,50,44,50,54,46,48,54,32,45,51,52,46,50,52,44,51,56,46,57,53,99,45,51,46,54,53,44,45,52,46,52,54,32,45,54,46,49,51,44,45,57,46,55,49,32,45,57,46,49,55,44,45,49,52,46,53,56,99,45,49,56,46,53,44,45,51,48,46,55,57,32,45,51,55,46,51,52,44,45,54,49,46,51,56,32,45,53,53,46,56,50,44,45,57,50,46,49,57,99,45,49,46,51,50,44,45,50,32,45,50,46,53,44,45,52,46,52,49,32,45,49,46,49,57,44,45,54,46,55,51,99,50,57,46,50,55,44,45,56,48,46,56,54,32,53,55,46,57,52,44,45,49,54,49,46,57,52,32,56,55,46,50,51,44,45,50,52,50,46,56,99,50,50,46,57,49,44,45,54,50,46,57,57,32,52,53,46,55,51,44,45,49,50,54,46,48,50,32,54,56,46,50,51,44,45,49,56,57,46,49,54,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,52,34,47,62,10,32,32,60,112,97,116,104,32,100,61,34,109,49,57,49,46,54,52,53,55,51,52,44,49,53,52,46,51,53,99,49,48,46,48,49,44,56,46,53,32,49,57,46,57,49,44,49,55,46,49,53,32,50,57,46,57,56,44,50,53,46,53,56,99,49,48,46,53,49,44,45,56,46,50,32,50,48,46,50,51,44,45,49,55,46,51,54,32,51,48,46,54,53,44,45,50,53,46,54,54,99,45,56,46,53,54,44,49,57,46,50,52,32,45,49,55,46,54,52,44,51,56,46,50,51,32,45,50,54,46,49,51,44,53,55,46,53,99,45,49,46,51,56,44,51,46,48,52,32,45,50,46,55,57,44,54,46,48,55,32,45,52,46,51,57,44,57,99,45,52,46,51,54,44,45,56,46,52,55,32,45,55,46,56,52,44,45,49,55,46,51,54,32,45,49,49,46,57,52,44,45,50,53,46,57,53,99,45,54,46,48,53,44,45,49,51,46,52,57,32,45,49,50,46,53,53,44,45,50,54,46,55,57,32,45,49,56,46,49,55,44,45,52,48,46,52,55,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,53,34,47,62,10,32,32,60,112,97,116,104,32,100,61,34,109,50,50,49,46,55,49,53,55,51,52,44,50,52,50,46,54,99,56,46,51,44,45,49,54,46,50,56,32,49,53,46,50,57,44,45,51,51,46,50,32,50,51,46,51,52,44,45,52,57,46,54,99,49,46,50,57,44,55,46,56,32,48,46,54,54,44,49,53,46,55,51,32,49,46,54,54,44,50,51,46,53,54,99,53,46,51,44,57,49,46,56,53,32,49,48,46,53,56,44,49,56,51,46,54,57,32,49,53,46,57,55,44,50,55,53,46,53,52,99,51,46,53,51,44,54,50,46,57,55,32,55,46,53,54,44,49,50,53,46,57,49,32,49,48,46,55,49,44,49,56,56,46,57,99,45,49,55,46,53,44,45,49,57,46,49,50,32,45,51,52,46,50,53,44,45,51,56,46,57,53,32,45,53,49,46,56,44,45,53,56,46,48,50,99,45,49,55,46,50,52,44,49,57,46,51,54,32,45,51,52,46,52,56,44,51,56,46,55,51,32,45,53,49,46,54,51,44,53,56,46,49,54,99,45,48,46,50,54,44,45,57,46,51,56,32,49,46,50,44,45,49,56,46,54,56,32,49,46,50,55,44,45,50,56,46,48,52,99,57,46,48,56,44,45,49,53,51,46,48,52,32,49,55,46,57,44,45,51,48,54,46,48,57,32,50,55,44,45,52,53,57,46,49,52,99,48,46,51,56,44,48,46,51,54,32,49,46,49,52,44,49,46,48,56,32,49,46,53,50,44,49,46,52,52,99,55,46,51,51,44,49,53,46,55,50,32,49,52,46,50,50,44,51,49,46,54,55,32,50,49,46,57,54,44,52,55,46,50,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,54,34,47,62,10,32,32,60,112,97,116,104,32,100,61,34,109,50,55,50,46,51,54,53,55,51,52,44,52,52,52,46,50,53,99,51,46,54,50,44,52,46,50,56,32,53,46,57,44,57,46,52,54,32,56,46,56,53,44,49,52,46,50,99,49,57,46,56,56,44,51,50,46,56,50,32,51,57,46,55,52,44,54,53,46,54,53,32,53,57,46,52,44,57,56,46,54,99,51,46,55,51,44,54,46,51,51,32,55,46,56,56,44,49,50,46,52,51,32,49,49,46,49,51,44,49,57,46,48,51,99,45,56,46,53,52,44,49,52,46,52,32,45,49,55,46,56,50,44,50,56,46,51,52,32,45,50,54,46,54,55,44,52,50,46,53,53,99,45,49,48,46,53,53,44,49,55,46,51,57,32,45,50,49,46,55,56,44,51,52,46,51,53,32,45,51,50,46,52,44,53,49,46,55,49,99,45,50,46,52,52,44,51,46,51,32,45,51,46,57,51,44,55,46,51,57,32,45,55,46,50,50,44,49,48,99,45,52,46,49,50,44,45,55,48,46,49,56,32,45,55,46,56,49,44,45,49,52,48,46,51,55,32,45,49,49,46,56,55,44,45,50,49,48,46,53,53,99,45,48,46,51,49,44,45,56,46,53,50,32,45,49,46,50,57,44,45,49,55,46,48,50,32,45,49,46,50,50,44,45,50,53,46,53,52,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,55,34,47,62,10,32,32,60,112,97,116,104,32,100,61,34,109,49,54,50,46,48,55,53,55,51,52,44,52,53,56,46,53,53,99,51,46,48,52,44,45,52,46,54,51,32,53,46,48,52,44,45,57,46,57,56,32,56,46,57,54,44,45,49,51,46,57,56,99,45,48,46,51,56,44,49,53,46,52,55,32,45,49,46,55,52,44,51,48,46,56,57,32,45,50,46,52,53,44,52,54,46,51,53,99,45,51,46,53,49,44,54,51,46,52,52,32,45,55,46,51,50,44,49,50,54,46,56,53,32,45,49,48,46,54,56,44,49,57,48,46,50,57,99,45,49,48,46,53,52,44,45,49,53,46,55,49,32,45,50,48,46,49,51,44,45,51,50,46,48,53,32,45,51,48,46,52,57,44,45,52,55,46,56,56,99,45,49,49,46,55,53,44,45,49,57,46,50,55,32,45,50,52,46,48,51,44,45,51,56,46,49,57,32,45,51,53,46,56,56,44,45,53,55,46,51,57,99,50,46,51,53,44,45,53,46,49,32,53,46,53,55,44,45,57,46,55,50,32,56,46,52,54,44,45,49,52,46,53,50,99,50,48,46,52,57,44,45,51,52,46,52,50,32,52,49,46,51,50,44,45,54,56,46,54,50,32,54,50,46,48,56,44,45,49,48,50,46,56,55,122,34,32,102,105,108,108,61,34,35,99,55,50,97,50,49,34,32,105,100,61,34,115,118,103,95,56,34,47,62,10,32,60,47,103,62,10,60,47,115,118,103,62,10]}`,
    [`assets/index.css`]: `#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  margin: 5px;
}
`,
    [`assets/main.css`]: `.logo {
  z-index: 99999;
  position: fixed;
  bottom: 20px;
  right: 10px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #c72a21;
  border-radius: 50%;
  background-color: #fff;
}

img {
  position: absolute;
  top: 7px;
}
`,
    [`${resourceDir}/src/entries/options/index.html`]: `<!DOCTYPE html>\n<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <title>Options</title>
    <script type=\"module\" crossorigin src=\"/assets/test/fixture/index/javascript/resources/fullIntegration/src/entries/options/index.js\"></script>
    <link rel=\"modulepreload\" crossorigin href=\"/assets/logo.js\">
    <link rel=\"stylesheet\" href=\"/assets/index.css\">
  </head>
  <body>
    <div id=\"app\"></div>
    
  </body>
</html>
`,
    [`${resourceDir}/src/lib.js`]:
      '(async()=>{await import(chrome.runtime.getURL("assets/test/fixture/index/javascript/resources/fullIntegration/src/lib.js"))})();',
    [`${resourceDir}/src/entries/contentScript/primary/main.js`]:
      '(async()=>{await import(chrome.runtime.getURL("assets/test/fixture/index/javascript/resources/fullIntegration/src/entries/contentScript/primary/main.js"))})();',
  };

  if (manifestVersion === 2) {
    assetCode[
      `background.html`
    ] = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />  <script type="module" crossorigin src="/assets/background.js"></script>
</head></html>`;
  }

  if (manifestVersion === 3) {
    assetCode[
      `serviceWorker.js`
    ] = `import "/assets/test/fixture/index/javascript/resources/fullIntegration/src/entries/background/main.js";`;
  }

  return {
    chunkCode,
    assetCode,
  };
}
