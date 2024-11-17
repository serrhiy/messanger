async (headers) => {
  const cookie = parseCookie(headers.cookie);
  const { token } = cookie;
  const exists = await storage.has(token);
  if (!token || !exists) return redirect('login', 302);
  return render('index', 200);
};
