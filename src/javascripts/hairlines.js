/*jshint esversion: 6 */

class HairlineClass {
	constructor(window, document) {
		var hairlines = false;
		if (window.devicePixelRatio && devicePixelRatio >= 2) {
			var testElem = document.createElement('div');
			testElem.style.border = '.5px solid transparent';
			document.body.appendChild(testElem);
			if (testElem.offsetHeight == 1) {
				document.querySelector('html').classList.add('hairlines');
				hairlines = true;
			}
			document.body.removeChild(testElem);
		}
		if (hairlines === false) {
			document.querySelector('html').classList.add('no-hairlines');
		}
	}
}

export {
	HairlineClass
};
