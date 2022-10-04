import * as assert from 'assert';
import * as vscode from 'vscode';
import Parser from '../../parser';

const document = `
	import styled from '@emotion/styled'; // ImportDeclaration

	const BigText = 123 // VariableDeclaration
	const Text1 = '123', Text2 = '456';
	let var2 = "asfc" // VariableDeclaration
	export var var3 = {} // ExportNamedDeclaration
	const func2 = () => console.log(1) // VariableDeclaration
	function func1() {} // FunctionDeclaration
	const func3 = () => {
		const varInFunc1 = 123;
		const funcInFunc = () => {}
	} // VariableDeclaration

	export {func1, func2} // ExportNamedDeclaration
	export default BigText; // ExportDefaultDeclaration
`;

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('@babel/parser test', () => {
		vscode.window.createInputBox();
		const parser = new Parser(document);
		const declarationStatements = parser.getExportableStatements(parser._statements);
		console.log(JSON.stringify(declarationStatements, null, 4));
		// const exportStatement = parser.getExportStatement(exportableStatements, 'named');



		// vscode.window.showInformationMessage(nodes);


		// assert.strictEqual(1, [1, 2, 3].indexOf(0));
	});
});

