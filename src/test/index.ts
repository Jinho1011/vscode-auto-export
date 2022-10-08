import { DeclareClass, Identifier } from '@babel/types';
import Parser from '../parser';

export declare type TypeAlias = 1;

const document = `
import styled from '@emotion/styled'; // ImportDeclaration

const BigText = 123 // VariableDeclaration
const Text1 = '123', Text2 = '456'; // VariableDeclaration
let var2 = "asfc" // VariableDeclaration
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

export var eFuncArrow = () => {} // 
export function eFunc() {}  // 
export {func1, func2} // ExportNamedDeclaration
export var var3 = {} // ExportNamedDeclaration
export {A, B}
export default BigText; // ExportDefaultDeclaration
`;

export const parser = new Parser(document);
const declarationStatements = parser.getExportableStatements();
const names = parser.getVariablesName(declarationStatements);
const exportStatement = parser.getNamedExportStatement(names);

const existedNamedExports = parser.getExportNamedDeclarations();

existedNamedExports.map((v) => console.log(v.loc));

// document에 exportStatement 추가
// - 만약 이미 declaration이 null이고, specifiers가 있는 ExportNamedDeclaration가 있다면 기존 specifiers들을 새로운 statement에 추가하고
// - 위와 같은 ExportNamedDeclaration이 없다면 document 최하단에 exportStatement를 추가
