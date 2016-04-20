/*jshint esversion: 6 */

var jQuery = require('jQuery');
import {HairlineClass} from './hairlines';

(function($) {
	"use strict";
	$(document).ready(function(){
		new HairlineClass(window, window.document);
	});
})(jQuery);
