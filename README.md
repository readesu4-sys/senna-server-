# Senna Server

Backend untuk Senna — AI tsundere assistant. Nyimpen API key Claude dengan aman di server, jadi client (web/APK) nggak pernah pegang API key langsung.

## Cara jalanin

npm install
cp .env.example .env
# lalu edit .env, isi ANTHROPIC_API_KEY dan APP_SECRET dengan punya kamu sendiri
npm start

Server nyala di http://localhost:3000

## Endpoint

Semua endpoint (kecuali GET /) butuh header:
- x-app-secret: harus sama dengan APP_SECRET di .env
- x-user-id: id unik user/device

| Method | Endpoint | Body | Keterangan |
|---|---|---|---|
| POST | /chat | { "message": "..." } | Kirim pesan, dapat balasan Senna |
| GET | /chat/history | - | Ambil riwayat chat |
| GET | /memory | - | Ambil semua memory tersimpan |
| POST | /memory | { "text": "..." } | Simpan memory baru |
| DELETE | /memory/:id | - | Hapus memory |
| GET | /settings | - | Ambil settings user |
| PATCH | /settings | { "level"?, "lang"?, "accent"?, "dark"? } | Update settings |
