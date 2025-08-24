export function startSession(req, res) {
  const sessionId = `vid-${req.user._id}-${Date.now()}`;
  res.json({ sessionId }); // In real-world: integrate WebRTC or 3rd-party
}