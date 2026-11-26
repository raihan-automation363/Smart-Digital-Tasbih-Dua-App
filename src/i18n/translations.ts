import { DuaCategory, Language } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  nav: {
    counter: string;
    dhikr: string;
    duas: string;
    stats: string;
    settings: string;
  };
  common: {
    save: string;
    cancel: string;
    close: string;
    reset: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    all: string;
    favourites: string;
    copy: string;
    copied: string;
    confirm: string;
    back: string;
    next: string;
    done: string;
    offlineBadge: string;
    verifiedSource: string;
    customRecommendation: string;
    restoreDefault: string;
    noResults: string;
  };
  counter: {
    tapToCount: string;
    tapAction: string;
    tapSubtitle: string;
    currentCount: string;
    target: string;
    progress: string;
    rounds: string;
    dailyProgress: string;
    undo: string;
    reset: string;
    changeTarget: string;
    customTarget: string;
    applyTarget: string;
    targetReached: string;
    continueCounting: string;
    newRound: string;
    wakeLock: string;
    wakeLockActive: string;
    wakeLockUnsupported: string;
    prayerMode: string;
    prayerModeShort: string;
    prayerModeDesc: string;
    prayerModeComplete: string;
    exitPrayerMode: string;
    stepOf: string;
    confirmResetTitle: string;
    confirmResetMessage: string;
    switchDhikr: string;
    keyboardHint: string;
  };
  dhikr: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    addCustom: string;
    editDhikr: string;
    startCounting: string;
    recommended: string;
    times: string;
    arabicLabel: string;
    translitEnLabel: string;
    translitBnLabel: string;
    meaningEnLabel: string;
    meaningBnLabel: string;
    sourceLabel: string;
    countLabel: string;
    confirmDeleteTitle: string;
    confirmDeleteMessage: string;
  };
  duas: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    addCustom: string;
    editDua: string;
    countThisDua: string;
    categoryLabel: string;
    titleEnLabel: string;
    titleBnLabel: string;
    titleArLabel: string;
    arabicLabel: string;
    translitEnLabel: string;
    translitBnLabel: string;
    translationEnLabel: string;
    translationBnLabel: string;
    sourceLabel: string;
    notesLabel: string;
    categories: Record<DuaCategory, string>;
    confirmDeleteTitle: string;
    confirmDeleteMessage: string;
  };
  quranDuas: {
    sectionTitle: string;
    sectionSubtitle: string;
    tabQuran: string;
    tabDuas: string;
    searchPlaceholder: string;
    readPassage: string;
    backToList: string;
    verseLabel: string;
    versesCount: string;
    previousPassage: string;
    nextPassage: string;
    previousVerse: string;
    nextVerse: string;
    showTransliteration: string;
    countInTasbih: string;
    groups: {
      surah_hashr: string;
      ayatul_kursi: string;
      baqarah_end: string;
      baqarah_duas: string;
    };
  };
  stats: {
    title: string;
    subtitle: string;
    todayTotal: string;
    overallTotal: string;
    completedTargets: string;
    dailyGoal: string;
    editGoal: string;
    weeklyChartTitle: string;
    topDhikrsTitle: string;
    sessionHistoryTitle: string;
    clearHistory: string;
    confirmClearTitle: string;
    confirmClearMessage: string;
    noHistory: string;
    targetHit: string;
    backupTitle: string;
    backupDesc: string;
    exportJson: string;
    importJson: string;
    importSuccess: string;
    importError: string;
  };
  settings: {
    title: string;
    subtitle: string;
    languageSection: string;
    languageLabel: string;
    appearanceSection: string;
    darkMode: string;
    themePreset: string;
    themes: {
      emerald: string;
      midnight: string;
      sand: string;
      rose: string;
      ocean: string;
    };
    customBg: string;
    resetBg: string;
    fontSize: string;
    fontSizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    counterStyle: string;
    counterStyles: {
      ring: string;
      pad: string;
      minimal: string;
    };
    soundVibrationSection: string;
    clickSound: string;
    soundStyle: string;
    soundStyles: {
      wood: string;
      chime: string;
      pulse: string;
      tick: string;
    };
    completionSound: string;
    vibration: string;
    completionVibration: string;
    vibrationUnsupported: string;
    testSound: string;
    testVibration: string;
    goalsPresetsSection: string;
    dailyGoalLabel: string;
    customPresetsLabel: string;
    addPresetPlaceholder: string;
    pwaSection: string;
    installApp: string;
    installedStatus: string;
    offlineReady: string;
    androidGuideTitle: string;
    androidGuideSteps: string[];
    iosGuideTitle: string;
    iosGuideSteps: string[];
    openGuide: string;
    privacySection: string;
    privacyPoints: string[];
    versionLabel: string;
    dangerSection: string;
    resetAllData: string;
    resetAllTitle: string;
    resetAllMessage: string;
    resetTypeHint: string;
    resetConfirmWord: string;
  };
  onboarding: {
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    getStarted: string;
    skip: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appName: 'Noor Tasbih',
    tagline: 'Peaceful Dhikr & Dua Companion',
    nav: {
      counter: 'Tasbih',
      dhikr: 'Dhikr',
      duas: 'Quran & Duas',
      stats: 'Stats',
      settings: 'Settings',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      reset: 'Reset',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      all: 'All',
      favourites: 'Favourites',
      copy: 'Copy',
      copied: 'Copied',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      offlineBadge: 'Offline Mode · Local Data Active',
      verifiedSource: 'Verified reference',
      customRecommendation: 'Custom / general recommendation',
      restoreDefault: 'Restore Default',
      noResults: 'No matching entries found.',
    },
    counter: {
      tapToCount: 'Tap to count',
      tapAction: 'Tap',
      tapSubtitle: 'to count',
      currentCount: 'Count',
      target: 'Target',
      progress: 'Progress',
      rounds: 'Rounds',
      dailyProgress: 'Daily Goal',
      undo: 'Undo',
      reset: 'Reset',
      changeTarget: 'Target',
      customTarget: 'Custom target',
      applyTarget: 'Apply',
      targetReached: 'Target Completed',
      continueCounting: 'Continue',
      newRound: 'New Round',
      wakeLock: 'Keep Screen On',
      wakeLockActive: 'Screen Awake',
      wakeLockUnsupported: 'Wake lock not supported on this browser',
      prayerMode: 'After-Prayer Tasbih (33-33-34)',
      prayerModeShort: 'After Prayer',
      prayerModeDesc: 'Sunnah sequence: 33x SubhanAllah, 33x Alhamdulillah, 34x Allahu Akbar, then Tahlil.',
      prayerModeComplete: 'After-Prayer Tasbih Complete! May Allah accept your remembrance.',
      exitPrayerMode: 'Exit Sequence',
      stepOf: 'Step',
      confirmResetTitle: 'Reset Counter?',
      confirmResetMessage: 'This will reset the current count to 0. Your daily and overall totals remain saved.',
      switchDhikr: 'Switch Dhikr',
      keyboardHint: 'Tip: Press Spacebar or Enter to count',
    },
    dhikr: {
      title: 'Dhikr Library',
      subtitle: 'Select a remembrance to count or add your own custom dhikr.',
      searchPlaceholder: 'Search Arabic, transliteration, or meaning...',
      addCustom: 'New Dhikr',
      editDhikr: 'Edit Dhikr',
      startCounting: 'Start Counting',
      recommended: 'Target',
      times: 'times',
      arabicLabel: 'Arabic Text',
      translitEnLabel: 'English Transliteration',
      translitBnLabel: 'Bangla Transliteration',
      meaningEnLabel: 'English Meaning',
      meaningBnLabel: 'Bangla Meaning',
      sourceLabel: 'Reference / Source',
      countLabel: 'Recommended Count',
      confirmDeleteTitle: 'Delete Dhikr?',
      confirmDeleteMessage: 'Are you sure you want to remove this custom dhikr entry?',
    },
    duas: {
      title: 'Important Duas',
      subtitle: 'Authentic supplications organized by daily moments. Tap edit on any dua to customize.',
      searchPlaceholder: 'Search duas, translation, or source...',
      addCustom: 'New Dua',
      editDua: 'Edit Dua',
      countThisDua: 'Count in Tasbih',
      categoryLabel: 'Category',
      titleEnLabel: 'Title (English)',
      titleBnLabel: 'Title (Bangla)',
      titleArLabel: 'Title (Arabic)',
      arabicLabel: 'Arabic Text',
      translitEnLabel: 'English Transliteration',
      translitBnLabel: 'Bangla Transliteration',
      translationEnLabel: 'English Translation',
      translationBnLabel: 'Bangla Translation',
      sourceLabel: 'Verified Source / Reference',
      notesLabel: 'Notes (Optional)',
      categories: {
        morning: 'Morning',
        evening: 'Evening',
        before_sleep: 'Before Sleep',
        after_waking: 'After Waking',
        before_eating: 'Before Eating',
        after_eating: 'After Eating',
        forgiveness: 'Forgiveness',
        protection: 'Protection',
        daily_life: 'Daily Life',
      },
      confirmDeleteTitle: 'Delete Dua?',
      confirmDeleteMessage: 'Are you sure you want to delete this custom dua?',
    },
    quranDuas: {
      sectionTitle: 'Quranic Verses & Duas',
      sectionSubtitle: 'Verified Quranic passages and authentic daily supplications with Bangla and English translations.',
      tabQuran: 'Quranic Verses',
      tabDuas: 'Important Duas',
      searchPlaceholder: 'Search Surah, verse, or translation...',
      readPassage: 'Read Passage',
      backToList: 'Back to Quranic Verses & Duas',
      verseLabel: 'Verse',
      versesCount: 'verses',
      previousPassage: 'Previous Passage',
      nextPassage: 'Next Passage',
      previousVerse: 'Prev Verse',
      nextVerse: 'Next Verse',
      showTransliteration: 'Transliteration',
      countInTasbih: 'Recite in Tasbih',
      groups: {
        surah_hashr: 'Al-Hashr 59:22–24',
        ayatul_kursi: 'Ayatul Kursi',
        baqarah_end: 'Al-Baqarah 2:285–286',
        baqarah_duas: 'Al-Baqarah Duas',
      },
    },
    stats: {
      title: 'History & Statistics',
      subtitle: 'All counting activity is stored privately on your device.',
      todayTotal: "Today's Dhikr",
      overallTotal: 'Overall Total',
      completedTargets: 'Targets Reached',
      dailyGoal: 'Daily Goal',
      editGoal: 'Update Goal',
      weeklyChartTitle: 'Last 7 Days Activity',
      topDhikrsTitle: 'Most Recited Dhikr',
      sessionHistoryTitle: 'Recent Sessions',
      clearHistory: 'Clear History',
      confirmClearTitle: 'Clear Session History?',
      confirmClearMessage: 'This removes the session log entries. Your lifetime total can still be reset separately in Settings.',
      noHistory: 'No counting sessions recorded yet. Start counting to see your progress.',
      targetHit: 'Completed',
      backupTitle: 'Backup & Restore',
      backupDesc: 'Export all dhikr, duas, history, and preferences to a JSON file or restore from a previous backup.',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      importSuccess: 'Backup restored successfully.',
      importError: 'Invalid backup file. Please choose a valid Noor Tasbih JSON export.',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Personalize language, visual theme, sound, haptics, and offline installation.',
      languageSection: 'Language & Layout',
      languageLabel: 'App Language',
      appearanceSection: 'Theme & Appearance',
      darkMode: 'Dark Mode',
      themePreset: 'Color Palette',
      themes: {
        emerald: 'Emerald',
        midnight: 'Midnight',
        sand: 'Sand',
        rose: 'Rose',
        ocean: 'Ocean',
      },
      customBg: 'Custom Background Color',
      resetBg: 'Use Theme Default',
      fontSize: 'Text & Arabic Size',
      fontSizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        xlarge: 'Extra Large',
      },
      counterStyle: 'Counter Tap Area Style',
      counterStyles: {
        ring: 'Classic Ring',
        pad: 'Tactile Pad',
        minimal: 'Minimal Zen',
      },
      soundVibrationSection: 'Sound & Vibration',
      clickSound: 'Tap Sound',
      soundStyle: 'Click Sound Style',
      soundStyles: {
        wood: 'Tasbih Bead',
        chime: 'Soft Chime',
        pulse: 'Warm Pulse',
        tick: 'Crisp Tick',
      },
      completionSound: 'Target Completion Sound',
      vibration: 'Tap Vibration',
      completionVibration: 'Completion Vibration',
      vibrationUnsupported: 'Vibration is not supported by this browser or device (for example iOS Safari or desktop browsers).',
      testSound: 'Test Sound',
      testVibration: 'Test Vibration',
      goalsPresetsSection: 'Daily Goal & Presets',
      dailyGoalLabel: 'Daily Dhikr Goal',
      customPresetsLabel: 'Target Presets',
      addPresetPlaceholder: 'Add count (e.g. 500)',
      pwaSection: 'Install & Offline App',
      installApp: 'Install Noor Tasbih',
      installedStatus: 'Installed as Standalone App',
      offlineReady: 'Offline Ready · Works without internet',
      androidGuideTitle: 'Install on Android (Chrome)',
      androidGuideSteps: [
        'Open Noor Tasbih in Google Chrome.',
        'Tap the "Install Noor Tasbih" button above or open Chrome menu (⋮).',
        'Select "Add to Home screen" or "Install app" and confirm.',
      ],
      iosGuideTitle: 'Install on iPhone / iPad (Safari)',
      iosGuideSteps: [
        'Open Noor Tasbih in Apple Safari.',
        'Tap the Share icon at the bottom or top toolbar.',
        'Scroll down and tap "Add to Home Screen", then tap Add.',
      ],
      openGuide: 'Show Welcome Guide',
      privacySection: 'App Info & Privacy',
      privacyPoints: [
        '100% On-Device Storage: Your tasbih counts, custom duas, and settings never leave your device.',
        'No Login, No Ads, No Tracking: Zero analytics scripts, zero external databases, and zero network tracking.',
        'Authentic References: Quran and Hadith citations are marked clearly; unverified custom target counts are labeled as recommendations.',
      ],
      versionLabel: 'Noor Tasbih Offline PWA',
      dangerSection: 'Data Management',
      resetAllData: 'Reset All App Data',
      resetAllTitle: 'Reset Everything?',
      resetAllMessage: 'This permanently erases all counts, history, custom dhikr/duas, and restores factory defaults.',
      resetTypeHint: 'Type RESET to confirm:',
      resetConfirmWord: 'RESET',
    },
    onboarding: {
      step1Title: 'Welcome to Noor Tasbih',
      step1Body: 'A serene, distraction-free Islamic Tasbih and Dua companion designed to work completely offline on your phone or desktop.',
      step2Title: 'Tactile Counting & After-Prayer Mode',
      step2Body: 'Tap anywhere on the counter, customize target presets (33, 99, 100, 1000), or launch the 33-33-34 After-Prayer Sunnah sequence.',
      step3Title: 'Private & Installable Anywhere',
      step3Body: 'Everything stays strictly on your device. Install Noor Tasbih to your home screen for instant offline access anytime.',
      getStarted: 'Start Counting',
      skip: 'Skip',
    },
  },
  bn: {
    appName: 'নূর তাসবীহ',
    tagline: 'প্রশান্তিময় জিকির ও দুআ সঙ্গী',
    nav: {
      counter: 'তাসবীহ',
      dhikr: 'জিকির',
      duas: 'কুরআন ও দুআ',
      stats: 'পরিসংখ্যান',
      settings: 'সেটিংস',
    },
    common: {
      save: 'সংরক্ষণ',
      cancel: 'বাতিল',
      close: 'বন্ধ করুন',
      reset: 'রিসেট',
      delete: 'মুছুন',
      edit: 'সম্পাদনা',
      add: 'যোগ করুন',
      search: 'খুঁজুন',
      all: 'সবগুলো',
      favourites: 'পছন্দসমূহ',
      copy: 'কপি',
      copied: 'কপি হয়েছে',
      confirm: 'নিশ্চিত করুন',
      back: 'পিছনে',
      next: 'পরবর্তী',
      done: 'সম্পন্ন',
      offlineBadge: 'অফলাইন মোড · লোকাল ডেটা সক্রিয়',
      verifiedSource: 'যাচাইকৃত সূত্র',
      customRecommendation: 'সাধারণ / ঐচ্ছিক সংখ্যা',
      restoreDefault: 'আগের অবস্থায় ফেরান',
      noResults: 'কোনো ফলাফল পাওয়া যায়নি।',
    },
    counter: {
      tapToCount: 'ট্যাপ করুন',
      tapAction: 'ট্যাপ করুন',
      tapSubtitle: 'গণনা করতে',
      currentCount: 'গণনা',
      target: 'লক্ষ্য',
      progress: 'অগ্রগতি',
      rounds: 'চক্র',
      dailyProgress: 'দৈনিক লক্ষ্য',
      undo: 'পূর্বাবস্থা',
      reset: 'রিসেট',
      changeTarget: 'লক্ষ্য',
      customTarget: 'নিজস্ব লক্ষ্য',
      applyTarget: 'সেট করুন',
      targetReached: 'লক্ষ্য পূর্ণ হয়েছে',
      continueCounting: 'চালিয়ে যান',
      newRound: 'নতুন চক্র',
      wakeLock: 'স্ক্রিন চালু রাখুন',
      wakeLockActive: 'স্ক্রিন সচল আছে',
      wakeLockUnsupported: 'এই ব্রাউজারে স্ক্রিন ওয়েক-লক সমর্থিত নয়',
      prayerMode: 'নামাজের পরের তাসবীহ (৩৩-৩৩-৩৪)',
      prayerModeShort: 'নামাজের পর',
      prayerModeDesc: 'সুন্নাহ ক্রম: ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ, ৩৪ বার আল্লাহু আকবার, এরপর তাহলীল।',
      prayerModeComplete: 'নামাজের পরের তাসবীহ সম্পন্ন হয়েছে! আল্লাহ আপনার জিকির কবুল করুন।',
      exitPrayerMode: 'মোড বন্ধ করুন',
      stepOf: 'ধাপ',
      confirmResetTitle: 'গণনা রিসেট করবেন?',
      confirmResetMessage: 'বর্তমান গণনা ০-তে ফিরে যাবে। আপনার দৈনিক ও সর্বমোট হিসাব সংরক্ষিত থাকবে।',
      switchDhikr: 'জিকির বদলান',
      keyboardHint: 'টিপস: কিবোর্ডে Space বা Enter চেপেও গণনা করতে পারেন',
    },
    dhikr: {
      title: 'জিকির লাইব্রেরি',
      subtitle: 'গণনার জন্য একটি জিকির বেছে নিন অথবা নিজস্ব জিকির যোগ করুন।',
      searchPlaceholder: 'আরবি, উচ্চারণ বা অর্থ দিয়ে খুঁজুন...',
      addCustom: 'নতুন জিকির',
      editDhikr: 'জিকির সম্পাদনা',
      startCounting: 'গণনা শুরু করুন',
      recommended: 'লক্ষ্য',
      times: 'বার',
      arabicLabel: 'আরবি পাঠ',
      translitEnLabel: 'ইংরেজি উচ্চারণ',
      translitBnLabel: 'বাংলা উচ্চারণ',
      meaningEnLabel: 'ইংরেজি অর্থ',
      meaningBnLabel: 'বাংলা অর্থ',
      sourceLabel: 'তথ্যসূত্র / দলিল',
      countLabel: 'প্রস্তাবিত সংখ্যা',
      confirmDeleteTitle: 'জিকির মুছবেন?',
      confirmDeleteMessage: 'আপনি কি নিশ্চিতভাবে এই নিজস্ব জিকিরটি মুছে ফেলতে চান?',
    },
    duas: {
      title: 'গুরুত্বপূর্ণ দুআসমূহ',
      subtitle: 'দৈনন্দিন জীবনের বিভিন্ন মুহূর্তের নির্ভরযোগ্য দুআ। যেকোনো দুআ সম্পাদনা করতে এডিট বাটনে ট্যাপ করুন।',
      searchPlaceholder: 'দুআ, অনুবাদ বা সূত্র খুঁজুন...',
      addCustom: 'নতুন দুআ',
      editDua: 'দুআ সম্পাদনা',
      countThisDua: 'তাসবীহে গণনা করুন',
      categoryLabel: 'বিভাগ',
      titleEnLabel: 'শিরোনাম (ইংরেজি)',
      titleBnLabel: 'শিরোনাম (বাংলা)',
      titleArLabel: 'শিরোনাম (আরবি)',
      arabicLabel: 'আরবি পাঠ',
      translitEnLabel: 'ইংরেজি উচ্চারণ',
      translitBnLabel: 'বাংলা উচ্চারণ',
      translationEnLabel: 'ইংরেজি অনুবাদ',
      translationBnLabel: 'বাংলা অনুবাদ',
      sourceLabel: 'যাচাইকৃত সূত্র',
      notesLabel: 'টীকা (ঐচ্ছিক)',
      categories: {
        morning: 'সকালের দুআ',
        evening: 'সন্ধ্যার দুআ',
        before_sleep: 'ঘুমানোর আগে',
        after_waking: 'ঘুম থেকে উঠে',
        before_eating: 'খাওয়ার আগে',
        after_eating: 'খাওয়ার পর',
        forgiveness: 'ক্ষমা প্রার্থনা',
        protection: 'নিরাপত্তা ও আশ্রয়',
        daily_life: 'দৈনন্দিন জীবন',
      },
      confirmDeleteTitle: 'দুআ মুছবেন?',
      confirmDeleteMessage: 'আপনি কি নিশ্চিতভাবে এই দুআটি মুছে ফেলতে চান?',
    },
    quranDuas: {
      sectionTitle: 'কুরআনের আয়াত ও দুআ',
      sectionSubtitle: 'যাচাইকৃত কুরআনের আয়াত ও প্রতিদিনের গুরুত্বপূর্ণ দুআসমূহ — বাংলা উচ্চারণ, বাংলা ও ইংরেজি অর্থসহ।',
      tabQuran: 'কুরআনের আয়াত',
      tabDuas: 'গুরুত্বপূর্ণ দুআ',
      searchPlaceholder: 'সূরা, আয়াত বা অনুবাদ খুঁজুন...',
      readPassage: 'বিস্তারিত পড়ুন',
      backToList: 'তালিকায় ফিরে যান',
      verseLabel: 'আয়াত',
      versesCount: 'টি আয়াত',
      previousPassage: 'পূর্ববর্তী পাঠ',
      nextPassage: 'পরবর্তী পাঠ',
      previousVerse: 'আগের আয়াত',
      nextVerse: 'পরের আয়াত',
      showTransliteration: 'উচ্চারণ দেখান',
      countInTasbih: 'তাসবীহে গণনা করুন',
      groups: {
        surah_hashr: 'সূরা হাশর ৫৯:২২–২৪',
        ayatul_kursi: 'আয়াতুল কুরসি',
        baqarah_end: 'বাকারা ২:২৮৫–২৮৬',
        baqarah_duas: 'বাকারার দুআসমূহ',
      },
    },
    stats: {
      title: 'ইতিহাস ও পরিসংখ্যান',
      subtitle: 'আপনার সকল গণনার তথ্য কেবল আপনার ডিভাইসেই নিরাপদে সংরক্ষিত থাকে।',
      todayTotal: 'আজকের জিকির',
      overallTotal: 'সর্বমোট গণনা',
      completedTargets: 'পূর্ণ লক্ষ্য',
      dailyGoal: 'দৈনিক লক্ষ্য',
      editGoal: 'লক্ষ্য পরিবর্তন',
      weeklyChartTitle: 'গত ৭ দিনের আমল',
      topDhikrsTitle: 'সর্বাধিক পঠিত জিকির',
      sessionHistoryTitle: 'সাম্প্রতিক সেশন',
      clearHistory: 'ইতিহাস মুছুন',
      confirmClearTitle: 'সেশন ইতিহাস মুছবেন?',
      confirmClearMessage: 'এতে সাম্প্রতিক সেশন তালিকা মুছে যাবে। সর্বমোট সংখ্যা সেটিংস থেকে আলাদাভাবে রিসেট করা যাবে।',
      noHistory: 'এখনো কোনো সেশন সংরক্ষিত হয়নি। অগ্রগতি দেখতে জিকির গণনা শুরু করুন।',
      targetHit: 'সম্পন্ন',
      backupTitle: 'ব্যাকআপ ও রিস্টোর',
      backupDesc: 'সব জিকির, দুআ, ইতিহাস এবং সেটিংস JSON ফাইলে সংরক্ষণ করুন বা আগের ব্যাকআপ থেকে ফিরিয়ে আনুন।',
      exportJson: 'JSON এক্সপোর্ট',
      importJson: 'JSON ইমপোর্ট',
      importSuccess: 'ব্যাকআপ সফলভাবে রিস্টোর হয়েছে।',
      importError: 'ফাইলটি সঠিক নয়। অনুগ্রহ করে একটি বৈধ নূর তাসবীহ JSON ফাইল নির্বাচন করুন।',
    },
    settings: {
      title: 'সেটিংস',
      subtitle: 'ভাষা, থিম, শব্দ, ভাইব্রেশন এবং অফলাইন ইনস্টলেশন সাজিয়ে নিন।',
      languageSection: 'ভাষা ও লেআউট',
      languageLabel: 'অ্যাপের ভাষা',
      appearanceSection: 'থিম ও ডিজাইন',
      darkMode: 'ডার্ক মোড',
      themePreset: 'রঙের থিম',
      themes: {
        emerald: 'পান্না সবুজ',
        midnight: 'রাতের নীল',
        sand: 'মরু বালি',
        rose: 'গোলাপ',
        ocean: 'সমুদ্র',
      },
      customBg: 'নিজস্ব ব্যাকগ্রাউন্ড রঙ',
      resetBg: 'থিমের মূল রঙ ব্যবহার করুন',
      fontSize: 'লেখা ও আরবি অক্ষরের আকার',
      fontSizes: {
        small: 'ছোট',
        medium: 'মাঝারি',
        large: 'বড়',
        xlarge: 'অনেক বড়',
      },
      counterStyle: 'কাউন্টার বাটনের ধরন',
      counterStyles: {
        ring: 'ক্লাসিক রিং',
        pad: 'ট্যাকটাইল প্যাড',
        minimal: 'মিনিমাল জেন',
      },
      soundVibrationSection: 'শব্দ ও ভাইব্রেশন',
      clickSound: 'ট্যাপ শব্দ',
      soundStyle: 'শব্দের ধরন',
      soundStyles: {
        wood: 'তাসবীহ দানা',
        chime: 'মৃদু ঘণ্টা',
        pulse: 'স্নিগ্ধ পালস',
        tick: 'হালকা টিক',
      },
      completionSound: 'লক্ষ্য পূরণের শব্দ',
      vibration: 'ট্যাপ ভাইব্রেশন',
      completionVibration: 'লক্ষ্য পূরণের ভাইব্রেশন',
      vibrationUnsupported: 'এই ব্রাউজার বা ডিভাইসে ভাইব্রেশন সমর্থিত নয় (যেমন iOS Safari বা ডেস্কটপ ব্রাউজার)।',
      testSound: 'শব্দ পরীক্ষা',
      testVibration: 'ভাইব্রেশন পরীক্ষা',
      goalsPresetsSection: 'দৈনিক লক্ষ্য ও প্রিসেট',
      dailyGoalLabel: 'দৈনিক জিকিরের লক্ষ্য',
      customPresetsLabel: 'লক্ষ্য প্রিসেটসমূহ',
      addPresetPlaceholder: 'সংখ্যা লিখুন (যেমন ৫০০)',
      pwaSection: 'ইনস্টল ও অফলাইন অ্যাপ',
      installApp: 'নূর তাসবীহ ইনস্টল করুন',
      installedStatus: 'অ্যাপ হিসেবে ইনস্টল করা আছে',
      offlineReady: 'অফলাইন প্রস্তুত · ইন্টারনেট ছাড়াই চলে',
      androidGuideTitle: 'অ্যান্ড্রয়েডে ইনস্টল (Chrome)',
      androidGuideSteps: [
        'Google Chrome ব্রাউজারে নূর তাসবীহ খুলুন।',
        'উপরের "নূর তাসবীহ ইনস্টল করুন" বাটনে ট্যাপ করুন অথবা Chrome মেনু (⋮) খুলুন।',
        '"Add to Home screen" বা "Install app" নির্বাচন করে নিশ্চিত করুন।',
      ],
      iosGuideTitle: 'আইফোন / আইপ্যাডে ইনস্টল (Safari)',
      iosGuideSteps: [
        'Apple Safari ব্রাউজারে নূর তাসবীহ খুলুন।',
        'নিচের বা উপরের টুলবারে Share আইকনে ট্যাপ করুন।',
        'নিচে স্ক্রল করে "Add to Home Screen"-এ ট্যাপ করুন এবং Add চাপুন।',
      ],
      openGuide: 'ব্যবহার নির্দেশিকা দেখুন',
      privacySection: 'অ্যাপ তথ্য ও গোপনীয়তা',
      privacyPoints: [
        '১০০% ডিভাইসে সংরক্ষণ: আপনার জিকির গণনা, নিজস্ব দুআ ও সেটিংস কখনোই ডিভাইসের বাইরে যায় না।',
        'কোনো লগইন, বিজ্ঞাপন বা ট্র্যাকিং নেই: কোনো অ্যানালিটিক্স বা বাহ্যিক সার্ভারের সাথে সংযোগ নেই।',
        'নির্ভরযোগ্য সূত্র: কুরআন ও হাদিসের তথ্যসূত্র স্পষ্টভাবে উল্লেখিত এবং ঐচ্ছিক সংখ্যাগুলো আলাদাভাবে চিহ্নিত।',
      ],
      versionLabel: 'নূর তাসবীহ অফলাইন PWA',
      dangerSection: 'ডেটা ব্যবস্থাপনা',
      resetAllData: 'সব ডেটা রিসেট করুন',
      resetAllTitle: 'সব কিছু মুছে ফেলবেন?',
      resetAllMessage: 'এতে আপনার সব গণনা, ইতিহাস, নিজস্ব জিকির/দুআ মুছে যাবে এবং অ্যাপটি প্রথম অবস্থায় ফিরে যাবে।',
      resetTypeHint: 'নিশ্চিত করতে RESET লিখুন:',
      resetConfirmWord: 'RESET',
    },
    onboarding: {
      step1Title: 'নূর তাসবীহ-তে স্বাগতম',
      step1Body: 'একটি প্রশান্তিময় ও সম্পূর্ণ অফলাইন ইসলামিক তাসবীহ ও দুআ অ্যাপ, যা ইন্টারনেট ছাড়াই আপনার ফোন ও কম্পিউটারে কাজ করে।',
      step2Title: 'সহজ গণনা ও নামাজের পরের তাসবীহ',
      step2Body: 'কাউন্টারে ট্যাপ করে গণনা করুন, নিজের লক্ষ্য (৩৩, ৯৯, ১০০, ১০০০) ঠিক করুন অথবা নামাজের পরের ৩৩-৩৩-৩৪ তাসবীহ মোড চালু করুন।',
      step3Title: 'সম্পূর্ণ ব্যক্তিগত ও ইনস্টলযোগ্য',
      step3Body: 'আপনার সব তথ্য কেবল আপনার ডিভাইসে থাকে। দ্রুত অফলাইন ব্যবহারের জন্য হোম স্ক্রিনে ইনস্টল করে নিন।',
      getStarted: 'গণনা শুরু করুন',
      skip: 'এড়িয়ে যান',
    },
  },
  ar: {
    appName: 'نور تسبيح',
    tagline: 'رفيق الذكر والدعاء الهادئ',
    nav: {
      counter: 'التسبيح',
      dhikr: 'الأذكار',
      duas: 'القرآن والأدعية',
      stats: 'الإحصاء',
      settings: 'الإعدادات',
    },
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      close: 'إغلاق',
      reset: 'تصفير',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      all: 'الكل',
      favourites: 'المفضلة',
      copy: 'نسخ',
      copied: 'تم النسخ',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      done: 'تم',
      offlineBadge: 'وضع عدم الاتصال · البيانات محفوظة محلياً',
      verifiedSource: 'مرجع موثق',
      customRecommendation: 'عدد اختياري / عام',
      restoreDefault: 'استعادة الافتراضي',
      noResults: 'لا توجد نتائج مطابقة.',
    },
    counter: {
      tapToCount: 'اضغط للتسبيح',
      tapAction: 'اضغط',
      tapSubtitle: 'للتسبيح',
      currentCount: 'العدد',
      target: 'الهدف',
      progress: 'الإنجاز',
      rounds: 'الأشواط',
      dailyProgress: 'الهدف اليومي',
      undo: 'تراجع',
      reset: 'تصفير',
      changeTarget: 'الهدف',
      customTarget: 'هدف مخصص',
      applyTarget: 'تطبيق',
      targetReached: 'اكتمل الهدف',
      continueCounting: 'متابعة',
      newRound: 'شوط جديد',
      wakeLock: 'إبقاء الشاشة مضاءة',
      wakeLockActive: 'الشاشة نشطة',
      wakeLockUnsupported: 'ميزة إبقاء الشاشة غير مدعومة في هذا المتصفح',
      prayerMode: 'تسبيح بعد الصلاة (٣٣-٣٣-٣٤)',
      prayerModeShort: 'بعد الصلاة',
      prayerModeDesc: 'الترتيب المسنون: ٣٣ سبحان الله، ٣٣ الحمد لله، ٣٤ الله أكبر، ثم التهليل.',
      prayerModeComplete: 'اكتمل تسبيح ما بعد الصلاة! تقبل الله ذكرك.',
      exitPrayerMode: 'إنهاء الوضع',
      stepOf: 'الخطوة',
      confirmResetTitle: 'تصفير العداد؟',
      confirmResetMessage: 'سيتم إعادة العداد الحالي إلى ٠. سيبقى مجموعك اليومي والإجمالي محفوظاً.',
      switchDhikr: 'تغيير الذكر',
      keyboardHint: 'تلميح: يمكنك استخدام مفتاح المسافة أو الإدخال للعد',
    },
    dhikr: {
      title: 'مكتبة الأذكار',
      subtitle: 'اختر ذكراً للتسبيح أو أضف ذكرك الخاص.',
      searchPlaceholder: 'ابحث بالعربية أو المعنى...',
      addCustom: 'ذكر جديد',
      editDhikr: 'تعديل الذكر',
      startCounting: 'ابدأ التسبيح',
      recommended: 'الهدف',
      times: 'مرة',
      arabicLabel: 'النص العربي',
      translitEnLabel: 'النطق بالإنجليزية',
      translitBnLabel: 'النطق بالبنغالية',
      meaningEnLabel: 'المعنى بالإنجليزية',
      meaningBnLabel: 'المعنى بالبنغالية',
      sourceLabel: 'المصدر / الدليل',
      countLabel: 'العدد المقترح',
      confirmDeleteTitle: 'حذف الذكر؟',
      confirmDeleteMessage: 'هل أنت متأكد من حذف هذا الذكر المخصص؟',
    },
    duas: {
      title: 'الأدعية المهمة',
      subtitle: 'أدعية مأثورة مصنفة حسب أوقات اليوم. يمكنك تعديل أي دعاء أو إضافة أدعية خاصة.',
      searchPlaceholder: 'ابحث في الأدعية أو المصادر...',
      addCustom: 'دعاء جديد',
      editDua: 'تعديل الدعاء',
      countThisDua: 'العد في المسبحة',
      categoryLabel: 'التصنيف',
      titleEnLabel: 'العنوان (إنجليزي)',
      titleBnLabel: 'العنوان (بنغالي)',
      titleArLabel: 'العنوان (عربي)',
      arabicLabel: 'النص العربي',
      translitEnLabel: 'النطق بالإنجليزية',
      translitBnLabel: 'النطق بالبنغالية',
      translationEnLabel: 'الترجمة بالإنجليزية',
      translationBnLabel: 'الترجمة بالبنغالية',
      sourceLabel: 'المصدر الموثق',
      notesLabel: 'ملاحظات (اختياري)',
      categories: {
        morning: 'أذكار الصباح',
        evening: 'أذكار المساء',
        before_sleep: 'قبل النوم',
        after_waking: 'عند الاستيقاظ',
        before_eating: 'قبل الطعام',
        after_eating: 'بعد الطعام',
        forgiveness: 'الاستغفار',
        protection: 'التحصين والحفظ',
        daily_life: 'الحياة اليومية',
      },
      confirmDeleteTitle: 'حذف الدعاء؟',
      confirmDeleteMessage: 'هل أنت متأكد من حذف هذا الدعاء المخصص؟',
    },
    quranDuas: {
      sectionTitle: 'الآيات القرآنية والأدعية',
      sectionSubtitle: 'آيات قرآنية موثقة وأدعية يومية مختارة مع التفسير والترجمة.',
      tabQuran: 'الآيات القرآنية',
      tabDuas: 'الأدعية المهمة',
      searchPlaceholder: 'ابحث باسم السورة أو الآية أو الترجمة...',
      readPassage: 'قراءة المقطع',
      backToList: 'العودة إلى القائمة',
      verseLabel: 'آية',
      versesCount: 'آيات',
      previousPassage: 'المقطع السابق',
      nextPassage: 'المقطع التالي',
      previousVerse: 'الآية السابقة',
      nextVerse: 'الآية التالية',
      showTransliteration: 'إظهار النطق',
      countInTasbih: 'التسبيح بهذا المقطع',
      groups: {
        surah_hashr: 'سورة الحشر ٥٩:٢٢-٢٤',
        ayatul_kursi: 'آية الكرسي',
        baqarah_end: 'خواتيم البقرة ٢:٢٨٥-٢٨٦',
        baqarah_duas: 'أدعية البقرة',
      },
    },
    stats: {
      title: 'السجل والإحصائيات',
      subtitle: 'جميع بيانات التسبيح محفوظة بخصوصية تامة على جهازك فقط.',
      todayTotal: 'تسبيح اليوم',
      overallTotal: 'المجموع الكلي',
      completedTargets: 'الأهداف المكتملة',
      dailyGoal: 'الهدف اليومي',
      editGoal: 'تعديل الهدف',
      weeklyChartTitle: 'نشاط آخر ٧ أيام',
      topDhikrsTitle: 'الأكثر تسبيحاً',
      sessionHistoryTitle: 'الجلسات الأخيرة',
      clearHistory: 'مسح السجل',
      confirmClearTitle: 'مسح سجل الجلسات؟',
      confirmClearMessage: 'سيؤدي هذا إلى حذف سجل الجلسات الأخيرة، بينما يبقى التصفير الشامل متاحاً في الإعدادات.',
      noHistory: 'لا توجد جلسات مسجلة بعد. ابدأ التسبيح لمتابعة تقدمك.',
      targetHit: 'مكتمل',
      backupTitle: 'النسخ الاحتياطي والاستعادة',
      backupDesc: 'تصدير جميع الأذكار والأدعية والسجل والإعدادات إلى ملف JSON أو استعادتها.',
      exportJson: 'تصدير JSON',
      importJson: 'استيراد JSON',
      importSuccess: 'تمت استعادة النسخة الاحتياطية بنجاح.',
      importError: 'ملف غير صالح. يرجى اختيار ملف نسخ احتياطي صحيح من نور تسبيح.',
    },
    settings: {
      title: 'الإعدادات',
      subtitle: 'تخصيص اللغة والمظهر والصوت والاهتزاز وتثبيت التطبيق.',
      languageSection: 'اللغة والاتجاه',
      languageLabel: 'لغة التطبيق',
      appearanceSection: 'المظهر والألوان',
      darkMode: 'الوضع الداكن',
      themePreset: 'نمط الألوان',
      themes: {
        emerald: 'زمردي',
        midnight: 'ليلي',
        sand: 'رملي',
        rose: 'وردي',
        ocean: 'محيطي',
      },
      customBg: 'لون خلفية مخصص',
      resetBg: 'استعادة خلفية النمط',
      fontSize: 'حجم الخط والنص العربي',
      fontSizes: {
        small: 'صغير',
        medium: 'متوسط',
        large: 'كبير',
        xlarge: 'كبير جداً',
      },
      counterStyle: 'نمط زر التسبيح',
      counterStyles: {
        ring: 'حلقة كلاسيكية',
        pad: 'لوحة لمس',
        minimal: 'بسيط هادئ',
      },
      soundVibrationSection: 'الصوت والاهتزاز',
      clickSound: 'صوت التسبيح',
      soundStyle: 'نوع الصوت',
      soundStyles: {
        wood: 'خرزة خشبية',
        chime: 'رنين ناعم',
        pulse: 'نبضة دافئة',
        tick: 'نقرة خفيفة',
      },
      completionSound: 'صوت اكتمال الهدف',
      vibration: 'الاهتزاز عند الضغط',
      completionVibration: 'اهتزاز اكتمال الهدف',
      vibrationUnsupported: 'الاهتزاز غير مدعوم في هذا المتصفح أو الجهاز (مثل سفاري على آيفون أو متصفحات الحاسوب).',
      testSound: 'تجربة الصوت',
      testVibration: 'تجربة الاهتزاز',
      goalsPresetsSection: 'الهدف اليومي والأهداف السريعة',
      dailyGoalLabel: 'الهدف اليومي للتسبيح',
      customPresetsLabel: 'أهداف سريعة مخصصة',
      addPresetPlaceholder: 'أضف عدداً (مثل ٥٠٠)',
      pwaSection: 'تثبيت التطبيق والعمل دون اتصال',
      installApp: 'تثبيت نور تسبيح',
      installedStatus: 'مثبت كتطبيق مستقل',
      offlineReady: 'جاهز للعمل دون اتصال بالإنترنت',
      androidGuideTitle: 'التثبيت على أندرويد (Chrome)',
      androidGuideSteps: [
        'افتح نور تسبيح في متصفح Google Chrome.',
        'اضغط على زر "تثبيت نور تسبيح" أعلاه أو افتح قائمة Chrome (⋮).',
        'اختر "الإضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق" ثم أكد.',
      ],
      iosGuideTitle: 'التثبيت على آيفون وآيباد (Safari)',
      iosGuideSteps: [
        'افتح نور تسبيح في متصفح Safari.',
        'اضغط على أيقونة المشاركة في شريط الأدوات.',
        'مرر للأسفل واختر "إضافة إلى الصفحة الرئيسية" ثم اضغط إضافة.',
      ],
      openGuide: 'عرض دليل الترحيب',
      privacySection: 'معلومات التطبيق والخصوصية',
      privacyPoints: [
        'تخزين محلي ١٠٠٪: أذكارك وإحصائياتك وإعداداتك تبقى على جهازك فقط.',
        'بدون تسجيل دخول أو إعلانات أو تتبع: لا توجد خوادم خارجية ولا تحليلات.',
        'توثيق المصادر: الآيات والأحاديث موثقة بوضوح، والأعداد غير المقيدة بنص مميزة كأهداف اختيارية.',
      ],
      versionLabel: 'نور تسبيح · تطبيق ويب تقدمي دون اتصال',
      dangerSection: 'إدارة البيانات',
      resetAllData: 'إعادة ضبط جميع البيانات',
      resetAllTitle: 'مسح جميع البيانات؟',
      resetAllMessage: 'سيؤدي هذا إلى حذف جميع الأعداد والسجلات والأذكار المخصصة واستعادة الإعدادات الافتراضية.',
      resetTypeHint: 'اكتب RESET للتأكيد:',
      resetConfirmWord: 'RESET',
    },
    onboarding: {
      step1Title: 'مرحباً بك في نور تسبيح',
      step1Body: 'تطبيق إسلامي هادئ للتسبيح والأدعية، مصمم للعمل بسلاسة دون اتصال بالإنترنت على هاتفك وحاسوبك.',
      step2Title: 'تسبيح مريح ووضع ما بعد الصلاة',
      step2Body: 'اضغط في أي مكان على مساحة العد، اختر أهدافك (٣٣، ٩٩، ١٠٠، ١٠٠٠)، أو فعّل تسبيح ما بعد الصلاة (٣٣-٣٣-٣٤).',
      step3Title: 'خصوصية تامة وتثبيت مباشر',
      step3Body: 'تبقى بياناتك على جهازك فقط. ثبّت نور تسبيح على شاشتك الرئيسية للوصول الفوري في أي وقت.',
      getStarted: 'ابدأ التسبيح',
      skip: 'تخطي',
    },
  },
};
