import { parse } from '@babel/parser';
import {
  Declaration,
  DeclareExportAllDeclaration,
  DeclareExportDeclaration,
  DeclareModule,
  DeclareModuleExports,
  Identifier,
  ModuleDeclaration,
  Statement,
  TSModuleDeclaration,
} from '@babel/types';

type ExportableDeclaration = Exclude<
  Declaration,
  | ModuleDeclaration
  | TSModuleDeclaration
  | DeclareModule
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | DeclareModuleExports
>;

export default class Parser {
  exportableDeclarations = [
    'FunctionDeclaration',
    'VariableDeclaration',
    'ClassDeclaration',
    'DeclareClass',
    'DeclareFunction',
    'DeclareInterface',
    'DeclareTypeAlias',
    'DeclareOpaqueType',
    'DeclareVariable',
    'InterfaceDeclaration',
    'OpaqueType',
    'TypeAlias',
    'EnumDeclaration',
    'TSDeclareFunction',
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'TSEnumDeclaration',
    // "TSModuleDeclaration",
    // "DeclareModule",
    // "DeclareExportDeclaration",
    // "DeclareExportAllDeclaration",
    // "DeclareModuleExports",
  ];

  _document: string;
  _statements: Statement[];

  constructor(document: string) {
    this._document = document;
    this._statements = this.getStatements(this._document);
  }

  getStatements(document: string): Statement[] {
    const parsed = parse(document, {
      sourceType: 'unambiguous',
      plugins: ['typescript'],
    });
    return parsed.program.body;
  }

  getExportableStatements(statements: Statement[]) {
    return statements.filter((statement): statement is ExportableDeclaration =>
      this.exportableDeclarations.includes(statement.type)
    );
  }

  getVariableName(node: ExportableDeclaration): string {
    if (node.type === 'VariableDeclaration') {
      return node.declarations
        .map((declaration) => (declaration.id as Identifier).name)
        .join(', ');
    } else {
      return node.id!.name;
    }
  }

  getVariablesName(nodes: ExportableDeclaration[]) {
    return [...new Set(nodes.map((node) => this.getVariableName(node)))];
  }

  getNamedExportStatement(names: string[]) {
    return `export { ${names.join(', ')} }`;
  }
}
