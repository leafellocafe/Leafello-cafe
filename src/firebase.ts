import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, writeBatch, query, where, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Check if we are running with the placeholder credentials
export const isMockConfig = firebaseConfig.apiKey.includes("AIzaSyMockPlaceholder") || firebaseConfig.projectId.includes("mock-project");

let app;
let db: any;
let auth: any;
let isFirebaseReady = false;

try {
  if (!isMockConfig) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isFirebaseReady = true;
  }
} catch (error) {
  console.warn("Firebase failed to initialize. Falling back to local storage simulator.", error);
  isFirebaseReady = false;
}

// Validate connection to Firestore on initialization as per Skill guidelines
async function testFirestoreConnection() {
  if (isFirebaseReady && db) {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
    } catch (error) {
      if (error instanceof Error && error.message.includes("the client is offline")) {
        console.error("Please check your Firebase configuration; device offline.");
      }
    }
  }
}
testFirestoreConnection();

export { db, auth, isFirebaseReady };

// --- Mandatory Firestore Error Handling ---

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map((p: any) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- High-Fidelity Local Storage Simulation Fallback ---

const getMockData = (key: string): any[] => {
  const data = localStorage.getItem(`leafello_${key}`);
  return data ? JSON.parse(data) : [];
};

const saveMockData = (key: string, data: any[]) => {
  localStorage.setItem(`leafello_${key}`, JSON.stringify(data));
};

// --- Unified Database Services (Autodetects Live vs Mock) ---

export const dbService = {
  // --- User Profiles ---
  async saveUserProfile(userId: string, name: string, email: string, phoneNumber?: string) {
    const profile = {
      uid: userId,
      name,
      email,
      phoneNumber: phoneNumber || "",
      memberTier: "Bronze",
      greenPoints: 50, // Welcome points
    };

    if (isFirebaseReady) {
      const path = `users/${userId}`;
      try {
        await setDoc(doc(db, "users", userId), profile);
        return profile;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const users = getMockData("users");
      const filtered = users.filter((u) => u.uid !== userId);
      filtered.push(profile);
      saveMockData("users", filtered);
      return profile;
    }
  },

  async getUserProfile(userId: string) {
    if (isFirebaseReady) {
      const path = `users/${userId}`;
      try {
        const uDoc = await getDoc(doc(db, "users", userId));
        if (uDoc.exists()) {
          return uDoc.data();
        }
        return null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    } else {
      const users = getMockData("users");
      return users.find((u) => u.uid === userId) || null;
    }
  },

  // --- Orders ---
  async createOrder(orderData: any) {
    const freshOrder = {
      id: orderData.orderId || `LF-${Date.now()}`,
      userId: orderData.userId,
      customerName: orderData.customerName,
      items: orderData.items,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      phoneNumber: orderData.phoneNumber,
      deliveryAddress: orderData.deliveryAddress || "Takeaway Counter",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseReady) {
      const path = `orders/${freshOrder.id}`;
      try {
        await setDoc(doc(db, "orders", freshOrder.id), freshOrder);
        return freshOrder;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const orders = getMockData("orders");
      orders.unshift(freshOrder);
      saveMockData("orders", orders);
      return freshOrder;
    }
  },

  async getOrders(userId: string) {
    if (isFirebaseReady) {
      const path = "orders";
      try {
        const q = query(collection(db, "orders"), where("userId", "==", userId));
        const qSnapshot = await getDocs(q);
        const results: any[] = [];
        qSnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      const orders = getMockData("orders");
      return orders.filter((o) => o.userId === userId || o.userId === "anonymous");
    }
  },

  async cancelOrder(orderId: string) {
    if (isFirebaseReady) {
      const path = `orders/${orderId}`;
      try {
        const docRef = doc(db, "orders", orderId);
        await updateDoc(docRef, { status: "CANCELLED" });
        return true;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const orders = getMockData("orders");
      const order = orders.find((o) => o.id === orderId);
      if (order && order.status === "PENDING") {
        order.status = "CANCELLED";
        saveMockData("orders", orders);
        return true;
      }
      return false;
    }
  },

  // --- Support Queries ---
  async submitSupportQuery(name: string, email: string, subject: string, message: string) {
    const qDoc = {
      queryId: `Q-${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseReady) {
      const path = `support_queries/${qDoc.queryId}`;
      try {
        await setDoc(doc(db, "support_queries", qDoc.queryId), qDoc);
        return true;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const queries = getMockData("support_queries");
      queries.unshift(qDoc);
      saveMockData("support_queries", queries);
      return true;
    }
  },
};

// --- Unified Authentication Service (Autodetects Live vs Mock) ---
export const mockAuthService = {
  currUser: null as any,
  listeners: [] as Array<(user: any) => void>,
  onStateChange(cb: (user: any) => void) {
    this.listeners.push(cb);
    cb(this.currUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  },
  signInMock(name: string, email: string, phone?: string) {
    const mockUid = `MOCK-UID-${Date.now()}`;
    const userObj = {
      uid: mockUid,
      displayName: name,
      email: email,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      phoneNumber: phone || "",
      memberTier: "Bronze",
      greenPoints: 50,
    };
    this.currUser = userObj;
    localStorage.setItem("leafello_mock_session", JSON.stringify(userObj));
    this.listeners.forEach((l) => l(userObj));
    dbService.saveUserProfile(mockUid, name, email, phone);
    return userObj;
  },
  async signInWithGoogle() {
    if (isFirebaseReady) {
      const provider = new GoogleAuthProvider();
      // Prefer popup as requested for iframe compliance
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
    throw new Error("Firebase auth services not ready.");
  },
  loadSession() {
    if (isFirebaseReady) {
      // Firebase triggers onAuthStateChanged asynchronously on page load
      return;
    }
    const stored = localStorage.getItem("leafello_mock_session");
    if (stored) {
      const parsed = JSON.parse(stored);
      this.currUser = parsed;
      this.listeners.forEach((l) => l(parsed));
    }
  },
  async signOutMock() {
    if (isFirebaseReady && auth && auth.currentUser) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn("Error signing out from Firebase Auth:", err);
      }
    }
    this.currUser = null;
    localStorage.removeItem("leafello_mock_session");
    this.listeners.forEach((l) => l(null));
  },
};

// Auto-attach standard Firebase Auth State changed hook to sync profile
if (isFirebaseReady && auth) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        let profile = await dbService.getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = await dbService.saveUserProfile(
            firebaseUser.uid,
            firebaseUser.displayName || "Google Diner",
            firebaseUser.email || "",
            firebaseUser.phoneNumber || ""
          );
        }
        const userObj = {
          uid: firebaseUser.uid,
          displayName: profile?.name || firebaseUser.displayName || "Google Diner",
          email: firebaseUser.email || firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.displayName}`,
          phoneNumber: profile?.phoneNumber || firebaseUser.phoneNumber || "",
          memberTier: profile?.memberTier || "Bronze",
          greenPoints: profile?.greenPoints || 50,
        };
        mockAuthService.currUser = userObj;
        mockAuthService.listeners.forEach((l) => l(userObj));
      } catch (err) {
        console.error("Failed to fetch or save real user profile sync details:", err);
      }
    } else {
      // Check for guest fallback
      const stored = localStorage.getItem("leafello_mock_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        mockAuthService.currUser = parsed;
        mockAuthService.listeners.forEach((l) => l(parsed));
      } else {
        mockAuthService.currUser = null;
        mockAuthService.listeners.forEach((l) => l(null));
      }
    }
  });
}
