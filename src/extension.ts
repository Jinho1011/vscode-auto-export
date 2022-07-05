import { commands, ExtensionContext, Uri, window, workspace } from 'vscode';
import Scanner from './scanner';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('auto-export-js.exportAll', () =>
      console.log('Export All var/func')
    )
  );

  context.subscriptions.push(
    commands.registerCommand('auto-export-js.test', () => {
      const editor = window.activeTextEditor;

      if (editor) {
        const document = editor.document.getText();
        const sc = new Scanner(document);

        const varNames = sc.getVariableNames();
        window.showInformationMessage(varNames[0]);

        // editor.edit((editBuilder) => {
        //   editBuilder.replace(selection, reversed);
        // });
      } else {
        window.showInformationMessage('Cannot find and document');
      }
    })
  );
}

// string = /* eslint-disable react-hooks/rules-of-hooks */ /* eslint-disable @typescript-eslint/no-var-requires */ const path = require('path'); const { override, getBabelLoader } = require('customize-cra'); module.exports = override(removeBuiltinBabelConfig, enableBabelConfig); function removeBuiltinBabelConfig(config) { const loader = getBabelLoader(config); loader.options.presets = []; loader.options.plugins = []; return config; } function enableBabelConfig(config) { const loader = getBabelLoader(config); loader.options.configFile = path.resolve(__dirname, 'babel.config.js'); return config; }

export function handleError(error: Error) {
  window.showErrorMessage(error.message);
}
