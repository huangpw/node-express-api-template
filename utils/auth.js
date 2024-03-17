exports.verifyAdmin = (req, res, next) => {
  const role = req.auth.role
  if (role === 1) {
    return
  }
}
