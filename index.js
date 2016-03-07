"use strict";

const GLOBAL_ACCESOR = global;

const ARRAY_METHODS_MAP = new Set([
	'map', 'filter', 'every', 'some', // ES5
	'find', 'findIndex', // ES2015
]);
const OBJECT_METHODS_MAP = new Set([
	'keys',
]);
const STRING_METHODS_REGEXP = new Set([
	'startsWith', 'endsWith',
]);

let PATCHED = false;

function isRestrictedMethod(container, methodName) {
	return container === GLOBAL_ACCESOR['Function'].prototype && (methodName === 'caller' || methodName === 'arguments');
}

function isRegExp(obj) {
	return typeof obj === 'object' && obj instanceof RegExp;
}

function isCallable(obj) {
	return typeof obj === 'function';
}

function isUncallable(obj) {
	return typeof obj !== 'function';
}

function getOwnMethods(target) {
	let methods = Object.getOwnPropertyNames(target);
	methods = methods.filter(methodName => !isRestrictedMethod(target, methodName) && typeof target[methodName] === 'function');
	const methodDictionary = Object.create(null);
	for (let method of methods) {
		methodDictionary[method] = target[method];
	}
	return methodDictionary;
}

function getMethodsByType(targetClass) {
	return {'static': getOwnMethods(targetClass), 'class': getOwnMethods(targetClass.prototype)};
}

function crippleSignature(targetName, target, methodName, disabledArgs, sugarMethod, logCallback) {
	target[methodName] = function () {
		const threshold = Math.min(arguments.length, disabledArgs.length);
		for (let i = 0; i < threshold; i++) {
			if (!disabledArgs[i] || !disabledArgs[i](arguments[i])) continue;
			const error = new Error("Method `" + targetName + methodName + "` called in a Sugar.js-reliant way.");
			process.nextTick(logCallback, error);
			break;
		}
		switch (arguments.length) {
		case 0: return sugarMethod.call(this);
		case 1: return sugarMethod.call(this, arguments[0]);
		case 2: return sugarMethod.call(this, arguments[0], arguments[1]);
		default: return sugarMethod.apply(this, arguments);
		}
	};
}

function deprecateMethod(targetName, target, methodName, sugarMethod, logCallback) {
	target[methodName] = function () {
		const error = new Error("Method `" + targetName + methodName + "` is a Sugar.js extension.");
		process.nextTick(logCallback, error);

		switch (arguments.length) {
		case 0: return sugarMethod.call(this);
		case 1: return sugarMethod.call(this, arguments[0]);
		case 2: return sugarMethod.call(this, arguments[0], arguments[1]);
		default: return sugarMethod.apply(this, arguments);
		}
	};
}

function patchClass(targetClass, nativeMethods, sugarMethods, logCallback) {
	const IS_ARRAY = targetClass === Array;
	const IS_STRING = targetClass === String;
	const IS_OBJECT = targetClass === Object;

	for (const methodType of ['static', 'class']) {
		const holderPrefix = targetClass.name + (methodType === 'class' ? '#' : '.');
		const holder = methodType === 'class' ? targetClass.prototype : targetClass;

		for (const methodName in sugarMethods[methodType]) {
			if (nativeMethods[methodType][methodName] === sugarMethods[methodType][methodName]) continue;
			if (methodType === 'class') {
				if (IS_ARRAY && ARRAY_METHODS_MAP.has(methodName)) {
					crippleSignature(holderPrefix, holder, methodName, [isUncallable], sugarMethods[methodType][methodName], logCallback);
					continue;
				} else if (IS_STRING && STRING_METHODS_REGEXP.has(methodName)) {
					crippleSignature(holderPrefix, holder, methodName, [isRegExp], sugarMethods[methodType][methodName], logCallback);
					continue;
				}
			} else {
				if (IS_OBJECT && OBJECT_METHODS_MAP.has(methodName)) {
					crippleSignature(holderPrefix, holder, methodName, [null, isCallable], sugarMethods[methodType][methodName], logCallback);
					continue;
				}
			}
			if (!nativeMethods[methodType][methodName]) {
				deprecateMethod(holderPrefix, holder, methodName, sugarMethods[methodType][methodName], logCallback);
			} else {
				console.error("Unexpected extension: `" + holderPrefix + methodName + "`");
			}
		}
	}
}

function runPatch(cb) {
	if (typeof cb !== 'function') throw new Error("Please pass a logger function to .patch()");

	const sugarPath = require.resolve('sugar');
	if (!PATCHED && require.cache[sugarPath]) throw new Error("Sugar was loaded before calling .patch()");
	const nativeGlobals = ['String', 'Number', 'Array', 'Object', 'Function', 'RegExp', 'Date'];
	const nativeMethods = nativeGlobals.reduce((prev, next) => {
		prev[next] = getMethodsByType(GLOBAL_ACCESOR[next]);
		return prev;
	}, {});

	require('sugar');
	const sugarMethods = nativeGlobals.reduce((prev, next) => {
		prev[next] = getMethodsByType(GLOBAL_ACCESOR[next]);
		return prev;
	}, {});

	for (let nativeGlobal of nativeGlobals) {
		patchClass(GLOBAL_ACCESOR[nativeGlobal], nativeMethods[nativeGlobal], sugarMethods[nativeGlobal], cb);
	}

	PATCHED = true;
}

module.exports = runPatch;
