import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";
import {
  MessageSquarePlus, Layers, GraduationCap, LayoutDashboard, Workflow,
  Mic, Camera, MapPin, Users, CheckCircle2, ArrowRight, Sparkles,
  Building2, X, Radio, Wand2, FileSearch, User, LogOut, Lock, ShieldCheck, Bell,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

/* ---------------------------------- design tokens ---------------------------------- */
const COLORS = {
  paper: "#EDEAE0",
  paperDark: "#E1DCCB",
  card: "#F8F6EF",
  ink: "#20281F",
  inkSoft: "#5B6355",
  rust: "#B5541F",
  rustDark: "#8F4118",
  forest: "#2F5D45",
  forestSoft: "#4C7A60",
  gold: "#B98B2E",
  slate: "#33475A",
  maroon: "#8E3B46",
  violet: "#6B4C8A",
  line: "#D8D2C2",
  white: "#FFFFFF",
};

const SHADOW_SM = "0 1px 2px rgba(32,40,31,0.07), 0 1px 1px rgba(32,40,31,0.04)";
const SHADOW_MD = "0 6px 16px rgba(32,40,31,0.09), 0 2px 5px rgba(32,40,31,0.06)";
const SHADOW_LG = "0 18px 40px rgba(32,40,31,0.16), 0 6px 14px rgba(32,40,31,0.08)";
const SHADOW_INSET = "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(181,84,31,0.10)";

/* Original mark: a sal leaf (Jharkhand = "land of forests") rising over a bridge (Setu) — not any official emblem. */
function Emblem({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill={COLORS.card} stroke={COLORS.gold} strokeWidth="1" />
      <circle cx="24" cy="24" r="19" fill="none" stroke={COLORS.rust} strokeWidth="0.75" strokeOpacity="0.55" />
      <path d="M24,9 C29.5,14 30.5,22 24,28.5 C17.5,22 18.5,14 24,9 Z" fill={COLORS.forest} fillOpacity="0.9" />
      <line x1="24" y1="12" x2="24" y2="26" stroke={COLORS.card} strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="8" y1="36" x2="40" y2="36" stroke={COLORS.rustDark} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13,36 Q24,25.5 35,36" fill="none" stroke={COLORS.rustDark} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17.5" y1="32.5" x2="17.5" y2="36" stroke={COLORS.rustDark} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="30.5" y1="32.5" x2="30.5" y2="36" stroke={COLORS.rustDark} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PaperGrain() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 60, opacity: 0.045, mixBlendMode: "multiply" }}
    >
      <filter id="grainFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainFilter)" />
    </svg>
  );
}

function useCountUp(value, duration = 650) {
  const isNum = typeof value === "number";
  const [display, setDisplay] = useState(isNum ? 0 : value);
  const prevRef = useRef(isNum ? 0 : value);
  useEffect(() => {
    if (!isNum) { setDisplay(value); return; }
    const from = typeof prevRef.current === "number" ? prevRef.current : 0;
    const to = value;
    if (from === to) { setDisplay(to); return; }
    let startTime = null;
    let raf;
    function step(ts) {
      if (startTime === null) startTime = ts;
      const progress = Math.min(1, (ts - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);
  return display;
}



/* ---------------------------------- multilingual accessibility ---------------------------------- */
const LANGUAGES = [
  { code: "English", label: "English", native: "English", flag: "🇬🇧" },
  { code: "Hindi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "Punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "Haryanvi", label: "Haryanvi", native: "हरियाणवी", flag: "🇮🇳" },
];

const TRANSLATIONS = {
  English: {
    language: "Language", chooseLanguage: "Choose your language", languageHint: "You can change this anytime from the top bar.",
    continue: "Continue", close: "Close", selectLanguage: "Select language",
    department: "Higher & Technical Education · Government of Jharkhand",
    chooseRole: "Choose your role to continue. Each account only sees the data it's permitted to.",
    enterPassword: "Enter the password for this account to continue.", password: "Password",
    enterPasswordPlaceholder: "Enter password", signIn: "Sign in", switchRole: "Switch role",
    chooseDifferentRole: "← Choose a different role", incorrectPassword: "Incorrect password for this demo account.",
    demoPassword: "Demo password", signInAs: "Sign in as", accessRole: "Access is role-scoped and password-protected, like the production system would be.",
    reportProblem: "Report a Problem", caseClusters: "Case Clusters", facultyMatch: "Faculty Match", controlRoom: "Control Room", caseFiles: "Case Files",
    portalTagline: "Societal Innovation Collaboration Portal — routing citizen problems into university research and industry solutions.",
    cases: "cases", reports: "reports", districts: "districts", reportChallenge: "Report a societal challenge",
    reportIntro: "Citizens, Panchayats, Urban Local Bodies and government departments can log an issue here. The AI panel on the right shows exactly what happens to it.",
    tryDuplicate: "Try a duplicate report", tryFresh: "Try a fresh case", title: "Title", description: "Description",
    titlePlaceholder: "e.g. Handpump dry for three weeks", descriptionPlaceholder: "Describe the problem in your own words, in any language…",
    speakInstead: "Speak instead", listening: "Listening…", transcribing: "Listening — speak clearly, then tap again to stop…", micUnsupported: "Voice input isn't supported in this browser. Try Chrome or Edge.",
    district: "District", attachPhoto: "Attach photo evidence", logCase: "Log this case",
    domain: "Domain", autoDetect: "Auto-detect (AI)", domainHint: "Pick the domain yourself so it routes straight to the right faculty — or leave it on auto-detect.",
    aiPreview: "AI problem management — live preview", startTyping: "Start typing, or use a quick-fill above, to see auto-categorisation and duplicate detection run in real time.",
    detectedCategory: "Detected category", confidence: "confidence", resolutionTarget: "resolution target once logged",
    similarity: "Similarity to existing cases", noRelated: "No related cases found — this looks new.",
    merge: "Will merge into", newCase: "Below merge threshold — will open as a new case.",
    caseClustersTitle: "Case clusters", caseClustersIntro: "Every duplicate report strengthens a single case instead of creating noise.",
    all: "All", sort: "Sort:", mostUrgent: "Most urgent", mostReported: "Most reported",
    myReports: "My reports — full detail", communityBoard: "Community board — public summary only",
    fullDetails: "Full details visible only to the reporting citizen and officials", filedBy: "Filed by",
    citizensReported: "citizens reported this", findFaculty: "Find a faculty match", matched: "Matched",
    accessScope: "Access scope", noCases: "No cases here", onTarget: "On target", deployed: "Deployed",
    caseLifecycle: "Case files — project lifecycle", lifecycleIntro: "Advance a case stage by stage and watch the control room update live.",
    matchFaculty: "Match faculty →", pledgeSupport: "Pledge support", awaitingPledge: "Awaiting an industry partner to pledge",
    advance: "Advance", facultyTitle: "Faculty match", assignCase: "Assign case", matchStrength: "Match strength",
    activeCases: "active cases currently", yourQueue: "Your queue: unassigned cases plus ones already matched to you.",
    rankedFaculty: "Pick a case to see it ranked against faculty by research keywords, not just department tags.",
    currentlyAssigned: "Currently assigned to", stakeholdersNotified: "Case advanced to the next stage — stakeholders notified.",
    languageChanged: "Language changed to",
  },
  Hindi: {
    language: "भाषा", chooseLanguage: "अपनी भाषा चुनें", languageHint: "आप इसे कभी भी ऊपर से बदल सकते हैं।",
    continue: "आगे बढ़ें", close: "बंद करें", selectLanguage: "भाषा चुनें",
    department: "उच्च एवं तकनीकी शिक्षा · झारखंड सरकार",
    chooseRole: "आगे बढ़ने के लिए अपनी भूमिका चुनें। हर खाते को केवल अनुमति वाला डेटा दिखाई देता है।",
    enterPassword: "जारी रखने के लिए इस खाते का पासवर्ड दर्ज करें।", password: "पासवर्ड",
    enterPasswordPlaceholder: "पासवर्ड दर्ज करें", signIn: "लॉग इन करें", switchRole: "भूमिका बदलें",
    chooseDifferentRole: "← दूसरी भूमिका चुनें", incorrectPassword: "इस डेमो खाते का पासवर्ड गलत है।",
    demoPassword: "डेमो पासवर्ड", signInAs: "के रूप में लॉग इन करें", accessRole: "हर भूमिका का डेटा अलग है और पासवर्ड से सुरक्षित है।",
    reportProblem: "समस्या दर्ज करें", caseClusters: "समस्या समूह", facultyMatch: "विशेषज्ञ मिलान", controlRoom: "कंट्रोल रूम", caseFiles: "केस फाइल",
    portalTagline: "नागरिक समस्याओं को विश्वविद्यालय के शोध और उद्योग के समाधान से जोड़ने वाला मंच।",
    cases: "केस", reports: "रिपोर्ट", districts: "जिले", reportChallenge: "सामाजिक समस्या दर्ज करें",
    reportIntro: "नागरिक, पंचायत और सरकारी विभाग यहाँ समस्या दर्ज कर सकते हैं। दाईं ओर AI बताएगा कि समस्या के साथ क्या होगा।",
    tryDuplicate: "डुप्लिकेट रिपोर्ट आज़माएँ", tryFresh: "नई समस्या आज़माएँ", title: "शीर्षक", description: "विवरण",
    titlePlaceholder: "जैसे: तीन हफ्तों से हैंडपंप सूखा है", descriptionPlaceholder: "समस्या अपने शब्दों में लिखें, किसी भी भाषा में…",
    speakInstead: "बोलकर बताएं", listening: "सुन रहे हैं…", transcribing: "सुन रहे हैं — साफ़ बोलें, रोकने के लिए फिर टैप करें…",
    district: "जिला", attachPhoto: "फोटो प्रमाण जोड़ें", logCase: "समस्या दर्ज करें",
    domain: "क्षेत्र", autoDetect: "स्वतः पहचान (AI)", domainHint: "सही विशेषज्ञ तक सीधे भेजने के लिए क्षेत्र खुद चुनें — या स्वतः पहचान पर छोड़ दें।",
    aiPreview: "AI समस्या प्रबंधन — लाइव", startTyping: "लिखना शुरू करें या ऊपर से उदाहरण चुनें। AI श्रेणी और मिलती-जुलती समस्याएँ दिखाएगा।",
    detectedCategory: "पहचानी गई श्रेणी", confidence: "विश्वास", resolutionTarget: "दर्ज होने के बाद समाधान का लक्ष्य",
    similarity: "मौजूदा मामलों से समानता", noRelated: "कोई संबंधित मामला नहीं मिला — यह नई समस्या लगती है।",
    merge: "इसमें जोड़ दिया जाएगा", newCase: "मिलान कम है — नया केस खुलेगा।",
    caseClustersTitle: "समस्या समूह", caseClustersIntro: "एक जैसी रिपोर्टें एक ही समस्या को मजबूत करती हैं और अनावश्यक भीड़ नहीं बनातीं।",
    all: "सभी", sort: "क्रम:", mostUrgent: "सबसे जरूरी", mostReported: "सबसे अधिक रिपोर्ट",
    myReports: "मेरी रिपोर्ट — पूरी जानकारी", communityBoard: "सामुदायिक बोर्ड — केवल सार्वजनिक जानकारी",
    fullDetails: "पूरी जानकारी केवल रिपोर्ट करने वाले नागरिक और अधिकारियों को दिखाई देती है।", filedBy: "दर्जकर्ता",
    citizensReported: "नागरिकों ने रिपोर्ट किया", findFaculty: "विशेषज्ञ खोजें", matched: "मिलान",
    accessScope: "पहुँच सीमा", noCases: "कोई केस नहीं", onTarget: "समय पर", deployed: "लागू",
    caseLifecycle: "केस फाइल — परियोजना की प्रगति", lifecycleIntro: "केस को चरण-दर-चरण आगे बढ़ाएँ और कंट्रोल रूम में बदलाव देखें।",
    matchFaculty: "विशेषज्ञ मिलाएँ →", pledgeSupport: "सहायता राशि दें", awaitingPledge: "उद्योग भागीदार की सहायता का इंतज़ार",
    advance: "आगे बढ़ाएँ", facultyTitle: "विशेषज्ञ मिलान", assignCase: "केस सौंपें", matchStrength: "मिलान की ताकत",
    activeCases: "सक्रिय केस", yourQueue: "आपकी सूची: बिना विशेषज्ञ वाले और आपके नाम से जुड़े केस।",
    rankedFaculty: "किसी केस को चुनें और शोध के आधार पर विशेषज्ञों की रैंकिंग देखें।",
    currentlyAssigned: "वर्तमान में सौंपा गया", stakeholdersNotified: "केस अगले चरण में गया — संबंधित लोगों को सूचना भेजी गई।",
    languageChanged: "भाषा बदलकर",
  },
  Punjabi: {
    language: "ਭਾਸ਼ਾ", chooseLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", languageHint: "ਤੁਸੀਂ ਇਸਨੂੰ ਉੱਪਰੋਂ ਕਦੇ ਵੀ ਬਦਲ ਸਕਦੇ ਹੋ।",
    continue: "ਅੱਗੇ ਵਧੋ", close: "ਬੰਦ ਕਰੋ", selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    department: "ਉੱਚ ਅਤੇ ਤਕਨੀਕੀ ਸਿੱਖਿਆ · ਝਾਰਖੰਡ ਸਰਕਾਰ",
    chooseRole: "ਅੱਗੇ ਵਧਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ। ਹਰ ਖਾਤੇ ਨੂੰ ਸਿਰਫ਼ ਮਨਜ਼ੂਰ ਡਾਟਾ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।",
    enterPassword: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਇਸ ਖਾਤੇ ਦਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।", password: "ਪਾਸਵਰਡ",
    enterPasswordPlaceholder: "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ", signIn: "ਸਾਈਨ ਇਨ ਕਰੋ", switchRole: "ਭੂਮਿਕਾ ਬਦਲੋ",
    chooseDifferentRole: "← ਹੋਰ ਭੂਮਿਕਾ ਚੁਣੋ", incorrectPassword: "ਇਸ ਡੈਮੋ ਖਾਤੇ ਦਾ ਪਾਸਵਰਡ ਗਲਤ ਹੈ।",
    demoPassword: "ਡੈਮੋ ਪਾਸਵਰਡ", signInAs: "ਵਜੋਂ ਸਾਈਨ ਇਨ ਕਰੋ", accessRole: "ਹਰ ਭੂਮਿਕਾ ਦਾ ਡਾਟਾ ਵੱਖਰਾ ਅਤੇ ਪਾਸਵਰਡ ਨਾਲ ਸੁਰੱਖਿਅਤ ਹੈ।",
    reportProblem: "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ", caseClusters: "ਸਮੱਸਿਆ ਸਮੂਹ", facultyMatch: "ਮਾਹਿਰ ਮਿਲਾਨ", controlRoom: "ਕੰਟਰੋਲ ਰੂਮ", caseFiles: "ਕੇਸ ਫਾਈਲਾਂ",
    portalTagline: "ਨਾਗਰਿਕ ਸਮੱਸਿਆਵਾਂ ਨੂੰ ਯੂਨੀਵਰਸਿਟੀ ਖੋਜ ਅਤੇ ਉਦਯੋਗ ਦੇ ਹੱਲਾਂ ਨਾਲ ਜੋੜਨ ਵਾਲਾ ਮੰਚ।",
    cases: "ਕੇਸ", reports: "ਰਿਪੋਰਟਾਂ", districts: "ਜ਼ਿਲ੍ਹੇ", reportChallenge: "ਸਮਾਜਿਕ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ",
    reportIntro: "ਨਾਗਰਿਕ ਅਤੇ ਸਰਕਾਰੀ ਵਿਭਾਗ ਇੱਥੇ ਸਮੱਸਿਆ ਦਰਜ ਕਰ ਸਕਦੇ ਹਨ। ਸੱਜੇ ਪਾਸੇ AI ਦੱਸੇਗਾ ਕਿ ਸਮੱਸਿਆ ਨਾਲ ਕੀ ਹੋਵੇਗਾ।",
    tryDuplicate: "ਡੁਪਲੀਕੇਟ ਰਿਪੋਰਟ ਅਜ਼ਮਾਓ", tryFresh: "ਨਵਾਂ ਕੇਸ ਅਜ਼ਮਾਓ", title: "ਸਿਰਲੇਖ", description: "ਵੇਰਵਾ",
    titlePlaceholder: "ਜਿਵੇਂ: ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਹੈਂਡਪੰਪ ਸੁੱਕਾ ਹੈ", descriptionPlaceholder: "ਸਮੱਸਿਆ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੋ, ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ…",
    speakInstead: "ਬੋਲ ਕੇ ਦੱਸੋ", listening: "ਸੁਣ ਰਹੇ ਹਾਂ…", transcribing: "ਸੁਣ ਰਹੇ ਹਾਂ — ਸਾਫ਼ ਬੋਲੋ, ਰੋਕਣ ਲਈ ਦੁਬਾਰਾ ਟੈਪ ਕਰੋ…",
    district: "ਜ਼ਿਲ੍ਹਾ", attachPhoto: "ਫੋਟੋ ਸਬੂਤ ਜੋੜੋ", logCase: "ਕੇਸ ਦਰਜ ਕਰੋ",
    domain: "ਖੇਤਰ", autoDetect: "ਆਪਣੇ-ਆਪ ਪਛਾਣ (AI)", domainHint: "ਸਹੀ ਮਾਹਿਰ ਤੱਕ ਸਿੱਧਾ ਭੇਜਣ ਲਈ ਖੇਤਰ ਖੁਦ ਚੁਣੋ — ਜਾਂ ਆਪਣੇ-ਆਪ ਪਛਾਣ 'ਤੇ ਛੱਡ ਦਿਓ।",
    aiPreview: "AI ਸਮੱਸਿਆ ਪ੍ਰਬੰਧਨ — ਲਾਈਵ", startTyping: "ਲਿਖਣਾ ਸ਼ੁਰੂ ਕਰੋ ਜਾਂ ਉੱਪਰੋਂ ਉਦਾਹਰਨ ਚੁਣੋ। AI ਸ਼੍ਰੇਣੀ ਅਤੇ ਮਿਲਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦਿਖਾਏਗਾ।",
    detectedCategory: "ਪਛਾਣੀ ਸ਼੍ਰੇਣੀ", confidence: "ਭਰੋਸਾ", resolutionTarget: "ਦਰਜ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੱਲ ਦਾ ਟੀਚਾ",
    similarity: "ਮੌਜੂਦਾ ਕੇਸਾਂ ਨਾਲ ਮਿਲਾਪ", noRelated: "ਕੋਈ ਸੰਬੰਧਿਤ ਕੇਸ ਨਹੀਂ ਮਿਲਿਆ — ਇਹ ਨਵੀਂ ਸਮੱਸਿਆ ਲੱਗਦੀ ਹੈ।",
    merge: "ਇਸ ਵਿੱਚ ਜੋੜਿਆ ਜਾਵੇਗਾ", newCase: "ਮਿਲਾਪ ਘੱਟ ਹੈ — ਨਵਾਂ ਕੇਸ ਖੁੱਲੇਗਾ।",
    caseClustersTitle: "ਸਮੱਸਿਆ ਸਮੂਹ", caseClustersIntro: "ਇੱਕੋ ਜਿਹੀਆਂ ਰਿਪੋਰਟਾਂ ਇੱਕ ਸਮੱਸਿਆ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦੀਆਂ ਹਨ ਅਤੇ ਫ਼ਜ਼ੂਲ ਭੀੜ ਨਹੀਂ ਬਣਾਉਂਦੀਆਂ।",
    all: "ਸਭ", sort: "ਕ੍ਰਮ:", mostUrgent: "ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ", mostReported: "ਸਭ ਤੋਂ ਵੱਧ ਰਿਪੋਰਟ",
    myReports: "ਮੇਰੀਆਂ ਰਿਪੋਰਟਾਂ — ਪੂਰੀ ਜਾਣਕਾਰੀ", communityBoard: "ਕਮਿਊਨਿਟੀ ਬੋਰਡ — ਸਿਰਫ਼ ਜਨਤਕ ਜਾਣਕਾਰੀ",
    fullDetails: "ਪੂਰੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਰਿਪੋਰਟ ਕਰਨ ਵਾਲੇ ਨਾਗਰਿਕ ਅਤੇ ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ।", filedBy: "ਦਰਜ ਕੀਤਾ",
    citizensReported: "ਨਾਗਰਿਕਾਂ ਨੇ ਰਿਪੋਰਟ ਕੀਤਾ", findFaculty: "ਮਾਹਿਰ ਲੱਭੋ", matched: "ਮਿਲਿਆ",
    accessScope: "ਪਹੁੰਚ ਸੀਮਾ", noCases: "ਕੋਈ ਕੇਸ ਨਹੀਂ", onTarget: "ਸਮੇਂ ਸਿਰ", deployed: "ਲਾਗੂ",
    caseLifecycle: "ਕੇਸ ਫਾਈਲ — ਪ੍ਰੋਜੈਕਟ ਦੀ ਤਰੱਕੀ", lifecycleIntro: "ਕੇਸ ਨੂੰ ਪੜਾਅ ਦਰ ਪੜਾਅ ਅੱਗੇ ਵਧਾਓ ਅਤੇ ਕੰਟਰੋਲ ਰੂਮ ਵਿੱਚ ਬਦਲਾਅ ਵੇਖੋ।",
    matchFaculty: "ਮਾਹਿਰ ਮਿਲਾਓ →", pledgeSupport: "ਸਹਾਇਤਾ ਦਿਓ", awaitingPledge: "ਉਦਯੋਗ ਭਾਗੀਦਾਰ ਦੀ ਸਹਾਇਤਾ ਦੀ ਉਡੀਕ",
    advance: "ਅੱਗੇ ਵਧਾਓ", facultyTitle: "ਮਾਹਿਰ ਮਿਲਾਨ", assignCase: "ਕੇਸ ਸੌਂਪੋ", matchStrength: "ਮਿਲਾਨ ਦੀ ਤਾਕਤ",
    activeCases: "ਸਰਗਰਮ ਕੇਸ", yourQueue: "ਤੁਹਾਡੀ ਸੂਚੀ: ਬਿਨਾਂ ਮਾਹਿਰ ਵਾਲੇ ਅਤੇ ਤੁਹਾਡੇ ਨਾਲ ਜੁੜੇ ਕੇਸ।",
    rankedFaculty: "ਕੇਸ ਚੁਣੋ ਅਤੇ ਖੋਜ ਦੇ ਆਧਾਰ 'ਤੇ ਮਾਹਿਰਾਂ ਦੀ ਰੈਂਕਿੰਗ ਵੇਖੋ।",
    currentlyAssigned: "ਮੌਜੂਦਾ ਤੌਰ 'ਤੇ ਸੌਂਪਿਆ", stakeholdersNotified: "ਕੇਸ ਅਗਲੇ ਪੜਾਅ 'ਤੇ ਗਿਆ — ਸਬੰਧਤ ਲੋਕਾਂ ਨੂੰ ਸੂਚਨਾ ਭੇਜੀ ਗਈ।",
    languageChanged: "ਭਾਸ਼ਾ ਬਦਲ ਕੇ",
  },
  Haryanvi: {
    language: "भाषा", chooseLanguage: "अपणी भाषा चुनो", languageHint: "इसे ऊपर तै कदे भी बदल सको हो।",
    continue: "आगे चालो", close: "बंद करो", selectLanguage: "भाषा चुनो",
    department: "उच्च अर तकनीकी शिक्षा · झारखंड सरकार",
    chooseRole: "आगे चालण खातर अपणी भूमिका चुनो। हर खाते नै जितना अधिकार सै उतना ही डेटा दिखेगा।",
    enterPassword: "जारी राखण खातर इस खाते का पासवर्ड भरो।", password: "पासवर्ड",
    enterPasswordPlaceholder: "पासवर्ड भरो", signIn: "साइन इन करो", switchRole: "भूमिका बदलो",
    chooseDifferentRole: "← दूसरी भूमिका चुनो", incorrectPassword: "इस डेमो खाते का पासवर्ड गलत सै।",
    demoPassword: "डेमो पासवर्ड", signInAs: "के नाम तै साइन इन करो", accessRole: "हर भूमिका का डेटा अलग अर पासवर्ड तै सुरक्षित सै।",
    reportProblem: "समस्या दर्ज करो", caseClusters: "समस्या समूह", facultyMatch: "माहिर मिलान", controlRoom: "कंट्रोल रूम", caseFiles: "केस फाइल",
    portalTagline: "गांव-शहर की समस्याओं नै यूनिवर्सिटी की रिसर्च अर उद्योग के हल तै जोड़ण वाला मंच।",
    cases: "केस", reports: "रिपोर्ट", districts: "जिले", reportChallenge: "समाज की समस्या दर्ज करो",
    reportIntro: "नागरिक अर सरकारी विभाग इब्बै समस्या दर्ज कर सकें सैं। दाईं तरफ AI बतावेगा के आगे के होगा।",
    tryDuplicate: "डुप्लीकेट रिपोर्ट देखो", tryFresh: "नया केस देखो", title: "शीर्षक", description: "विवरण",
    titlePlaceholder: "जैसे: तीन हफ्ते तै हैंडपंप सूखा सै", descriptionPlaceholder: "समस्या अपने शब्दां में लिखो, किसी भी भाषा में…",
    speakInstead: "बोल कै बताओ", listening: "सुण रहे सैं…", transcribing: "सुण रहे सैं — साफ बोलो, रोकण खात्तर फेर टैप करो…",
    district: "जिला", attachPhoto: "फोटो सबूत जोड़ो", logCase: "केस दर्ज करो",
    domain: "क्षेत्र", autoDetect: "अपने आप पहचान (AI)", domainHint: "सही माहिर तक सीधा भेजण खात्तर क्षेत्र खुद चुणो — या अपने आप पहचान पर छोड़ दो।",
    aiPreview: "AI समस्या प्रबंधन — लाइव", startTyping: "लिखना शुरू करो या ऊपर तै उदाहरण चुनो। AI श्रेणी अर मिलती-जुलती समस्या दिखावेगा।",
    detectedCategory: "पहचानी गई श्रेणी", confidence: "भरोसा", resolutionTarget: "दर्ज होण पाछै समाधान का टारगेट",
    similarity: "मौजूदा केसां तै मिलान", noRelated: "कोई मिलती समस्या ना मिली — यो नई समस्या लागै सै।",
    merge: "इसमें जोड़ दी जाएगी", newCase: "मिलान कम सै — नया केस खुलैगा।",
    caseClustersTitle: "समस्या समूह", caseClustersIntro: "एक जैसी रिपोर्ट एक ही समस्या नै मजबूत करै सैं, फालतू भीड़ ना बनै।",
    all: "सारे", sort: "क्रम:", mostUrgent: "सबतै जरूरी", mostReported: "सबतै ज्यादा रिपोर्ट",
    myReports: "मेरी रिपोर्ट — पूरी जानकारी", communityBoard: "सामुदायिक बोर्ड — सिर्फ सार्वजनिक जानकारी",
    fullDetails: "पूरी जानकारी सिर्फ रिपोर्ट करण वाले नागरिक अर अफसरां नै दिखै सै।", filedBy: "दर्ज करण वाला",
    citizensReported: "नागरिकां नै रिपोर्ट किया", findFaculty: "माहिर ढूंढो", matched: "मिल गया",
    accessScope: "पहुंच सीमा", noCases: "कोई केस ना सै", onTarget: "समय पर", deployed: "लागू",
    caseLifecycle: "केस फाइल — प्रोजेक्ट की प्रगति", lifecycleIntro: "केस नै चरण-दर-चरण आगे बढ़ाओ अर कंट्रोल रूम में बदलाव देखो।",
    matchFaculty: "माहिर मिलाओ →", pledgeSupport: "सहायता दो", awaitingPledge: "उद्योग वाले की सहायता का इंतजार",
    advance: "आगे बढ़ाओ", facultyTitle: "माहिर मिलान", assignCase: "केस सौंपो", matchStrength: "मिलान की ताकत",
    activeCases: "चलते केस", yourQueue: "तुम्हारी सूची: बिना माहिर वाले अर तुम तै जुड़े केस।",
    rankedFaculty: "केस चुनो अर रिसर्च के हिसाब तै माहिरां की रैंकिंग देखो।",
    currentlyAssigned: "इब्बै सौंपा गया", stakeholdersNotified: "केस अगले चरण में गया — संबंधित लोगां नै सूचना भेज दी।",
    languageChanged: "भाषा बदल कै",
  },
};

const LanguageContext = createContext(null);
function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try { return localStorage.getItem("samadhan-language") || "English"; } catch { return "English"; }
  });
  useEffect(() => {
    try { localStorage.setItem("samadhan-language", language); } catch {}
  }, [language]);
  const setLanguage = (next) => {
    const valid = LANGUAGES.some((l) => l.code === next) ? next : "English";
    setLanguageState(valid);
  };
  const t = (key) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
function useLanguage() {
  return useContext(LanguageContext);
}
function languageLabel(code) {
  return LANGUAGES.find((l) => l.code === code)?.native || code;
}
function LanguageModal({ open, language, setLanguage, onClose, loginMode = false }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(32,40,31,0.48)", backdropFilter: "blur(4px)" }} />
      <div className="relative w-full max-w-md rounded-2xl p-5 sm:p-6" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_LG }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: COLORS.rustDark }}>{t("language")}</div>
            <h2 className="font-display text-2xl mt-1" style={{ color: COLORS.ink }}>{t("chooseLanguage")}</h2>
            <p className="text-xs mt-1.5" style={{ color: COLORS.inkSoft }}>{t("languageHint")}</p>
          </div>
          {!loginMode && <button onClick={onClose} aria-label={t("close")} className="p-1.5 rounded-full" style={{ color: COLORS.inkSoft }}><X size={17} /></button>}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          {LANGUAGES.map((item) => {
            const active = language === item.code;
            return (
              <button key={item.code} onClick={() => setLanguage(item.code)}
                className="text-left rounded-xl p-4 transition-all"
                style={{ background: active ? COLORS.rust + "12" : COLORS.white, border: `2px solid ${active ? COLORS.rust : COLORS.line}`, boxShadow: active ? `0 0 0 3px ${COLORS.rust}10` : "none" }}>
                <div className="text-2xl">{item.flag}</div>
                <div className="text-sm font-semibold mt-2" style={{ color: COLORS.ink }}>{item.native}</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: COLORS.inkSoft }}>{item.label}</div>
                {active && <div className="text-[10px] font-semibold mt-2" style={{ color: COLORS.rustDark }}>✓ {t("selectLanguage")}</div>}
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full mt-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustDark})`, color: COLORS.white, boxShadow: SHADOW_MD }}>
          {loginMode ? t("continue") : t("close")}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- domain data ---------------------------------- */
const CATEGORIES = {
  Water: { color: COLORS.slate, sdg: "SDG 6 · Clean Water", keywords: ["handpump", "groundwater", "borewell", "drinking water", "arsenic", "water treatment", "pond", "well is dry", "water"] },
  Education: { color: COLORS.gold, sdg: "SDG 4 · Quality Education", keywords: ["teacher", "school", "classroom", "syllabus", "board exam", "science teacher", "students"] },
  Healthcare: { color: COLORS.maroon, sdg: "SDG 3 · Good Health", keywords: ["doctor", "sub-health centre", "clinic", "maternal", "anganwadi", "nutrition", "hospital", "pregnant"] },
  Agriculture: { color: COLORS.forest, sdg: "SDG 2 · Zero Hunger", keywords: ["crop", "paddy", "elephant", "cold storage", "harvest", "irrigation", "tomato", "farmer"] },
  Environment: { color: COLORS.forestSoft, sdg: "SDG 15 · Life on Land", keywords: ["mining", "river", "pollution", "deforestation", "sal forest", "spring", "contamination"] },
  Energy: { color: "#A6742C", sdg: "SDG 7 · Affordable Energy", keywords: ["power cut", "electricity", "grid", "transformer", "microgrid", "outage"] },
  "Urban Development": { color: COLORS.slate, sdg: "SDG 11 · Sustainable Cities", keywords: ["drainage", "stormwater", "waterlogging", "streetlight", "ward", "flood", "road", "bridge", "footbridge"] },
  Accessibility: { color: COLORS.violet, sdg: "SDG 10 · Reduced Inequality", keywords: ["ramp", "wheelchair", "disabled", "accessible", "barrier"] },
  "Public Administration": { color: COLORS.inkSoft, sdg: "SDG 16 · Strong Institutions", keywords: ["certificate", "pending", "application", "ration card", "office", "delay"] },
  "Rural Livelihoods": { color: COLORS.rust, sdg: "SDG 8 · Decent Work", keywords: ["artisan", "handicraft", "lac", "market linkage", "livelihood", "haat", "self help group"] },
};
const CODES = { Water: "WTR", Education: "EDU", Healthcare: "HLT", Agriculture: "AGR", Environment: "ENV", Energy: "NRG", "Urban Development": "URB", Accessibility: "ACC", "Public Administration": "ADM", "Rural Livelihoods": "LVH" };

const DISTRICTS = ["Ranchi", "Khunti", "Gumla", "Simdega", "Lohardaga", "West Singhbhum", "East Singhbhum", "Saraikela Kharsawan", "Bokaro", "Dhanbad", "Giridih", "Koderma", "Hazaribagh", "Ramgarh", "Chatra", "Palamu", "Garhwa", "Latehar", "Deoghar", "Dumka", "Jamtara", "Godda", "Sahibganj", "Pakur"];

/* Approximate district-headquarters coordinates, used only to lay out a schematic map — not a survey-accurate boundary. */
const DISTRICT_GEO = {
  Ranchi: [23.36, 85.33], Khunti: [23.07, 85.28], Gumla: [23.04, 84.54], Simdega: [22.62, 84.51],
  Lohardaga: [23.43, 84.68], "West Singhbhum": [22.56, 85.80], "East Singhbhum": [22.80, 86.18],
  "Saraikela Kharsawan": [22.70, 85.93], Bokaro: [23.67, 86.15], Dhanbad: [23.80, 86.43],
  Giridih: [24.18, 86.30], Koderma: [24.47, 85.59], Hazaribagh: [23.99, 85.36], Ramgarh: [23.63, 85.52],
  Chatra: [24.21, 84.87], Palamu: [24.05, 84.07], Garhwa: [24.15, 83.80], Latehar: [23.74, 84.50],
  Deoghar: [24.48, 86.70], Dumka: [24.27, 87.25], Jamtara: [23.96, 86.80], Godda: [24.83, 87.21],
  Sahibganj: [25.25, 87.65], Pakur: [24.63, 87.85],
};
const GEO_BOUNDS = { latMin: 21.85, latMax: 25.55, lonMin: 83.25, lonMax: 88.15 };
const MAP_W = 580, MAP_H = 460;
function project([lat, lon]) {
  const x = ((lon - GEO_BOUNDS.lonMin) / (GEO_BOUNDS.lonMax - GEO_BOUNDS.lonMin)) * MAP_W;
  const y = ((GEO_BOUNDS.latMax - lat) / (GEO_BOUNDS.latMax - GEO_BOUNDS.latMin)) * MAP_H;
  return { x, y };
}
function catmullRomPath(pts) {
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
  }
  return d + "Z";
}
/* Rough perimeter waypoints tracing Jharkhand's outline, incl. the narrow Sahibganj–Pakur prong in the northeast. Schematic, not GIS-accurate. */
const OUTLINE_LATLON = [
  [24.30, 83.55], [24.55, 84.55], [24.62, 85.55], [24.68, 86.15], [24.80, 86.75],
  [25.05, 87.20], [25.38, 87.80], [24.95, 88.00], [24.55, 87.55], [23.95, 87.30],
  [23.30, 87.00], [22.65, 86.55], [22.30, 86.05], [22.00, 85.55], [21.95, 84.95],
  [22.20, 84.35], [22.65, 83.95], [23.30, 83.65], [23.90, 83.55],
];
const STATE_OUTLINE_PATH = catmullRomPath(OUTLINE_LATLON.map(project));

/* Institution coordinates are approximate campus locations for wayfinding — good enough to open
   directions from, not survey-accurate GPS. */
const FACULTY = [
  { name: "Dr. R. Oraon", inst: "BIT Mesra", dept: "Civil & Water Resources Engineering", categories: ["Water"], keywords: ["handpump", "groundwater", "arsenic", "water treatment", "borewell", "drinking water", "filtration", "dry"], load: 4, geo: [23.4130, 85.4485], address: "BIT Mesra, Ranchi, Jharkhand 835215" },
  { name: "Dr. S. Kujur", inst: "Birsa Agricultural University, Ranchi", dept: "Agricultural Sciences", categories: ["Agriculture"], keywords: ["crop", "paddy", "elephant", "cold storage", "harvest", "irrigation", "tomato", "farmer"], load: 3, geo: [23.4325, 85.2810], address: "Birsa Agricultural University, Kanke, Ranchi, Jharkhand 834006" },
  { name: "Dr. A. Mahto", inst: "IIT (ISM) Dhanbad", dept: "Computer Science & Engineering", categories: ["Urban Development", "Environment"], keywords: ["drainage", "stormwater", "gis", "mining", "flood", "waterlogging", "sensor"], load: 5, geo: [23.8143, 86.4341], address: "IIT (ISM) Dhanbad, Jharkhand 826004" },
  { name: "Dr. P. Hansda", inst: "XISS, Ranchi", dept: "Rural Development & Management", categories: ["Rural Livelihoods"], keywords: ["artisan", "handicraft", "lac", "market", "livelihood", "haat", "self help group"], load: 2, geo: [23.3560, 85.3230], address: "Xavier Institute of Social Service, Ranchi, Jharkhand 834001" },
  { name: "Dr. N. Verma", inst: "Vinoba Bhave University, Hazaribagh", dept: "Environmental Science", categories: ["Environment"], keywords: ["mining", "river", "pollution", "deforestation", "sal forest", "spring", "contamination"], load: 3, geo: [23.9925, 85.3630], address: "Vinoba Bhave University, Hazaribagh, Jharkhand 825301" },
  { name: "Dr. K. Singh", inst: "Ranchi University", dept: "Education", categories: ["Education"], keywords: ["teacher", "school", "classroom", "syllabus", "science teacher", "board exam", "roof"], load: 4, geo: [23.3730, 85.3346], address: "Ranchi University, Ranchi, Jharkhand 834001" },
  { name: "Dr. M. Toppo", inst: "RIMS, Ranchi", dept: "Community & Public Health", categories: ["Healthcare"], keywords: ["doctor", "sub-health centre", "maternal", "anganwadi", "nutrition", "clinic", "pregnant"], load: 6, geo: [23.3820, 85.3390], address: "Rajendra Institute of Medical Sciences, Bariatu, Ranchi, Jharkhand 834009" },
  { name: "Dr. D. Ansari", inst: "BIT Sindri", dept: "Electrical Engineering", categories: ["Energy"], keywords: ["power cut", "electricity", "grid", "transformer", "microgrid", "outage"], load: 2, geo: [23.7480, 86.6660], address: "BIT Sindri, Dhanbad, Jharkhand 828123" },
];

const PARTNERS = [
  { name: "Sal Valley Ventures", type: "Startup · AgriTech", focus: ["Agriculture", "Rural Livelihoods"], geo: [23.3629, 85.3255], address: "Startup Hub, Kutchery Road, Ranchi, Jharkhand 834001" },
  { name: "Mesra Innovation & Incubation Cell", type: "University Incubator", focus: ["Water", "Energy", "Urban Development"], geo: [23.4130, 85.4485], address: "BIT Mesra Campus, Ranchi, Jharkhand 835215" },
  { name: "Plateau Health Foundation", type: "CSR Foundation", focus: ["Healthcare", "Education"], geo: [23.3441, 85.3096], address: "Circular Road, Lalpur, Ranchi, Jharkhand 834001" },
  { name: "GreenLac Enterprises", type: "MSME · Forest Produce", focus: ["Environment", "Rural Livelihoods"], geo: [23.0713, 85.2789], address: "Industrial Area, Khunti, Jharkhand 835210" },
  { name: "Chotanagpur Research Labs", type: "Research Lab", focus: ["Water", "Environment"], geo: [23.4041, 85.4298], address: "Namkum, Ranchi, Jharkhand 834010" },
  { name: "Koel River CSR Trust", type: "CSR Foundation", focus: ["Urban Development", "Accessibility"], geo: [23.3200, 85.3000], address: "Harmu Road, Ranchi, Jharkhand 834002" },
];

/* Small pill that opens the exact spot in Google Maps — used wherever a faculty institution
   or industry partner is listed, so anyone can get walking/driving directions in one tap. */
function DirectionsLink({ geo, label }) {
  if (!geo) return null;
  const [lat, lon] = geo;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
      style={{ color: COLORS.slate, background: COLORS.slate + "14", border: `1px solid ${COLORS.slate}33` }}
    >
      <MapPin size={9} /> {label || "Directions"}
    </a>
  );
}

const STAGES = ["Logged", "Assigned to University", "Prototype in Development", "Industry Partnership", "Piloting", "Deployed"];

const ROLE_META = {
  Citizen: { label: "Citizen", demoName: "Meera Devi", demoSub: "Resident, Chatra district", icon: User, desc: "Report a problem and see how many others share it.", tabs: ["submit", "clusters"], password: "citizen123", scopeNote: "Sees full detail only on cases they personally filed; other cases appear as redacted public summaries." },
  Faculty: { label: "University Faculty", demoName: "Dr. R. Oraon", demoSub: "BIT Mesra", icon: GraduationCap, desc: "Review clustered cases and take on ones matching your research.", tabs: ["clusters", "match", "lifecycle"], password: "faculty123", scopeNote: "Sees the open, unassigned pool plus only their own assigned cases — not other institutions' active work." },
  Industry: { label: "Industry Partner", demoName: "Anil Verma", demoSub: "Sal Valley Ventures", icon: Building2, desc: "Co-fund and track prototypes moving toward deployment.", tabs: ["clusters", "lifecycle"], password: "industry123", scopeNote: "Sees only cases that have reached Industry Partnership stage or later — not raw citizen submissions." },
  Government: { label: "Government Official", demoName: "S. Kumari", demoSub: "Dept. of Higher & Technical Education", icon: LayoutDashboard, desc: "Full oversight — submissions, routing, funding and analytics.", tabs: ["submit", "clusters", "match", "dashboard", "lifecycle"], password: "govt2026", scopeNote: "Unrestricted access — the only role that can see every case, every stage, statewide." },
};

/* Row-level access scoping — mirrors an IAM policy per role, applied before data ever reaches a screen. */
function scopeProblems(problems, user) {
  if (!user || user.role === "Government") return problems;
  if (user.role === "Faculty") return problems.filter((p) => !p.matchedFaculty || p.matchedFaculty.startsWith(user.name));
  if (user.role === "Industry") return problems.filter((p) => ["Industry Partnership", "Piloting", "Deployed"].includes(p.status));
  return problems; // Citizen: scoping is applied at render time (ownership-based redaction), not by filtering the list
}

const SEED = [
  { id: 1, caseNo: "JH-WTR-1042", category: "Water", district: "Chatra", title: "Community handpump has run dry", description: "Community handpump has been dry for three months, forcing women and children to walk nearly two kilometres daily to fetch drinking water from the neighbouring village. The groundwater table in this hamlet has dropped sharply after two weak monsoons, and the panchayat's request for a new borewell has been pending for over a year with no site survey conducted yet. Elderly residents and pregnant women are worst affected, since the daily trip eats into time otherwise spent on farm work, schooling, or rest. The issue has been raised at three separate gram sabha meetings, but no written response has come from the block water resources office so far.", summary: "Community handpump has been dry for three months, forcing daily two-kilometre water trips.", votes: 46, status: "Assigned to University", matchedFaculty: "Dr. R. Oraon · BIT Mesra", daysAgo: 52, fundingGoal: 0, fundingPledged: 0 },
  { id: 2, caseNo: "JH-EDU-1043", category: "Education", district: "Gumla", title: "No science teacher for two years", description: "No science teacher has been posted at the government high school for two years, leaving close to 140 students across classes 9 and 10 without formal instruction in physics, chemistry, or biology. Students are self-studying from old notes and photocopied textbooks passed between classmates, with almost no practical lab exposure ahead of their board exams. The school's single science laboratory now sits mostly unused, and the classroom meant for science periods has been repurposed for general assembly instead. Parents have submitted three written requests to the block education office, but the vacancy remains unfilled due to a district-wide shortage of qualified science teachers.", summary: "No science teacher posted for two years; students are self-studying ahead of board exams.", votes: 31, status: "Prototype in Development", matchedFaculty: "Dr. K. Singh · Ranchi University", daysAgo: 61, fundingGoal: 0, fundingPledged: 0 },
  { id: 3, caseNo: "JH-HLT-1044", category: "Healthcare", district: "Simdega", title: "Sub-health centre has no doctor visits", description: "The sub-health centre has had no doctor visits since last winter, despite serving roughly a dozen surrounding villages with a combined population of over six thousand people. Pregnant women now travel eighteen kilometres to the nearest functioning clinic for routine checkups, often relying on shared jeeps that run only twice a day. At least two high-risk pregnancies flagged by the local ASHA worker have gone unmonitored through the third trimester due to the lack of a resident doctor. The centre's pharmacy has also been out of basic medicines for over two months, compounding the effect of the staffing gap on maternal and general health.", summary: "Sub-health centre has had no doctor visits since last winter; pregnant women travel far for checkups.", votes: 58, status: "Industry Partnership", matchedFaculty: "Dr. M. Toppo · RIMS, Ranchi", daysAgo: 74, fundingGoal: 150000, fundingPledged: 95000, fundingUsed: 61000, fundingPartner: "Plateau Health Foundation", expenses: [
    { id: "e3-1", amount: 32000, note: "Telemedicine kiosk hardware", by: "Dr. M. Toppo", at: 1 },
    { id: "e3-2", amount: 29000, note: "Community health worker stipends (2 months)", by: "Dr. M. Toppo", at: 2 },
  ] },
  { id: 4, caseNo: "JH-AGR-1045", category: "Agriculture", district: "West Singhbhum", title: "Wild elephants damage paddy every season", description: "Wild elephants damage the paddy fields every harvest season, entering from the adjoining forest corridor at night and trampling entire plots within a few hours. Families across this cluster of villages lose an entire season's income overnight, with no compensation process currently reaching them despite repeated complaints filed with the forest department. Farmers have tried makeshift solar fencing and night-time drum patrols, but neither has meaningfully reduced how often the herds return. Since paddy is the primary crop for most households here, the recurring losses are pushing several families toward debt before the next planting cycle even begins.", summary: "Wild elephants damage paddy fields every harvest season, wiping out a season's income overnight.", votes: 39, status: "Prototype in Development", matchedFaculty: "Dr. S. Kujur · BAU Ranchi", daysAgo: 40, fundingGoal: 0, fundingPledged: 0 },
  { id: 5, caseNo: "JH-AGR-1046", category: "Agriculture", district: "Ramgarh", title: "No cold storage for tomato farmers", description: "There is no cold storage facility for tomato farmers within roughly forty kilometres, so nearly a third of the harvest rots before it reaches the market during peak season. Farmers currently sell at throwaway prices to middlemen who arrive with refrigerated trucks, since holding the produce even two extra days risks spoiling the entire batch. A proposed cooperative cold-storage unit was discussed three years ago but never moved past the planning stage due to funding gaps between the panchayat and the agriculture department. Better storage infrastructure could directly raise farmgate prices and cut post-harvest losses for dozens of tomato-growing villages nearby.", summary: "No cold storage for tomato farmers nearby, so nearly a third of the harvest rots before sale.", votes: 22, status: "Logged", matchedFaculty: null, daysAgo: 9, fundingGoal: 0, fundingPledged: 0 },
  { id: 6, caseNo: "JH-ENV-1047", category: "Environment", district: "East Singhbhum", title: "Illegal mining clouding the river", description: "Illegal sand and stone mining upstream has turned the river water cloudy and undrinkable for three villages downstream, with visible silt deposits now reaching stretches that previously stayed clear year-round. Local fishing catches have dropped noticeably over the past two seasons, and several households that once relied on the river for both drinking and irrigation have had to switch to handpumps instead. Villagers have reported the illegal mining operation to the district mining office twice, but enforcement visits have been irregular and no action has followed. Continued pollution also risks longer-term contamination of the groundwater table feeding nearby wells.", summary: "Illegal mining upstream has turned the river cloudy and undrinkable for three villages downstream.", votes: 44, status: "Assigned to University", matchedFaculty: "Dr. N. Verma · Vinoba Bhave University", daysAgo: 35, fundingGoal: 0, fundingPledged: 0 },
  { id: 7, caseNo: "JH-ENV-1048", category: "Environment", district: "Khunti", title: "Sal forest clearing has dried up springs", description: "Sal forest clearing near the hills has dried up two natural springs that the village depended on for both drinking water and irrigating its terraced fields. The clearing, linked to unregulated timber extraction over the past three years, has visibly thinned the tree cover on the upper slopes that once retained monsoon runoff through the dry months. Since the springs failed, women now walk an extra forty minutes to the nearest alternative source, and terrace farmers have had to abandon part of their rabi crop for lack of irrigation water. Village elders say this is the first time in living memory that both springs have dried up in the same year.", summary: "Sal forest clearing has dried up two natural springs the village depended on.", votes: 18, status: "Logged", matchedFaculty: null, daysAgo: 6, fundingGoal: 0, fundingPledged: 0 },
  { id: 8, caseNo: "JH-NRG-1049", category: "Energy", district: "Dhanbad", title: "Six to eight hour daily power cuts", description: "Power cuts of six to eight hours daily are shutting down small welding and workshop units across this industrial cluster, cutting into already thin margins for roughly thirty small business owners. Most units run diesel generators as a stopgap, but rising fuel costs have made that an unsustainable long-term fix for daily operations. The outages tend to cluster in the afternoon, exactly when workshops need continuous power for cutting and welding equipment that can't tolerate frequent restarts. Business owners have petitioned the local electricity board for a dedicated feeder line but have not received a firm timeline for approval.", summary: "Six to eight hour daily power cuts are shutting down small welding and workshop units.", votes: 27, status: "Logged", matchedFaculty: null, daysAgo: 14, fundingGoal: 0, fundingPledged: 0 },
  { id: 9, caseNo: "JH-URB-1050", category: "Urban Development", district: "Ranchi", title: "Ward 12 floods every monsoon", description: "Ward 12 floods every monsoon because the stormwater drains were never connected to the main channel during the last road expansion project nearly six years ago. Water pools to knee-depth on the main road within an hour of heavy rain, cutting off access for two-wheelers and stranding residents in low-lying homes along the ward's eastern stretch. Local shopkeepers report recurring stock damage each monsoon season, and the municipal corporation's temporary desilting measures have not addressed the underlying connectivity gap in the drainage network. Residents have filed the same complaint for three consecutive monsoon seasons without a permanent fix being scheduled.", summary: "Ward 12 floods every monsoon due to stormwater drains never connected to the main channel.", votes: 63, status: "Deployed", matchedFaculty: "Dr. A. Mahto · IIT (ISM) Dhanbad", daysAgo: 210, fundingGoal: 220000, fundingPledged: 220000, fundingUsed: 218500, fundingPartner: "Mesra Innovation & Incubation Cell", expenses: [
    { id: "e9-1", amount: 140000, note: "Stormwater sensor network + install", by: "Dr. A. Mahto", at: 1 },
    { id: "e9-2", amount: 52000, note: "GIS drainage mapping survey", by: "Dr. A. Mahto", at: 2 },
    { id: "e9-3", amount: 26500, note: "Field crew + equipment transport", by: "Dr. A. Mahto", at: 3 },
  ] },
  { id: 10, caseNo: "JH-URB-1051", category: "Urban Development", district: "Bokaro", title: "No street lighting for a kilometre", description: "There is no street lighting for almost a kilometre on the main road connecting the residential colony to the market area, and residents avoid walking that stretch after dark because of safety concerns. Two minor two-wheeler accidents have been reported on the unlit stretch over the past six months, both attributed partly to poor visibility at night. Women commuting home from work or evening tuition classes now arrange group walks or paid transport instead of covering the short distance alone. The ward councillor has acknowledged the gap but has cited pending budget approval for new poles and wiring before work can start.", summary: "No street lighting for almost a kilometre; residents avoid walking after dark.", votes: 15, status: "Logged", matchedFaculty: null, daysAgo: 4, fundingGoal: 0, fundingPledged: 0 },
  { id: 11, caseNo: "JH-ACC-1052", category: "Accessibility", district: "Hazaribagh", title: "Block office has no ramp", description: "The block office has no ramp, so wheelchair users and elderly visitors are carried up the single flight of stairs by strangers or family members for every single visit, including routine paperwork like pension renewals. The building was constructed over a decade ago, before accessibility norms were as strictly enforced, and no retrofit has been carried out since. At least two disabled residents in the area say they now avoid the office altogether because of the physical difficulty, delaying their access to government schemes they are otherwise entitled to. A simple ramp and handrail installation could restore access for an estimated fifteen to twenty differently-abled residents who regularly need the office's services.", summary: "Block office has no ramp, so wheelchair users are carried up the stairs on every visit.", votes: 12, status: "Logged", matchedFaculty: null, daysAgo: 8, fundingGoal: 0, fundingPledged: 0 },
  { id: 12, caseNo: "JH-LVH-1053", category: "Rural Livelihoods", district: "Dumka", title: "Artisans have no market beyond the haat", description: "Handicraft artisans have no market beyond the weekly haat, and most of their work — including bamboo craft and traditional textile weaving — sells for a fraction of its real worth to local traders who resell it at a significant markup in nearby towns. Around forty artisan households in the area rely on this craft as a secondary income source alongside farming, but the lack of direct market access or branding keeps their earnings consistently low. Several artisans have expressed interest in an online marketplace or an exhibition stall at district fairs but lack the resources or guidance to set one up on their own. Better market linkage could meaningfully raise household income without requiring any change to their existing craft practice.", summary: "Artisans have no market beyond the weekly haat and sell work for a fraction of its worth.", votes: 29, status: "Assigned to University", matchedFaculty: "Dr. P. Hansda · XISS, Ranchi", daysAgo: 45, fundingGoal: 0, fundingPledged: 0 },
  { id: 13, caseNo: "JH-LVH-1054", category: "Rural Livelihoods", district: "Khunti", title: "Lac cultivators use decades-old methods", description: "Lac cultivators still rely on decades-old processing methods passed down through generations, which cuts deeply into both yield and quality compared to lac produced in neighbouring states using more modern extraction techniques. The traditional method results in higher wastage during the scraping and washing stages, and cultivators have no access to updated equipment or training on improved practices. Roughly sixty households in the surrounding villages depend on lac cultivation as a primary or secondary income source, particularly during the lean agricultural season. Introducing modern processing techniques and basic quality-testing equipment could substantially improve both yield and market price for these local cultivators.", summary: "Lac cultivators still use decades-old methods, cutting into yield and quality.", votes: 17, status: "Logged", matchedFaculty: null, daysAgo: 11, fundingGoal: 0, fundingPledged: 0 },
  { id: 14, caseNo: "JH-ADM-1055", category: "Public Administration", district: "Godda", title: "Caste certificate pending six months", description: "Caste certificate applications have been pending for over six months with no update on status available to the applicant, despite the official processing timeline stating a maximum of thirty days. Several applicants, including students who need the certificate for scholarship or college admission purposes, have visited the block office multiple times only to be told the file is 'under verification' with no further detail offered. The lack of an online tracking system means applicants have no way to check progress remotely, forcing repeated in-person visits that cost daily-wage earners a full day's income each time. At least a dozen similarly delayed applications have been reported from the same block over the past year.", summary: "Caste certificate applications pending over six months with no status update.", votes: 34, status: "Logged", matchedFaculty: null, daysAgo: 20, fundingGoal: 0, fundingPledged: 0 },
  { id: 15, caseNo: "JH-WTR-1056", category: "Water", district: "Sahibganj", title: "Arsenic levels above safe limits", description: "Groundwater tests conducted by a district health team show arsenic levels above safe limits in three hamlets, but no alternative water source has been provided to residents yet despite the results being shared with the block office over four months ago. Long-term consumption of arsenic-contaminated water carries serious health risks, and a few residents have already reported skin lesions consistent with early-stage arsenic exposure. The affected hamlets currently have no functioning water treatment or filtration system in place, and the nearest confirmed-safe handpump is over a kilometre away. Community health workers have recommended urgent installation of arsenic-removal units or a piped connection from an unaffected source.", summary: "Groundwater tests show arsenic above safe limits; no alternative water source provided yet.", votes: 21, status: "Logged", matchedFaculty: null, daysAgo: 13, fundingGoal: 0, fundingPledged: 0 },
  { id: 16, caseNo: "JH-EDU-1057", category: "Education", district: "Latehar", title: "School roof collapsed after monsoon", description: "The school building roof partially collapsed after heavy monsoon rains this year, damaging two classrooms and forcing all classes to run in the open courtyard without any shelter from sun or rain. Roughly one hundred and eighty students across the primary and middle school sections are affected, and several parents have raised safety concerns about continuing classes outdoors through the rest of the monsoon season. The building, constructed over twenty-five years ago, has not undergone any structural inspection or maintenance in recent memory. Teachers have improvised with tarpaulin sheets to keep lessons going, but the arrangement is not sustainable once the rains intensify further.", summary: "School roof partially collapsed after monsoon rains; classes now run in the open courtyard.", votes: 25, status: "Logged", matchedFaculty: null, daysAgo: 17, fundingGoal: 0, fundingPledged: 0 },
  { id: 17, caseNo: "JH-HLT-1058", category: "Healthcare", district: "Palamu", title: "Anganwadi centres out of nutrition supplies", description: "Anganwadi centres across this block have lacked basic nutrition supplies for three consecutive months, and routine malnutrition checks for children under five have stopped entirely because of the shortage. Around eight anganwadi centres serving over three hundred children are affected, and several frontline workers report that pregnant and lactating mothers have also missed their supplementary nutrition rations during this period. The supply chain disruption has been attributed to delayed fund transfers from the district office, though the exact cause remains unclear to workers on the ground. Continued gaps in monitoring raise the risk of undetected malnutrition cases going untreated through a crucial early-childhood window.", summary: "Anganwadi centres out of nutrition supplies for three months; malnutrition checks have stopped.", votes: 33, status: "Piloting", matchedFaculty: "Dr. M. Toppo · RIMS, Ranchi", daysAgo: 95, fundingGoal: 90000, fundingPledged: 90000, fundingUsed: 97500, fundingPartner: "Plateau Health Foundation", expenses: [
    { id: "e17-1", amount: 45000, note: "Nutrition supply restocking, 6 centres", by: "Dr. M. Toppo", at: 1 },
    { id: "e17-2", amount: 38000, note: "Cold-chain storage unit", by: "Dr. M. Toppo", at: 2 },
    { id: "e17-3", amount: 14500, note: "Field monitoring visits", by: "Dr. M. Toppo", at: 3 },
  ] },
  { id: 18, caseNo: "JH-NRG-1059", category: "Energy", district: "Giridih", title: "Transformer down for three weeks", description: "A blown transformer has been down for three weeks, leaving two hamlets without any grid power ahead of the exam season, forcing students preparing for board exams to study by kerosene lamp or mobile phone flashlight after sunset. The local electricity department has cited a shortage of replacement transformers in district stock as the reason for the delay, with no confirmed repair date given so far. Small households running refrigerators for medicine storage have also been affected, and one family reported spoiled insulin because of the prolonged outage. Residents have escalated the complaint through the block-level grievance cell but have not yet received a written response.", summary: "Blown transformer down for three weeks, leaving two hamlets without grid power.", votes: 9, status: "Logged", matchedFaculty: null, daysAgo: 3, fundingGoal: 0, fundingPledged: 0 },
];

const DUPLICATE_SAMPLE = {
  title: "Our handpump has been dry for weeks",
  description: "Our handpump has been dry for weeks now and women are walking long distances every day to fetch drinking water from another village.",
  district: "Chatra",
};
const NEW_SAMPLE = {
  title: "Panchayat office has no accessible entrance",
  description: "The panchayat office in our block has no accessible entrance, and elderly residents struggle with the single narrow staircase to reach any counter.",
  district: "Pakur",
};
const VOICE_SAMPLE = {
  title: "Footbridge near the market is unsafe",
  description: "The wooden footbridge near the market has broken planks and no railing, and villagers risk the crossing every single morning to reach the other side.",
  district: "Simdega",
};
/* SIH demo scenario: citizen → university → industry → government, end-to-end.
   Kept in a different district from the seeded elephant case (JH-AGR-1045, West Singhbhum)
   so the duplicate-detection engine treats it as a genuinely new case, not a merge. */
const ELEPHANT_CONFLICT_SAMPLE = {
  title: "Elephants entering villages damage crops and endanger lives",
  description: "Every year, elephants enter villages and agricultural areas in our region, damaging crops, destroying property and sometimes causing loss of human lives. The problem is recurring, and existing responses are mostly reactive. Communities need an early warning and long-term solution to reduce conflict while also protecting wildlife.",
  district: "Saraikela Kharsawan",
};

const STOPWORDS = new Set(["this", "that", "with", "from", "have", "were", "been", "into", "their", "there", "which", "about", "after", "before", "during", "over", "under", "more", "than", "they", "them", "also", "near", "only", "very", "some", "many", "most", "without", "still", "every", "single", "entire", "already"]);

/* Card views show a short, scannable summary; the full description is reserved for the
   "View details" popup. Seeded cases carry a hand-written `summary`; new citizen-submitted
   cases fall back to this auto-generated one-liner. */
function shortSummary(text, maxLen = 110) {
  if (!text) return "";
  const firstSentence = text.split(/(?<=[.!?])\s/)[0];
  if (firstSentence.length <= maxLen) return firstSentence;
  return text.slice(0, maxLen).trim() + "…";
}
function cardSummary(p) {
  return p.summary || shortSummary(p.description);
}

function tokenize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOPWORDS.has(w));
}
function textSimilarity(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  let overlap = 0;
  A.forEach((w) => { if (B.has(w)) overlap++; });
  return overlap / Math.min(A.size, B.size);
}
function classifyText(text) {
  const lower = (text || "").toLowerCase();
  let best = { category: null, hits: 0 };
  Object.entries(CATEGORIES).forEach(([cat, meta]) => {
    const hits = meta.keywords.filter((k) => lower.includes(k)).length;
    if (hits > best.hits) best = { category: cat, hits };
  });
  if (!best.category) return { category: "Public Administration", confidence: 42 };
  return { category: best.category, confidence: Math.min(96, 58 + best.hits * 11) };
}
function analyzeSubmission(title, description, district, problems, manualCategory) {
  const combined = `${title} ${description}`;
  // If the citizen picked a domain themselves, trust it over AI text classification —
  // that's a deliberate, informed choice and routes to faculty with full confidence.
  const { category, confidence } = manualCategory
    ? { category: manualCategory, confidence: 100 }
    : classifyText(combined);
  const sdg = CATEGORIES[category]?.sdg || "—";
  const matches = problems
    .map((p) => {
      let score = textSimilarity(combined, `${p.title} ${p.description}`);
      if (p.district === district) score += 0.12;
      if (p.category === category) score += 0.08;
      return { ...p, score: Math.min(0.99, score) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return { category, confidence, sdg, matches, manual: !!manualCategory };
}
function matchFaculty(problem) {
  if (!problem) return [];
  const text = `${problem.title} ${problem.description}`.toLowerCase();
  return FACULTY.map((f) => {
    const matchedKeywords = f.keywords.filter((k) => text.includes(k));
    const catBonus = f.categories.includes(problem.category) ? 2.4 : 0;
    const raw = matchedKeywords.length + catBonus;
    const score = Math.min(97, Math.round(30 + raw * 13));
    return { ...f, score, matchedKeywords };
  }).sort((a, b) => b.score - a.score).slice(0, 4);
}
function facultyGeoFor(matchedFacultyLabel) {
  return FACULTY.find((f) => `${f.name} · ${f.inst}` === matchedFacultyLabel) || null;
}

const MERGE_THRESHOLD = 0.35;
/* Auto-routing: a new case is pushed straight to the top-ranked faculty in its domain
   whenever the match score clears this bar, instead of sitting unassigned. */
const AUTO_ASSIGN_THRESHOLD = 55;
function autoRouteFaculty(problem) {
  const ranked = matchFaculty(problem);
  const top = ranked[0];
  if (top && top.score >= AUTO_ASSIGN_THRESHOLD) return top;
  return null;
}

/* ---------------------------------- urgency / SLA engine ---------------------------------- */
/* Base resolution targets per domain (days). Life-critical / infrastructure domains get tighter targets. */
const SLA_DAYS = {
  Water: 21, Healthcare: 21, Education: 45, Agriculture: 30, Environment: 40,
  Energy: 25, "Urban Development": 35, Accessibility: 40, "Public Administration": 30, "Rural Livelihoods": 45,
};
function effectiveSlaDays(problem) {
  const base = SLA_DAYS[problem.category] || 30;
  const pressureDiscount = Math.max(0.55, 1 - problem.votes / 220); // more citizen reports -> tighter effective deadline
  return Math.max(7, Math.round(base * pressureDiscount));
}
function urgencyInfo(problem) {
  const slaDays = effectiveSlaDays(problem);
  if (problem.status === "Deployed") return { slaDays, pct: 100, overdueDays: 0, resolved: true };
  const pct = Math.round((problem.daysAgo / slaDays) * 100);
  const overdueDays = Math.max(0, problem.daysAgo - slaDays);
  return { slaDays, pct, overdueDays, resolved: false };
}
function urgencyColor(pct, resolved) {
  if (resolved) return COLORS.forest;
  if (pct >= 100) return COLORS.rust;
  if (pct >= 65) return COLORS.gold;
  return COLORS.forest;
}
function UrgencyMeter({ problem }) {
  const { t } = useLanguage();
  const info = urgencyInfo(problem);
  const color = urgencyColor(info.pct, info.resolved);
  const label = info.resolved ? t("onTarget") : info.pct >= 100 ? `Overdue ${info.overdueDays}d` : `${info.pct}% of ${info.slaDays}d target`;
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span style={{ color: COLORS.inkSoft }}>Deadline</span>
        <span className="font-mono font-semibold" style={{ color }}>{label}</span>
      </div>
      <ScoreBar pct={Math.min(100, info.pct)} color={color} />
    </div>
  );
}

/* ---------------------------------- small ui atoms ---------------------------------- */
function CaseStamp({ children }) {
  return (
    <span
      className="inline-block font-mono text-[11px] tracking-wider px-2 py-0.5 rounded-sm select-none"
      style={{ color: COLORS.rustDark, border: `1px dashed ${COLORS.rust}99`, boxShadow: SHADOW_INSET, transform: "rotate(-1.2deg)", background: "#fffdf8" }}
    >
      {children}
    </span>
  );
}
function CategoryBadge({ category, small }) {
  const meta = CATEGORIES[category] || { color: COLORS.inkSoft };
  return (
    <span
      className={`inline-flex items-center rounded font-mono tracking-wide ${small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"}`}
      style={{ background: meta.color + "1A", color: meta.color, border: `1px solid ${meta.color}55` }}
    >
      {category}
    </span>
  );
}
function StatCard({ label, value, sub, accent }) {
  const display = useCountUp(value);
  const tone = accent || COLORS.ink;
  return (
    <div className="relative overflow-hidden rounded-lg px-4 py-3.5 flex-1 min-w-[140px]" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
      <span className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: tone, opacity: 0.7 }} />
      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: COLORS.inkSoft }}>{label}</div>
      <div className="font-display text-2xl mt-0.5 tabular-nums" style={{ color: tone }}>{display}</div>
      {sub && <div className="text-[11px] mt-0.5" style={{ color: COLORS.inkSoft }}>{sub}</div>}
    </div>
  );
}
function TabButton({ active, label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-t-lg border text-sm font-medium whitespace-nowrap transition-all duration-150"
      style={{
        background: active ? COLORS.card : COLORS.paperDark,
        borderColor: COLORS.line,
        borderBottomColor: active ? COLORS.card : COLORS.line,
        color: active ? COLORS.ink : COLORS.inkSoft,
        marginBottom: active ? -1 : 0,
        position: "relative",
        zIndex: active ? 10 : 1,
        opacity: active ? 1 : 0.72,
        boxShadow: active ? "0 -2px 8px rgba(32,40,31,0.06)" : "none",
      }}
    >
      <Icon size={16} style={{ color: active ? COLORS.rust : "inherit" }} /> {label}
      {active && <span className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.rust})` }} />}
    </button>
  );
}
function ScoreBar({ pct, color }) {
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: COLORS.line }}>
      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color || COLORS.rust }} />
    </div>
  );
}

/* ---------------------------------- tabs ---------------------------------- */
function SubmitTab({
  form, setForm, isRecording, onVoice, onSubmit, onQuickFill,
  photoAttached, photoFile, photoPreviewUrl, onPhotoButtonClick, onPhotoSelected, onRemovePhoto, fileInputRef,
  preview,
}) {
  const { t, language } = useLanguage();
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl" style={{ color: COLORS.ink }}>{t("reportChallenge")}</h2>
        <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>{t("reportIntro")}</p>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => onQuickFill(DUPLICATE_SAMPLE)} className="text-xs font-mono px-3 py-1.5 rounded border" style={{ borderColor: COLORS.rust + "80", color: COLORS.rustDark, background: COLORS.rust + "0F" }}>
            <Wand2 size={12} className="inline mr-1 -mt-0.5" />{t("tryDuplicate")}
          </button>
          <button onClick={() => onQuickFill(NEW_SAMPLE)} className="text-xs font-mono px-3 py-1.5 rounded border" style={{ borderColor: COLORS.forest + "80", color: COLORS.forest, background: COLORS.forest + "0F" }}>
            <FileSearch size={12} className="inline mr-1 -mt-0.5" />{t("tryFresh")}
          </button>
          <button onClick={() => onQuickFill(ELEPHANT_CONFLICT_SAMPLE)} className="text-xs font-mono px-3 py-1.5 rounded border" style={{ borderColor: COLORS.violet + "80", color: COLORS.violet, background: COLORS.violet + "0F" }}>
            <Sparkles size={12} className="inline mr-1 -mt-0.5" />Demo: Elephant conflict
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("title")}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t("titlePlaceholder")}
              className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none premium-input transition-shadow"
              style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("description")}</label>
              <button
                onClick={onVoice}
                className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                style={{ background: isRecording ? COLORS.rust : COLORS.slate + "1A", color: isRecording ? COLORS.white : COLORS.slate }}
              >
                <Mic size={12} className={isRecording ? "animate-pulse" : ""} /> {isRecording ? t("listening") : t("speakInstead")}
              </button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
              rows={4}
              className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none resize-none premium-input transition-shadow"
              style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
            />
            {isRecording && <div className="text-[11px] mt-1 font-mono" style={{ color: COLORS.rust }}>{t("transcribing")}</div>}
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("domain")}</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none premium-input transition-shadow"
              style={{ background: COLORS.white, border: `1px solid ${form.category ? COLORS.forest + "88" : COLORS.line}`, color: COLORS.ink }}
            >
              <option value="">{t("autoDetect")}</option>
              {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-[11px] mt-1" style={{ color: COLORS.inkSoft }}>{t("domainHint")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("district")}</label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none premium-input transition-shadow"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
              >
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("language")}</label>
              <select
                value={form.language}
                onChange={(e) => { setLanguage(e.target.value); setForm({ ...form, language: e.target.value }); }}
                className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none premium-input transition-shadow"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी</option>
                <option value="Punjabi">ਪੰਜਾਬੀ</option>
                <option value="Haryanvi">हरियाणवी</option>
              </select>
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPhotoSelected}
              className="hidden"
            />
            {!photoAttached ? (
              <button
                onClick={onPhotoButtonClick}
                className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md border w-full"
                style={{ borderColor: COLORS.line, color: COLORS.inkSoft, background: "transparent" }}
              >
                <Camera size={14} /> {t("attachPhoto")}
              </button>
            ) : (
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-md border"
                style={{ borderColor: COLORS.forest + "55", background: COLORS.forest + "0F" }}
              >
                {photoPreviewUrl && (
                  <img
                    src={photoPreviewUrl}
                    alt="Attached evidence preview"
                    className="w-10 h-10 rounded object-cover shrink-0"
                    style={{ border: `1px solid ${COLORS.line}` }}
                  />
                )}
                <span className="text-xs font-medium truncate" style={{ color: COLORS.forest }}>
                  {photoFile?.name || "Photo attached"}
                </span>
                <button
                  onClick={onRemovePhoto}
                  className="ml-auto shrink-0 text-xs font-medium px-2 py-1 rounded"
                  style={{ color: COLORS.rustDark }}
                  aria-label="Remove attached photo"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onSubmit}
            className="w-full py-2.5 rounded-md text-sm font-semibold lift-hover"
            style={{ background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustDark})`, color: COLORS.white, boxShadow: SHADOW_MD }}
          >
            {t("logCase")}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: COLORS.rust }} />
          <h3 className="font-display text-lg" style={{ color: COLORS.ink }}>{t("aiPreview")}</h3>
        </div>
        <div className="rounded-lg p-4 space-y-4" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
          {!form.title && !form.description ? (
            <p className="text-sm" style={{ color: COLORS.inkSoft }}>{t("startTyping")}</p>
          ) : (
            <>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{preview.manual ? t("domain") : t("detectedCategory")}</div>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge category={preview.category} />
                  {preview.manual ? (
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: COLORS.forest }}><CheckCircle2 size={12} /> Selected by you</span>
                  ) : (
                    <span className="text-xs" style={{ color: COLORS.inkSoft }}>{preview.confidence}% {t("confidence")}</span>
                  )}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{preview.sdg}</div>
                <div className="text-xs mt-2 flex items-center gap-1.5" style={{ color: COLORS.slate }}>
                  <span className="font-mono font-semibold">
                    {effectiveSlaDays({ category: preview.category, votes: preview.matches[0]?.score >= MERGE_THRESHOLD ? preview.matches[0].votes + 1 : 1 })}-day
                  </span>
                  {t("resolutionTarget")}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wide mb-1.5" style={{ color: COLORS.inkSoft }}>{t("similarity")}</div>
                {preview.matches.filter((m) => m.score > 0.08).length === 0 && (
                  <div className="text-xs" style={{ color: COLORS.inkSoft }}>{t("noRelated")}</div>
                )}
                <div className="space-y-2">
                  {preview.matches.filter((m) => m.score > 0.08).map((m) => (
                    <div key={m.id}>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: COLORS.ink }}>{m.caseNo} · {m.district}</span>
                        <span className="font-mono" style={{ color: m.score >= MERGE_THRESHOLD ? COLORS.rust : COLORS.inkSoft }}>{Math.round(m.score * 100)}%</span>
                      </div>
                      <ScoreBar pct={Math.round(m.score * 100)} color={m.score >= MERGE_THRESHOLD ? COLORS.rust : COLORS.line} />
                    </div>
                  ))}
                </div>
                {preview.matches[0]?.score >= MERGE_THRESHOLD ? (
                  <div className="text-xs mt-2 font-medium" style={{ color: COLORS.rustDark }}>→ {t("merge")} {preview.matches[0].caseNo} as an additional citizen report.</div>
                ) : (
                  <div className="text-xs mt-2 font-medium" style={{ color: COLORS.forest }}>→ {t("newCase")}</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ScopeBanner({ user }) {
  const { t } = useLanguage();
  if (!user || user.role === "Government") return null;
  const meta = ROLE_META[user.role];
  return (
    <div className="flex items-start gap-2 rounded-md px-3 py-2 mb-4 text-[11px]" style={{ background: COLORS.slate + "0F", border: `1px solid ${COLORS.slate}33`, color: COLORS.slate }}>
      <ShieldCheck size={13} className="shrink-0 mt-[1px]" />
      <span><strong>{t("accessScope")}:</strong> {user.role === "Government" ? "" : (t("accessRole"))}</span>
    </div>
  );
}

function FullCaseCard({ p, highlightId, onOpenMatch, onOpenDetails }) {
  const { t } = useLanguage();
  return (
    <div
      className="rounded-lg p-4 lift-hover"
      style={{ background: COLORS.card, border: `1px solid ${p.id === highlightId ? COLORS.rust : COLORS.line}`, boxShadow: p.id === highlightId ? `0 0 0 3px ${COLORS.rust}33` : SHADOW_SM }}
    >
      <div className="flex items-start justify-between gap-2">
        <CaseStamp>{p.caseNo}</CaseStamp>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: COLORS.inkSoft, background: COLORS.paperDark }}>{p.status}</span>
      </div>
      <div className="mt-2 font-medium text-sm" style={{ color: COLORS.ink }}>{p.title}</div>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: COLORS.inkSoft }}>{cardSummary(p)}</p>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <CategoryBadge category={p.category} small />
        <span className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.inkSoft }}><MapPin size={11} />{p.district}</span>
        <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: COLORS.rustDark }}><Users size={11} />{p.votes} {t("citizensReported")}</span>
      </div>
      {p.reportedBy && <div className="text-[10px] mt-1.5 italic" style={{ color: COLORS.inkSoft }}>Filed by {p.reportedBy}</div>}
      <div className="mt-3">
        <UrgencyMeter problem={p} />
      </div>
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <button onClick={() => onOpenDetails(p.id)} className="flex items-center gap-1 text-xs font-medium" style={{ color: COLORS.rustDark }}>
          View details <ArrowRight size={12} />
        </button>
        <button onClick={() => onOpenMatch(p.id)} className="flex items-center gap-1 text-xs font-medium" style={{ color: COLORS.slate }}>
          {p.matchedFaculty ? `${t("matched")}: ${p.matchedFaculty}` : t("findFaculty")} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
function RedactedCaseCard({ p }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-lg p-4" style={{ background: COLORS.paperDark, border: `1px dashed ${COLORS.line}` }}>
      <div className="flex items-start justify-between gap-2">
        <CaseStamp>{p.caseNo}</CaseStamp>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: COLORS.inkSoft, background: COLORS.card }}>{p.status}</span>
      </div>
      <div className="mt-2 font-medium text-sm" style={{ color: COLORS.ink }}>{p.title}</div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <CategoryBadge category={p.category} small />
        <span className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.inkSoft }}><MapPin size={11} />{p.district}</span>
        <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: COLORS.rustDark }}><Users size={11} />{p.votes} {t("citizensReported")}</span>
      </div>
      <div className="text-[10px] mt-2.5 flex items-center gap-1" style={{ color: COLORS.inkSoft }}>
        <Lock size={10} /> {t("fullDetails")}
      </div>
    </div>
  );
}

function ClustersTab({ problems, user, highlightId, onOpenMatch, onOpenDetails, filter, setFilter }) {
  const { t, language } = useLanguage();
  const [sortBy, setSortBy] = useState("urgent");
  const isCitizen = user?.role === "Citizen";
  const scoped = isCitizen ? problems : scopeProblems(problems, user);
  const sorter = (a, b) => (sortBy === "urgent" ? urgencyInfo(b).pct - urgencyInfo(a).pct : b.votes - a.votes);
  const cats = ["All", ...Object.keys(CATEGORIES).filter((c) => scoped.some((p) => p.category === c))];
  const filtered = scoped.filter((p) => filter === "All" || p.category === filter).sort(sorter);
  const mine = isCitizen ? filtered.filter((p) => p.reportedBy === user.name) : [];
  const others = isCitizen ? filtered.filter((p) => p.reportedBy !== user.name) : filtered;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="font-display text-xl" style={{ color: COLORS.ink }}>{t("caseClustersTitle")}</h2>
          <p className="text-sm" style={{ color: COLORS.inkSoft }}>{t("caseClustersIntro")}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full border"
              style={{ borderColor: filter === c ? COLORS.rust : COLORS.line, color: filter === c ? COLORS.rustDark : COLORS.inkSoft, background: filter === c ? COLORS.rust + "14" : "transparent" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <ScopeBanner user={user} />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("sort")}</span>
        {[["urgent", "Most urgent"], ["reports", "Most reported"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
            style={{ borderColor: sortBy === key ? COLORS.slate : COLORS.line, color: sortBy === key ? COLORS.slate : COLORS.inkSoft, background: sortBy === key ? COLORS.slate + "14" : "transparent" }}
          >
            {label}
          </button>
        ))}
      </div>

      {isCitizen ? (
        <>
          {mine.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck size={13} style={{ color: COLORS.forest }} />
                <span className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.forest }}>{t("myReports")}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {mine.map((p) => <FullCaseCard key={p.id} p={p} highlightId={highlightId} onOpenMatch={onOpenMatch} onOpenDetails={onOpenDetails} />)}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5 mb-2">
            <Lock size={12} style={{ color: COLORS.inkSoft }} />
            <span className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{t("communityBoard")}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {others.map((p) => <RedactedCaseCard key={p.id} p={p} />)}
          </div>
        </>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((p) => <FullCaseCard key={p.id} p={p} highlightId={highlightId} onOpenMatch={onOpenMatch} onOpenDetails={onOpenDetails} />)}
        </div>
      )}
    </div>
  );
}

function MatchTab({ problems: rawProblems, user, selectedId, setSelectedId, onAssign, onOpenDetails }) {
  const { t } = useLanguage();
  const problems = useMemo(() => scopeProblems(rawProblems, user), [rawProblems, user]);
  const selected = problems.find((p) => p.id === selectedId) || problems[0];
  const ranked = useMemo(() => matchFaculty(selected), [selected]);
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <h2 className="font-display text-xl mb-1" style={{ color: COLORS.ink }}>{t("facultyTitle")}</h2>
        <p className="text-sm mb-3" style={{ color: COLORS.inkSoft }}>
          {user?.role === "Faculty" ? t("yourQueue") : t("rankedFaculty")}
        </p>
        <ScopeBanner user={user} />
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
          {[...problems].sort((a, b) => b.votes - a.votes).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="w-full text-left px-3 py-2 rounded-md text-xs"
              style={{ background: selected?.id === p.id ? COLORS.rust + "14" : COLORS.card, border: `1px solid ${selected?.id === p.id ? COLORS.rust : COLORS.line}` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono" style={{ color: COLORS.rustDark }}>{p.caseNo}</span>
                <CategoryBadge category={p.category} small />
              </div>
              <div className="mt-1 truncate" style={{ color: COLORS.ink }}>{p.title}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        {selected && (
          <>
            <div className="rounded-lg p-4 mb-4" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <CaseStamp>{selected.caseNo}</CaseStamp>
                  <CategoryBadge category={selected.category} />
                  <span className="text-xs flex items-center gap-1" style={{ color: COLORS.inkSoft }}><MapPin size={11} />{selected.district}</span>
                </div>
                {onOpenDetails && (
                  <button onClick={() => onOpenDetails(selected.id)} className="flex items-center gap-1 text-xs font-medium shrink-0" style={{ color: COLORS.rustDark }}>
                    View details <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <p className="text-sm mt-2" style={{ color: COLORS.ink }}>{cardSummary(selected)}</p>
              {selected.matchedFaculty && (
                <div className="text-xs mt-2 flex items-center gap-1" style={{ color: COLORS.forest }}><CheckCircle2 size={13} /> {t("currentlyAssigned")} {selected.matchedFaculty}</div>
              )}
            </div>
            <div className="space-y-3">
              {ranked.map((f) => (
                <div key={f.name} className="rounded-lg p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <GraduationCap size={15} style={{ color: COLORS.slate }} />
                        <span className="font-medium text-sm" style={{ color: COLORS.ink }}>{f.name}</span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{f.dept} · {f.inst}</div>
                      <div className="mt-1"><DirectionsLink geo={f.geo} label="Directions to campus" /></div>
                    </div>
                    <button
                      onClick={() => onAssign(selected.id, `${f.name} · ${f.inst}`)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md shrink-0"
                      style={{ background: COLORS.slate, color: COLORS.white }}
                    >
                      Assign case
                    </button>
                  </div>
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: COLORS.inkSoft }}>{t("matchStrength")}</span>
                      <span className="font-mono" style={{ color: COLORS.slate }}>{f.score}%</span>
                    </div>
                    <ScoreBar pct={f.score} color={COLORS.slate} />
                  </div>
                  {f.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {f.matchedKeywords.map((k) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: COLORS.slate + "14", color: COLORS.slate }}>{k}</span>
                      ))}
                    </div>
                  )}
                  <div className="text-[11px] mt-2" style={{ color: COLORS.inkSoft }}>{f.load} {t("activeCases")}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JharkhandMap({ problems, onOpenDetails }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const stats = useMemo(() => {
    const map = {};
    Object.keys(DISTRICT_GEO).forEach((d) => { map[d] = { count: 0, categoryCounts: {}, urgencySum: 0 }; });
    problems.forEach((p) => {
      if (!map[p.district]) map[p.district] = { count: 0, categoryCounts: {}, urgencySum: 0 };
      map[p.district].count += 1;
      map[p.district].categoryCounts[p.category] = (map[p.district].categoryCounts[p.category] || 0) + 1;
      map[p.district].urgencySum += urgencyInfo(p).pct;
    });
    Object.values(map).forEach((entry) => {
      let top = null, topCount = 0;
      Object.entries(entry.categoryCounts).forEach(([cat, c]) => { if (c > topCount) { top = cat; topCount = c; } });
      entry.dominant = top;
      entry.avgUrgency = entry.count > 0 ? Math.round(entry.urgencySum / entry.count) : 0;
    });
    return map;
  }, [problems]);

  const maxCount = Math.max(1, ...Object.values(stats).map((s) => s.count));
  Object.values(stats).forEach((s) => {
    const densityScore = (s.count / maxCount) * 100;
    const urgencyScore = Math.min(100, (s.avgUrgency / 150) * 100);
    s.priorityIndex = s.count > 0 ? Math.round(0.5 * densityScore + 0.5 * urgencyScore) : 0;
  });
  const topDistricts = Object.entries(stats).filter(([, s]) => s.count > 0).sort((a, b) => b[1].priorityIndex - a[1].priorityIndex).slice(0, 5);
  const selectedStats = selectedDistrict ? stats[selectedDistrict] : null;

  return (
    <div className="rounded-lg p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
        <div className="text-sm font-medium" style={{ color: COLORS.ink }}>Where the problems are</div>
        <div className="text-[10px] font-mono" style={{ color: COLORS.inkSoft }}>bubble size = cases · colour = dominant issue · tap a district</div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-auto select-none">
            <path d={STATE_OUTLINE_PATH} fill={COLORS.paperDark} stroke={COLORS.rust} strokeWidth="1.5" strokeOpacity="0.35" />
            <text x={MAP_W * 0.48} y="16" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={COLORS.inkSoft}>BIHAR</text>
            <text x={MAP_W - 6} y={MAP_H * 0.32} textAnchor="end" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={COLORS.inkSoft}>WEST BENGAL</text>
            <text x={MAP_W * 0.46} y={MAP_H - 6} textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={COLORS.inkSoft}>ODISHA</text>
            <text x="6" y={MAP_H * 0.58} textAnchor="start" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={COLORS.inkSoft}>CHHATTISGARH</text>

            {Object.entries(DISTRICT_GEO).map(([name, coord]) => {
              const { x, y } = project(coord);
              const s = stats[name] || { count: 0 };
              const r = s.count === 0 ? 4 : 7 + (s.count / maxCount) * 15;
              const fill = s.count === 0 ? COLORS.paper : (CATEGORIES[s.dominant]?.color || COLORS.inkSoft);
              const isSelected = selectedDistrict === name;
              return (
                <g key={name} onClick={() => setSelectedDistrict(name === selectedDistrict ? null : name)} style={{ cursor: "pointer" }}>
                  <circle cx={x} cy={y} r={r} fill={fill} fillOpacity={s.count === 0 ? 0.35 : 0.82} stroke={isSelected ? COLORS.ink : COLORS.card} strokeWidth={isSelected ? 2.5 : 1.2}>
                    <title>{`${name}: ${s.count} case${s.count === 1 ? "" : "s"}${s.dominant ? " · mostly " + s.dominant : ""}`}</title>
                  </circle>
                  {s.count > 0 && (
                    <text x={x} y={y + 3.5} textAnchor="middle" fontSize={r > 13 ? 10 : 8} fontWeight="700" fill={COLORS.white} style={{ pointerEvents: "none" }}>{s.count}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="text-[10px] mt-1" style={{ color: COLORS.inkSoft }}>Schematic district layout for demo purposes, not a survey-accurate boundary.</p>
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: COLORS.inkSoft }}>Priority districts</div>
          <div className="space-y-1.5">
            {topDistricts.map(([name, s], i) => (
              <button
                key={name}
                onClick={() => setSelectedDistrict(name === selectedDistrict ? null : name)}
                className="w-full text-left rounded-md p-2"
                style={{ background: selectedDistrict === name ? COLORS.rust + "14" : COLORS.paperDark, border: `1px solid ${selectedDistrict === name ? COLORS.rust : COLORS.line}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: COLORS.ink }}>{i + 1}. {name}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: COLORS.rustDark }}>{s.priorityIndex}%</span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: COLORS.inkSoft }}>{s.count} case{s.count === 1 ? "" : "s"} · {s.avgUrgency}% avg. deadline used</div>
                {s.dominant && <div className="mt-1"><CategoryBadge category={s.dominant} small /></div>}
              </button>
            ))}
          </div>
          {selectedDistrict && selectedStats && (
            <div className="mt-3 rounded-md p-2.5" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: COLORS.ink }}>{selectedDistrict} — {selectedStats.count} case{selectedStats.count === 1 ? "" : "s"}</div>
              <div className="space-y-1.5">
                {problems.filter((p) => p.district === selectedDistrict).slice(0, 4).map((p) => (
                  <div key={p.id} className="text-[11px] leading-snug" style={{ color: COLORS.inkSoft }}>
                    <CaseStamp>{p.caseNo}</CaseStamp> <span className="ml-1 font-medium" style={{ color: COLORS.ink }}>{p.title}</span>
                    <p className="mt-0.5" style={{ color: COLORS.inkSoft }}>{cardSummary(p)}</p>
                    {onOpenDetails && (
                      <button onClick={() => onOpenDetails(p.id)} className="mt-0.5 font-medium flex items-center gap-0.5" style={{ color: COLORS.rustDark }}>
                        View details <ArrowRight size={9} />
                      </button>
                    )}
                  </div>
                ))}
                {selectedStats.count === 0 && <div className="text-[11px] italic" style={{ color: COLORS.inkSoft }}>No cases reported here yet.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.line}` }}>
        {Object.entries(CATEGORIES).filter(([cat]) => Object.values(stats).some((s) => s.dominant === cat)).map(([cat, meta]) => (
          <span key={cat} className="text-[10px] flex items-center gap-1" style={{ color: COLORS.inkSoft }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: meta.color }} />{cat}
          </span>
        ))}
      </div>
    </div>
  );
}

function DashboardTab({ problems, onOpenDetails }) {
  const categoryData = useMemo(() => Object.keys(CATEGORIES).map((cat) => ({ name: cat, count: problems.filter((p) => p.category === cat).length, color: CATEGORIES[cat].color })).filter((d) => d.count > 0).sort((a, b) => b.count - a.count), [problems]);
  const sdgData = useMemo(() => {
    const map = {};
    problems.forEach((p) => { const sdg = CATEGORIES[p.category]?.sdg || "Other"; map[sdg] = (map[sdg] || 0) + 1; });
    const palette = [COLORS.rust, COLORS.forest, COLORS.gold, COLORS.slate, COLORS.maroon, COLORS.violet, COLORS.forestSoft, "#A6742C", COLORS.inkSoft, COLORS.rustDark];
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }));
  }, [problems]);
  const statusData = useMemo(() => STAGES.map((s) => ({ stage: s, count: problems.filter((p) => p.status === s).length })), [problems]);
  const maxStatus = Math.max(1, ...statusData.map((s) => s.count));
  const priorityQueue = useMemo(
    () => problems.filter((p) => p.status !== "Deployed").map((p) => ({ ...p, urgency: urgencyInfo(p) })).sort((a, b) => b.urgency.pct - a.urgency.pct).slice(0, 6),
    [problems]
  );
  const overdueCount = problems.filter((p) => p.status !== "Deployed" && urgencyInfo(p).pct >= 100).length;

  const totalReports = problems.reduce((s, p) => s + p.votes, 0);
  const districtsReporting = new Set(problems.map((p) => p.district)).size;
  const facultyEngaged = new Set(problems.filter((p) => p.matchedFaculty).map((p) => p.matchedFaculty)).size;
  const totalPledged = problems.reduce((s, p) => s + p.fundingPledged, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Radio size={16} style={{ color: COLORS.rust }} className="animate-pulse" />
        <h2 className="font-display text-xl" style={{ color: COLORS.ink }}>Control room</h2>
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>Live view for government departments — updates instantly as cases move through the system.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard label="Unique cases" value={problems.length} sub={`from ${totalReports} citizen reports`} accent={COLORS.rust} />
        <StatCard label="Dedup ratio" value={`${(totalReports / problems.length).toFixed(1)}×`} sub="reports compressed per case" />
        <StatCard label="Districts reporting" value={`${districtsReporting}/24`} />
        <StatCard label="Faculty engaged" value={facultyEngaged} accent={COLORS.slate} />
        <StatCard label="Industry pledged" value={`₹${totalPledged.toLocaleString("en-IN")}`} accent={COLORS.gold} />
        <StatCard label="Past deadline" value={overdueCount} sub="cases need escalation" accent={overdueCount > 0 ? COLORS.rust : COLORS.forest} />
      </div>

      <div className="rounded-lg p-4 mb-6" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium" style={{ color: COLORS.ink }}>Priority queue — resolve in this order</div>
          <div className="text-[10px] font-mono" style={{ color: COLORS.inkSoft }}>ranked by % of deadline used</div>
        </div>
        <div className="space-y-2">
          {priorityQueue.map((p, i) => {
            const uColor = urgencyColor(p.urgency.pct, p.urgency.resolved);
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-md p-2.5" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
                <span className="font-display text-sm w-5 text-center shrink-0" style={{ color: COLORS.inkSoft }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CaseStamp>{p.caseNo}</CaseStamp>
                    <CategoryBadge category={p.category} small />
                    <span className="text-[11px] flex items-center gap-1" style={{ color: COLORS.inkSoft }}><MapPin size={10} />{p.district}</span>
                  </div>
                  <div className="text-xs mt-1 font-medium" style={{ color: COLORS.ink }}>{p.title}</div>
                  <p className="text-[11px] mt-0.5 leading-snug" style={{ color: COLORS.inkSoft }}>{cardSummary(p)}</p>
                  <button onClick={() => onOpenDetails(p.id)} className="text-[11px] mt-1 font-medium flex items-center gap-0.5" style={{ color: COLORS.rustDark }}>
                    View details <ArrowRight size={10} />
                  </button>
                </div>
                <div className="w-28 shrink-0">
                  <div className="text-[11px] font-mono font-semibold text-right" style={{ color: uColor }}>
                    {p.urgency.pct >= 100 ? `+${p.urgency.overdueDays}d overdue` : `${p.urgency.pct}% used`}
                  </div>
                  <ScoreBar pct={Math.min(100, p.urgency.pct)} color={uColor} />
                  <div className="text-[10px] text-right mt-0.5" style={{ color: COLORS.inkSoft }}>{p.urgency.slaDays}d target</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
          <div className="text-sm font-medium mb-3" style={{ color: COLORS.ink }}>Cases by domain</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" stroke={COLORS.inkSoft} fontSize={11} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke={COLORS.inkSoft} fontSize={11} width={130} />
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
          <div className="text-sm font-medium mb-3" style={{ color: COLORS.ink }}>SDG alignment</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sdgData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {sdgData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center -mt-2">
            {sdgData.map((d) => (
              <span key={d.name} className="text-[10px] flex items-center gap-1" style={{ color: COLORS.inkSoft }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />{d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <JharkhandMap problems={problems} onOpenDetails={onOpenDetails} />
      </div>

      <div className="rounded-lg p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
        <div className="text-sm font-medium mb-3" style={{ color: COLORS.ink }}>Pipeline by stage</div>
        <div className="space-y-2.5">
          {statusData.map((s) => (
            <div key={s.stage}>
              <div className="flex justify-between text-[11px] mb-1">
                <span style={{ color: COLORS.inkSoft }}>{s.stage}</span>
                <span className="font-mono" style={{ color: COLORS.ink }}>{s.count}</span>
              </div>
              <ScoreBar pct={(s.count / maxStatus) * 100} color={COLORS.forest} />
            </div>
          ))}
        </div>
      </div>

      <FacultyRoster problems={problems} onOpenDetails={onOpenDetails} />
      <PartnerDirectory problems={problems} />
    </div>
  );
}

/* Every faculty member across every partner university, and exactly which cases each one is
   currently handling — the oversight view a government official needs, in one place. */
function FacultyRoster({ problems, onOpenDetails }) {
  const roster = useMemo(
    () =>
      FACULTY.map((f) => {
        const label = `${f.name} · ${f.inst}`;
        const assigned = problems.filter((p) => p.matchedFaculty === label);
        const active = assigned.filter((p) => p.status !== "Deployed");
        return { ...f, label, assigned, active };
      }).sort((a, b) => b.active.length - a.active.length),
    [problems]
  );
  const totalAssigned = roster.reduce((s, f) => s + f.assigned.length, 0);

  return (
    <div className="rounded-lg p-4 mt-6" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap size={15} style={{ color: COLORS.slate }} />
          <div className="text-sm font-medium" style={{ color: COLORS.ink }}>Faculty roster — who is handling what</div>
        </div>
        <span className="text-[10px] font-mono" style={{ color: COLORS.inkSoft }}>{roster.length} faculty · {totalAssigned} cases assigned</span>
      </div>
      <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>Every faculty member across partner universities, with the cases currently routed to them — statewide, across every institution.</p>
      <div className="space-y-2">
        {roster.map((f) => (
          <div key={f.label} className="rounded-md p-3" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-sm font-medium" style={{ color: COLORS.ink }}>{f.name}</div>
                <div className="text-[11px]" style={{ color: COLORS.inkSoft }}>{f.inst} · {f.dept}</div>
                <div className="mt-1"><DirectionsLink geo={f.geo} label={f.address} /></div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {f.categories.map((c) => <CategoryBadge key={c} category={c} small />)}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: f.active.length > 0 ? COLORS.forest + "1A" : COLORS.line + "80", color: f.active.length > 0 ? COLORS.forest : COLORS.inkSoft }}>
                  {f.active.length} active
                </span>
              </div>
            </div>
            {f.assigned.length > 0 ? (
              <div className="mt-2.5 flex flex-col gap-1.5">
                {f.assigned.map((p) => (
                  <div key={p.id} className="text-[11px]" style={{ color: COLORS.inkSoft }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CaseStamp>{p.caseNo}</CaseStamp>
                      <span className="truncate font-medium" style={{ color: COLORS.ink }}>{p.title}</span>
                      <span className="ml-auto font-mono px-1.5 py-0.5 rounded" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>{p.status}</span>
                    </div>
                    <p className="mt-0.5" style={{ color: COLORS.inkSoft }}>{cardSummary(p)}</p>
                    {onOpenDetails && (
                      <button onClick={() => onOpenDetails(p.id)} className="mt-0.5 font-medium flex items-center gap-0.5" style={{ color: COLORS.rustDark }}>
                        View details <ArrowRight size={9} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-[11px] italic" style={{ color: COLORS.inkSoft }}>No cases currently assigned.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Every registered industry / CSR partner, their exact address, funding committed vs. actually
   spent by the university on their behalf, and a one-tap directions link for site visits. */
function PartnerDirectory({ problems }) {
  const rows = useMemo(
    () =>
      PARTNERS.map((partner) => {
        const funded = problems.filter((p) => p.fundingPartner === partner.name);
        const pledged = funded.reduce((s, p) => s + (p.fundingPledged || 0), 0);
        const used = funded.reduce((s, p) => s + (p.fundingUsed || 0), 0);
        return { ...partner, funded, pledged, used };
      }),
    [problems]
  );

  return (
    <div className="rounded-lg p-4 mt-6" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
      <div className="flex items-center gap-2 mb-1">
        <Building2 size={15} style={{ color: COLORS.gold }} />
        <div className="text-sm font-medium" style={{ color: COLORS.ink }}>Industry & CSR partner directory</div>
      </div>
      <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>Exact addresses for site visits, plus how much each partner has pledged versus how much universities have actually spent — so funding stays accountable.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((partner) => {
          const overspent = partner.used > partner.pledged;
          return (
            <div key={partner.name} className="rounded-md p-3" style={{ background: COLORS.paperDark, border: `1px solid ${overspent ? COLORS.rust + "88" : COLORS.line}` }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium" style={{ color: COLORS.ink }}>{partner.name}</div>
                  <div className="text-[11px]" style={{ color: COLORS.inkSoft }}>{partner.type}</div>
                </div>
                {overspent && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ color: COLORS.white, background: COLORS.rust }}>Overspend</span>
                )}
              </div>
              <div className="mt-1.5"><DirectionsLink geo={partner.geo} label={partner.address} /></div>
              {partner.pledged > 0 ? (
                <>
                  <div className="flex justify-between text-[10px] mt-2" style={{ color: COLORS.inkSoft }}>
                    <span>₹{partner.used.toLocaleString("en-IN")} used</span>
                    <span>of ₹{partner.pledged.toLocaleString("en-IN")} pledged</span>
                  </div>
                  <ScoreBar pct={Math.min(100, (partner.used / partner.pledged) * 100)} color={overspent ? COLORS.rust : COLORS.forest} />
                  <div className="text-[10px] mt-1" style={{ color: COLORS.inkSoft }}>{partner.funded.length} case{partner.funded.length === 1 ? "" : "s"} funded</div>
                </>
              ) : (
                <div className="text-[10px] mt-2 italic" style={{ color: COLORS.inkSoft }}>No pledges made yet.</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoginBackground() {
  const trees = [
    [60, 645], [130, 660], [205, 630], [280, 655], [355, 615], [430, 640],
    [520, 600], [600, 625], [685, 595], [770, 615], [855, 590], [935, 610],
    [1015, 585], [1090, 605], [1150, 620],
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.35" />
          <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.paper} stopOpacity="0" />
          <stop offset="100%" stopColor={COLORS.paper} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill={COLORS.paper} />
      <circle cx="930" cy="130" r="140" fill="url(#sunGlow)" />
      <circle cx="930" cy="130" r="42" fill={COLORS.gold} fillOpacity="0.25" />

      {/* topographic contour lines, echoing the district map */}
      <path d="M-60,160 Q600,60 1260,190" stroke={COLORS.slate} strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
      <path d="M-60,230 Q600,140 1260,260" stroke={COLORS.slate} strokeOpacity="0.10" strokeWidth="1.5" fill="none" />
      <path d="M-60,300 Q600,220 1260,330" stroke={COLORS.slate} strokeOpacity="0.08" strokeWidth="1.5" fill="none" />

      {/* faint case-marker dots, echoing the priority-district map */}
      {[[180, 110], [430, 80], [700, 150], [990, 220], [300, 250], [830, 90], [1080, 300]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={COLORS.rust} fillOpacity="0.22" />
      ))}

      {/* rolling sal-forest hills, Chota Nagpur plateau silhouette */}
      <path d="M0,520 C150,470 300,502 450,480 C600,458 750,512 900,472 C1050,440 1150,478 1200,462 L1200,800 L0,800 Z" fill={COLORS.forestSoft} fillOpacity="0.16" />
      <path d="M0,600 C180,548 330,590 480,560 C630,530 780,582 930,542 C1050,512 1150,560 1200,542 L1200,800 L0,800 Z" fill={COLORS.forest} fillOpacity="0.20" />
      <path d="M0,680 C200,618 350,660 500,630 C680,598 820,652 1000,610 C1100,588 1160,622 1200,610 L1200,800 L0,800 Z" fill={COLORS.ink} fillOpacity="0.18" />

      {/* sal-tree silhouettes along the front ridge */}
      {trees.map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <line x1="0" y1="0" x2="0" y2="20" stroke={COLORS.ink} strokeOpacity="0.22" strokeWidth="2" />
          <circle cx="0" cy="-7" r="11" fill={COLORS.forest} fillOpacity="0.24" />
        </g>
      ))}

      <rect width="1200" height="800" fill="url(#skyFade)" />
    </svg>
  );
}

function LoginScreen({ onLogin }) {
  const { language, setLanguage, t } = useLanguage();
  const [pendingRole, setPendingRole] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(true);

  function chooseRole(role) {
    setPendingRole(role);
    setPasswordInput("");
    setError("");
  }
  function backToRoles() {
    setPendingRole(null);
    setPasswordInput("");
    setError("");
  }
  function trySubmit() {
    if (passwordInput === ROLE_META[pendingRole].password) {
      onLogin(pendingRole);
    } else {
      setError(t("incorrectPassword"));
      setPasswordInput("");
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
  }

  const roleLabel = (role) => ({
    Citizen: language === "English" ? "Citizen" : language === "Hindi" ? "नागरिक" : language === "Punjabi" ? "ਨਾਗਰਿਕ" : "नागरिक",
    Faculty: language === "English" ? "University Faculty" : language === "Hindi" ? "विश्वविद्यालय विशेषज्ञ" : language === "Punjabi" ? "ਯੂਨੀਵਰਸਿਟੀ ਮਾਹਿਰ" : "यूनिवर्सिटी माहिर",
    Industry: language === "English" ? "Industry Partner" : language === "Hindi" ? "उद्योग भागीदार" : language === "Punjabi" ? "ਉਦਯੋਗ ਭਾਗੀਦਾਰ" : "उद्योग भागीदार",
    Government: language === "English" ? "Government Official" : language === "Hindi" ? "सरकारी अधिकारी" : language === "Punjabi" ? "ਸਰਕਾਰੀ ਅਧਿਕਾਰੀ" : "सरकारी अफसर",
  }[role]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <LoginBackground />
      <div className="absolute inset-0" style={{ background: COLORS.paper, opacity: 0.55 }} />
      <div className="absolute top-4 right-4 z-20">
        <button onClick={() => setLanguageOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold"
          style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, color: COLORS.ink, boxShadow: SHADOW_MD }}>
          🌐 {languageLabel(language)} <span style={{ color: COLORS.inkSoft }}>▾</span>
        </button>
      </div>
      <LanguageModal open={languageOpen} language={language} setLanguage={setLanguage}
        onClose={() => setLanguageOpen(false)} loginMode={true} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3" style={{ filter: `drop-shadow(0 4px 10px rgba(32,40,31,0.15))` }}>
            <Emblem size={52} />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: COLORS.inkSoft }}>{t("department")}</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2" style={{ color: COLORS.ink }}>Samadhan Setu</h1>
          <div className="w-14 h-[3px] mx-auto mt-2 rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.rust})` }} />
          <p className="text-sm mt-3" style={{ color: COLORS.inkSoft }}>
            {pendingRole ? t("enterPassword") : t("chooseRole")}
          </p>
        </div>

        {!pendingRole ? (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(ROLE_META).map(([role, meta]) => {
                const Icon = meta.icon;
                return (
                  <button key={role} onClick={() => chooseRole(role)} className="text-left rounded-lg p-4 lift-hover"
                    style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_SM }}>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.rust + "1A", color: COLORS.rustDark }}>
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: COLORS.ink }}>
                          {roleLabel(role)} <Lock size={11} style={{ color: COLORS.inkSoft }} />
                        </div>
                        <div className="text-[11px] font-mono truncate" style={{ color: COLORS.inkSoft }}>{meta.demoName} · {meta.demoSub}</div>
                      </div>
                    </div>
                    <p className="text-xs mt-2.5 leading-relaxed" style={{ color: COLORS.inkSoft }}>
                      {language === "English" ? meta.desc : language === "Hindi" ? ({
                        Citizen:"समस्या दर्ज करें और देखें कि कितने लोग इसी समस्या से जुड़े हैं।", Faculty:"अपने शोध से जुड़ी समस्याओं की समीक्षा करें और उन्हें संभालें।", Industry:"प्रोटोटाइप में सहायता दें और समाधान की प्रगति देखें।", Government:"सभी रिपोर्ट, मिलान, फंडिंग और प्रगति की निगरानी करें।"
                      }[role]) : language === "Punjabi" ? ({
                        Citizen:"ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ ਅਤੇ ਵੇਖੋ ਕਿੰਨੇ ਲੋਕ ਇਸ ਨਾਲ ਜੁੜੇ ਹਨ।", Faculty:"ਆਪਣੀ ਖੋਜ ਨਾਲ ਜੁੜੀਆਂ ਸਮੱਸਿਆਵਾਂ ਵੇਖੋ ਅਤੇ ਸੰਭਾਲੋ।", Industry:"ਪ੍ਰੋਟੋਟਾਈਪ ਲਈ ਸਹਾਇਤਾ ਦਿਓ ਅਤੇ ਤਰੱਕੀ ਵੇਖੋ।", Government:"ਸਾਰੀਆਂ ਰਿਪੋਰਟਾਂ, ਮਿਲਾਨ, ਫੰਡਿੰਗ ਅਤੇ ਤਰੱਕੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।"
                      }[role]) : ({
                        Citizen:"समस्या दर्ज करो अर देखो कितने लोग इस समस्या तै जुड़े सैं।", Faculty:"अपणी रिसर्च तै जुड़ी समस्या देखो अर संभालो।", Industry:"प्रोटोटाइप में मदद करो अर समाधान की प्रगति देखो।", Government:"सारी रिपोर्ट, मिलान, फंडिंग अर प्रगति देखो।"
                      }[role])}
                    </p>
                    <div className="text-[10px] mt-2 flex items-start gap-1" style={{ color: COLORS.slate }}>
                      <ShieldCheck size={12} className="shrink-0 mt-[1px]" />
                      <span>{language === "English" ? meta.scopeNote : t("accessRole")}</span>
                    </div>
                    <div className="text-xs mt-2.5 font-medium flex items-center gap-1" style={{ color: COLORS.rustDark }}>
                      {t("signInAs")} {meta.demoName.split(" ")[0]} <ArrowRight size={12} />
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-center mt-5 font-mono" style={{ color: COLORS.inkSoft }}>{t("accessRole")}</p>
          </>
        ) : (
          <div className="max-w-sm mx-auto rounded-lg p-6"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_LG, animation: shake ? "shakeX 0.4s" : "none" }}>
            {(() => {
              const meta = ROLE_META[pendingRole];
              const Icon = meta.icon;
              return (
                <>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.rust + "1A", color: COLORS.rustDark }}>
                      <Icon size={17} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: COLORS.ink }}>{roleLabel(pendingRole)}</div>
                      <div className="text-[11px] font-mono" style={{ color: COLORS.inkSoft }}>{meta.demoName} · {meta.demoSub}</div>
                    </div>
                  </div>
                  <label className="text-xs font-mono uppercase tracking-wide block mt-4" style={{ color: COLORS.inkSoft }}>{t("password")}</label>
                  <div className="relative mt-1">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.inkSoft }} />
                    <input type="password" autoFocus value={passwordInput}
                      onChange={(e) => { setPasswordInput(e.target.value); setError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") trySubmit(); }}
                      placeholder={t("enterPasswordPlaceholder")}
                      className="w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none premium-input transition-shadow"
                      style={{ background: COLORS.white, border: `1px solid ${error ? COLORS.rust : COLORS.line}`, color: COLORS.ink }} />
                  </div>
                  {error && <div className="text-[11px] mt-1.5 font-medium" style={{ color: COLORS.rust }}>{error}</div>}
                  <div className="text-[10px] mt-2 font-mono" style={{ color: COLORS.inkSoft }}>{t("demoPassword")}: {meta.password}</div>
                  <button onClick={trySubmit} className="w-full mt-4 py-2.5 rounded-md text-sm font-semibold lift-hover"
                    style={{ background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustDark})`, color: COLORS.white, boxShadow: SHADOW_MD }}>
                    {t("signIn")}
                  </button>
                  <button onClick={backToRoles} className="w-full mt-2 py-2 text-xs font-medium" style={{ color: COLORS.inkSoft }}>
                    {t("chooseDifferentRole")}
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function LifecycleTab({ problems: rawProblems, user, onAdvance, onPledge, onLogExpense, onGoToMatch, onOpenDetails }) {
  const { t } = useLanguage();
  const problems = useMemo(() => scopeProblems(rawProblems, user), [rawProblems, user]);
  const userRole = user?.role;
  return (
    <div>
      <h2 className="font-display text-xl mb-1" style={{ color: COLORS.ink }}>{t("caseLifecycle")}</h2>
      <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>{t("lifecycleIntro")}</p>
      <ScopeBanner user={user} />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage, idx) => {
          const items = problems.filter((p) => p.status === stage).sort((a, b) => urgencyInfo(b).pct - urgencyInfo(a).pct);
          return (
            <div key={stage} className="w-64 shrink-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{stage}</span>
                <span className="text-xs font-mono px-1.5 rounded" style={{ background: COLORS.paperDark, color: COLORS.ink }}>{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {items.map((p) => {
                  const fundingReady = stage !== "Industry Partnership" || p.fundingPledged >= p.fundingGoal;
                  const info = urgencyInfo(p);
                  const uColor = urgencyColor(info.pct, info.resolved);
                  return (
                    <div key={p.id} className="rounded-md p-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderLeft: `3px solid ${CATEGORIES[p.category].color}`, boxShadow: SHADOW_SM }}>
                      <div className="flex items-center justify-between">
                        <CaseStamp>{p.caseNo}</CaseStamp>
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full" style={{ color: uColor, background: uColor + "1A" }}>
                          {info.resolved ? t("onTarget") : info.pct >= 100 ? `+${info.overdueDays}d` : `${info.pct}%`}
                        </span>
                      </div>
                      <div className="text-xs font-medium mt-1.5" style={{ color: COLORS.ink }}>{p.title}</div>
                      <p className="text-[11px] mt-1 leading-snug" style={{ color: COLORS.inkSoft }}>{cardSummary(p)}</p>
                      <button onClick={() => onOpenDetails(p.id)} className="text-[11px] mt-1 font-medium flex items-center gap-0.5" style={{ color: COLORS.rustDark }}>
                        View details <ArrowRight size={10} />
                      </button>
                      <div className="text-[11px] mt-1 flex items-center gap-1" style={{ color: COLORS.inkSoft }}><MapPin size={10} />{p.district}</div>
                      {p.matchedFaculty && (
                        <div className="text-[11px] mt-1 flex items-center gap-1 flex-wrap" style={{ color: COLORS.inkSoft }}>
                          <GraduationCap size={10} /> {p.matchedFaculty}
                          <DirectionsLink geo={facultyGeoFor(p.matchedFaculty)?.geo} label="Directions to university" />
                        </div>
                      )}
                      {stage === "Assigned to University" && !p.matchedFaculty && (
                        <button onClick={() => onGoToMatch(p.id)} className="text-[11px] mt-1.5 font-medium" style={{ color: COLORS.slate }}>{t("matchFaculty")}</button>
                      )}
                      {stage === "Industry Partnership" && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] mb-1" style={{ color: COLORS.inkSoft }}>
                            <span>₹{p.fundingPledged.toLocaleString("en-IN")}</span>
                            <span>of ₹{p.fundingGoal.toLocaleString("en-IN")}</span>
                          </div>
                          <ScoreBar pct={Math.min(100, (p.fundingPledged / p.fundingGoal) * 100)} color={COLORS.gold} />
                          {p.fundingPledged < p.fundingGoal && (
                            ["Industry", "Government"].includes(userRole) ? (
                              <button onClick={() => onPledge(p)} className="text-[11px] mt-1.5 font-medium flex items-center gap-1" style={{ color: COLORS.gold }}>
                                <Building2 size={11} /> Pledge support
                              </button>
                            ) : (
                              <div className="text-[10px] mt-1.5 italic" style={{ color: COLORS.inkSoft }}>{t("awaitingPledge")}</div>
                            )
                          )}
                        </div>
                      )}
                      {p.fundingGoal > 0 && (
                        <FundsPanel problem={p} user={user} onLogExpense={onLogExpense} />
                      )}
                      {idx < STAGES.length - 1 && (
                        <button
                          onClick={() => onAdvance(p.id)}
                          disabled={!fundingReady}
                          className="w-full mt-2 text-[11px] font-semibold py-1.5 rounded flex items-center justify-center gap-1 disabled:opacity-40"
                          style={{ background: fundingReady ? COLORS.forest : COLORS.line, color: fundingReady ? COLORS.white : COLORS.inkSoft }}
                        >
                          Advance <ArrowRight size={11} />
                        </button>
                      )}
                      {idx === STAGES.length - 1 && (
                        <div className="text-[11px] mt-2 flex items-center gap-1 font-medium" style={{ color: COLORS.forest }}><CheckCircle2 size={12} /> Deployed</div>
                      )}
                    </div>
                  );
                })}
                {items.length === 0 && <div className="text-[11px] italic px-1" style={{ color: COLORS.inkSoft }}>{t("noCases")}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Pledged vs. spent, per case — an itemized, timestamped expense trail so an industry
   partner (or government) can see exactly where their money went, not just a lump total. */
function FundsPanel({ problem: p, user, onLogExpense }) {
  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const used = p.fundingUsed || 0;
  const pledged = p.fundingPledged || 0;
  const balance = pledged - used;
  const overspent = used > pledged;
  const canLogExpense = user?.role === "Faculty" && p.matchedFaculty?.startsWith(user.name);
  const expenses = p.expenses || [];

  return (
    <div className="mt-2.5 rounded-md p-2.5" style={{ background: COLORS.paperDark, border: `1px solid ${overspent ? COLORS.rust + "88" : COLORS.line}` }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>Funds used by university</span>
        {overspent && (
          <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: COLORS.white, background: COLORS.rust }}>
            <ShieldCheck size={9} /> Over pledged amount
          </span>
        )}
      </div>
      <div className="flex justify-between text-[10px] mt-1.5" style={{ color: COLORS.inkSoft }}>
        <span>₹{used.toLocaleString("en-IN")} used</span>
        <span>of ₹{pledged.toLocaleString("en-IN")} pledged</span>
      </div>
      <ScoreBar pct={pledged > 0 ? Math.min(100, (used / pledged) * 100) : 0} color={overspent ? COLORS.rust : COLORS.forest} />
      <div className="flex justify-between text-[10px] mt-1">
        <span style={{ color: COLORS.inkSoft }}>{p.fundingPartner ? `Funded by ${p.fundingPartner}` : "No partner assigned yet"}</span>
        <span className="font-mono font-semibold" style={{ color: overspent ? COLORS.rust : COLORS.forest }}>
          {overspent ? `₹${Math.abs(balance).toLocaleString("en-IN")} over` : `₹${balance.toLocaleString("en-IN")} left`}
        </span>
      </div>

      <button onClick={() => setExpanded((v) => !v)} className="text-[11px] mt-2 font-medium flex items-center gap-1" style={{ color: COLORS.slate }}>
        {expanded ? "Hide" : "View"} expense log ({expenses.length}) <ArrowRight size={10} style={{ transform: expanded ? "rotate(90deg)" : "none" }} />
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5">
          {expenses.length === 0 && <div className="text-[10px] italic" style={{ color: COLORS.inkSoft }}>No expenses logged yet — full pledged amount is unaccounted for.</div>}
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-[10px] rounded px-2 py-1" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <span style={{ color: COLORS.ink }}>{e.note}</span>
              <span className="font-mono font-semibold shrink-0 ml-2" style={{ color: COLORS.rustDark }}>₹{e.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}

          {canLogExpense && (
            <div className="flex items-center gap-1.5 mt-2">
              <input
                type="number"
                min="0"
                placeholder="Amount ₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="premium-input w-20 text-[10px] px-1.5 py-1 rounded"
                style={{ border: `1px solid ${COLORS.line}`, background: COLORS.card, color: COLORS.ink }}
              />
              <input
                type="text"
                placeholder="What was it spent on?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="premium-input flex-1 min-w-0 text-[10px] px-1.5 py-1 rounded"
                style={{ border: `1px solid ${COLORS.line}`, background: COLORS.card, color: COLORS.ink }}
              />
              <button
                onClick={() => {
                  onLogExpense(p.id, Number(amount), note);
                  setAmount("");
                  setNote("");
                }}
                className="text-[10px] font-semibold px-2 py-1 rounded shrink-0"
                style={{ background: COLORS.slate, color: COLORS.white }}
              >
                Log
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Full-detail popup for a single case — the "View details" action available wherever a
   case is listed, giving the same depth of information as the Faculty Match detail panel. */
function CaseDetailModal({ problem: p, onClose, onOpenMatch }) {
  const { t } = useLanguage();
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);
  if (!p) return null;
  const info = urgencyInfo(p);
  const uColor = urgencyColor(info.pct, info.resolved);
  const facultyGeo = p.matchedFaculty ? facultyGeoFor(p.matchedFaculty) : null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(32,40,31,0.48)", backdropFilter: "blur(4px)" }} />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-5 sm:p-6" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_LG }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CaseStamp>{p.caseNo}</CaseStamp>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: COLORS.inkSoft, background: COLORS.paperDark }}>{p.status}</span>
          </div>
          <button onClick={onClose} aria-label={t("close")} className="p-1.5 rounded-full shrink-0" style={{ color: COLORS.inkSoft }}><X size={17} /></button>
        </div>

        <h2 className="font-display text-xl mt-3" style={{ color: COLORS.ink }}>{p.title}</h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: COLORS.inkSoft }}>{p.description}</p>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <CategoryBadge category={p.category} />
          <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.inkSoft }}><MapPin size={12} />{p.district}</span>
          <span className="flex items-center gap-1 text-xs font-mono" style={{ color: COLORS.rustDark }}><Users size={12} />{p.votes} {t("citizensReported")}</span>
        </div>
        {p.reportedBy && <div className="text-xs mt-2 italic" style={{ color: COLORS.inkSoft }}>Filed by {p.reportedBy}</div>}
        {CATEGORIES[p.category]?.sdg && <div className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{CATEGORIES[p.category].sdg}</div>}

        <div className="mt-4 rounded-lg p-3" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}` }}>
          <div className="text-[11px] font-mono uppercase tracking-wide mb-1.5" style={{ color: COLORS.inkSoft }}>Deadline status</div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: COLORS.inkSoft }}>{info.resolved ? t("onTarget") : info.pct >= 100 ? `Overdue ${info.overdueDays}d` : `${info.pct}% of ${info.slaDays}d target`}</span>
          </div>
          <ScoreBar pct={Math.min(100, info.pct)} color={uColor} />
        </div>

        {p.matchedFaculty ? (
          <div className="mt-3 rounded-lg p-3" style={{ background: COLORS.slate + "0F", border: `1px solid ${COLORS.slate}33` }}>
            <div className="text-[11px] font-mono uppercase tracking-wide mb-1" style={{ color: COLORS.inkSoft }}>{t("matched")}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <GraduationCap size={14} style={{ color: COLORS.slate }} />
              <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{p.matchedFaculty}</span>
            </div>
            {facultyGeo && <div className="mt-1.5"><DirectionsLink geo={facultyGeo.geo} label="Directions to campus" /></div>}
          </div>
        ) : (
          <div className="mt-3 text-xs italic" style={{ color: COLORS.inkSoft }}>No faculty assigned yet.</div>
        )}

        {p.fundingGoal > 0 && (
          <div className="mt-3 rounded-lg p-3" style={{ background: COLORS.gold + "0F", border: `1px solid ${COLORS.gold}44` }}>
            <div className="text-[11px] font-mono uppercase tracking-wide mb-1.5" style={{ color: COLORS.inkSoft }}>Funding</div>
            <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.inkSoft }}>
              <span>₹{(p.fundingUsed || 0).toLocaleString("en-IN")} used</span>
              <span>of ₹{p.fundingPledged.toLocaleString("en-IN")} pledged (goal ₹{p.fundingGoal.toLocaleString("en-IN")})</span>
            </div>
            <ScoreBar pct={p.fundingPledged > 0 ? Math.min(100, ((p.fundingUsed || 0) / p.fundingPledged) * 100) : 0} color={COLORS.gold} />
            {p.fundingPartner && <div className="text-[11px] mt-1.5" style={{ color: COLORS.inkSoft }}>Funded by {p.fundingPartner}</div>}
          </div>
        )}

        {onOpenMatch && (
          <button onClick={() => { onOpenMatch(p.id); onClose(); }} className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{ background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustDark})`, color: COLORS.white, boxShadow: SHADOW_MD }}>
            {t("findFaculty")} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */
function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [problems, setProblems] = useState(SEED);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("submit");
  const [form, setForm] = useState({ title: "", description: "", district: "Chatra", language: language, category: "" });
  const [isRecording, setIsRecording] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [micUnsupported, setMicUnsupported] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [selectedId, setSelectedId] = useState(SEED[4].id);
  const [detailCaseId, setDetailCaseId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const nextId = useRef(4000);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const baseDescriptionRef = useRef("");

  // Map app languages to BCP-47 speech recognition locales.
  // Haryanvi has no dedicated browser ASR locale, so it falls back to Hindi (closest supported).
  const SPEECH_LANG = { English: "en-IN", Hindi: "hi-IN", Punjabi: "pa-IN", Haryanvi: "hi-IN" };

  useEffect(() => {
    setForm((f) => ({ ...f, language }));
  }, [language]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 4500);
    return () => clearTimeout(t);
  }, [highlightId]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg) => setToast({ msg, key: Date.now() });

  const preview = useMemo(() => analyzeSubmission(form.title, form.description, form.district, problems, form.category || null), [form.title, form.description, form.district, form.category, problems]);
  const myNotifs = useMemo(() => (user?.role === "Faculty" ? notifications.filter((n) => n.facultyName === user.name) : []), [notifications, user]);
  const myUnreadNotifs = useMemo(() => myNotifs.filter((n) => !n.read).length, [myNotifs]);

  const ALL_TABS = [
    { id: "submit", label: t("reportProblem"), icon: MessageSquarePlus },
    { id: "clusters", label: t("caseClusters"), icon: Layers },
    { id: "match", label: t("facultyMatch"), icon: GraduationCap },
    { id: "dashboard", label: t("controlRoom"), icon: LayoutDashboard },
    { id: "lifecycle", label: t("caseFiles"), icon: Workflow },
  ];
  const allowedTabIds = user ? ROLE_META[user.role].tabs : [];
  const TABS = ALL_TABS.filter((t) => allowedTabIds.includes(t.id));

  function handleLogin(role) {
    setUser({ role, name: ROLE_META[role].demoName });
    setTab(ROLE_META[role].tabs[0]);
    showToast(`${t("signIn")} ${ROLE_META[role].demoName} · ${ROLE_META[role].label}.`);
  }
  function handleLogout() {
    setUser(null);
  }
  function handleQuickFill(sample) {
    setForm({ ...form, title: sample.title, description: sample.description, district: sample.district });
  }
  function handleVoice() {
    // Already recording → treat the button as a stop control.
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicUnsupported(true);
      showToast("Voice input isn't supported in this browser. Try Chrome or Edge, or type your report instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG[form.language] || "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    baseDescriptionRef.current = form.description ? form.description + " " : "";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript + " ";
        else interimText += transcript;
      }
      if (finalText) baseDescriptionRef.current += finalText;
      setForm((f) => ({ ...f, description: (baseDescriptionRef.current + interimText).trimStart() }));
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        showToast("Microphone access was denied. Allow microphone permission in your browser settings to use voice input.");
      } else if (event.error === "no-speech") {
        showToast("Didn't catch that — try speaking again after tapping the mic.");
      } else {
        showToast("Voice input stopped due to an error. You can type instead.");
      }
    };

    recognition.onend = () => setIsRecording(false);

    try {
      recognition.start(); // triggers the browser's native microphone permission prompt
    } catch {
      setIsRecording(false);
      showToast("Couldn't start the microphone. Please try again.");
    }
  }

  function handlePhotoButtonClick() {
    fileInputRef.current?.click(); // triggers the browser/OS native camera & photo library prompt
  }

  function handlePhotoSelected(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      return;
    }
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    setPhotoAttached(true);
    showToast(`${file.name} attached as photo evidence.`);
  }

  function handleRemovePhoto() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setPhotoAttached(false);
  }
  function handleSubmit() {
    if (!form.title.trim() || !form.description.trim()) {
      showToast("Add a short title and description before logging the case.");
      return;
    }
    const { category, sdg, matches, manual } = analyzeSubmission(form.title, form.description, form.district, problems, form.category || null);
    const top = matches[0];
    if (top && top.score >= MERGE_THRESHOLD) {
      const newVotes = top.votes + 1;
      setProblems((prev) => prev.map((p) => (p.id === top.id ? { ...p, votes: newVotes } : p)));
      setHighlightId(top.id);
      showToast(`AI match ${Math.round(top.score * 100)}% — merged into ${top.caseNo}, now reported by ${newVotes} citizens.`);
    } else {
      const code = CODES[category] || "GEN";
      const num = nextId.current++;
      let newProblem = { id: num, caseNo: `JH-${code}-${num}`, category, district: form.district, title: form.title, description: form.description, votes: 1, status: "Logged", matchedFaculty: null, daysAgo: 0, fundingGoal: 0, fundingPledged: 0, sdg, reportedBy: user?.name || "a district resident" };

      // Domain-based auto-routing: skip the manual "Find a faculty match" step whenever a
      // confident faculty match exists for this case's category, and notify that faculty directly.
      // A citizen-picked domain (rather than AI guesswork) makes this match far more reliable.
      const routed = autoRouteFaculty(newProblem);
      if (routed) {
        const facultyLabel = `${routed.name} · ${routed.inst}`;
        newProblem = { ...newProblem, matchedFaculty: facultyLabel, status: "Assigned to University" };
        setNotifications((prev) => [
          { id: `${num}-${Date.now()}`, facultyName: routed.name, facultyInst: routed.inst, caseNo: newProblem.caseNo, title: newProblem.title, category, district: form.district, score: routed.score, read: false, at: Date.now() },
          ...prev,
        ]);
      }

      setProblems((prev) => [newProblem, ...prev]);
      setHighlightId(num);
      if (routed) {
        showToast(`New case opened: ${newProblem.caseNo} — ${manual ? `logged under ${category}` : "auto-detected as " + category} and routed directly to ${routed.name} (${routed.inst}), notified now.`);
      } else {
        showToast(`No strong faculty match (${Math.round((top?.score || 0) * 100)}% max) — new case opened: ${newProblem.caseNo}, awaiting faculty review.`);
      }
    }
    setForm({ title: "", description: "", district: form.district, language: form.language, category: "" });
    setPhotoAttached(false);
    setTab("clusters");
  }
  function handleOpenDetails(id) {
    setDetailCaseId(id);
  }
  function handleOpenMatch(id) {
    if (user && !ROLE_META[user.role].tabs.includes("match")) {
      showToast("Faculty matching is visible to university faculty and government accounts.");
      return;
    }
    setSelectedId(id);
    setTab("match");
  }
  function handleAssign(problemId, facultyLabel) {
    setProblems((prev) => prev.map((p) => (p.id === problemId ? { ...p, matchedFaculty: facultyLabel, status: p.status === "Logged" ? "Assigned to University" : p.status } : p)));
    showToast(`${facultyLabel.split(" · ")[0]} assigned — notification sent to the case owner.`);
  }
  function handleAdvance(id) {
    setProblems((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const idx = STAGES.indexOf(p.status);
      const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
      const patch = { status: next };
      if (next === "Industry Partnership" && !p.fundingGoal) {
        patch.fundingGoal = 60000 + Math.floor(Math.random() * 140000);
        patch.fundingPledged = 0;
        patch.fundingUsed = 0;
        patch.expenses = [];
      }
      return { ...p, ...patch };
    }));
    showToast("Case advanced to the next stage — stakeholders notified.");
  }
  function handlePledge(problem) {
    const partner = PARTNERS.find((pt) => pt.focus.includes(problem.category)) || PARTNERS[0];
    const amount = Math.min(problem.fundingGoal - problem.fundingPledged, 15000 + Math.floor(Math.random() * 25000));
    setProblems((prev) => prev.map((p) => (p.id === problem.id ? { ...p, fundingPledged: Math.min(p.fundingGoal, p.fundingPledged + amount), fundingPartner: partner.name } : p)));
    showToast(`₹${amount.toLocaleString("en-IN")} pledged by ${partner.name} for ${problem.caseNo}.`);
  }
  function handleLogExpense(problemId, amount, note) {
    if (!amount || amount <= 0) {
      showToast("Enter a valid amount before logging an expense.");
      return;
    }
    setProblems((prev) => prev.map((p) => {
      if (p.id !== problemId) return p;
      const entry = { id: `${problemId}-${Date.now()}`, amount, note: note?.trim() || "Expense", by: user?.name, at: Date.now() };
      return { ...p, fundingUsed: (p.fundingUsed || 0) + amount, expenses: [entry, ...(p.expenses || [])] };
    }));
    showToast(`₹${amount.toLocaleString("en-IN")} logged as spent — visible to the industry partner and government instantly.`);
  }

  const totalReports = problems.reduce((s, p) => s + p.votes, 0);
  const districtsReporting = new Set(problems.map((p) => p.district)).size;

  return (
    <div className="min-h-screen w-full font-body" style={{ background: COLORS.paper, color: COLORS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Roboto Slab', serif; }
        .font-body, .font-body input, .font-body select, .font-body textarea, .font-body button { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        select, input, textarea, button { font-family: inherit; }
        .lift-hover { transition: transform 180ms ease, box-shadow 180ms ease; }
        .lift-hover:hover { transform: translateY(-3px); box-shadow: ${SHADOW_LG}; }
        .premium-input:focus { outline: none; border-color: ${COLORS.rust} !important; box-shadow: 0 0 0 3px ${COLORS.rust}22; }
        ::selection { background: ${COLORS.gold}55; }
        @keyframes shakeX { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
      `}</style>
      <PaperGrain />

      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <header style={{ boxShadow: SHADOW_SM }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center justify-between flex-wrap gap-y-2 gap-x-4">
                <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: COLORS.inkSoft }}>{t("department")}</span>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full" style={{ background: COLORS.slate + "14", color: COLORS.slate, border: `1px solid ${COLORS.slate}44` }}>
                    <User size={11} /> {user.name} · {ROLE_META[user.role].label}
                  </span>
                  {user.role === "Faculty" && (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setNotifOpen((v) => !v);
                          setNotifications((prev) => prev.map((n) => (n.facultyName === user.name ? { ...n, read: true } : n)));
                        }}
                        className="relative flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: COLORS.slate, border: `1px solid ${COLORS.line}`, background: COLORS.card }}
                      >
                        <Bell size={12} /> Notifications
                        {myUnreadNotifs > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: COLORS.rust, color: COLORS.white }}>
                            {myUnreadNotifs}
                          </span>
                        )}
                      </button>
                      {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg z-50" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: SHADOW_LG }}>
                          <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wide" style={{ color: COLORS.inkSoft, borderBottom: `1px solid ${COLORS.line}` }}>
                            Cases auto-routed to you
                          </div>
                          {myNotifs.length === 0 ? (
                            <div className="px-3 py-4 text-xs" style={{ color: COLORS.inkSoft }}>No cases have been auto-routed to you yet.</div>
                          ) : (
                            myNotifs.map((n) => (
                              <div key={n.id} className="px-3 py-2.5" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <CaseStamp>{n.caseNo}</CaseStamp>
                                  <CategoryBadge category={n.category} small />
                                </div>
                                <div className="text-xs mt-1.5 font-medium" style={{ color: COLORS.ink }}>{n.title}</div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[10px] flex items-center gap-1" style={{ color: COLORS.inkSoft }}><MapPin size={10} />{n.district}</span>
                                  <span className="text-[10px] font-mono font-semibold" style={{ color: COLORS.forest }}>{n.score}% match</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={() => setLanguageOpen(true)} className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: COLORS.slate, border: `1px solid ${COLORS.line}`, background: COLORS.card }}>
                    🌐 {languageLabel(language)}
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color: COLORS.inkSoft, border: `1px solid ${COLORS.line}` }}>
                    <LogOut size={11} /> {t("switchRole")}
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between flex-wrap gap-y-4 gap-x-6 mt-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Emblem size={44} />
                  <div className="min-w-0">
                    <h1 className="font-display text-3xl sm:text-4xl" style={{ color: COLORS.ink }}>Samadhan Setu</h1>
                    <p className="text-sm mt-1.5 max-w-md" style={{ color: COLORS.inkSoft }}>{t("portalTagline")}</p>
                  </div>
                </div>
                <div className="flex gap-5 sm:gap-6 font-mono text-xs shrink-0" style={{ color: COLORS.inkSoft }}>
                  <div><span className="block text-lg font-semibold tabular-nums" style={{ color: COLORS.rustDark }}>{problems.length}</span>{t("cases")}</div>
                  <div><span className="block text-lg font-semibold tabular-nums" style={{ color: COLORS.ink }}>{totalReports}</span>{t("reports")}</div>
                  <div><span className="block text-lg font-semibold tabular-nums" style={{ color: COLORS.forest }}>{districtsReporting}/24</span>{t("districts")}</div>
                </div>
              </div>
            </div>
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.rust} 45%, ${COLORS.gold})` }} />
          </header>

          <LanguageModal open={languageOpen} language={language} setLanguage={setLanguage}
            onClose={() => setLanguageOpen(false)} />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
            <div className="flex gap-1.5 overflow-x-auto pb-px">
              {TABS.map((t) => <TabButton key={t.id} active={tab === t.id} label={t.label} icon={t.icon} onClick={() => setTab(t.id)} />)}
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            <div className="rounded-b-xl rounded-tr-xl border p-5 sm:p-8 lg:p-9" style={{ background: COLORS.card, borderColor: COLORS.line, boxShadow: SHADOW_LG }}>
              {tab === "submit" && (
                <SubmitTab
                  form={form} setForm={setForm} isRecording={isRecording} onVoice={handleVoice}
                  onSubmit={handleSubmit} onQuickFill={handleQuickFill}
                  photoAttached={photoAttached} photoFile={photoFile} photoPreviewUrl={photoPreviewUrl}
                  onPhotoButtonClick={handlePhotoButtonClick} onPhotoSelected={handlePhotoSelected}
                  onRemovePhoto={handleRemovePhoto} fileInputRef={fileInputRef} preview={preview}
                />
              )}
              {tab === "clusters" && (
                <ClustersTab problems={problems} user={user} highlightId={highlightId} onOpenMatch={handleOpenMatch} onOpenDetails={handleOpenDetails} filter={filter} setFilter={setFilter} />
              )}
              {tab === "match" && (
                <MatchTab problems={problems} user={user} selectedId={selectedId} setSelectedId={setSelectedId} onAssign={handleAssign} onOpenDetails={handleOpenDetails} />
              )}
              {tab === "dashboard" && <DashboardTab problems={problems} onOpenDetails={handleOpenDetails} />}
              {tab === "lifecycle" && (
                <LifecycleTab problems={problems} user={user} onAdvance={handleAdvance} onPledge={handlePledge} onLogExpense={handleLogExpense} onGoToMatch={handleOpenMatch} onOpenDetails={handleOpenDetails} />
              )}
            </div>
          </main>
        </>
      )}

      {detailCaseId && (
        <CaseDetailModal
          problem={problems.find((p) => p.id === detailCaseId)}
          onClose={() => setDetailCaseId(null)}
          onOpenMatch={handleOpenMatch}
        />
      )}

      {toast && (
        <div
          key={toast.key}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          style={{ background: COLORS.ink, color: COLORS.paper }}
        >
          <Sparkles size={15} style={{ color: COLORS.gold }} className="shrink-0" />
          <span className="text-xs">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-auto shrink-0"><X size={13} /></button>
        </div>
      )}
    </div>
  );
}


export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
