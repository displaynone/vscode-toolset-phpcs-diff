const {
	workspace,
	Range,
	languages,
	Diagnostic,
	DiagnosticSeverity,
} = require( 'vscode' );
const { getConfig } = require( '../utils/config' );
const { PHPCS_DIFF_ARGUMENTS } = require( '../utils/constants' );
const cp = require( 'child_process' );

class ToolsetPHPCSDiff {
	/**
	 * Constructor
	 *
	 * @param {vscode.ExtensionContext} context
	 */
	constructor( context ) {
		this.context = context;
	}

	/**
	 * Sets events for saving document
	 */
	setOnSaveDocument() {
		const self = this;
		const createDiagnosticCollection = languages.createDiagnosticCollection( 'toolset-phpcs-diff' );
		this.context.subscriptions.push( workspace.onWillSaveTextDocument( function( event ) {
			if (
				event.document.languageId === 'php' &&
				getConfig( 'path' )
			) {
				self.run( function( error, stdout ) {
					if ( ! stdout ) {
						return;
					}
					const data = JSON.parse( stdout );

					if ( data.constructor === Object ) {
						const diagnostics = [];
						Object.keys( data ).forEach( typeError => {
							data[ typeError ].forEach( errorData => {
								const [ , line, startCharacter, message ] = errorData;
								const range = new Range( line, startCharacter, line, startCharacter + 1 );

								let severity = null;
								switch ( typeError ) {
									case 'blockers':
										severity = DiagnosticSeverity.Error;
										break;
									case 'warnings':
										severity = DiagnosticSeverity.Warning;
										break;
									default:
										severity = DiagnosticSeverity.Hint;
										break;
								}
								diagnostics.push( new Diagnostic( range, message, severity, null, 'toolset-phpcs-diff' ) );
							} );
						} );
						createDiagnosticCollection.set( event.document.uri, diagnostics );
					} else {
						createDiagnosticCollection.clear();
					}
				} );
			}
		} ) );
	}

	/**
	 * Runs PHPCS
	 *
	 * @param {Function} callback Callback that handles the result of PHPCS Diff
	 */
	run( callback ) {
		const args = [ ... PHPCS_DIFF_ARGUMENTS ];
		const path = getConfig( 'path' );
		if ( ! path ) {
			return;
		}
		const options = {
			cwd: workspace.workspaceFolders[ 0 ].uri.fsPath,
		};
		cp.exec( `${ path } ${ args.join( ' ' ) }`, options, callback );
	}
}

module.exports = {
	ToolsetPHPCSDiff,
};
