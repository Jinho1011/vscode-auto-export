import { commands, ExtensionContext, window } from 'vscode';
import scanner from './parser';

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

        // editor.edit((editBuilder) => {
        //   editBuilder.replace(selection, reversed);
        // });
      } else {
        window.showInformationMessage('Cannot find and document');
      }
    })
  );
}
