/**
 * Config handler
 */
const vscode = require( 'vscode' );
const { CONFIGURATION_KEY } = require( './constants' );

function getConfig( key ) {
	return vscode.workspace.getConfiguration( CONFIGURATION_KEY ).get( key );
}

module.exports = {
	getConfig,
};
