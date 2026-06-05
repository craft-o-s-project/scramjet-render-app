"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const { Controller, config } = $scramjetController;

config.injectPath = "/controller/controller.inject.js";
config.scramjetPath = "/scram/scramjet.js";
config.wasmPath = "/scram/scramjet.wasm";

let controllerPromise;

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	error.textContent = "";
	errorCode.textContent = "";

	const url = search(address.value, searchEngine.value);

	try {
		const controller = await getController();
		const frame = controller.createFrame();
		frame.element.id = "sj-frame";
		document.body.appendChild(frame.element);
		frame.go(url);
	} catch (err) {
		error.textContent = "Failed to launch Scramjet.";
		errorCode.textContent = err?.stack || err?.toString() || String(err);
		throw err;
	}
});

async function getController() {
	if (!controllerPromise) {
		controllerPromise = initController().catch((err) => {
			controllerPromise = undefined;
			throw err;
		});
	}

	return controllerPromise;
}

async function initController() {
	const serviceworker = await registerSW();
	const wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	const transport = new LibcurlTransport.LibcurlClient({ wisp: wispUrl });
	const controller = new Controller({
		serviceworker,
		transport,
	});

	await controller.wait();
	return controller;
}
