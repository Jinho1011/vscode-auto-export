import { parse } from "@babel/parser";
import {
  BlockStatement,
  Declaration,
  FunctionDeclaration,
  ModuleDeclaration,
  Statement,
  TSInterfaceDeclaration,
  TSTypeAliasDeclaration,
  VariableDeclaration,
} from "@babel/types";

const EXPORTABLE_TYPES = [
  "VariableDeclaration",
  "FunctionDeclaration",
  // "TSInterfaceDeclaration",
  // "TSTypeAliasDeclaration",
];

type ExportableDeclaration = Exclude<Declaration, ModuleDeclaration>;

export default class Parser {
  _document: string;
  _statements: Statement[];

  constructor(document: string) {
    this._document = document;
    this._statements = this.getStatements(this._document);
  }

  getStatements(document: string): Statement[] {
    const parsed = parse(document, {
      sourceType: "unambiguous",
      plugins: ["typescript"],
    });
    return parsed.program.body;
  }

  isDeclaration(statement: Statement): statement is ExportableDeclaration {
    // return (statement as ExportableDeclaration).type
  }

  getExportableStatements(statements: Statement[]) {
    // filter Declaration from Statement
    return statements.filter(this.isDeclaration);
  }

  // getExportStatement(
  //   statements: Exclude<Statement, BlockStatement>[],
  //   type: "named" | "default"
  // ) {
  //   // let exportStatement = `export {${statements.map(statement => statement.)}}`;
  //   statements
  //     .map((statement) => {
  //       return statement.declaration.map((v) => v.id.name);
  //     })
  //     .flatMap();
  // }
}

// const EXPORTABLE_TYPES = ['VariableDeclaration','FunctionDeclaration', 'TSInterfaceDeclaration', 'TSTypeAliasDeclaration'];

// export default (document: string) => {
//   const parsed = parse(document, { sourceType: "unambiguous", plugins:["typescript"] });
//   const nodes = parsed.program.body;
//   const exportableVariables = nodes.filter(node => node.type);
//   return exportableVariables;
// };

// const getNodes = () => {

// };

// const getExportableVariables = () => {

// };
