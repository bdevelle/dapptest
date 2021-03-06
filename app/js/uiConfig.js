'use strict';

/** 
 * The default settings 
 * @private
 * @type {Object}
 */ 
const defaultConfig = {
	homePlugin: 'Overview',
	siadAddress: 'http://localhost:9980',
	zoom: 1,
};

/**
 * The config object derived from the config.json file used to store UI settings
 * @typedef {Object} config
 * @property {string} homePlugin - The name of the default plugin, usually 'Overview'
 * @property {string} siadAddress - Usually 'http://localhost:9980'
 * @property {string} siadCommand - The command to run siad
 * @property {number} zoom - The zoom factor for the UI
 */

/**
 * Holds all config.json related logic for the UI
 * @module UIConfig
 */
module.exports = {
	/**
	 * Writes the current config to defaultConfigPath
	 * @param {config} config - config in memory
	 * @param {string} path - UI's defaultConfigPath
	 */
	save: function(config, path) {
		if (config !== undefined) {
			Fs.writeFile(path, JSON.stringify(config, null, '\t'), function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	},

	/**
	 * Finds if a config file exists and uses default if not
	 * @param {string} path - UI's defaultConfigPath
	 * @param {callback} callback
	 */
	load: function(path, callback) {
		Fs.readFile(path, function(err, data) {
			if (err || data === 'undefined') {
				// no file found, use default config
				callback(defaultConfig);
			} else {
				// found config, use it
				callback(JSON.parse(data));
			}
		});
	},

	/**
	 * returns the defaultConfig
	 * @param {callback} callback
	 */
	reset: function(callback) {
		callback(defaultConfig);
	},
};
