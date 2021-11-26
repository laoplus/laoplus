// ==UserScript==
// @name        LAOPLUS
// @namespace   net.mizle
// @version     process.env.VERSION
// @author      process.env.AUTHOR
// @description ブラウザ版ラストオリジンのプレイを支援する userscript
// @homepageURL https://github.com/eai04191/laoplus
// @supportURL  https://github.com/eai04191/laoplus/issues
// @run-at      document-idle
// @match       https://pc-play.games.dmm.co.jp/play/lastorigin_r/*
// @match       https://pc-play.games.dmm.com/play/lastorigin/*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=616121&*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=699297&*
// @match       https://adult-client.last-origin.com/
// @match       https://normal-client.last-origin.com/
// @require     https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require     https://unpkg.com/micromodal/dist/micromodal.min.js
// @require     https://cdn-tailwindcss.vercel.app
// ==/UserScript==

/**
 * The @grant's used in your source code will be added automatically by rollup-plugin-userscript.
 * However you have to add explicitly those used in required resources.
 */
