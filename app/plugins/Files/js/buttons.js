'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');

// Used to hide subsequent steps when selecting an earlier one
function hideSteps(steps) {
	steps.forEach(function(step) {
		var c = eID('step' + step).children;
		for (var i = 0; i < c.length; i++) {
			if(!hidden(c[i])) {
				hide(c[i]);
			}
		}
	});
}

// Exit function to return to general filelist view
function exitFileAdder() {
	hide('add-dir');
	hide('add-file');
	show('file-library');

	hideSteps([2,3,'f2','f3']);

	// Clear fields
	var fields = document.querySelectorAll('.description-field');
	for (var i = 0; i < fields.length; i++) {
		fields[i].value = '';
	}
	var paths = document.querySelectorAll('.file-path, .dir-path');
	for (var j = 0; j < paths.length; j++) {
		paths[j].innerHTML = '';
	}
}

// TODO: Get sliding frame in to work
eID('new-file').onclick = function() {
	show('add-file');
	hide('file-library');
};
eID('back').onclick = exitFileAdder;

// Upload file option chosen
eID('upload-choice').onclick = function() {
	hideSteps([2,3]);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('nickname-file').querySelector('.file-path').innerHTML = loadPath;
		eID('nickname-file-input').value = nameFromPath(loadPath[0]);
		show('nickname-file');
		show('upload-file');
		// TODO: this does not work for some reason. Perhaps the view needs to
		// be refocused after the dialog box is closed.
		eID('nickname-file-input').focus();
	}
};

// An 'Enter' keypress in the input field will submit it.
eID('nickname-file-input').addEventListener('keydown', function(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        eID('upload-file').click();
    }
}, false);
eID('upload-file').onclick = function() {
	var loadPath = eID('nickname-file').querySelector('.file-path').innerHTML;
	var nickname = eID('nickname-file-input').value;
	upload(loadPath, nickname);
	exitFileAdder();
	update();
	eID('nickname-file-input').focus();
};

// Sia file option chosen
eID('sia-choice').onclick = function() {
	hideSteps([2,3]);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Sia File Path',
		filters: [
			{ name: 'Sia file', extensions: ['sia'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('sia-file').querySelector('.file-path').innerHTML = loadPath;
		show('sia-file');
		show('add-sia-file');
	}
};
eID('add-sia-file').onclick = function() {
	var loadPath = eID('sia-file').querySelector('.file-path').innerHTML;
	loadDotSia(loadPath);
};

// ASCII file option chosen
eID('ascii-choice').onclick = function() {
	hideSteps([2,3]);

	show('paste-ascii');
	show('add-ascii-file');
	eID('paste-ascii-input').focus();
};
// An 'Enter' keypress in the input field will submit it.
eID('paste-ascii-input').addEventListener('keydown', function(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        eID('add-ascii-file').click();
    }
}, false);
eID('add-ascii-file').onclick = function() {
	loadAscii(eID('paste-ascii-input').value);
};

// Share ASCII popup
eID('copy-ascii').onclick = function() {
	var file = eID('show-ascii').querySelector('.ascii').innerHTML;
	var nickname = eID('show-ascii').querySelector('.title').innerHTML;
	Clipboard.writeText(file);
	notify('Copied ' + nickname + '.sia to clipboard!', 'asciifile');
	hide('show-ascii');
};
eID('cancel-ascii').onclick = function() {
	hide('show-ascii');
};

// Confirm file deletion
eID('delete-file').onclick = function() {
	var nickname = eID('confirm-delete').querySelector('.nickname').innerHTML;
	deleteFile(nickname);
	hide('confirm-delete');
};
eID('cancel-delete').onclick = function() {
	hide('confirm-delete');
};

// Select directory sliding frame
eID('new-dir').onclick = function() {
	show('add-dir');
	hide('file-library');
};
eID('back-dir').onclick = exitFileAdder;

// Upload directory option chosen
eID('upload-dir-choice').onclick = function() {
	hideSteps(['f2','f3']);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Select Directory',
		properties: ['openDirectory'],
	});

	// Check that loadPath is a valid path
	if (loadPath) {
		eID('nickname-dir').querySelector('.dir-path').innerHTML = loadPath;
		loadPath = loadPath[0].split(Path.sep);
		eID('nickname-dir-input').value = loadPath[loadPath.length - 1] + '_';
		show('nickname-dir');
		show('upload-dir');
		eID('nickname-dir-input').focus();
	}
};

eID('upload-dir').onclick = function() {
	var loadPath = eID('nickname-dir').querySelector('.dir-path').innerHTML;
	var nickname = eID('nickname-dir-input').value;
	// Illegal filename characters in nickname seems to throw errors
	// So, substitute \ and / with underscore (_)
	nickname.replace(/[/\\\\]/g, '_');
	exitFileAdder();
	update();
	uploadDir(loadPath, nickname);
};

// Filter file list by search string
function filterFileList(searchstr) {
	NodeList.prototype.forEach = Array.prototype.forEach;
	var entries = eID('file-browser').childNodes;
	entries.forEach( function(entry) {
		if (entry.querySelector('.name').innerHTML.indexOf(searchstr) > -1) {
			show(entry);
		} else {
			hide(entry);
		}
	});
}

// Start search when typing in Search field
eID('search-bar').onkeyup = function() {
	tooltip('Searching...', this);
	var searchstr = eID('search-bar').value;
	filterFileList(searchstr);
};

