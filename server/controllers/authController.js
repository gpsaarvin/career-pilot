const { OAuth2Client } = require("google-auth-library");
const { signToken } = require("../utils/jwt");
const {
  saveUser,
  getUserByEmail,
  getUserById,
} = require("../services/storageService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || undefined);

async function verifyGoogleCredential(credential) {
  if (!process.env.GOOGLE_CLIENT_ID || !credential) {
    return null;
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
}

async function googleAuth(req, res, next) {
  try {
    const { credential, profile } = req.body || {};

    let payload = null;
    try {
      payload = await verifyGoogleCredential(credential);
    } catch (error) {
      payload = null;
    }

    const email = payload?.email || profile?.email;
    if (!email) {
      return res.status(400).json({ message: "Google email is required" });
    }

    const existing = await getUserByEmail(email);
    const user = await saveUser({
      id: existing?.id,
      email,
      name: payload?.name || profile?.name || existing?.name || "",
      picture: payload?.picture || profile?.picture || existing?.picture || "",
      googleId: payload?.sub || existing?.googleId || "",
      createdAt: existing?.createdAt,
    });

    const token = signToken(user);
    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const current = await getUserById(req.user.id);
    if (!current) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await saveUser({
      ...current,
      name: req.body.name ?? current.name,
      picture: req.body.picture ?? current.picture,
    });

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { googleAuth, me, updateMe };
