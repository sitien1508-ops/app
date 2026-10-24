// So cong viec - app dien thoai: chi luu GIAO DIEN de mo nhanh / mo duoc khi mat mang. KHONG luu du lieu (du lieu luon lay tu may chu).
var BAN = 'scv-9.9-202610241357';
var VO = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
var LIB = ['https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js', 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js']; // bo quet ma (kiem ke) - luu de mat mang van quet duoc
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(BAN).then(function (c) { return c.addAll(VO).then(function () { return Promise.all(LIB.map(function (u) { return fetch(u, { mode: 'no-cors' }).then(function (r) { return c.put(u, r); }).catch(function () {}); })); }); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== BAN; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method === 'GET' && LIB.indexOf(e.request.url) >= 0) { e.respondWith(caches.match(e.request.url).then(function (r) { return r || fetch(e.request).then(function (r2) { var c2 = r2.clone(); caches.open(BAN).then(function (c) { c.put(e.request.url, c2); }); return r2; }); })); return; }
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // goi may chu Google: de nguyen, khong luu
  // giao dien: lay ban moi tren mang truoc, mat mang moi dung ban da luu
  e.respondWith(fetch(e.request).then(function (r) { var c2 = r.clone(); caches.open(BAN).then(function (c) { c.put(e.request, c2); }); return r; }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
