/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***********************************************************!*\
  !*** ../demo1/src/js/custom/documentation/base/rotate.js ***!
  \***********************************************************/


// Class definition
var KTBaseRotateDemos = function() {
    // Private functions
    var example3 = function(element) {
        // Element to indecate
        var button = document.querySelector("#kt_button_toggle");

        // Handle button click event
        button.addEventListener("click", function() {
            button.classList.toggle("active");              
        });
    }
    

    return {
        // Public Functions
        init: function(element) {
            example3();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTBaseRotateDemos.init();
});
/******/ })()
;
//# sourceMappingURL=rotate.js.map