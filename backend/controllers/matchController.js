import matchTherapist from '../utils/aiMatcher.js';

export async function match(req, res) {
  const { issueType, language } = req.body;
  const matched = await matchTherapist({ issueType, language });
  res.json(matched);
}