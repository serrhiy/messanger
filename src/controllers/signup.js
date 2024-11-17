async (headers) => {
  const cookie = parseCookie(headers.cookie);
  const { token } = cookie;
  const exists = await storage.has(token);
  if (exists) return redirect('index', 303);
  return render('signup.html', 200);
};
