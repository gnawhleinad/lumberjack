function toggleLog(type) {
    var logs = document.getElementsByClassName(type);
    for (var i=0;i<logs.length;i++) {
	var log = logs[i];
	if (log.style.display && (log.style.display === 'none' || log.style.display === '')) {
	    log.style.display = 'block';
	} else {
	    log.style.display = 'none';
	}
    }
}
