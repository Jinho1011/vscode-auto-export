import { DeclareClass, Identifier } from '@babel/types';
import Parser from '../parser';

export declare type TypeAlias = 1;

const document = `
	import styled from '@emotion/styled'; // ImportDeclaration

	const BigText = 123 // VariableDeclaration
	const Text1 = '123', Text2 = '456'; // VariableDeclaration
	let var2 = "asfc" // VariableDeclaration
	export var var3 = {} // ExportNamedDeclaration
	const func2 = () => console.log(1) // VariableDeclaration
	function func1() {} // FunctionDeclaration
	const func3 = () => {
		const varInFunc1 = 123;
		const funcInFunc = () => {}
	} // VariableDeclaration
  class A {} // ClassDeclaration
  interface B {name:string} // 15 // TSInterfaceDeclaration
  declare interface B {name:string} // TSInterfaceDeclaration
  declare const V1: any; // VariableDeclaration
  declare interface IDeclare {} // TSInterfaceDeclaration

	// export {func1, func2} // ExportNamedDeclaration
	// export default BigText; // ExportDefaultDeclaration
`;

const parser = new Parser(document);
const declarationStatements = parser.getExportableStatements(
  parser._statements
);

const names = parser.getVariablesName(declarationStatements);
const exportStatement = parser.getNamedExportStatement(names);

console.log(exportStatement);
