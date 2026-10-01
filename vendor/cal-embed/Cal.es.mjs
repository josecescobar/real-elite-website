"use client";
"use client";
import { useEffect as e, useRef as t, useState as n } from "react";
import { jsx as r } from "react/jsx-runtime";
//#region ../../../real-elite-booking/packages/embeds/embed-snippet/src/index.ts
var i = "http://localhost:3000/embed/embed.js";
function a(e = i) {
	return (function(e, t, n) {
		let r = function(e, t) {
			e.q.push(t);
		}, i = e.document;
		e.Cal = e.Cal || function() {
			let a = e.Cal, o = arguments;
			if (a.loaded ||= (a.ns = {}, a.q = a.q || [], i.head.appendChild(i.createElement("script")).src = t, !0), o[0] === n) {
				let e = function() {
					r(e, arguments);
				}, t = o[1];
				e.q = e.q || [], typeof t == "string" ? (a.ns[t] = a.ns[t] || e, r(a.ns[t], o), r(a, ["initNamespace", t])) : r(a, o);
				return;
			}
			r(a, o);
		};
	})(window, e, "init"), window.Cal;
}
a.toString();
//#endregion
//#region ../../../real-elite-booking/packages/embeds/embed-react/src/useEmbed.ts
function o(t) {
	let [r, i] = n();
	return e(() => {
		i(() => a(t));
	}, []), r;
}
//#endregion
//#region ../../../real-elite-booking/packages/embeds/embed-react/src/Cal.tsx
var s = function(n) {
	let { calLink: i, calOrigin: a, namespace: s = "", config: c, initConfig: l = {}, embedJsUrl: u, ...d } = n;
	if (!i) throw Error("calLink is required");
	let f = t(!1), p = o(u), m = t(null);
	return e(() => {
		if (!p || f.current || !m.current) return;
		f.current = !0;
		let e = m.current;
		s ? (p("init", s, {
			...l,
			origin: a
		}), p.ns[s]("inline", {
			elementOrSelector: e,
			calLink: i,
			config: c
		})) : (p("init", {
			...l,
			origin: a
		}), p("inline", {
			elementOrSelector: e,
			calLink: i,
			config: c
		}));
	}, [
		p,
		i,
		c,
		s,
		a,
		l
	]), p ? /* @__PURE__ */ r("div", {
		ref: m,
		...d
	}) : null;
};
//#endregion
//#region ../../../real-elite-booking/packages/embeds/embed-react/src/index.ts
function c(e) {
	let { namespace: t = "", embedJsUrl: n } = typeof e == "string" ? { embedJsUrl: e } : e ?? {};
	return new Promise(function e(r) {
		let i = a(n);
		i("init", t);
		let o = t ? i.ns[t] : i;
		if (!o) {
			setTimeout(() => {
				e(r);
			}, 50);
			return;
		}
		r(o);
	});
}
var l = s;
//#endregion
export { l as default, c as getCalApi };
