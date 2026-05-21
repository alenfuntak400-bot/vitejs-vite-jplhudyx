import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  Eye,
  Sliders,
  Camera,
  Download,
  CheckCircle2,
  MapPin,
  Sparkle,
  Terminal,
  Layers3,
  Dices,
  Lock,
  Unlock,
  Wand2,
  User,
  LogOut,
  Mail,
  Key,
  ShieldCheck,
  CreditCard,
  BarChart3,
  FolderHeart,
  Trash2,
  Undo,
  X,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,

  authDomain: 'aurateaser-brand-studio.firebaseapp.com',
  projectId: 'aurateaser-brand-studio',
  storageBucket: 'aurateaser-brand-studio.firebasestorage.app',
  messagingSenderId: '771946262378',
  appId: '1:771946262378:web:cfd63201b2c1c6d4e57f13',
};const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const STRIPE_LINK_MONTHLY =
  'https://buy.stripe.com/test_3cI9AU8OteHf8MZd272kw01';
const STRIPE_LINK_YEARLY =
  'https://buy.stripe.com/test_5kQ6oI1m142B0gt6DJ2kw02';

// Initialize Firebase services safely
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const appId =
  typeof __app_id !== 'undefined' ? __app_id : 'aurateaser-brand-studio';

// High-fidelity fallback asset pathways
const landingImageCandidates = [
  'best%20picture.png',
  'best picture.png',
  './best%20picture.png',
  './best picture.png',
  '../best%20picture.png',
  '/best%20picture.png',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><rect width="100%" height="100%" fill="%230c0c0e"/><circle cx="250" cy="250" r="120" fill="%23D97706" fill-opacity="0.12"/><text x="50%" y="50%" fill="%2371717a" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">DUBAI CAMPAIGN PREVIEW ACTIVE</text></svg>',
];

export default function App() {
  // --- Auth & Subscription Management States ---
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [authMode, setAuthMode] = useState('landing');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isMockAuth, setIsMockAuth] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  // --- Real-time Session Concurrency States ---
  const [localSessionId] = useState(() => crypto.randomUUID());
  const [sessionConflict, setSessionConflict] = useState(false);

  // --- Free Trial States ---
  const [trialGens, setTrialGens] = useState(2);

  // --- Credit Card Mock States ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // --- Workspace Teaser State (Production Suite) ---
  const [cameraAngle, setCameraAngle] = useState('Eye Level Cinematic Frame');
  const [seedLock, setSeedLock] = useState(true);
  const [generationSeed, setGenerationSeed] = useState('5582910471');
  const [isAutonomousPrompt, setIsAutonomousPrompt] = useState(true);

  // Clean, healthy workspace starting concept focusing on beautiful, positive design aesthetics
  const [userConcept, setUserConcept] = useState(
    'premium organic cotton white t-shirt hanging on a natural bamboo hanger in a minimalist architectural room with soft warm natural morning sunbeams highlighting clean fabric textures'
  );
  const [computedSystemPrompt, setComputedSystemPrompt] = useState('');
  const [isExpandingPrompt, setIsExpandingPrompt] = useState(false);

  // --- Base Aesthetic States ---
  const [brandColor, setBrandColor] = useState('#D97706');
  const [daysCount, setDaysCount] = useState('7');
  const [locationName, setLocationName] = useState('Dublin');
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [previewMode, setPreviewMode] = useState('mockup');
  const [lightingStyle, setLightingStyle] = useState(
    'High Contrast Rim Lighting'
  );
  const [textureFinish, setTextureFinish] = useState('Matte Ceramic');

  // --- Caption & Interactive Floating Badges ---
  const [captionTone, setCaptionTone] = useState('Hype');
  const [rawCaption, setRawCaption] = useState(
    'Embrace simple clean lines. ⏳ Coming soon to {{location}}. Experience the full aesthetic reveal on Day {{day}}.'
  );
  const [showSticker, setShowSticker] = useState(true);
  const [stickerText, setStickerText] = useState('STUDIO');
  const [stickerX, setStickerX] = useState(8);
  const [stickerY, setStickerY] = useState(8);

  // --- Image Source Resolution & Failovers ---
  const fileInputRef = useRef(null);
  const [localImageBlob, setLocalImageBlob] = useState(null);
  const [landingPathIndex, setLandingPathIndex] = useState(0);

  // --- Rendering States ---
  const [imageUrl, setImageUrl] = useState(null);
  const [aiImageUrl, setAiImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isOutOfSync, setIsOutOfSync] = useState(false);

  // --- Firestore Creative Vault States ---
  const [savedCreations, setSavedCreations] = useState([]);

  // --- Analytics Index Score Metrics ---
  const [analyticsScore, setAnalyticsScore] = useState({
    aestheticIndex: 94,
    engagementRate: 88,
    reachPotential: 91,
  });

  const isFirebaseUnconfigured =
    !firebaseConfig.apiKey ||
    firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY_HERE';

  // --- Inject Tailwind CSS Dynamically to Guarantee Styling ---
  useEffect(() => {
    if (!document.getElementById('tailwind-play-engine')) {
      const script = document.createElement('script');
      script.id = 'tailwind-play-engine';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    if (!document.getElementById('google-fonts-studio')) {
      const link = document.createElement('link');
      link.id = 'google-fonts-studio';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;850&family=Playfair+Display:ital,wght@0,300;0,750;1,400&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleLocalImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setLocalImageBlob(blobUrl);
      triggerNotification('Loaded local mockup file successfully!');
    }
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const generateSeedRandom = () => {
    const val = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setGenerationSeed(val);
    triggerNotification('Generated dynamic spatial seed coordinate');
  };

  const getComputedCaption = () => {
    return rawCaption
      .replace('{{location}}', locationName)
      .replace('{{day}}', daysCount);
  };

  const handleStripeCheckoutRedirect = () => {
    triggerNotification('Initiating connection with Stripe servers...');
    const targetLink =
      billingPeriod === 'annual' ? STRIPE_LINK_YEARLY : STRIPE_LINK_MONTHLY;
    window.open(targetLink, '_blank');
  };

  const processSubscriptionUpgrade = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      updateSubscriptionInDb(true).then(() => {
        setAuthMode('studio');
        triggerNotification('Professional Studio Licence Activated!');
      });
    }, 1500);
  };

  // --- Firebase Auth & Subscription Lifecycle Handshake ---
  useEffect(() => {
    if (isFirebaseUnconfigured) {
      setIsMockAuth(true);
      return;
    }

    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== 'undefined' &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        setIsMockAuth(true);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Sync subscriber state and trial status safely using standard collection structure
        const profileDocRef = doc(
          db,
          'artifacts',
          appId,
          'users',
          currentUser.uid,
          'subscription',
          'status'
        );
        getDoc(profileDocRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              const sub = data.isSubscribed || false;
              const remaining =
                data.trialGensLeft !== undefined ? data.trialGensLeft : 2;
              setIsSubscribed(sub);
              setTrialGens(remaining);

              if (sub || remaining > 0) {
                setAuthMode('studio');
              } else {
                setAuthMode('paywall');
              }
            } else {
              const initialStatus = {
                isSubscribed: false,
                trialGensLeft: 2,
                lastUpdated: new Date().toISOString(),
              };
              setDoc(profileDocRef, initialStatus).then(() => {
                setIsSubscribed(false);
                setTrialGens(2);
                setAuthMode('studio');
              });
            }
          })
          .catch(() => {
            setAuthMode('studio');
          });

        // Sync Creative Vault
        const creationsColRef = collection(
          db,
          'artifacts',
          appId,
          'users',
          currentUser.uid,
          'creations'
        );
        const unsubscribeCreations = onSnapshot(
          creationsColRef,
          (snap) => {
            const list = [];
            snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
            setSavedCreations(list);
          },
          (error) => {
            console.error('Vault listening subscription error: ', error);
          }
        );

        return () => unsubscribeCreations();
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Real-time Multi-device Concurrency Watcher ---
  useEffect(() => {
    if (!user || isMockAuth) return;

    const sessionDocRef = doc(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'session',
      'status'
    );
    setDoc(
      sessionDocRef,
      {
        sessionId: localSessionId,
        lastActive: new Date().toISOString(),
        email: user.email || 'Anonymous Operator',
      },
      { merge: true }
    ).catch(() => {});

    const unsubscribeSession = onSnapshot(
      sessionDocRef,
      (snap) => {
        if (snap.exists()) {
          const activeDbSessionId = snap.data().sessionId;
          if (activeDbSessionId && activeDbSessionId !== localSessionId) {
            setSessionConflict(true);
            triggerNotification('Session active on another device.');
          }
        }
      },
      (error) => {
        console.error('Concurreny tracking error: ', error);
      }
    );

    return () => unsubscribeSession();
  }, [user, isMockAuth]);

  const claimActiveSession = async () => {
    if (!user) return;
    setSessionConflict(false);
    const sessionDocRef = doc(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'session',
      'status'
    );
    await setDoc(
      sessionDocRef,
      {
        sessionId: localSessionId,
        lastActive: new Date().toISOString(),
        email: user.email || 'Anonymous Operator',
      },
      { merge: true }
    );
    triggerNotification('Session re-claimed on this terminal.');
  };

  const handleDecrementTrial = async () => {
    if (isSubscribed) return true;
    if (trialGens <= 0) {
      setAuthMode('paywall');
      triggerNotification('Free trial exhausted. Upgrade to PRO!');
      return false;
    }
    const nextVal = trialGens - 1;
    setTrialGens(nextVal);
    if (user && !isMockAuth) {
      const profileDocRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'subscription',
        'status'
      );
      await setDoc(profileDocRef, { trialGensLeft: nextVal }, { merge: true });
    }
    return true;
  };

  const updateSubscriptionInDb = async (status) => {
    setIsSubscribed(status);
    if (isMockAuth || !user) return;
    try {
      const profileDocRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'subscription',
        'status'
      );
      await setDoc(
        profileDocRef,
        { isSubscribed: status, lastUpdated: new Date().toISOString() },
        { merge: true }
      );
    } catch (err) {}
  };

  const handleSaveToVault = async () => {
    const backupItem = {
      id: String(Math.random()),
      userConcept,
      computedSystemPrompt,
      brandColor,
      daysCount,
      locationName,
      cameraAngle,
      lightingStyle,
      textureFinish,
      generationSeed,
      savedAt: new Date().toISOString(),
      aiImageUrl: aiImageUrl || null,
      caption: getComputedCaption(),
      stickerText,
    };

    if (isMockAuth || !user) {
      setSavedCreations((prev) => [backupItem, ...prev]);
      triggerNotification('Saved securely to local sandboxed memory!');
      return;
    }

    try {
      const colRef = collection(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'creations'
      );
      await addDoc(colRef, backupItem);
      triggerNotification(
        'Teaser configuration saved securely to Cloud Vault!'
      );
    } catch (err) {
      setSavedCreations((prev) => [backupItem, ...prev]);
      triggerNotification('Cloud saved to temporary sandbox.');
    }
  };

  const handleDeleteFromVault = async (id) => {
    if (isMockAuth || !user) {
      setSavedCreations((prev) => prev.filter((c) => c.id !== id));
      triggerNotification('Design removed.');
      return;
    }
    try {
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'creations',
        id
      );
      await deleteDoc(docRef);
      triggerNotification('Design removed from Cloud Vault.');
    } catch (err) {}
  };

  const handleRestoreFromVault = (item) => {
    setUserConcept(item.userConcept || '');
    setBrandColor(item.brandColor || '#D97706');
    setDaysCount(item.daysCount || '7');
    setLocationName(item.locationName || 'Dublin');
    setCameraAngle(item.cameraAngle || 'Eye Level Cinematic Frame');
    setLightingStyle(item.lightingStyle || 'High Contrast Rim Lighting');
    setTextureFinish(item.textureFinish || 'Matte Ceramic');
    setGenerationSeed(item.generationSeed || '5582910471');
    setStickerText(item.stickerText || 'STUDIO');
    if (item.aiImageUrl) {
      setAiImageUrl(item.aiImageUrl);
      setPreviewMode('ai');
    } else {
      setPreviewMode('mockup');
    }
    triggerNotification('Teaser parameters restored!');
  };

  // --- Autonomous Formula compiler ---
  useEffect(() => {
    if (isAutonomousPrompt) {
      const expanded = `Professional commercial studio lifestyle advertising photography, shot at ${cameraAngle.toLowerCase()}, featuring a ${userConcept}. Texture profile: ${textureFinish.toLowerCase()}. Ambient environment enhanced by ${lightingStyle.toLowerCase()}. Masterpiece grade, photorealistic rendering, Raytraced volumetric atmosphere, Unreal Engine 5 render style, seed:${generationSeed}`;
      setComputedSystemPrompt(expanded);
    } else {
      setComputedSystemPrompt(userConcept);
    }
  }, [
    userConcept,
    isAutonomousPrompt,
    cameraAngle,
    lightingStyle,
    textureFinish,
    generationSeed,
  ]);

  // --- Realtime Heuristic Engine ---
  useEffect(() => {
    const fontLen = computedSystemPrompt.length;
    const hasColor = brandColor !== '#D97706' ? 15 : 5;
    const cameraBonus = cameraAngle.includes('Close') ? 18 : 10;

    const baseAesthetic = Math.min(
      Math.floor(fontLen * 0.12 + cameraBonus + hasColor + 45),
      99
    );
    const baseEngagement = Math.min(
      Math.floor(
        daysCount * 1.2 + (captionTone === 'Mysterious' ? 25 : 15) + 50
      ),
      97
    );
    const baseReach = Math.min(
      Math.floor(locationName.length * 2.0 + baseAesthetic * 0.3 + 50),
      98
    );

    setAnalyticsScore({
      aestheticIndex: baseAesthetic,
      engagementRate: baseEngagement,
      reachPotential: baseReach,
    });
  }, [
    computedSystemPrompt,
    brandColor,
    daysCount,
    captionTone,
    locationName,
    cameraAngle,
  ]);

  useEffect(() => {
    if (aiImageUrl) setIsOutOfSync(true);
  }, [
    computedSystemPrompt,
    brandColor,
    cameraAngle,
    lightingStyle,
    textureFinish,
  ]);

  useEffect(() => {
    generatePlaceholder();
  }, [
    brandColor,
    stickerText,
    textureFinish,
    lightingStyle,
    cameraAngle,
    computedSystemPrompt,
  ]);

  const generatePlaceholder = () => {
    const promptLower = computedSystemPrompt.toLowerCase();

    let activeStudioColor = brandColor;
    if (promptLower.includes('blue')) activeStudioColor = '#2563EB';
    else if (promptLower.includes('green')) activeStudioColor = '#059669';
    else if (promptLower.includes('red')) activeStudioColor = '#DC2626';
    else if (promptLower.includes('purple')) activeStudioColor = '#7C3AED';
    else if (promptLower.includes('gold') || promptLower.includes('yellow'))
      activeStudioColor = '#D97706';
    else if (promptLower.includes('white') || promptLower.includes('silver'))
      activeStudioColor = '#E5E7EB';
    else if (promptLower.includes('black') || promptLower.includes('carbon'))
      activeStudioColor = '#1F2937';

    const isCloseUp =
      cameraAngle.includes('Close') || cameraAngle.includes('Macro');
    const scaleFactor = isCloseUp
      ? 'scale(1.4) translate(-25, -25)'
      : 'scale(1) translate(0, 0)';

    let shadowOffset = -10;
    let blurStrength = 25;
    let ambientOpacity = 0.08;

    if (
      lightingStyle.includes('Backlight') ||
      promptLower.includes('backlight')
    ) {
      shadowOffset = 0;
      ambientOpacity = 0.24;
    } else if (
      lightingStyle.includes('Golden') ||
      promptLower.includes('golden')
    ) {
      ambientOpacity = 0.18;
    }

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090b"/>
            <stop offset="100%" stop-color="#020202"/>
          </linearGradient>
          <linearGradient id="productGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${activeStudioColor}"/>
            <stop offset="100%" stop-color="#0e0e12"/>
          </linearGradient>
          <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blurStrength}"/></filter>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="${shadowOffset}" dy="15" stdDeviation="10" flood-color="#000" flood-opacity="0.95"/>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#bgGrad)"/>
        <circle cx="250" cy="250" r="170" fill="${activeStudioColor}" fill-opacity="${ambientOpacity}" filter="url(#blurFilter)"/>
        
        <g transform="translate(180, 100) ${scaleFactor}" filter="url(#softShadow)">
          <rect x="20" y="40" width="100" height="240" rx="16" fill="url(#productGrad)"/>
          <rect x="40" y="20" width="60" height="20" rx="4" fill="#1e1b4b" opacity="0.6"/>
          <path d="M 25,60 L 25,260" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.15" filter="url(#blurFilter)"/>
          <circle cx="70" cy="140" r="15" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.25"/>
          <line x1="55" y1="140" x2="85" y2="140" stroke="#ffffff" stroke-width="2" opacity="0.25"/>
        </g>

        <rect width="100%" height="100%" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.04"/>
        <text x="30" y="465" fill="#fff" opacity="0.2" font-family="monospace" font-size="8" letter-spacing="1">
          [MOCKUP PREVIEW] [BRAND DESIGN PLATFORM v4] ANGLE: ${cameraAngle.toUpperCase()}
        </text>
      </svg>
    `;
    setImageUrl(
      `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgString))
      )}`
    );
  };

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setIsAuthLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        authEmail,
        authPassword
      );
      setUser(cred.user);
      triggerNotification('Account created successfully!');
      setAuthMode('studio');
    } catch (err) {
      setUser({ email: authEmail, uid: 'mock-user-123' });
      triggerNotification('Entering sandboxed licence desk.');
      setAuthMode('studio');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setIsAuthLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        authEmail,
        authPassword
      );
      setUser(cred.user);
      triggerNotification('Welcome back!');
      setAuthMode('studio');
    } catch (err) {
      setUser({ email: authEmail, uid: 'mock-user-123' });
      triggerNotification('Authenticated via local Sandbox');
      setAuthMode('studio');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const targetEmail = resetEmail || authEmail;
    if (!targetEmail) {
      triggerNotification('Please specify a valid email address.');
      return;
    }
    setIsAuthLoading(true);

    try {
      if (isMockAuth) {
        setTimeout(() => {
          setIsAuthLoading(false);
          triggerNotification(
            `Recovery link transmitted to ${targetEmail} (Sandbox)!`
          );
          setAuthMode('login');
        }, 1200);
      } else {
        await sendPasswordResetEmail(auth, targetEmail);
        setIsAuthLoading(false);
        triggerNotification(
          `Password recovery link transmitted to ${targetEmail}!`
        );
        setAuthMode('login');
      }
    } catch (err) {
      setIsAuthLoading(false);
      triggerNotification(err.message || 'Unable to execute reset process.');
    }
  };

  const handleRestorePurchases = () => {
    setIsSubscribed(true);
    setAuthMode('studio');
    triggerNotification('All prior licenses recovered successfully!');
  };

  // --- GOOGLE IMAGEN 4.0 PIPELINE (DIRECT NON-NESTED FETCH TO GUARANTEE INJECTION) ---
  const generateTeaserImage = async () => {
    if (!isSubscribed && trialGens <= 0) {
      setAuthMode('paywall');
      triggerNotification('Free trial limit reached. Upgrade to PRO!');
      return;
    }

    const isAllowed = await handleDecrementTrial();
    if (!isAllowed) return;

    setIsGenerating(true);
    setError(null);
    setGenerationLogs([
      'Initializing organic product rendering suite...',
      'Compiling prompt matrix parameters...',
      'Connecting to Google Imagen commercial servers...',
    ]);

    const addLogWithDelay = (message, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setGenerationLogs((prev) => [...prev, message]);
          resolve();
        }, delay);
      });
    };

    try {
      // This structure is guaranteed to be detected and mapped by the environment's key injector
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${activeApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: {
              prompt: computedSystemPrompt,
            },
            parameters: {
              sampleCount: 1,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const rawErrorMessage =
          errorData?.error?.message ||
          `HTTP Error ${response.status}: ${response.statusText}`;
        throw new Error(rawErrorMessage);
      }

      const data = await response.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        setAiImageUrl(
          `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
        );
        setIsOutOfSync(false);
        setPreviewMode('ai');
        await addLogWithDelay(
          'Success: Multimodal viewport render completed.',
          100
        );
        triggerNotification('Teaser output generated successfully!');
      } else {
        throw new Error('Invalid payload format returned from Google.');
      }
    } catch (err) {
      setError(err.message);
      await addLogWithDelay(`Pipeline error: ${err.message}`, 100);
      triggerNotification('Synthesizer pipeline error.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- GEMINI PROMPT OPTIMIZER (DIRECT NON-NESTED FETCH TO GUARANTEE INJECTION) ---
  const handleGeminiExpandPrompt = async () => {
    setIsExpandingPrompt(true);
    setGenerationLogs(['Contacting Gemini AI Prompt Optimizer...']);

    try {
      // Direct fetch call mapped seamlessly by our runtime sandbox injector
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert commercial advertising director. Rewrite this simple product concept into an incredibly detailed, clean, and elegant high-fashion description paragraph focusing on healthy daylight, positive composition, camera parameters, and minimalist textile aesthetics. Keep it to one single fluid paragraph. Concept: "${userConcept}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (outputText) {
        setUserConcept(outputText.trim());
        setGenerationLogs(['Gemini Prompt Expansion integrated successfully.']);
        triggerNotification('Prompt optimized by Gemini!');
      } else {
        throw new Error('Empty response structure from Gemini.');
      }
    } catch (err) {
      setGenerationLogs([
        `Gemini Expansion warning: Using local formula generator fallback.`,
      ]);
      triggerNotification('Using local templates.');
    } finally {
      setIsExpandingPrompt(false);
    }
  };

  const handleToneChange = (tone) => {
    setCaptionTone(tone);
    if (tone === 'Hype') {
      setRawCaption(
        'The next chapter of minimalist design. ⏳ Coming to you direct from {{location}}. Witness the full unveiling on Day {{day}}.'
      );
    } else if (tone === 'Mysterious') {
      setRawCaption(
        'Something is forming in the light. 🌑 Originating from {{location}}. A brand new release unfolding on Day {{day}}.'
      );
    } else if (tone === 'Minimalist') {
      setRawCaption(
        'Day {{day}}. Studio footprint: {{location}}. Elegant form factor, simplified. #NewRelease'
      );
    }
    triggerNotification(`Switched tone to: ${tone}`);
  };

  const getPlatformClass = () => {
    if (activePlatform === 'tiktok')
      return 'aspect-[9/16] max-h-[500px] w-auto mx-auto';
    if (activePlatform === 'pinterest')
      return 'aspect-[2/3] max-h-[480px] w-auto mx-auto';
    return 'aspect-square w-full';
  };

  const handleCopyCaption = () => {
    const textMedia = document.createElement('textarea');
    textMedia.innerText = getComputedCaption();
    document.body.appendChild(textMedia);
    textMedia.select();
    document.execCommand('copy');
    textMedia.remove();
    triggerNotification('Caption copied!');
  };

  const activeImageSource =
    previewMode === 'ai' && aiImageUrl
      ? aiImageUrl
      : localImageBlob || landingImageCandidates[landingPathIndex];

  // =========================================================================
  // RENDER MODAL HELPER: TO RENDER THE LEGAL OVERLAY ACCESSIBLY IN ALL FLOWS
  // =========================================================================
  const renderLegalModal = () => {
    if (!legalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-neutral-100">
        <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[80vh] rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative">
          {/* Modal Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white uppercase tracking-[0.1em]">
                Legal Space & Compliance
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                AuraTeaser Pro Suite v4
              </p>
            </div>
            <button
              onClick={() => setLegalOpen(false)}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-all focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8 overflow-y-auto space-y-6 text-xs text-neutral-455 leading-relaxed custom-scrollbar font-sans text-left">
            <section className="space-y-2">
              <h4 className="font-extrabold text-neutral-200 uppercase tracking-wider text-[11px]">
                1. Commercial Usage Rights & Intellectual Property
              </h4>
              <p>
                AuraTeaser Pro Suite grants users a global, royalty-free,
                perpetual license to use, modify, and commercially exploit all
                still graphics, brand layout mockups, and synthesized campaign
                teasers generated through our active Google Imagen pipeline.
                AuraTeaser claims no ownership over your generated outputs.
                However, AuraTeaser makes no representations or warranties
                regarding the copyrightability or trademark eligibility of
                AI-generated content under local intellectual property laws.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-extrabold text-neutral-200 uppercase tracking-wider text-[11px]">
                2. Privacy Policy & Data Security
              </h4>
              <p>
                We prioritize your digital brand assets. When saving
                configurations to the AuraTeaser History Vault, your brand
                colors, prompt syntaxes, day matrices, and layout offsets are
                encrypted in transit and at rest within private, sandboxed
                Firebase environments. We strictly maintain a zero-training
                policy: your proprietary brand materials, custom product
                descriptions, and prompt history are never used to train
                artificial intelligence models, nor are they ever monetized or
                shared with third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-extrabold text-neutral-200 uppercase tracking-wider text-[11px]">
                3. Generative Artificial Intelligence & Indemnification
              </h4>
              <p>
                Synthesis services are facilitated directly through the
                enterprise-tier Google Vertex AI network. Users assume sole
                responsibility for the inputs they provide and the materials
                they generate. By compiling rendering prompts, you agree to
                generate materials that adhere strictly to local regional
                standards regarding fair use, intellectual copyright, and
                advertising legislation. You agree to indemnify, defend, and
                hold harmless AuraTeaser from any claims, damages, liabilities,
                or legal fees arising from content generated by your account
                that infringes upon third-party rights.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-extrabold text-neutral-200 uppercase tracking-wider text-[11px]">
                4. Refund & Subscription Cancellation Policy
              </h4>
              <p>
                Professional subscription licenses are activated and provisioned
                immediately upon payment. Due to the immediate high-performance
                GPU server cost footprints associated with Google Imagen
                processing networks, all transactions are strictly
                non-refundable.
              </p>
              <p>
                Subscriptions may be canceled at any point through your account
                dashboard. Upon cancellation, your subscription will remain
                active with full platform access until the end of your current
                paid billing cycle, at which point further automatic billing
                will cease. No partial or prorated refunds will be issued for
                unused time within a billing cycle.
              </p>
            </section>

            <p className="text-[10px] text-neutral-550 italic border-t border-zinc-800 pt-4 text-center font-sans">
              Last revised: May 18, 2026. AuraTeaser Legal Desk, Dublin Studio.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
            <button
              onClick={() => setLegalOpen(false)}
              className="px-6 py-2.5 bg-white text-black text-[10px] font-bold rounded-xl hover:bg-neutral-200 transition-all uppercase tracking-widest"
            >
              Acknowledge Terms
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 1: LANDING PAGE
  // =========================================================================
  if (authMode === 'landing') {
    return (
      <div
        className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between selection:bg-amber-650 selection:text-white relative overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[60vh] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-purple-900/10 rounded-full blur-[180px] pointer-events-none" />

        <header className="px-6 sm:px-12 py-10 flex justify-between items-center bg-transparent sticky top-0 z-40 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-start">
            <span className="font-extrabold tracking-[0.45em] text-2xl uppercase text-white leading-none">
              AuraTeaser
            </span>
            <span className="text-[9px] tracking-[0.6em] text-amber-500 uppercase font-light mt-2">
              PRO BRAND STUDIO v4
            </span>
          </div>
          <button
            onClick={() => setAuthMode('login')}
            className="px-6 py-2.5 bg-zinc-900/60 hover:bg-white/10 rounded-full text-[10px] font-bold border border-white/15 transition-all duration-300 uppercase tracking-widest text-white backdrop-blur-xl focus:outline-none"
          >
            Client Login
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 sm:gap-16 z-10">
          <div className="flex-1 text-left space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-neutral-400 text-[9px] font-medium uppercase tracking-[0.3em] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Production Engine Active</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
                Cinematic brand <br />
                <span className="italic font-light text-neutral-400 tracking-tight">
                  teasers in seconds.
                </span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                Elevate your commercial launch campaigns. Connect simple
                descriptive concepts directly to Google Vertex AI and compile
                studio-quality visual teaser masterpieces instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setAuthMode('register')}
                className="px-10 py-4.5 bg-white hover:bg-neutral-250 text-black font-extrabold text-xs transition duration-300 uppercase tracking-[0.2em] shadow-xl hover:shadow-white/5 active:scale-[0.98] focus:outline-none"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className="px-10 py-4.5 bg-transparent hover:bg-white/5 text-white font-semibold text-xs border border-white/20 transition uppercase tracking-[0.2em] active:scale-[0.98] focus:outline-none"
              >
                Enterprise Login
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/5 font-sans">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FolderHeart className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-[10px] text-white uppercase tracking-[0.2em]">
                    Creative Vault
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                  Automated cloud preset vault for raw brand assets, copywriting
                  lines, and mockup versions.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-[10px] text-white uppercase tracking-[0.2em]">
                    Aesthetics Index
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                  Predictive ROI and aesthetic scoring metrics constructed
                  dynamically using luxury market analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center w-full max-w-md lg:max-w-lg">
            <div className="bg-[#18181B]/30 border border-white/10 p-4 rounded-[2rem] shadow-2xl backdrop-blur-xl w-full">
              <div className="aspect-square w-full rounded-[1.5rem] overflow-hidden relative bg-black border border-white/5 flex items-center justify-center">
                <img
                  src={activeImageSource}
                  alt="Campaign Teaser Viewport"
                  className="w-full h-full object-cover animate-fade-in"
                  onError={() => {
                    if (landingPathIndex < landingImageCandidates.length - 1) {
                      setLandingPathIndex((prev) => prev + 1);
                    }
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent flex flex-col justify-end p-8 text-left pointer-events-none">
                  <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest self-start mb-3 backdrop-blur-md animate-pulse">
                    {stickerText}
                  </div>
                  <h4 className="text-white font-bold text-lg tracking-wide leading-tight uppercase tracking-wider font-sans">
                    Studio Reveal Concept
                  </h4>
                  <p className="text-[11px] text-neutral-455 mt-1 uppercase tracking-widest font-sans">
                    DUBLIN STUDIO ACTIVE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-10 text-center text-[9px] text-neutral-600 uppercase tracking-[0.4em] flex flex-col items-center gap-2 z-10 border-t border-white/5 w-full bg-black/60 backdrop-blur-md">
          <span>
            &copy; 2026 AuraTeaser Inc &bull; Global Studio Deployment
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
            <button
              onClick={() => setLegalOpen(true)}
              className="hover:text-white underline tracking-[0.2em] transition-colors duration-300 focus:outline-none"
            >
              Legal & Terms of Service
            </button>
            <span className="text-neutral-800 font-sans tracking-normal select-none">
              &bull;
            </span>
            <a
              href="mailto:aurateaser.studio@gmail.com"
              className="hover:text-white underline tracking-[0.2em] transition-colors duration-300"
            >
              Support: aurateaser.studio@gmail.com
            </a>
          </div>
        </footer>

        {renderLegalModal()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTH PAGES (LOGIN / REGISTER)
  // =========================================================================
  if (authMode === 'login' || authMode === 'register') {
    return (
      <div
        className="min-h-screen bg-[#0A0A0B] text-neutral-100 flex items-center justify-center px-4 relative overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[60vh] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-purple-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#161618]/60 border border-white/10 p-12 rounded-[2rem] shadow-2xl space-y-8 backdrop-blur-2xl relative z-10">
          <div className="text-center space-y-4 font-sans">
            <span className="font-extralight tracking-[0.4em] text-sm uppercase text-neutral-400">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Studio Access
            </h2>
          </div>

          <form
            onSubmit={
              authMode === 'login' ? handleUserLogin : handleUserRegistration
            }
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => {
                    setAuthEmail(e.target.value);
                    setResetEmail(e.target.value);
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-neutral-700 font-sans"
                  placeholder="name@agency.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">
                  Secret Key / Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[9px] text-amber-500 hover:text-amber-400 uppercase tracking-widest font-bold focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Key className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-neutral-700 font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-[0.2em]"
            >
              {isAuthLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>
                {authMode === 'login' ? 'Authenticate' : 'Initialize Studio'}
              </span>
            </button>
          </form>

          <div className="text-center pt-4">
            <button
              onClick={() =>
                setAuthMode(authMode === 'login' ? 'register' : 'login')
              }
              className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-white transition-colors focus:outline-none"
            >
              {authMode === 'login'
                ? 'No license? Request trial'
                : 'Existing partner? Sign in'}
            </button>
          </div>
        </div>

        {renderLegalModal()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2.5: PASSWORD RESET VIEW
  // =========================================================================
  if (authMode === 'forgot') {
    return (
      <div
        className="min-h-screen bg-[#0A0A0B] text-neutral-100 flex items-center justify-center px-4 relative overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[60vh] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-purple-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#161618]/60 border border-white/10 p-12 rounded-[2rem] shadow-2xl space-y-8 backdrop-blur-2xl relative z-10">
          <div className="text-center space-y-4">
            <span className="font-extralight tracking-[0.4em] text-sm uppercase text-neutral-450">
              Credentials Area
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Reset Key
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto font-sans">
              Please declare your registered email address to receive password
              recovery instruction packets.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em] ml-1">
                Account Email
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-neutral-700 font-sans"
                  placeholder="name@agency.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-[0.2em]"
            >
              {isAuthLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              <span>Transmit Instructions</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-[10px] text-neutral-400 hover:text-white transition-all uppercase tracking-widest font-bold focus:outline-none"
            >
              Back to Authorization Desk
            </button>
          </div>
        </div>

        {renderLegalModal()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: INTERACTIVE CHECKOUT/PAYWALL
  // =========================================================================
  if (authMode === 'paywall') {
    return (
      <div
        className="min-h-screen bg-black text-neutral-150 flex flex-col justify-between selection:bg-amber-650 selection:text-white relative overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute top-[-20%] left-[10%] w-[60vw] h-[60vh] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vh] bg-neutral-900/40 rounded-full blur-[140px] pointer-events-none" />

        <header className="px-6 sm:px-12 py-6 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md z-10 font-sans">
          <div className="flex flex-col items-start">
            <span className="font-extrabold tracking-[0.3em] text-sm uppercase text-white leading-none">
              AuraTeaser
            </span>
            <span className="text-[7px] tracking-[0.4em] text-amber-500 uppercase font-light mt-1.5">
              SECURE DESK
            </span>
          </div>
          <button
            onClick={() => signOut(auth).then(() => setAuthMode('landing'))}
            className="text-[9px] tracking-widest text-neutral-400 hover:text-white font-bold flex items-center gap-2 uppercase transition-all focus:outline-none"
          >
            <LogOut className="w-3 h-3 text-neutral-500" />
            <span>Sign Out</span>
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 flex-1 flex flex-col justify-center z-10 w-full">
          <div className="text-center space-y-4 max-w-2xl mx-auto font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-full text-[8px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Unlimited Production Pipeline</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Unleash Luxury Creative Power
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Elevate your campaign pre-launch assets. Upgrade to configure
              unlimited Google Vertex AI still frames, unlock dynamic metadata
              generation, and protect priority designs inside your Private Cloud
              Vault.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
              <div className="p-3.5 bg-neutral-950/50 border border-white/5 rounded-xl flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/25 shrink-0 mt-0.5">
                  <Sparkle className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-white tracking-wider">
                    Vertex AI Pipeline
                  </h4>
                  <p className="text-[9px] text-neutral-550 mt-1">
                    Unlimited commercial rendering iterations.
                  </p>
                </div>
              </div>
              <div className="p-3.5 bg-neutral-950/50 border border-white/5 rounded-xl flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/25 shrink-0 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-white tracking-wider">
                    Aesthetic Matrix
                  </h4>
                  <p className="text-[9px] text-neutral-550 mt-1">
                    Advanced audience index & reach score calculators.
                  </p>
                </div>
              </div>
              <div className="p-3.5 bg-neutral-950/50 border border-white/5 rounded-xl flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/25 shrink-0 mt-0.5">
                  <FolderHeart className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-white tracking-wider">
                    Cloud Preset Vault
                  </h4>
                  <p className="text-[9px] text-neutral-555 mt-1">
                    Automatic backups of variables & mockup outputs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-[#121214] p-1 rounded-xl max-w-[260px] mx-auto border border-neutral-800 font-sans">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition focus:outline-none ${
                billingPeriod === 'monthly'
                  ? 'bg-neutral-800 text-white shadow-inner'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setBillingPeriod('annual');
                triggerNotification('Annual license selected.');
              }}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition flex items-center justify-center gap-1.5 focus:outline-none ${
                billingPeriod === 'annual'
                  ? 'bg-amber-600 text-black font-black'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span>Yearly</span>
              <span className="px-1 py-0.5 rounded bg-black/20 text-[7px] text-white font-extrabold tracking-tight">
                SAVE 20%
              </span>
            </button>
          </div>

          <div className="text-center space-y-1 font-sans">
            <div className="text-5xl font-black tracking-tighter text-white flex items-center justify-center">
              <span>{billingPeriod === 'monthly' ? '€24' : '€19'}</span>
              <span className="text-sm text-neutral-500 font-semibold tracking-normal ml-1">
                / month
              </span>
            </div>
            <p className="text-[9px] text-amber-500 uppercase tracking-widest font-black">
              {billingPeriod === 'monthly'
                ? 'Standard monthly access, cancel anytime'
                : 'Billed annually — save €60 per terminal'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-3xl mx-auto w-full pt-2">
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-72 h-44 rounded-2xl p-5 text-white font-mono flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-700 cursor-pointer"
                style={{
                  background:
                    'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transform: isCardFlipped
                    ? 'rotateY(180deg)'
                    : 'rotateY(0deg)',
                }}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                {!isCardFlipped ? (
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase text-neutral-500 font-sans tracking-widest font-black">
                          AuraTeaser Corporate
                        </span>
                        <div className="w-8 h-6 bg-amber-500/25 rounded-md border border-amber-500/30" />
                      </div>
                      <span className="text-xs font-black italic tracking-tight text-amber-500 font-sans">
                        VISA
                      </span>
                    </div>
                    <div>
                      <div className="text-sm tracking-widest text-neutral-200">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[7px] uppercase text-neutral-500 block font-sans font-bold">
                          Card Holder
                        </span>
                        <span className="text-[10px] text-neutral-300 font-sans tracking-wide block uppercase font-bold truncate max-w-[120px]">
                          {cardName || 'Operator Name'}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-[7px] uppercase text-neutral-500 block font-sans font-bold">
                          Expires
                        </span>
                        <span className="text-[10px] text-neutral-300 block font-bold">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col justify-between h-full py-2"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="w-full h-8 bg-neutral-900 -mx-5" />
                    <div className="flex justify-end items-center gap-2 mt-4">
                      <span className="text-[7px] uppercase text-neutral-500 font-sans font-bold">
                        CVC
                      </span>
                      <div className="bg-[#121214] px-3 py-1 text-xs rounded font-bold tracking-widest">
                        {cardCvc || '•••'}
                      </div>
                    </div>
                    <p className="text-[6px] text-neutral-600 leading-tight font-sans">
                      This interactive credential engine is built on premium
                      design patterns for validation. Protected under sandbox
                      environment encryption layers.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 bg-zinc-900/60 border border-white/5 rounded-2xl text-left space-y-4 shadow-xl backdrop-blur-xl font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-neutral-200">
                      Stripe Protected Payment
                    </h4>
                    <p className="text-[9px] text-neutral-550 font-light font-sans">
                      {billingPeriod === 'monthly'
                        ? 'Standard monthly'
                        : 'Discounted annual'}{' '}
                      subscription activated via secure sandbox checkout.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-800 pt-4 font-sans">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>AuraTeaser Pro Suite License</span>
                    <span className="text-white font-mono">
                      {billingPeriod === 'monthly' ? '€24.00' : '€228.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Recurring Billing Quota</span>
                    <span className="text-white">
                      {billingPeriod === 'monthly' ? 'Monthly' : 'Annually'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400 font-bold border-t border-dashed border-neutral-800 pt-2">
                    <span className="text-neutral-200">Total Charge Due</span>
                    <span className="text-amber-500 font-mono">
                      {billingPeriod === 'monthly' ? '€24.00' : '€228.00'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleStripeCheckoutRedirect}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-450 text-black font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98] focus:outline-none"
                  >
                    <CreditCard className="w-4 h-4 text-black" />
                    <span>Pay Securely with Stripe</span>
                  </button>

                  <button
                    onClick={() => {
                      updateSubscriptionInDb(true).then(() => {
                        setAuthMode('studio');
                        triggerNotification(
                          'Mock sandbox subscription validated!'
                        );
                      });
                    }}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-755 text-neutral-400 hover:text-white rounded-xl text-[10px] font-bold border border-white/5 transition uppercase tracking-wider focus:outline-none"
                  >
                    Bypass via Developer Sandbox
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center font-sans">
            <button
              onClick={handleRestorePurchases}
              className="text-xs text-indigo-450 hover:text-indigo-400 hover:underline font-bold transition-all uppercase tracking-widest text-[9px] focus:outline-none"
            >
              Restore Purchases
            </button>
          </div>
        </main>

        <footer className="py-6 border-t border-neutral-900 text-center text-[9px] text-neutral-600 uppercase tracking-widest">
          Secure Irish Studio Portal &bull; Irish Gateway Protected
        </footer>

        {renderLegalModal()}
      </div>
    );
  }

  // =========================================================================
  // EXCLUSIVE VIEW: CONCURRENT SESSION CONFLICT LOCKED SCREEN
  // =========================================================================
  if (sessionConflict) {
    return (
      <div
        className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-6"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="max-w-md w-full bg-[#161618]/65 border border-red-500/20 p-10 rounded-[2.5rem] shadow-2xl space-y-6 text-center backdrop-blur-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase tracking-[0.05em]">
              Session Conflict
            </h2>
            <p className="text-[10px] text-neutral-550 uppercase tracking-widest">
              Multi-User Account Sharing Detected
            </p>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Your AuraTeaser Pro Suite license is currently actively compiling on
            another computer, terminal, or browser tab.
          </p>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1.5 text-left text-[11px] text-neutral-455 font-sans">
            <p className="text-neutral-500 text-[9px] uppercase tracking-wider font-bold">
              Active Station details:
            </p>
            <p>
              &bull; User:{' '}
              <span className="font-semibold text-neutral-200">
                {user?.email || 'studio-operator@aurateaser.design'}
              </span>
            </p>
            <p>
              &bull; Status:{' '}
              <span className="text-amber-500 font-semibold">
                Rendering Active
              </span>
            </p>
          </div>
          <div className="space-y-3 pt-4 font-sans">
            <button
              onClick={claimActiveSession}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-450 text-black font-bold text-xs rounded-xl shadow-lg uppercase tracking-wider transition-all duration-350 focus:outline-none"
            >
              Terminate other tab & Re-claim here
            </button>
            <button
              onClick={() =>
                signOut(auth).then(() => {
                  setSessionConflict(false);
                  setAuthMode('landing');
                })
              }
              className="w-full py-3.5 bg-neutral-900 hover:bg-[#121214] text-neutral-455 hover:text-white rounded-xl text-xs font-semibold border border-white/5 transition-all focus:outline-none"
            >
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: THE FULL PRODUCTION DASHBOARD (100% UNRESTRICTED)
  // =========================================================================
  return (
    <div
      className="min-h-screen bg-black text-neutral-100 font-sans flex flex-col selection:bg-amber-650 selection:text-black pb-12"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-neutral-200 font-sans">
            {notification}
          </span>
        </div>
      )}

      {/* Premium Header */}
      <header className="border-b border-neutral-900 bg-[#0A0A0B]/85 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20 transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Camera className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-neutral-450 font-bold">
                AuraTeaser Pro Suite v4
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ENTERPRISE OFFLINE CORE
              </span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight uppercase tracking-wider">
              AuraTeaser Brand Space
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-neutral-400">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Active Operator:{' '}
              <strong className="text-neutral-200 text-ellipsis truncate max-w-[120px] inline-block align-middle">
                {user?.email || 'Studio Creator'}
              </strong>
            </span>
          </div>
          <button
            onClick={() =>
              updateSubscriptionInDb(false).then(() => setAuthMode('paywall'))
            }
            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-xl text-xs font-semibold border border-neutral-800 transition focus:outline-none"
          >
            Manage Licences
          </button>
        </div>
      </header>

      {/* Free Trial Banner Indicator */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-amber-600/10 to-rose-600/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-455 font-sans">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>
              Free Trial Active: <strong>{trialGens}</strong> high-resolution
              picture generations remaining.
            </span>
          </span>
          <button
            onClick={handleStripeCheckoutRedirect}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] rounded-lg transition-all uppercase tracking-wider focus:outline-none"
          >
            Upgrade via Stripe
          </button>
        </div>
      )}

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Controls (7 Columns) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Autonomous Prompt Expansion Desk */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h2 className="font-bold text-xs uppercase tracking-wider">
                  Autonomous AI Expansion Core
                </h2>
              </div>
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={() => setIsAutonomousPrompt(!isAutonomousPrompt)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all focus:outline-none ${
                    isAutonomousPrompt
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-[#121214] border-neutral-800 text-neutral-450'
                  }`}
                >
                  {isAutonomousPrompt
                    ? 'Autonomous Optimization'
                    : 'Manual Concept Only'}
                </button>
                {isAutonomousPrompt && (
                  <button
                    onClick={handleGeminiExpandPrompt}
                    disabled={isExpandingPrompt}
                    className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-450 text-black rounded-lg text-[10px] font-bold flex items-center gap-1 transition focus:outline-none disabled:opacity-50"
                  >
                    {isExpandingPrompt ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span>Gemini AI Optimize</span>
                  </button>
                )}
              </div>
            </div>

            <div className="font-sans">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                User Base Concept / Core Idea
              </label>
              <textarea
                value={userConcept}
                onChange={(e) => setUserConcept(e.target.value)}
                rows={3}
                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 text-white leading-relaxed"
                placeholder="Describe your design vision simply (e.g., green mug, warm light, dark background)..."
              />
            </div>

            {isAutonomousPrompt && (
              <div className="bg-[#121214] border border-neutral-800 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[9px] font-bold text-neutral-550 uppercase tracking-widest block font-sans">
                  Expanded Studio Prompt Target Syntax
                </span>
                <p className="text-[10px] text-neutral-400 font-mono leading-relaxed select-all font-semibold italic">
                  "{computedSystemPrompt}"
                </p>
              </div>
            )}
          </div>

          {/* Camera Angles & Seed Constraints */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-xs uppercase tracking-wider">
                  Aesthetic & Camera Coordinates
                </h2>
              </div>
              <button
                onClick={() => {
                  setSeedLock(!seedLock);
                  triggerNotification(
                    seedLock ? 'Seed unlock active' : 'Consistency lock active'
                  );
                }}
                className="flex items-center gap-2 bg-[#121214] hover:bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 rounded-xl text-[10px] text-neutral-300 transition focus:outline-none"
              >
                {seedLock ? (
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold font-sans">
                  {seedLock ? 'Consistency Locked' : 'Free Roam Seed'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              <div>
                <label className="block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-1.5">
                  Production Angle
                </label>
                <select
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                >
                  <option>Eye Level Cinematic Frame</option>
                  <option>Ultra Close-Up</option>
                  <option>Low Angle Profile</option>
                  <option>Overhead Flatlay</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-455 font-semibold uppercase tracking-wider mb-1.5">
                  Atmospheric Light
                </label>
                <select
                  value={lightingStyle}
                  onChange={(e) => setLightingStyle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-300 focus:outline-none"
                >
                  <option>Cinematic Sidelight</option>
                  <option>Golden Flare Atmospheric</option>
                  <option>Deep Backlight Shadow</option>
                  <option>High Contrast Rim Lighting</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-1.5">
                  Structural Seed Coordinate
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={generationSeed}
                    onChange={(e) => setGenerationSeed(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-xs font-mono rounded-xl px-2.5 text-neutral-300 focus:outline-none font-mono"
                    disabled={seedLock}
                  />
                  <button
                    onClick={generateSeedRandom}
                    className="p-2.5 bg-black border border-neutral-700 rounded-xl transition hover:border-neutral-500 focus:outline-none"
                    disabled={seedLock}
                  >
                    <Dices className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={generateTeaserImage}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-450 text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] uppercase tracking-wider focus:outline-none disabled:opacity-40"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-black" />
              )}
              <span>Compile Parameters & Synthesize Photo</span>
            </button>
          </div>

          {/* Active Process Logging Desk */}
          <div className="bg-[#0C0C0E] border border-neutral-900 rounded-2xl p-4 space-y-2.5 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <div className="flex items-center gap-2 text-neutral-400">
                <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-sans">
                  Active Output Console
                </span>
              </div>
              <span className="text-[9px] text-neutral-500 font-mono font-bold">
                Process stream
              </span>
            </div>

            <div className="font-mono text-[11px] space-y-1 h-24 overflow-y-auto leading-relaxed custom-scrollbar text-neutral-400 font-semibold select-text font-sans">
              {generationLogs.length === 0 ? (
                <div className="text-neutral-600 italic text-[10px]">
                  Console idle. Awaiting configuration compilation...
                </div>
              ) : (
                generationLogs.map((log, index) => (
                  <div key={index} className="flex gap-2 text-[10px]">
                    <span className="text-amber-500 select-none">&gt;</span>
                    <span
                      className={
                        index === generationLogs.length - 1
                          ? 'text-neutral-200 font-bold animate-pulse'
                          : 'text-neutral-400'
                      }
                    >
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overlays & Copywriting Controls */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Launch Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-200 focus:outline-none font-sans"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Day Index
                </label>
                <input
                  type="number"
                  value={daysCount}
                  onChange={(e) => setDaysCount(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Brand Hex Accent
                </label>
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl p-2 text-xs font-mono text-neutral-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-[#0C0C0E] border border-neutral-800 rounded-xl space-y-3 font-sans">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 block">
                Interactive Badge Positioning Calibration
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-neutral-500 mb-1">
                    X Offset Padding: {stickerX}%
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={stickerX}
                    onChange={(e) => setStickerX(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-500 mb-1">
                    Y Offset Padding: {stickerY}%
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={stickerY}
                    onChange={(e) => setStickerY(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  value={stickerText}
                  onChange={(e) => setStickerText(e.target.value.toUpperCase())}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs font-black uppercase text-center focus:outline-none focus:border-amber-500 text-white"
                  placeholder="BADGE VALUE"
                />
              </div>
            </div>

            <div className="font-sans">
              <label className="block text-[10px] text-neutral-550 font-bold uppercase tracking-wider mb-1.5">
                Social Caption Template Blueprint
              </label>
              <textarea
                value={rawCaption}
                onChange={(e) => setRawCaption(e.target.value)}
                rows={2}
                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 text-white leading-relaxed font-sans"
              />
            </div>

            <div className="flex gap-2 font-sans">
              <button
                onClick={handleSaveToVault}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition focus:outline-none"
              >
                <FolderHeart className="w-4 h-4 text-amber-500" />
                <span>Save to Cloud Vault</span>
              </button>
            </div>
          </div>

          {/* Cloud history drawer */}
          <div className="bg-neutral-900 border border-[#27272A] rounded-2xl p-5 space-y-4">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-2 font-sans">
              <FolderHeart className="w-4 h-4 text-amber-500" />
              <span>AuraTeaser History Vault ({savedCreations.length})</span>
            </span>
            {savedCreations.length === 0 ? (
              <p className="text-[11px] text-neutral-555 italic font-sans">
                No configurations currently stored in cloud memory.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar font-sans">
                {savedCreations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#0C0C0E] border border-neutral-800 rounded-xl space-y-2 text-left relative group"
                  >
                    <button
                      onClick={() => handleDeleteFromVault(item.id)}
                      className="absolute top-2 right-2 text-neutral-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100 focus:outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.brandColor }}
                      />
                      <span className="text-[10px] font-bold text-neutral-300 font-mono truncate max-w-[150px]">
                        {item.userConcept}
                      </span>
                    </div>
                    <p className="text-[9px] text-neutral-555 line-clamp-2 italic font-sans">
                      "{item.caption}"
                    </p>
                    <div className="flex justify-between items-center pt-1.5 border-t border-neutral-800">
                      <span className="text-[8px] text-neutral-650 font-mono">
                        {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRestoreFromVault(item)}
                        className="text-[9px] text-indigo-400 hover:underline font-bold flex items-center gap-1 focus:outline-none"
                      >
                        <Undo className="w-3 h-3" />
                        <span>Restore Variables</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Hand Live Viewport */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Performance scorecard */}
          <div className="bg-neutral-900 border border-[#27272A] rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-2 font-sans">
              <BarChart3 className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Aura Performance Index</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5 text-center font-sans">
              <div className="p-2.5 bg-[#0C0C0E] border border-neutral-800 rounded-xl">
                <span className="text-[8px] text-neutral-500 block uppercase font-bold">
                  Aesthetic Score
                </span>
                <span className="text-lg font-black text-amber-500">
                  {analyticsScore.aestheticIndex}%
                </span>
              </div>
              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-[8px] text-neutral-500 block uppercase font-bold">
                  Virality Rate
                </span>
                <span className="text-lg font-black text-rose-500">
                  {analyticsScore.engagementRate}%
                </span>
              </div>
              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-[8px] text-neutral-500 block uppercase font-bold">
                  Reach Score
                </span>
                <span className="text-lg font-black text-emerald-400">
                  {analyticsScore.reachPotential}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col h-full space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 font-sans">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-xs uppercase tracking-wider">
                  Teaser Studio Monitor
                </h2>
              </div>

              <div className="flex items-center gap-1 font-sans">
                <select
                  value={activePlatform}
                  onChange={(e) => {
                    setActivePlatform(e.target.value);
                    triggerNotification(
                      `Simulating platform layouts: ${e.target.value}`
                    );
                  }}
                  className="bg-[#0C0C0E] border border-neutral-800 text-[10px] rounded-lg px-2 py-1.5 font-bold text-neutral-300 focus:outline-none"
                >
                  <option value="instagram">Instagram Grid</option>
                  <option value="tiktok">TikTok / Reels Feed</option>
                  <option value="pinterest">Pinterest Brand Card</option>
                </select>
              </div>
            </div>

            <div className="flex bg-[#0C0C0E] p-1 rounded-xl border border-neutral-800 font-sans">
              <button
                onClick={() => setPreviewMode('mockup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 focus:outline-none ${
                  previewMode === 'mockup'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Layers3 className="w-3.5 h-3.5" />
                <span>Draft Canvas Mockup</span>
              </button>
              <button
                onClick={() =>
                  aiImageUrl
                    ? setPreviewMode('ai')
                    : triggerNotification('No AI Render compiled yet.')
                }
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative focus:outline-none ${
                  previewMode === 'ai'
                    ? 'bg-amber-600 text-black shadow-md'
                    : 'text-neutral-500 hover:text-neutral-300'
                } ${!aiImageUrl && 'opacity-40'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Render Engine View</span>
              </button>
            </div>

            {isOutOfSync && previewMode === 'ai' && (
              <div className="bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-amber-400 animate-pulse font-sans">
                <span>⚠️ Workspace parameters updated. AI is out of sync.</span>
                <button
                  onClick={generateTeaserImage}
                  className="px-2 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg text-[9px] hover:bg-amber-400 transition focus:outline-none"
                >
                  Re-compile AI
                </button>
              </div>
            )}

            <div className="flex-1 flex items-center justify-center bg-[#0C0C0E]/60 rounded-xl border border-neutral-900 p-4 relative min-h-[340px] font-sans">
              <div className="w-full max-w-[300px] bg-black border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-md border border-neutral-800 p-1.5 rounded-lg text-white flex items-center gap-1 font-sans">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[8px] font-mono tracking-wider font-bold font-sans">
                    STILL PREVIEW
                  </span>
                </div>

                <div
                  className={`relative w-full overflow-hidden bg-neutral-900 ${getPlatformClass()}`}
                >
                  {activeImageSource ? (
                    <img
                      src={activeImageSource}
                      alt="AuraTeaser Preview View"
                      className="w-full h-full object-cover select-none"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-neutral-600 gap-2 font-sans">
                      <ImageIcon className="w-10 h-10 stroke-1" />
                      <span className="text-[11px] font-bold text-center px-4">
                        Ready to compile commercial design...
                      </span>
                    </div>
                  )}

                  {showSticker && (
                    <div
                      className="absolute transition-all duration-300 z-30 font-sans"
                      style={{
                        top: `${stickerY}%`,
                        left: `${stickerX}%`,
                      }}
                    >
                      <div
                        className="text-white font-black text-[9px] tracking-widest px-3 py-1.5 rounded shadow-xl flex items-center gap-1.5 font-sans"
                        style={{ backgroundColor: brandColor }}
                      >
                        <Sparkle className="w-2.5 h-2.5 animate-spin" />
                        <span>{stickerText || 'STUDIO'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {activePlatform === 'instagram' && (
                  <div className="p-3 border-t border-neutral-900 bg-neutral-950 font-sans">
                    <p className="text-[10px] text-neutral-300 font-sans leading-relaxed">
                      <span className="font-bold text-white mr-1.5">
                        brandstudio
                      </span>
                      {getComputedCaption()}
                    </p>
                  </div>
                )}
                {activePlatform === 'tiktok' && (
                  <div className="p-3 bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 right-0 z-20 space-y-1 bg-neutral-950/60 font-sans">
                    <div className="text-white text-[10px] font-bold font-sans">
                      @brandstudio
                    </div>
                    <p className="text-[9px] text-neutral-300 line-clamp-2 font-sans font-sans">
                      {getComputedCaption()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-sans">
              <button
                onClick={() => {
                  const target = previewMode === 'ai' ? aiImageUrl : imageUrl;
                  if (!target) return;
                  const link = document.createElement('a');
                  link.href = target;
                  link.download = `AuraTeaser-Asset-${generationSeed}.png`;
                  link.click();
                  triggerNotification('Media file downloaded.');
                }}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition uppercase tracking-wider focus:outline-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Master File</span>
              </button>
              <button
                onClick={handleCopyCaption}
                className="py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold text-xs rounded-xl transition uppercase tracking-wider focus:outline-none"
              >
                Copy Caption
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Unified clean footer and info desk */}
      <footer className="border-t border-neutral-900 bg-black py-12 px-6 mt-12 text-center text-zinc-500 text-xs font-sans">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="font-semibold uppercase tracking-widest text-[10px] text-zinc-400 font-sans">
            AuraTeaser Creative Suite v4
          </p>
          <p className="leading-relaxed font-light">
            Crafted for rapid brand and merchandise teaser creation. Integrates
            high-performance Google Generative AI frameworks.
          </p>
          <div className="flex justify-center space-x-6 pt-2 font-bold uppercase tracking-widest text-[9px] text-zinc-400 font-sans">
            <button
              className="hover:text-white transition-all focus:outline-none"
              onClick={() => setLegalOpen(true)}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              className="hover:text-white transition-all focus:outline-none"
              onClick={() => setLegalOpen(true)}
            >
              Terms of Use
            </button>
            <span>•</span>
            <a
              href="mailto:aurateaser.studio@gmail.com"
              className="hover:text-white transition-all"
            >
              Support Link
            </a>
          </div>
          <p className="text-[9px] text-zinc-700 font-mono">
            &copy; {new Date().getFullYear()} AuraTeaser Brand Networks. All
            Rights Reserved.
          </p>
        </div>
      </footer>

      {renderLegalModal()}
    </div>
  );
}
