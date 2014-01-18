var paginate = function (currentPage, numOfPages) {
	"use strict";
	var pages = [];

	for (let i = 1; i <= numOfPages; i++) {
		let p = { id: i, text: i };

		if (currentPage == i) {				// current page
			p.current = true;
			pages.push(p);
		} else if (currentPage == i+1) {	// page before current
			pages.push(p);
		} else if (currentPage == i-1) {	// page after current
			pages.push(p);
		} else if (i <= 2) {				// first two pages
			pages.push(p);
		} else if (i >= numOfPages-1) {		// last two pages
			pages.push(p);
		} else if (numOfPages <= 5) {		// all pages if num <= 5
			pages.push(p);
		} else {
			if (!pages[pages.length - 1].padding) {
				p = { padding: true };
				pages.push(p);
			}
		}
	}

	return pages;
};

module.exports.paginate = paginate;
