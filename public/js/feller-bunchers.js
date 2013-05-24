function toggleLog(type) {
    var logs = document.getElementsByClassName(type);
    for (var i = 0; i < logs.length; i++) {
	var log = logs[i];
	if (log.style.display && (log.style.display === 'none' || log.style.display === '')) {
	    log.style.display = 'block';
	} else {
	    log.style.display = 'none';
	}
    }
}

// Adapted from http://stackoverflow.com/questions/4652734/return-html-from-a-user-selection/4652824
// Tim Down 
function getSelectionHTML() {
    var container = document.createElement('div');
    if (typeof window.getSelection != 'undefined') {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
        }
    } else if (typeof document.selection != 'undefined') {
        if (document.selection.type === 'Text') {            
	    container.innerHTML = document.selection.createRange().htmlText;
        }
    }
    return container.children;
}

function getSelectionURL(selection) {
    var from, to;
    for (var i=0; i < selection.length; i++) {
	var log = selection[i];
	if (log.className.substr(-3,3) === 'Log' && log.innerHTML) {
	    if (!from) {
		from = log.getAttribute('data-timestamp');
	    } else {
		to = log.getAttribute('data-timestamp');;
	    }
	}
    }

    if (from && to) {
	var home = document.location.protocol+'//'+document.location.host;
	var channel = document.getElementById('channel').value;
	return home+'/query?c='+channel+'&f='+from+'&t='+to+'&strict';
    } else {
	return;
    }
}
