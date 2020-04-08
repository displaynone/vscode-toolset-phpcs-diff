const vscode = require( 'vscode' );
const phpcsdiff = require( './library/phpcs-diff' );

/**
 * Activates the extension
 *
 * @param {vscode.ExtensionContext} context
 */
function activate( context ) {
	const toolsetPHPCSDiff = new phpcsdiff.ToolsetPHPCSDiff( context );
	toolsetPHPCSDiff.setOnSaveDocument();

	const disposable = vscode.commands.registerCommand( 'extension.toolsetphpcsdiff', function() {
		vscode.window.showInformationMessage( 'Toolset PHPCS diff!' );
	} );

	context.subscriptions.push( disposable );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
