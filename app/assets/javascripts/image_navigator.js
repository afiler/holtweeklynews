var mDown = false;
var recentering = false;
var offsetX=0;
var offsetY=0;
var image_x=0;
var image_y=0;
var marker_width=0;
var marker_height=0;
var base_marker_size=20;
var scaleFactor;
var marker_x=0;
var marker_y=0;
var ibox = null; //document.getElementById("inf").x;
var dragging = false;
// Defined by server-side code
var webPath, imageLoc, zoom, tableSizeX, tableSizeY, searchTextPos, zoomLevels;
var real_img_height = 6648;
var thumbnail;

function init() {
	//ibox = document.getElementById("inf").x;

	document.onmouseup = captureMouseUp;
	document.getElementById("thumbnailArea").onmousedown = captureMouseDownClick;
	document.getElementById("thumbnailArea").onmousemove = captureMouseMove;
	document.getElementById("marker").onmousedown = captureMouseDownDrag;

	document.getElementById("marker").style.top = "0px";
	document.getElementById("marker").style.left = "0px";

	image_x = document.getElementById("thumbnailArea").offsetLeft;
	image_y = document.getElementById("thumbnailArea").offsetTop;
	
	thumbnail = { width: document.getElementById("thumbnail").width, height: document.getElementById("thumbnail").height };
	//thumbnail = document.getElementById("thumbnail")
	document.getElementById("thumbnailArea").style.width=thumbnail.width + "px"
	document.getElementById("thumbnailArea").style.height=thumbnail.height + "px"

	// Set zoom level and redraw
	if (searchTextPos != 0) {
		setZoom(50);
		//centerOn(5000, 3000);
		centerOnSearchText();
	} else {
		setZoom(zoom);
	}	
}

function captureMouseDownDrag(e) {
	x = parseInt(document.getElementById("marker").style.left);
	y = parseInt(document.getElementById("marker").style.top);
	if(document.all) {
		offsetX=window.event.clientX - x;
		offsetY=window.event.clientY - y;
	} else {
		offsetX = e.pageX - x;
		offsetY = e.pageY - y;
	}

	//ibox.value = "mdd " + dragging;
	dragging = true;
}

function captureMouseUpDrag(e) {
	//ibox.value = "mud " + dragging;
	mDown = false;
}

function captureMouseDownClick(e) {
	//ibox.value = "mdc " + dragging;
	mDown = true;
}

function captureMouseUp(e) {
	//ibox.value = "muc " + dragging;
	if (!dragging) recenter(e, false);
	dragging = false;
	mDown = false;
}

function captureMouseMove(e) {
	//ibox.value = "mm " + dragging;
	if (!(mDown && dragging)) return;
	recenter(e, true);
}

function setZoom(newZoom) {
    zoom = newZoom;
	scaleFactor = getScaleFactor();
    marker_width = base_marker_size / (zoom/100);
    marker_height = base_marker_size / (zoom/100);
	document.getElementById("marker").style.width = marker_width + "px";
	document.getElementById("marker").style.height = marker_height + "px";
	highlightZoom(zoom);
	redraw();
}

function changeZoom(zoomChange) {
	index = arrayIndexOf(zoomLevels, zoom);
	if ((index + zoomChange) < 0 || (index + zoomChange)  >= zoomLevels.length) return;

	setZoom(zoomLevels[index + zoomChange]);
}

function highlightZoom(zoom) {
	for (x=0; x < zoomLevels.length; x++) {
		if (zoomLevels[x] == zoom) document.getElementById("zoom"+zoom).style.backgroundColor = "#ccc";
		else document.getElementById("zoom"+zoomLevels[x]).style.backgroundColor = "#fff";
	}
}

function arrayIndexOf(array, data) {
	for (x=0; x < array.length; x++) {
		if (array[x] == data) return x;
	}
	return -1;
}

function positionSearchHighlight(viewAreaX, viewAreaY) {
	lineHeight = 60;
	viewAreaWidth = tableSizeX * segmentSize;
	viewAreaHeight = tableSizeY * segmentSize;

	p = getSearchTextPosition();
	startX = Math.floor(p[0] * (zoom/100) - viewAreaX - 30);
	startY = Math.floor(p[1] * (zoom/100) - viewAreaY);
	endX = Math.floor(p[2] * (zoom/100) - viewAreaX - 30);
	endY = Math.floor(p[3] * (zoom/100) - viewAreaY);

	hWidth = (endX - startX);
	hHeight = (lineHeight * (zoom/100));
	highlight = document.getElementById("search_highlight").style;

	if (((startX + hWidth) < 0) || (startX >= viewAreaWidth) ||
		((startY + hHeight) < 0) || (startY >= viewAreaHeight)) {
		// Totally out of range
		highlight.visibility = 'hidden';
		return;
	}
	// Partially out of range
	if (startX < 0) { startX = 0; hWidth = hWidth + startX; }
	if (startY < 0) { startY = 0; hHeight = hHeight + startY; }
	if (startX + hWidth >= viewAreaWidth) hWidth = viewAreaWidth - startX;
	if (startY + hHeight >= viewAreaHeight) hHeight = viewAreaHeight - startY;

	highlight.visibility = 'visible';
	highlight.left = startX + 'px';
	highlight.top = startY + 'px';
	//highlight.width = ((searchTextPos[2] - searchTextPos[0]) * (zoom/100)) + 'px';
	highlight.width = hWidth + 'px'
	highlight.height = hHeight + 'px';

	ibox = document.getElementById("inf").x;
	ibox.value = startX + "/" + startY + " " + p[0] + "/" + p[1];
}

function getSearchTextPosition() {
	pdfHeight = searchTextPos[4];
	pdfWidth = searchTextPos[5];
	pdfScaleFactor = 6648 / pdfHeight;
	pdfScaleFactor2 = 9327 / pdfWidth;
	startX = Math.ceil((searchTextPos[0] + 80) * pdfScaleFactor2);
	startY = Math.ceil((searchTextPos[1] - 25) * pdfScaleFactor);
	endX = Math.ceil((searchTextPos[2] + 120) * pdfScaleFactor2);
	endY = Math.ceil(searchTextPos[3] * pdfScaleFactor);
	return Array(startX, startY, endX, endY);
}

function move(relX, relY) {
	moveXScale = tableSizeX * segmentSize / scaleFactor / 2;
	moveYScale = tableSizeY * segmentSize / scaleFactor / 2;
	marker_x = marker_x + relX * moveXScale;
	marker_y = marker_y + relY * moveYScale;
	redraw();
}

function centerOn(x, y) {
	markerScale = thumbnail.height / real_img_height;
	marker_x = (x - (tableSizeX * segmentSize / 2 / (zoom/100))) * markerScale;
	marker_y = (y - (tableSizeY * segmentSize / 2 / (zoom/100))) * markerScale;
	redraw();
}

function centerOnSearchText() {
	p = getSearchTextPosition();
	centerOn(p[0]+(p[2]-p[0])/2, p[1]);
}

function recenter(e, inBox) {
	ibox = document.getElementById("inf").x

	abs_x = document.all?window.event.clientX:e.pageX;
	abs_y = document.all?window.event.clientY:e.pageY;
	if (inBox) {
		x = abs_x - offsetX;
		y = abs_y - offsetY;
	} else {
		x = abs_x - image_x;
		y = abs_y - image_y;
	}

	max_x_pos = thumbnail.width - marker_width;
	max_y_pos = thumbnail.height - marker_height;

	//ibox.value = e.pageX + "/" + e.pageY + " " + x + "/" + y + " " + max_x_pos + "/" + max_y_pos + " " + thumbnail.width + "/" + thumbnail.height

	if (inBox) {
		if (x<0 && y < 0) return;
		if (x>=max_x_pos && y>=max_y_pos) return;
	} else {
		if (x<0 || y < 0) return;
		if (x >= thumbnail.width || y >= thumbnail.height) return;
		x = x - (marker_width / 2)
		y = y - (marker_width / 2)
	}
	if (x >= max_x_pos) x = max_x_pos - 1;
	if (y >= max_y_pos) y = max_y_pos - 1;
	if (x<0) x = 0;
	if (y<0) y = 0;

	marker_x = x;
	marker_y = y;
	redraw();
}

function getScaleFactor() {
	real_img_width = thumbnail.width * (real_img_height/thumbnail.height);
	scaleFactor = (real_img_height/thumbnail.height) * (zoom/100);
	return scaleFactor;
}

function redraw() {
	ibox = document.getElementById("inf").x

	thumbnail = document.getElementById("thumbnail")

	document.getElementById("marker").style.left = marker_x + "px";	
	document.getElementById("marker").style.top = marker_y + "px";

	// Compute relative thumbnail position
    document.getElementById("marker").style.width = marker_width + "px";
    document.getElementById("marker").style.height = marker_height + "px";

	zoom_pos_x = Math.ceil(marker_x*scaleFactor/100)*100
	zoom_pos_y = Math.ceil(marker_y*scaleFactor/100)*100

	//ibox.value = marker_x + "/" + marker_y + "  " + zoom_pos_x + "/" + zoom_pos_y + " " + scaleFactor + " " + zoom;
	//ibox.value += "   " + document.getElementById("thumbnail").height + "/" + document.getElementById("thumbnail").width
	if (searchTextPos) positionSearchHighlight(zoom_pos_x, zoom_pos_y);
	repos(zoom_pos_x, zoom_pos_y);
}

function repos(x_pos, y_pos) {
	for (y = 0; y<tableSizeY; y++) {
		for (x = 0; x<tableSizeX; x++) {
			xImageSegment = x_pos + (x * 100);
			yImageSegment = y_pos + (y * 100);
			document.getElementById(x + "x" + y). src =
				webPath + imageLoc + '/' + zoom + '/' + yImageSegment + '/' + xImageSegment + '.gif';
		}
	}
}