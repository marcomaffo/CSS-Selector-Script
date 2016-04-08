// ==UserScript==
// @name         CSS Selector Script
// @namespace    https://github.com/marcomaffo/
// @version      0.1
// @description  Use the alt key to select any element on any website and get the absolute selector displayed on the bottom right corner
// @author       Marco Boldt
// @match        *://*/*
// @grant        none
// ==/UserScript==

var lastElement;
var lastColor;
var parentElements = [];
var popup;
function mouseClick(e) {
    if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();

        var element = document.elementFromPoint(e.x, e.y);
        parentElements = [];
        parentElements.push(element);
        while ((element = element.parentElement) != null) {
            parentElements.unshift(element);
            if (element.tagName.toLowerCase() === "body") {
                break;
            }
        }

        var selector = parentElements[0].tagName + ">";

        for (var i = 0; i < parentElements.length - 1; i++) {
            var children = parentElements[i].children;
            var _selector = "";
            for (var k = 0; k < children.length; k++) {
                _selector += children[k].tagName + "+";
                if (children[k] === parentElements[i+1]) {
                    _selector = _selector.slice(0, -1);
                    selector += _selector + ">";
                }
            }
        }
        selector = selector.slice(0, -1);

        if (popup != null) {
            document.body.removeChild(popup);
            popup = null;
        }

        popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.bottom = "0";
        popup.style.right = "0";
        popup.style.padding = "10px 20px 10px 10px";
        popup.style.border = "1px solid gray";
        popup.style.maxWidth = "90%";
        popup.style.overflow = "auto";
        popup.style.backgroundColor = "white";
        popup.style.zIndex = "10000000";

        popup.innerHTML = selector;

        var color;

        popup.onmouseenter = function() {
            color = document.querySelector(selector).style.backgroundColor;
            document.querySelector(selector).style.backgroundColor = "yellow";
        };
        popup.onmouseleave = function() {
            document.querySelector(selector).style.backgroundColor = color;
        };

        var closeButton = document.createElement('div');
        closeButton.style.position = "absolute";
        closeButton.style.top = "0";
        closeButton.style.right = "0";
        closeButton.style.borderLeft = "1px solid black";
        closeButton.style.borderBottom = "1px solid black";

        closeButton.style.backgroundColor = "lightgray";
        closeButton.style.padding = "2px";
        closeButton.innerHTML = "X";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function() {
            document.querySelector(selector).style.backgroundColor = color;
            document.body.removeChild(popup);
            popup = null;
        };

        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }
}

function mouseMove(e) {
    if (!e.altKey && lastElement) {
        lastElement.style.backgroundColor = lastColor;
        lastElement = null;
    }
    if (e.altKey) {
        var element = document.elementFromPoint(e.x, e.y);
        if (element !== lastElement) {
            if (lastElement) {
                lastElement.style.backgroundColor = lastColor;
            }
            lastColor = element.style.backgroundColor;
        }
        lastElement = element;
        element.style.backgroundColor = 'yellow';
    }
}

(function() {
    'use strict';
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('click', mouseClick, true);
})();
