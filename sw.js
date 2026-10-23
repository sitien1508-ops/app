// So cong viec - app dien thoai: chi luu GIAO DIEN de mo nhanh / mo duoc khi mat mang. KHONG luu du lieu (du lieu luon lay tu may chu).
var BAN = 'scv-9.4g-202610230725';
var VO = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(BAN).then(function (c) { return c.addAll(VO); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== BAN; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // goi may chu Google: de nguyen, khong luu
  // giao dien: lay ban moi tren mang truoc, mat mang moi dung ban da luu
  e.respondWith(fetch(e.request).then(function (r) { var c2 = r.clone(); caches.open(BAN).then(function (c) { c.put(e.request, c2); }); return r; }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
