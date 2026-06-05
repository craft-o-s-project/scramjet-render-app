"use strict";
const stockSW = "./sw.js";

/**
 * List of hostnames that are allowed to run serviceworkers on http://
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Global util
 * Used in 404.html and index.html
 */
async function registerSW() {
	if (!navigator.serviceWorker) {
		if (
			location.protocol !== "https:" &&
			!swAllowedHostnames.includes(location.hostname)
		)
			throw new Error("Service workers cannot be registered without https.");

		throw new Error("Your browser doesn't support service workers.");
	}

	const registration = await navigator.serviceWorker.register(stockSW);

	if (navigator.serviceWorker.controller) {
		return navigator.serviceWorker.controller;
	}

	await Promise.race([
		navigator.serviceWorker.ready,
		new Promise((resolve) => {
			navigator.serviceWorker.addEventListener("controllerchange", resolve, {
				once: true,
			});
		}),
		new Promise((resolve) => setTimeout(resolve, 10000)),
	]);

	const serviceworker =
		navigator.serviceWorker.controller ||
		registration.active ||
		registration.waiting ||
		registration.installing;

	if (!serviceworker) {
		throw new Error("No service worker available for Scramjet.");
	}

	return serviceworker;
}
