// Autentikasi sederhana untuk MVP:
// - Header 'x-app-secret' harus cocok dengan APP_SECRET di .env (biar endpoint nggak dipanggil sembarang orang)
// - Header 'x-user-id' menandai user/device (nanti bisa diganti hasil login asli dari Firebase/Supabase Auth)
export function requireAppSecret(req, res, next) {
  const secret = req.headers["x-app-secret"];
  if (!secret || secret !== process.env.APP_SECRET) {
    return res.status(401).json({ error: "Unauthorized: x-app-secret tidak valid" });
  }
  next();
}

export function requireUserId(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(400).json({ error: "Header x-user-id wajib diisi" });
  }
  req.userId = userId;
  next();
}
