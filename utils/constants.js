module.exports = {
	CONFIGURATION_KEY: 'toolset-phpcs-diff',
	PHPCS_DIFF_ARGUMENTS: [ '--sniff_unstaged', '--log_level=0', '--no_colours', '--standard=./phpcsdiff.xml', '--format=json' ],
};
