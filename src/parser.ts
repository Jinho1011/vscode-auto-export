import { parse } from '@babel/parser';
import {
  Declaration,
  DeclareExportAllDeclaration,
  DeclareExportDeclaration,
  DeclareModule,
  DeclareModuleExports,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Identifier,
  ModuleDeclaration,
  Statement,
  TSModuleDeclaration,
} from '@babel/types';

/**
 * Define Exportable Declarations with `@babel/types`
 *
 * @typedef {ExportableDeclaration}
 */
type ExportableDeclaration = Exclude<
  Declaration,
  | ModuleDeclaration
  | TSModuleDeclaration
  | DeclareModule
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | DeclareModuleExports
>;

/**
 * A parser parses the provided document as an entire ECMAScript program.
 */
export default class Parser {
  /**
   * Define all exportable declaration types
   *
   * @readonly
   * @type {{}}
   */
  readonly exportableDeclarations = [
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

  /**
   * Target document to parse with `@babel/parse`
   * @date 10/8/2022 - 11:13:21 PM
   *
   * @readonly
   * @type {string}
   */
  readonly _document: string;

  /**
   * An Array of Statement
   * @date 10/8/2022 - 11:13:21 PM
   *
   * @readonly
   * @type {Statement[]}
   */
  readonly _statements: Statement[];

  /**
   * Creates an instance of Parser.
   *
   * @constructor
   * @param {string} document
   */
  constructor(document: string) {
    this._document = document;
    this._statements = this.getStatements(this._document);
  }

  /**
   * Parse document with `@babel/parser.
   *
   * @param document String of code.
   * @return array of `Statement`
   */
  getStatements(document: string): Statement[] {
    const parsed = parse(document, {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx'],
    });
    return parsed.program.body;
  }

  /**
   * Find name of `node` and return it.
   * If the type of node is `VariableDeclaration`, it will map a declarations property of node and find name in id.
   * Otherwise, it will just find name in id property.
   *
   * @param document String of code.
   * @return An array of name or just single name.
   */
  getVariableName(node: ExportableDeclaration): string | string[] {
    if (node.type === 'VariableDeclaration') {
      return node.declarations.map(
        (declaration) => (declaration.id as Identifier).name
      );
    } else {
      return node.id!.name;
    }
  }

  /**
   * Find Named Exported Declaration that has specifiers
   *
   * @example
   * export { foo, bar }
   *
   * @returns An Array of ExportNamedDeclaration
   */
  getExportNamedDeclarations() {
    return this._statements.filter(
      (statement): statement is ExportNamedDeclaration =>
        statement.type === 'ExportNamedDeclaration' &&
        statement.declaration === null &&
        statement.specifiers.length > 0
    );
  }

  /**
   * Find Default Exported Declaration
   *
   * @example
   * export default foo
   *
   * @returns An ExportDefaultDeclaration if exists.
   * Otherwise, it will return undefined
   */
  getExportDefaultDeclaration(): ExportDefaultDeclaration | undefined {
    return this._statements.filter(
      (statement): statement is ExportDefaultDeclaration =>
        statement.type === 'ExportDefaultDeclaration'
    )[0];
  }

  /**
   * Find exportable variables in array of statement
   *
   * @returns {ExportableDeclaration[]}
   */
  getExportableStatements(): ExportableDeclaration[] {
    return this._statements.filter(
      (statement): statement is ExportableDeclaration =>
        this.exportableDeclarations.includes(statement.type)
    );
  }

  /**
   * Get name of variable/function for the given declarations
   *
   * @param {ExportableDeclaration[]} declarations
   *
   * @return An array of string because of multiple variables declaration
   *
   * @example
   * let foo, bar; // -> ['foo', 'bar']
   * let baz; // -> ['baz']
   */
  getVariablesName(declarations: ExportableDeclaration[]) {
    return [
      ...new Set(
        declarations
          .map((declaration) => this.getVariableName(declaration))
          .flat()
      ),
    ];
  }

  /**
   * Get export statement for the given array of ExportableDeclaration
   *
   * @param {ExportableDeclaration[]} declarations
   *
   * @return A string of export statement.
   * If the variable name exported as default is included, exclude it and generate an export statement.
   */
  getNamedExportStatement(declarations: ExportableDeclaration[]) {
    const existedDefaultExport = this.getExportDefaultDeclaration();
    const names = this.getVariablesName(declarations);

    /**
     * exclude default exported variable from export statement
     */
    if (existedDefaultExport) {
      return `export { ${names
        .filter(
          (name) =>
            name !== (existedDefaultExport.declaration as Identifier).name
        )
        .join(', ')} }`;
    }

    return `export { ${names.join(', ')} }`;
  }
}
