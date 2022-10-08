import {
  commands,
  ExtensionContext,
  Position,
  Range,
  TextEditor,
  window,
} from 'vscode';
import Parser from './parser';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('auto-export-js.exportAll', () => {})
  );

  context.subscriptions.push(
    commands.registerCommand('auto-export-js.test', () => {
      const editor: TextEditor | undefined = window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const textDocument = document.getText();
        const invalidRange = new Range(
          0,
          0,
          document.lineCount /*intentionally missing the '-1' */,
          0
        );
        const fullRange = document.validateRange(invalidRange);

        const parser: Parser = new Parser(textDocument);

        const declarationStatements = parser.getExportableStatements();
        const names = parser.getVariablesName(declarationStatements);
        const exportStatement = parser.getNamedExportStatement(names);

        const existedNamedExports = parser.getExportNamedDeclarations();

        if (true) {
          editor.edit((editBuilder) => {
            if (existedNamedExports.length) {
              existedNamedExports.map((existedNamedExport, i) => {
                const startPosition = new Position(
                  existedNamedExport.loc!.start.line - 1,
                  existedNamedExport.loc!.start.column
                );
                const endPosition = new Position(
                  existedNamedExport.loc!.end.line,
                  0
                );
                endPosition.isAfter(new Position(0, 0));
                console.log(existedNamedExport.loc);
                console.log(startPosition, endPosition);
                editBuilder.delete(new Range(startPosition, endPosition));
              });
            }

            editBuilder.insert(
              new Position(fullRange.end.line, fullRange.end.character),
              '\n'
            );
            editBuilder.insert(
              new Position(fullRange.end.line + 1, 0),
              exportStatement
            );
          });
        }
      } else {
        window.showInformationMessage('Cannot find and document');
      }
    })
  );
}
