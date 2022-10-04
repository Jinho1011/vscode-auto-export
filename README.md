# VS Code JavaScript Checkout
Automaically export javascript variables or functions. Works with JavaScript (ES6) and TypeScript (TS).

## Features
### Exports Named List from selection / document / current line
````javascript
export { var1, var2, var3 }

const var4 = ''; // AutoExport: Exports Named List from current line
export { var1, var2, var3, var4 }
````

### Exports Named Declaration from selection / document / current line
````javascript
export default var1;

const var2 = ''; // AutoExport: Exports Named Declaration
export default var2;
````

### Exports Default Declaration from selection / document / current line
````javascript
export default var1;

const var2 = ''; // AutoExport: Exports Default Declaration
export default var2;
````

### Caution
If export statement already decalred, then extension will override your previous exports.
````javascript
const var1 = 1;
export default var1;

const var2 = 2; // AutoExport: Exports Default Declaration from selection
export default var2;
````


-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)




## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

*


*Enjoy!**
