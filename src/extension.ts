import {
  commands,
  ExtensionContext,
  Position,
  Range,
  TextEditor,
  window,
} from 'vscode'
import Parser from './parser'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('auto-export-js.exportAllAsNamed', () => {
      const editor: TextEditor | undefined = window.activeTextEditor

      if (editor) {
        const document = editor.document
        const textDocument = document.getText()
        const documentRange = document.validateRange(
          new Range(0, 0, document.lineCount, 0),
        )

        try {
          const parser: Parser = new Parser(textDocument)
          const exportableStatements = parser.getExportableStatements()

          if (exportableStatements.length) {
            const existedNamedExports = parser.getExportNamedDeclarations()
            const exportStatement =
              parser.getNamedExportStatement(exportableStatements)

            editor.edit((editBuilder) => {
              /**
               * prevent redeclare exported variables
               */
              if (existedNamedExports.length) {
                existedNamedExports.map((existedNamedExport, i) => {
                  const startPosition = new Position(
                    existedNamedExport.loc!.start.line - 1,
                    existedNamedExport.loc!.start.column,
                  )
                  const endPosition = new Position(
                    existedNamedExport.loc!.end.line,
                    0,
                  )
                  editBuilder.delete(new Range(startPosition, endPosition))
                })
              }
              /**
               * inserts export statement at the end of the document
               */
              editBuilder.insert(
                new Position(
                  documentRange.end.line,
                  documentRange.end.character,
                ),
                '\n' + exportStatement,
              )
            })
          } else {
            window.showInformationMessage('Cannot find exportable statement.')
          }
        } catch (e) {
          window.showInformationMessage('Cannot parse current document.')
        }
      } else {
        window.showInformationMessage('Cannot find and document.')
      }
    }),
  )
}
