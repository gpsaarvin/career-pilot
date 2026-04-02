const { initFirestore } = require("../utils/firestore");

const memory = {
  users: new Map(),
  applications: [],
  searchHistory: [],
};

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function saveUser(user) {
  const db = initFirestore();
  const safeUser = {
    id: user.id || newId("user"),
    email: user.email,
    name: user.name || "",
    picture: user.picture || "",
    googleId: user.googleId || "",
    createdAt: user.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  if (!db) {
    memory.users.set(safeUser.id, safeUser);
    return safeUser;
  }

  await db.collection("users").doc(safeUser.id).set(safeUser, { merge: true });
  return safeUser;
}

async function getUserByEmail(email) {
  const db = initFirestore();
  if (!db) {
    for (const user of memory.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  const snap = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snap.empty) {
    return null;
  }
  return snap.docs[0].data();
}

async function getUserById(id) {
  const db = initFirestore();
  if (!db) {
    return memory.users.get(id) || null;
  }

  const doc = await db.collection("users").doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function upsertApplication(userId, payload) {
  const db = initFirestore();
  const item = {
    id: payload.id || newId("app"),
    userId,
    internshipId: payload.internshipId,
    internshipTitle: payload.internshipTitle,
    company: payload.company,
    applyLink: payload.applyLink || "",
    status: payload.status || "saved",
    notes: payload.notes || "",
    createdAt: payload.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  if (!db) {
    const index = memory.applications.findIndex(
      (entry) => entry.id === item.id && entry.userId === userId
    );
    if (index >= 0) {
      memory.applications[index] = item;
    } else {
      memory.applications.push(item);
    }
    return item;
  }

  await db.collection("applications").doc(item.id).set(item, { merge: true });
  return item;
}

async function getApplications(userId) {
  const db = initFirestore();
  if (!db) {
    return memory.applications
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const snap = await db
    .collection("applications")
    .where("userId", "==", userId)
    .get();

  return snap.docs
    .map((doc) => doc.data())
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

async function updateApplication(userId, id, patch) {
  const current = (await getApplications(userId)).find((entry) => entry.id === id);
  if (!current) {
    return null;
  }

  return upsertApplication(userId, {
    ...current,
    ...patch,
    id,
    userId,
  });
}

async function deleteApplication(userId, id) {
  const db = initFirestore();
  if (!db) {
    const before = memory.applications.length;
    memory.applications = memory.applications.filter(
      (item) => !(item.userId === userId && item.id === id)
    );
    return memory.applications.length < before;
  }

  const doc = await db.collection("applications").doc(id).get();
  if (!doc.exists || doc.data().userId !== userId) {
    return false;
  }

  await db.collection("applications").doc(id).delete();
  return true;
}

async function addSearchHistory(userId, query) {
  const db = initFirestore();
  const limit = Number(process.env.SEARCH_HISTORY_LIMIT || 20);
  const entry = {
    id: newId("search"),
    userId,
    query,
    createdAt: nowIso(),
  };

  if (!db) {
    memory.searchHistory.unshift(entry);
    memory.searchHistory = memory.searchHistory
      .filter((item) => item.userId === userId)
      .slice(0, limit)
      .concat(memory.searchHistory.filter((item) => item.userId !== userId));
    return;
  }

  await db.collection("searchHistory").doc(entry.id).set(entry);
}

async function getSearchHistory(userId) {
  const db = initFirestore();
  const limit = Number(process.env.SEARCH_HISTORY_LIMIT || 20);

  if (!db) {
    return memory.searchHistory
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  const snap = await db
    .collection("searchHistory")
    .where("userId", "==", userId)
    .limit(limit)
    .get();

  return snap.docs
    .map((doc) => doc.data())
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

module.exports = {
  saveUser,
  getUserByEmail,
  getUserById,
  upsertApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  addSearchHistory,
  getSearchHistory,
};
