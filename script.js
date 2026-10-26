// ============================================
// SMART IRON MONITORING SYSTEM - JAVASCRIPT (Frontend)
// SMART IRON MONITORING SYSTEM - JAVASCRIPT
// ============================================

// ============================================
// 1. GLOBAL STATE & CONFIG
// ============================================

const app = {
    isLoggedIn: false,
    currentUser: null,
    charts: {},
    dataUpdateInterval: null,
    isPolling: false,
    prevStatus: null,
    sensorData: {
        temperature: 28, // Initial dummy data
        humidity: 65,
        status: 'Safe'
    },
    thresholds: {
        risk: 70,
        danger: 85
    },
    alerts: [
        { id: 1, type: 'info', title: 'System Active', message: 'Real-time monitoring is running smoothly' }
    ],
    dataHistory: [],
    settings: {
        updateFrequency: 5,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true
    },
    idToken: null // Store Firebase ID token
};

const translations = {
    en: {
        pageTitleLogin: 'Smart Iron Guarding System - Login',
        pageTitleSignup: 'Smart Iron Guarding System - Signup',
        pageTitleDashboard: 'Smart Iron Guarding System - Dashboard',
        brandTitle: 'Smart Iron Guard',
        brandSubtitle: 'Real-time monitoring system for industrial safety',
        loginWelcome: 'Welcome Back',
        loginSubtitle: 'Sign in to your account',
        loginFieldLabel: 'Email or Username',
        loginFieldPlaceholder: 'Enter your email or username',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        demoCredentials: 'Demo Credentials:',
        demoUsername: 'Username: admin',
        demoPassword: 'Password: password123',
        featureTemperature: 'Real-time Temperature Tracking',
        featureHumidity: 'Humidity Monitoring',
        featureAlerts: 'Safety Status Alerts',
        featureAnalytics: 'Data Analytics & Reports',
        noAccount: 'Don\'t have an account?',
        signUpLink: 'Create an account',
        footer: '© 2026 Smart Iron Guarding System. All rights reserved.',
        loadingAuthenticating: 'Authenticating...',
        signupTitle: 'Create Account',
        signupSubtitle: 'Register to access live monitoring',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Choose a username',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email address',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        signUp: 'Sign Up',
        haveAccount: 'Already have an account?',
        signInLink: 'Login',
        loginError: 'Invalid username/email or password.',
        passwordMismatch: 'Passwords do not match.',
        passwordWeak: 'Password must be at least 8 characters.',
        userExistsError: 'Email already in use.',
        signupSuccess: 'Signup successful! Redirecting...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        dashboard: 'Dashboard',
        liveData: 'Live Data',
        graphs: 'Graphs',
        history: 'History',
        alerts: 'Alerts',
        settings: 'Settings',
        realTimeMonitoring: 'Real-time Monitoring',
        lastUpdated: 'Last updated:',
        activeAlerts: 'Active Alerts',
        clearAll: 'Clear All',
        systemActive: 'System Active',
        realTimeRunning: 'Real-time monitoring is running smoothly',
        liveDataStream: 'Live Data Stream',
        temperature: 'Temperature',
        humidity: 'Humidity',
        ironStatus: 'Iron Status',
        optimalRange: 'Optimal Range',
        normal: 'Normal',
        safe: 'Safe',
        risk: 'Risk',
        danger: 'Danger',
        currentLabel: 'Current:',
        minLabel: 'Min (24h):',
        maxLabel: 'Max (24h):',
        avgLabel: 'Avg (24h):',
        timestamp: 'Timestamp',
        status: 'Status',
        notes: 'Notes',
        normalOperation: 'Normal operation',
        humidityRising: 'Humidity increasing',
        criticalHumidity: 'Critical humidity!',
        allSystemsNominal: 'All systems nominal',
        riskDescription: 'Humidity rising - Risk of rust approaching',
        dangerDescription: 'Critical humidity level - Risk of rust damage!',
        analyticsTrends: 'Analytics & Trends',
        temperatureOverTime: 'Temperature Over Time',
        humidityOverTime: 'Humidity Over Time',
        downloadCSV: 'Download CSV',
        alertsNotifications: 'Alerts & Notifications',
        all: 'All',
        info: 'Info',
        warning: 'Warning',
        danger: 'Danger',
        settingsConfiguration: 'Settings & Configuration',
        alertThresholds: 'Alert Thresholds',
        humidityRiskLevel: 'Humidity Risk Level (%)',
        humidityDangerLevel: 'Humidity Danger Level (%)',
        notifications: 'Notifications',
        emailNotifications: 'Email Notifications',
        smsNotifications: 'SMS Notifications',
        pushNotifications: 'Push Notifications',
        systemPreferences: 'System Preferences',
        dataUpdateFrequency: 'Data Update Frequency',
        dataEncryption: 'Data Encryption (Always On)',
        saveSettings: 'Save Settings',
        freq1: 'Every 1 second',
        freq5: 'Every 5 seconds',
        freq10: 'Every 10 seconds',
        freq30: 'Every 30 seconds',
        downloadSuccess: 'Data downloaded successfully!',
        noDataToDownload: 'No data to download',
        saveSettingsSuccess: 'Settings saved successfully!',
        clearAlertsSuccess: 'Alerts cleared',
        firebaseNotConfigured: 'Firebase is not configured. Demo mode is active.',
        connectedStatus: 'Connected',
        disconnectedStatus: 'Offline',
        loading: 'Loading...'
    },
    ar: {
        pageTitleLogin: 'نظام مراقبة الحديد الذكي - تسجيل الدخول',
        pageTitleSignup: 'نظام مراقبة الحديد الذكي - تسجيل',
        pageTitleDashboard: 'نظام مراقبة الحديد الذكي - لوحة التحكم',
        brandTitle: 'المراقب الذكي للحديد',
        brandSubtitle: 'نظام مراقبة لحظي للسلامة الصناعية',
        loginWelcome: 'مرحبًا بعودتك',
        loginSubtitle: 'سجل دخولك إلى حسابك',
        loginFieldLabel: 'البريد الإلكتروني أو اسم المستخدم',
        loginFieldPlaceholder: 'أدخل بريدك أو اسم المستخدم',
        passwordLabel: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'نسيت كلمة المرور؟',
        signIn: 'تسجيل الدخول',
        demoCredentials: 'بيانات العرض التوضيحي:',
        demoUsername: 'اسم المستخدم: admin',
        demoPassword: 'كلمة المرور: password123',
        featureTemperature: 'تتبع درجة الحرارة في الوقت الحقيقي',
        featureHumidity: 'مراقبة الرطوبة',
        featureAlerts: 'تنبيهات حالة الأمان',
        featureAnalytics: 'تحليلات البيانات والتقارير',
        noAccount: 'ليس لديك حساب؟',
        signUpLink: 'إنشاء حساب',
        footer: '© 2026 نظام مراقبة الحديد الذكي. كل الحقوق محفوظة.',
        loadingAuthenticating: 'جاري التحقق...',
        signupTitle: 'إنشاء حساب',
        signupSubtitle: 'سجل للوصول إلى المراقبة الحية',
        usernameLabel: 'اسم المستخدم',
        usernamePlaceholder: 'اختر اسم مستخدم',
        emailLabel: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        confirmPasswordPlaceholder: 'أكد كلمة المرور',
        signUp: 'تسجيل',
        haveAccount: 'هل لديك حساب؟',
        signInLink: 'تسجيل الدخول',
        loginError: 'البريد الإلكتروني/اسم المستخدم أو كلمة المرور غير صحيحة.',
        passwordMismatch: 'كلمتا المرور غير متطابقتين.',
        passwordWeak: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
        userExistsError: 'البريد الإلكتروني مستخدم بالفعل.',
        signupSuccess: 'تم التسجيل بنجاح! جاري التحويل...',
        connected: 'متصل',
        disconnected: 'غير متصل',
        dashboard: 'لوحة التحكم',
        liveData: 'البيانات الحية',
        graphs: 'الرسوم البيانية',
        history: 'السجل',
        alerts: 'التنبيهات',
        settings: 'الإعدادات',
        realTimeMonitoring: 'المراقبة اللحظية',
        lastUpdated: 'آخر تحديث:',
        activeAlerts: 'التنبيهات النشطة',
        clearAll: 'مسح الكل',
        systemActive: 'النظام نشط',
        realTimeRunning: 'المراقبة اللحظية تعمل بسلاسة',
        liveDataStream: 'تدفق البيانات الحية',
        temperature: 'درجة الحرارة',
        humidity: 'الرطوبة',
        ironStatus: 'حالة الحديد',
        optimalRange: 'النطاق المثالي',
        normal: 'طبيعي',
        safe: 'آمن',
        risk: 'مخاطر',
        danger: 'خطر',
        currentLabel: 'الوقت الحالي:',
        minLabel: 'الحد الأدنى (24 ساعة):',
        maxLabel: 'الحد الأقصى (24 ساعة):',
        avgLabel: 'المتوسط (24 ساعة):',
        timestamp: 'الوقت',
        status: 'الحالة',
        notes: 'ملاحظات',
        normalOperation: 'تشغيل طبيعي',
        humidityRising: 'الرطوبة في تزايد',
        criticalHumidity: 'رطوبة حرجة!',
        allSystemsNominal: 'جميع الأنظمة طبيعية',
        riskDescription: 'الرطوبة في تزايد - خطر الصدأ يقترب',
        dangerDescription: 'مستوى رطوبة خطير - خطر تعرض الصدأ!',
        analyticsTrends: 'تحليلات واتجاهات',
        temperatureOverTime: 'درجة الحرارة مع الزمن',
        humidityOverTime: 'الرطوبة مع الزمن',
        downloadCSV: 'تنزيل CSV',
        alertsNotifications: 'التنبيهات والإشعارات',
        all: 'الكل',
        info: 'معلومات',
        warning: 'تحذير',
        danger: 'خطر',
        settingsConfiguration: 'الإعدادات والتكوين',
        alertThresholds: 'عتبات التنبيه',
        humidityRiskLevel: 'مستوى خطر الرطوبة (%)',
        humidityDangerLevel: 'مستوى خطورة الرطوبة (%)',
        notifications: 'الإشعارات',
        emailNotifications: 'إشعارات البريد الإلكتروني',
        smsNotifications: 'إشعارات الرسائل',
        pushNotifications: 'إشعارات دفع',
        systemPreferences: 'تفضيلات النظام',
        dataUpdateFrequency: 'تكرار تحديث البيانات',
        dataEncryption: 'تشفير البيانات (ممكّن دائمًا)',
        saveSettings: 'حفظ الإعدادات',
        freq1: 'كل ثانية',
        freq5: 'كل 5 ثوانٍ',
        freq10: 'كل 10 ثوانٍ',
        freq30: 'كل 30 ثانية',
        downloadSuccess: 'تم تنزيل البيانات بنجاح!',
        noDataToDownload: 'لا توجد بيانات للتنزيل',
        saveSettingsSuccess: 'تم حفظ الإعدادات بنجاح!',
        clearAlertsSuccess: 'تم مسح التنبيهات',
        firebaseNotConfigured: 'لم يتم إعداد Firebase. وضع العرض التوضيحي نشط.',
        connectedStatus: 'متصل',
        disconnectedStatus: 'غير متصل',
        loading: 'جارٍ التحميل...'
    }
};

let currentLanguage = loadFromLocalStorage('language', 'en') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    saveToLocalStorage('language', lang);
    applyTranslations(lang);
    updateLanguageButtons(lang);
}

function getTranslation(key) {
    return translations[currentLanguage] && translations[currentLanguage][key]
        ? translations[currentLanguage][key]
        : key;
}

function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const value = translations[lang][key];
        if (!value) return;
        if (element.tagName.toLowerCase() === 'input') {
            element.value = value;
        } else {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = translations[lang][key];
        if (value) {
            element.placeholder = value;
        }
    });

    if (document.body.classList.contains('signup-page')) {
        document.title = translations[lang].pageTitleSignup;
    } else if (document.body.classList.contains('login-page')) {
        document.title = translations[lang].pageTitleLogin;
    } else {
        document.title = translations[lang].pageTitleDashboard;
    }
}

function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-toggle').forEach((button) => {
        button.textContent = lang === 'ar' ? 'AR | EN' : 'EN | AR';
    });
}

function initLanguageSwitcher() {
    document.querySelectorAll('.lang-toggle').forEach((button) => {
        button.addEventListener('click', () => {
            const nextLang = currentLanguage === 'en' ? 'ar' : 'en';
            setLanguage(nextLang);
        });
    });
}

function setConnectionState(connected) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    if (statusDot) {
        statusDot.classList.toggle('connected', connected);
        statusDot.classList.toggle('disconnected', !connected);
    }
    if (statusText) {
        statusText.textContent = connected
            ? translations[currentLanguage].connectedStatus
            : translations[currentLanguage].disconnectedStatus;
    }
}

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

/**
 * Generate random data within a range
 */
function generateRandomData(min, max, decimal = 0) {
    const value = Math.random() * (max - min) + min;
    return decimal > 0 ? parseFloat(value.toFixed(decimal)) : Math.round(value);
}

/**
 * Format date/time
 */
function formatDateTime(date = new Date()) {
    const pad = (n) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get relative time string
 */
function getRelativeTime() {
    return 'just now';
}

/**
 * Save data to localStorage
 */
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Load data from localStorage
 */
function loadFromLocalStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${iconMap[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Animate counter
 */
function animateCounter(element, targetValue, duration = 1000) {
    const startValue = parseFloat(element.textContent) || 0;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (targetValue - startValue) * progress;

        if (element.textContent.includes('°')) {
            element.textContent = Math.round(currentValue) + '°C';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.round(currentValue) + '%';
        } else {
            element.textContent = Math.round(currentValue);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

// ============================================
// 3. LOGIN PAGE LOGIC
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('errorAlert');

    setLanguage(currentLanguage);
    initLanguageSwitcher();

    if (!window.firebaseEnabled) {
        showToast(getTranslation('firebaseNotConfigured'), 'warning');
    }

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.innerHTML = isPassword 
                ? '<i class="fas fa-eye-slash"></i>' 
                : '<i class="fas fa-eye"></i>';
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    function handleLogin() {
        const identifier = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear errors
        document.getElementById('usernameError').classList.remove('show');
        document.getElementById('passwordError').classList.remove('show');
        errorAlert.classList.remove('show');

        // Validation
        let isValid = true;

        if (!identifier) {
            document.getElementById('usernameError').textContent = 'This field is required';
            document.getElementById('usernameError').classList.add('show');
            isValid = false;
        }

        if (!password) {
            document.getElementById('passwordError').textContent = 'This field is required';
            document.getElementById('passwordError').classList.add('show');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        loadingSpinner.classList.add('show');
        loginBtn.disabled = true;

        const completeLogin = (userProfile) => {
            app.isLoggedIn = true;
            app.currentUser = userProfile.username || userProfile.email;
            saveToLocalStorage('user', {
                idToken: userProfile.idToken, // Save the ID token
                username: userProfile.username || userProfile.email,
                email: userProfile.email || '',
                uid: userProfile.uid || '',
                loginTime: new Date()
            });
            loadingSpinner.classList.remove('show');
            window.location.href = 'dashboard.html';
        };

        const handleError = (error) => {
            loadingSpinner.classList.remove('show');
            loginBtn.disabled = false;
            errorAlert.textContent = getAuthErrorMessage(error);
            errorAlert.classList.add('show');
        };

        if (window.firebaseEnabled && window.firebaseAuth && window.firebaseDatabase) {
            // Firebase client-side login
            const auth = window.firebaseAuth;
            const loginPromise = identifier.includes('@')
                ? auth.signInWithEmailAndPassword(identifier, password)
                : getEmailForUsername(identifier).then(email => auth.signInWithEmailAndPassword(email, password));

            loginPromise
                .then((credential) => {
                    return credential.user.getIdToken().then(idToken => {
                        app.idToken = idToken; // Store ID token globally
                        saveToLocalStorage('idToken', idToken); // Save ID token to local storage
                        return fetchUserProfileByEmail(credential.user.email).then(profile => {
                            profile.idToken = idToken; // Attach token to profile
                            return profile;
                        });
                    });
                })
                .catch(handleError);
        } else {
            setTimeout(() => {
                if ((identifier === 'admin' || identifier.toLowerCase() === 'admin') && password === 'password123') {
                    // For demo mode, generate a dummy token or skip token handling
                    completeLogin({ username: 'admin', email: 'admin@example.com', idToken: 'demo-token' });
                } else {
                    handleError({ code: 'auth/wrong-password', message: getTranslation('loginError') });
                }
            }, 800);
        }
    }

    function getEmailForUsername(username) {
        const db = window.firebaseDatabase;
        return db.ref('users').orderByChild('username').equalTo(username).once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    return Promise.reject({ code: 'auth/user-not-found' });
                }
                const firstUser = Object.values(data)[0];
                return firstUser.email;
            });
    }

    function fetchUserProfileByEmail(email) {
        const db = window.firebaseDatabase;
        return db.ref('users').orderByChild('email').equalTo(email).once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    return { username: email.split('@')[0], email };
                }
                const profile = Object.values(data)[0];
                return { username: profile.username || email.split('@')[0], email };
            });
    }

    function getAuthErrorMessage(error) {
        const code = error.code || '';
        if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-email') {
            return getTranslation('loginError');
        }
        if (code === 'auth/user-disabled') {
            return 'This account has been disabled.';
        }
        if (code === 'auth/too-many-requests') {
            return 'Too many attempts. Please try again later.';
        }
        return error.message || getTranslation('loginError');
    }
}

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('signupUsername');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    const signupBtn = document.getElementById('signupBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('signupError');

    setLanguage(currentLanguage);
    initLanguageSwitcher();

    if (!window.firebaseEnabled) {
        showToast(getTranslation('firebaseNotConfigured'), 'warning');
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignup();
        });
    }

    function handleSignup() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();

        usernameInput.classList.remove('error');
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        confirmInput.classList.remove('error');
        errorAlert.classList.remove('show');

        let isValid = true;

        if (!username) {
            document.getElementById('signupUsernameError').textContent = 'Username is required';
            document.getElementById('signupUsernameError').classList.add('show');
            usernameInput.classList.add('error');
            isValid = false;
        }
        if (!email) {
            document.getElementById('signupEmailError').textContent = 'Email is required';
            document.getElementById('signupEmailError').classList.add('show');
            emailInput.classList.add('error');
            isValid = false;
        }
        if (!password || password.length < 8) {
            document.getElementById('signupPasswordError').textContent = getTranslation('passwordWeak');
            document.getElementById('signupPasswordError').classList.add('show');
            passwordInput.classList.add('error');
            isValid = false;
        }
        if (password !== confirmPassword) {
            document.getElementById('signupConfirmPasswordError').textContent = getTranslation('passwordMismatch');
            document.getElementById('signupConfirmPasswordError').classList.add('show');
            confirmInput.classList.add('error');
            isValid = false;
        }
        if (!isValid) return;

        loadingSpinner.classList.add('show');
        signupBtn.disabled = true;

        const completeSignup = (profile) => {
            saveToLocalStorage('user', {
                username: profile.username,
                email: profile.email,
                uid: profile.uid || '',
                loginTime: new Date()
            });
            showToast(getTranslation('signupSuccess'), 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1100);
        };

        const handleError = (error) => {
            loadingSpinner.classList.remove('show');
            signupBtn.disabled = false;
            const message = error.code === 'auth/email-already-in-use'
                ? getTranslation('userExistsError')
                : error.message || 'Signup failed';
            errorAlert.textContent = message;
            errorAlert.classList.add('show');
        };

        if (window.firebaseEnabled && window.firebaseAuth && window.firebaseDatabase) {
            window.firebaseAuth.createUserWithEmailAndPassword(email, password)
                .then((credential) => saveUserProfile(credential.user.uid, username, email)
                    .then(() => {
                        loadingSpinner.classList.remove('show');
                        signupBtn.disabled = false;
                        completeSignup({ username, email, uid: credential.user.uid });
                    }))
                .catch(handleError);
        } else {
            setTimeout(() => {
                loadingSpinner.classList.remove('show');
                signupBtn.disabled = false;
                completeSignup({ username, email, uid: 'local-demo' });
            }, 800);
        }
    }

    function saveUserProfile(uid, username, email) {
        return window.firebaseDatabase.ref(`users/${uid}`).set({ username, email });
    }
}

// ============================================
// 4. DASHBOARD - INITIALIZATION
// ============================================

function initDashboard() {

    setLanguage(currentLanguage);
    initLanguageSwitcher();

    const savedUser = loadFromLocalStorage('user');

    // IMPORTANT: preserve existing login logic, but dashboard data must come from Flask.
    if (window.firebaseEnabled && window.firebaseAuth) {
        app.idToken = loadFromLocalStorage('idToken'); // Load ID token on dashboard init
        window.firebaseAuth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = 'index.html';
                return;
            }

            const profileUsername = savedUser?.username || user.email.split('@')[0];
            app.currentUser = profileUsername;
            app.idToken = app.idToken || savedUser?.idToken; // Ensure token is set
            document.getElementById('userName').textContent = profileUsername.charAt(0).toUpperCase() + profileUsername.slice(1);

            initializeDashboardComponents();
            // Do not depend on Firebase for sensor values.
            syncFirebaseConnection();
        });
    } else {
        if (!savedUser) {
            window.location.href = 'index.html';
            return;
        }

        app.currentUser = savedUser.username || savedUser.email;
        app.idToken = savedUser?.idToken; // Load ID token for demo mode
        document.getElementById('userName').textContent = app.currentUser.charAt(0).toUpperCase() + app.currentUser.slice(1);
        initializeDashboardComponents();
        setConnectionState(false);
    }
}


function initializeDashboardComponents() {
    // Load saved settings
    const savedSettings = loadFromLocalStorage('settings', app.settings);
    app.settings = savedSettings;
    app.thresholds = loadFromLocalStorage('thresholds', app.thresholds);

    // Initialize dashboard components
    initNavigation();
    initThemeToggle();
    initLogout();
    // IMPORTANT: remove simulation as the data source.
    // We keep initDataSimulation() to preserve existing UI timing hooks,
    // but it will be repurposed to start real polling.
    initDataSimulation();
    initCharts();
    initSettings();
    initEventListeners();

    // Load initial data from backend
    // (real values + real history)
    fetchCurrentDataFromBackend();
    fetchHistoryFromBackend();
}


function syncFirebaseCurrentData() {
    const db = window.firebaseDatabase;
    if (!db) return;

    const currentRef = db.ref('current');
    currentRef.on('value', (snapshot) => {
        const currentValue = snapshot.val();
        if (currentValue && currentValue.timestamp) { // Ensure it's a complete reading
            app.sensorData.temperature = currentValue.temperature;
            app.sensorData.humidity = currentValue.humidity;
            app.sensorData.status = currentValue.status || app.sensorData.status;
            updateDashboardData();
        }
    });
}

function syncFirebaseConnection() {
    const db = window.firebaseDatabase;
    if (!db) return;

    const connectionRef = db.ref('.info/connected');
    connectionRef.on('value', (snapshot) => {
        setConnectionState(!!snapshot.val());
    });
}

// New function to fetch current data from Flask backend
async function fetchCurrentDataFromBackend() {
    if (!app.idToken) return;
    try {
        const response = await fetch('/api/sensor', {
            headers: {
                'Authorization': `Bearer ${app.idToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            app.sensorData.temperature = data.temperature;
            app.sensorData.humidity = data.humidity;
            app.sensorData.status = data.status;
            updateDashboardData();
        } else {
            console.error('Failed to fetch current data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching current data:', error);
    }
}

// New function to fetch history from Flask backend (for real charts/table)
async function fetchHistoryFromBackend() {
    await loadHistoryFromBackend();
}


// ============================================
// 5. NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get section id
            const sectionId = item.getAttribute('data-section');

            // Update section title
            updateSectionTitle(sectionId);

            // Show active section
            showSection(sectionId);

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Toggle sidebar
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && (!toggleSidebarBtn || !toggleSidebarBtn.contains(e.target))) {
            sidebar.classList.remove('active');
        }
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

function updateSectionTitle(sectionId) {
    const titles = {
        'dashboard': getTranslation('dashboard'),
        'live-data': getTranslation('liveData'),
        'graphs': getTranslation('graphs'),
        'history': getTranslation('history'),
        'alerts': getTranslation('alerts'),
        'settings': getTranslation('settings')
    };

    const subtitles = {
        'dashboard': getTranslation('realTimeMonitoring'),
        'live-data': getTranslation('liveDataStream'),
        'graphs': getTranslation('analyticsTrends'),
        'history': getTranslation('historyData'),
        'alerts': getTranslation('alertsNotifications'),
        'settings': getTranslation('settingsConfiguration')
    };

    document.getElementById('sectionTitle').textContent = titles[sectionId] || getTranslation('dashboard');
    document.getElementById('sectionSubtitle').textContent = subtitles[sectionId] || '';
}

// ============================================
// 6. THEME TOGGLE (DARK MODE)
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = loadFromLocalStorage('theme', 'light');

    // Apply saved theme
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        saveToLocalStorage('theme', newTheme);

        themeToggle.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        });
    }
}

// ============================================
// 7. LOGOUT
// ============================================

function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (window.firebaseEnabled && window.firebaseAuth) await window.firebaseAuth.signOut();
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
}

// ============================================
// 8. DATA SIMULATION & UPDATES
// ============================================

function initDataSimulation() {
    // Preserve existing function name, but repurpose it to start real polling.
    // Initial fetch
    pollSensorAndUpdateUI();

    // Start continuous update (polling)
    startDataUpdateInterval();
}

function startDataUpdateInterval() {
    if (app.dataUpdateInterval) {
        clearInterval(app.dataUpdateInterval);
        app.dataUpdateInterval = null;
    }

    // Use configured frequency (in seconds) falling back to 1 second
    const freqSec = (app.settings && app.settings.updateFrequency) ? app.settings.updateFrequency : 1;
    const updateFrequencyMs = Math.max(500, parseInt(freqSec, 10) * 1000);

    app.dataUpdateInterval = setInterval(pollSensorAndUpdateUI, updateFrequencyMs);
}

async function pollSensorAndUpdateUI() {
    // Prevent overlapping polls
    if (app.isPolling) return;
    app.isPolling = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const headers = {};
        if (app.idToken) headers['Authorization'] = `Bearer ${app.idToken}`;

        const response = await fetch('/api/sensor', { signal: controller.signal, headers });

        if (!response.ok) throw new Error(response.statusText || `Status ${response.status}`);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('Invalid JSON from /api/sensor');
        }

        // Capture previous status for change detection
        const previousStatus = app.sensorData.status;

        // Update dashboard state from real backend data
        app.sensorData.temperature = data.temperature;
        app.sensorData.humidity = data.humidity;
        app.sensorData.status = data.status || app.sensorData.status;

        // Connection is alive
        setConnectionState(true);

        // Update cards and status badge
        updateDashboardData();

        // Update alerts (derived from real sensor values; no fake alerts)
        checkAndAddAlerts(previousStatus);

        // Append to local history for charts (keep local history capped)
        const reading = {
            timestamp: formatDateTime(),
            temperature: app.sensorData.temperature,
            humidity: app.sensorData.humidity,
            status: app.sensorData.status
        };
        const last = app.dataHistory[app.dataHistory.length - 1];
        if (!last || last.temperature !== reading.temperature || last.humidity !== reading.humidity) {
            app.dataHistory.push(reading);
            // Cap local history to prevent memory growth
            if (app.dataHistory.length > 1000) app.dataHistory.shift();
            // Update charts/display if charts are initialized
            if (app.charts && (app.charts.temperature || app.charts.humidity)) {
                updateChartsFromHistory();
            }
            updateHistoryDisplay();
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Sensor poll aborted due to timeout');
        } else {
            console.error('Failed to poll /api/sensor:', error);
        }
        setConnectionState(false);
    } finally {
        clearTimeout(timeout);
        app.isPolling = false;
    }
}

// pushReadingToFirebase preserved (not used in new workflow)
function pushReadingToFirebase() {
    // Intentionally left as-is to preserve existing code structure.
}


function updateDashboardData() {

    // Update temperature
    const tempValue = document.getElementById('tempValue');
    const liveTemp = document.getElementById('liveTemp');
    const liveTempCurrent = document.getElementById('liveTempCurrent');
    
    if (tempValue) {
        animateCounter(tempValue, app.sensorData.temperature, 500);
    }
    if (liveTemp) {
        liveTemp.textContent = `${app.sensorData.temperature}°C`;
    }
    if (liveTempCurrent) {
        liveTempCurrent.textContent = Math.round(app.sensorData.temperature);
    }

    // Update humidity
    const humidityValue = document.getElementById('humidityValue');
    const liveHumidity = document.getElementById('liveHumidity');
    const liveHumidityCurrent = document.getElementById('liveHumidityCurrent');
    
    if (humidityValue) {
        animateCounter(humidityValue, app.sensorData.humidity, 500);
    }
    if (liveHumidity) {
        liveHumidity.textContent = `${app.sensorData.humidity}%`;
    }
    if (liveHumidityCurrent) {
        liveHumidityCurrent.textContent = Math.round(app.sensorData.humidity);
    }

    // Update status
    updateStatusDisplay();

    // Update last update time
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        lastUpdate.textContent = getRelativeTime();
    }
}

function updateStatusDisplay() {
    const statusLabel = document.getElementById('statusLabel');
    const statusBadge = document.getElementById('statusBadge');
    const statusDescription = document.getElementById('statusDescription');

    let status = app.sensorData.status;
    let icon = '<i class="fas fa-check-circle"></i>';
    let description = getTranslation('allSystemsNominal');

    if (status === 'Danger') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
        description = getTranslation('dangerDescription');
    } else if (status === 'Risk') {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        description = getTranslation('riskDescription');
    }

    if (statusLabel) statusLabel.textContent = getTranslation(status.toLowerCase()) || status;
    if (statusBadge) {
        statusBadge.className = `status-badge ${status.toLowerCase()}`;
        statusBadge.innerHTML = `${icon} <span>${getTranslation(status.toLowerCase()) || status}</span>`;
    }
    if (statusDescription) statusDescription.textContent = description;
}

// ============================================
// 9. ALERTS SYSTEM
// ============================================

function checkAndAddAlerts(previousStatus) {
    // Alerts are derived only from real sensor values or status transitions.
    // Keep the persistent system-active alert (id === 1) and replace risk/danger based on current readings.

    const humidity = Number(app.sensorData.humidity) || 0;
    const temperature = Number(app.sensorData.temperature) || 0;
    const riskThreshold = Number(app.thresholds.risk) || 0;
    const dangerThreshold = Number(app.thresholds.danger) || 0;

    // Start fresh with persistent alert only
    app.alerts = app.alerts.filter(a => a.id === 1);

    // Determine current severity
    const isDanger = app.sensorData.status === 'Danger' || humidity > dangerThreshold || temperature > dangerThreshold;
    const isRisk = !isDanger && (app.sensorData.status === 'Risk' || humidity > riskThreshold || temperature > riskThreshold);

    if (isDanger) {
        if (!app.alerts.some(a => a.id === 'danger')) {
            app.alerts.push({
                id: 'danger',
                type: 'danger',
                title: getTranslation('criticalHumidity'),
                message: getTranslation('dangerDescription')
            });
        }
    } else if (isRisk) {
        if (!app.alerts.some(a => a.id === 'risk')) {
            app.alerts.push({
                id: 'risk',
                type: 'warning',
                title: getTranslation('humidityRising'),
                message: getTranslation('riskDescription')
            });
        }
    }

    // If there was a status transition from SAFE to DANGER ensure an alert is present
    if (previousStatus && previousStatus !== 'Danger' && app.sensorData.status === 'Danger') {
        if (!app.alerts.some(a => a.id === 'danger')) {
            app.alerts.push({
                id: 'danger',
                type: 'danger',
                title: getTranslation('criticalHumidity'),
                message: getTranslation('dangerDescription')
            });
        }
    }

    updateAlertsDisplay();
}


// Alerts are derived from real sensor values (no backend alerts API)
async function fetchAlertsFromBackend() {
    // Preserve function existence, but avoid hitting non-existent endpoints.
    app.alerts = app.alerts.filter(a => a.id === 1);
    updateAlertsDisplay();
}


function updateAlertsDisplay() {
    const alertsList = document.getElementById('alertsList');
    const alertsFullList = document.getElementById('alertsFullList');
    const alertBadge = document.getElementById('alertBadge');

    if (alertBadge) {
        alertBadge.textContent = app.alerts.length;
    }

    // Update main alerts list
    if (alertsList) {
        alertsList.innerHTML = [...app.alerts].slice(-3).reverse().map(alert => `
            <div class="alert-item ${alert.type}-alert">
                <i class="fas fa-${alert.type === 'danger' ? 'exclamation-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <div class="alert-content">
                    <p class="alert-title">${alert.title}</p>
                    <p class="alert-message">${alert.message}</p>
                </div>
                <span class="alert-time">Now</span>
            </div>
        `).join('');
    }

    // Update full alerts list
    if (alertsFullList) {
        alertsFullList.innerHTML = [...app.alerts].slice().reverse().map(alert => `
            <div class="alert-item ${alert.type}-alert">
                <i class="fas fa-${alert.type === 'danger' ? 'exclamation-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <div class="alert-content">
                    <p class="alert-title">${alert.title}</p>
                    <p class="alert-message">${alert.message}</p>
                </div>
                <span class="alert-time">Now</span>
            </div>
        `).join('');
    }
}

function clearAlerts() {

    // Requirement: Clear History via DELETE /api/history.
    // The current UI button is labeled/placed under Alerts; we reuse it to clear history.
    // Preserve existing alert clearing visuals by keeping only the persistent System Active item.
    app.alerts = app.alerts.filter(a => a.id === 1);
    updateAlertsDisplay();

    fetch('/api/history', {
        method: 'DELETE',
        headers: Object.assign({ 'Content-Type': 'application/json' }, app.idToken ? { 'Authorization': `Bearer ${app.idToken}` } : {})
    })
        .then(async (response) => {
            if (!response.ok) throw new Error(response.statusText);
            await loadHistoryFromBackend();
            showToast(getTranslation('clearAlertsSuccess'), 'success');
        })
        .catch((error) => {
            console.error('Failed to clear history:', error);
            showToast(getTranslation('noDataToDownload') || 'Failed to clear history', 'warning');
        });
}


// ============================================
// 10. HISTORY SYSTEM
// ============================================

async function loadHistoryFromBackend() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const headers = {};
        if (app.idToken) headers['Authorization'] = `Bearer ${app.idToken}`;

        const response = await fetch('/api/history', { signal: controller.signal, headers });
        if (!response.ok) throw new Error(response.statusText || `Status ${response.status}`);
        const history = await response.json();

        // Ensure chronological order for charts/table logic (older -> newer)
        app.dataHistory = Array.isArray(history) ? history : [];

        updateHistoryDisplay();
        updateChartsFromHistory();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Loading history aborted due to timeout');
        } else {
            console.error('Error loading history from backend:', error);
        }
    } finally {
        clearTimeout(timeout);
    }
}

// Keep existing function name to preserve structure, but do not use simulation.
async function addToHistory() {
    // Append current sensorData to local history (called from socket updates)
    const reading = {
        timestamp: formatDateTime(),
        temperature: app.sensorData.temperature,
        humidity: app.sensorData.humidity,
        status: app.sensorData.status
    };
    const last = app.dataHistory[app.dataHistory.length - 1];
    if (!last || last.temperature !== reading.temperature || last.humidity !== reading.humidity) {
        app.dataHistory.push(reading);
        if (app.dataHistory.length > 1000) app.dataHistory.shift();
        updateHistoryDisplay();
        if (app.charts && (app.charts.temperature || app.charts.humidity)) updateChartsFromHistory();
    }
}


function generateHistoricalData(hours) {
    // Preserve function for compatibility, but DO NOT generate fake chart/history data.
    // Real history is loaded from backend via loadHistoryFromBackend()/fetchHistoryFromBackend().
    // This keeps the UI unchanged while removing fake values.
    return hours;
}


function updateHistoryDisplay() {
    const historyTable = document.getElementById('historyTable');
    if (!historyTable) return;

    const rows = app.dataHistory.slice(-10).reverse().map(record => ` 
        <tr>
            <td>${record.timestamp}</td>
            <td>${record.temperature}°C</td>
            <td>${record.humidity}%</td>
            <td><span class="status-badge ${record.status.toLowerCase()}">
                ${record.status === 'Danger' ? '<i class="fas fa-exclamation-circle"></i>' : record.status === 'Risk' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>'}
                ${getTranslation(record.status.toLowerCase()) || record.status}
            </span></td>
            <td>${record.status === 'Danger' ? getTranslation('criticalHumidity') : record.status === 'Risk' ? getTranslation('humidityRising') : getTranslation('normalOperation')}</td>
        </tr>
    `).join('');

    historyTable.innerHTML = rows;
}

// ============================================
// 11. CHARTS
// ============================================

function initCharts() {
    // Get chart contexts
    const tempChartCanvas = document.getElementById('temperatureChart');
    const humidityChartCanvas = document.getElementById('humidityChart');

    if (!tempChartCanvas || !humidityChartCanvas) return;

    const ctx1 = tempChartCanvas.getContext('2d');
    const ctx2 = humidityChartCanvas.getContext('2d');

    // Prepare data for charts
    const chartData = prepareChartData();
    // Create nice gradients and enhance dataset appearance
    const gradTemp = ctx1.createLinearGradient(0, 0, 0, tempChartCanvas.height || 200);
    gradTemp.addColorStop(0, 'rgba(33,150,243,0.6)');
    gradTemp.addColorStop(1, 'rgba(33,150,243,0.05)');

    const gradHum = ctx2.createLinearGradient(0, 0, 0, humidityChartCanvas.height || 200);
    gradHum.addColorStop(0, 'rgba(33,150,243,0.5)');
    gradHum.addColorStop(1, 'rgba(33,150,243,0.08)');

    // Apply visual styles to datasets
    if (chartData.temperature.datasets && chartData.temperature.datasets[0]) {
        const ds = chartData.temperature.datasets[0];
        ds.backgroundColor = gradTemp;
        ds.borderColor = '#1976D2';
        ds.borderWidth = 3;
        ds.tension = 0.45;
        ds.pointRadius = 5;
        ds.pointHoverRadius = 8;
        ds.pointBackgroundColor = '#1976D2';
        ds.pointBorderColor = '#fff';
    }

    if (chartData.humidity.datasets && chartData.humidity.datasets[0]) {
        const ds2 = chartData.humidity.datasets[0];
        ds2.backgroundColor = gradHum;
        ds2.borderColor = '#0288D1';
        ds2.borderWidth = 2.5;
        ds2.tension = 0.45;
        ds2.pointRadius = 4;
        ds2.pointHoverRadius = 7;
        ds2.pointBackgroundColor = '#0288D1';
        ds2.pointBorderColor = '#fff';
    }

    // Temperature Chart - reuse if exists, else create
    if (app.charts.temperature) {
        app.charts.temperature.data = chartData.temperature;
        app.charts.temperature.options = getChartOptions('Temperature (°C)', '#1976D2');
        app.charts.temperature.update();
    } else {
        app.charts.temperature = new Chart(ctx1, {
            type: 'line',
            data: chartData.temperature,
            options: getChartOptions('Temperature (°C)', '#1976D2')
        });
    }

    // Humidity Chart - reuse if exists, else create
    if (app.charts.humidity) {
        app.charts.humidity.data = chartData.humidity;
        app.charts.humidity.options = getChartOptions('Humidity (%)', '#0288D1');
        app.charts.humidity.update();
    } else {
        app.charts.humidity = new Chart(ctx2, {
            type: 'line',
            data: chartData.humidity,
            options: getChartOptions('Humidity (%)', '#0288D1')
        });
    }

    // Chart control buttons
    initChartControls();
}

function prepareChartData() {
    const labels = app.dataHistory.map(h => (h.timestamp || '').split(' ')[1]).slice(-24);
    const temperatures = app.dataHistory.map(h => h.temperature).slice(-24);
    const humidities = app.dataHistory.map(h => h.humidity).slice(-24);

    return {
        temperature: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: true
            }]
        },
        humidity: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidities,
                fill: true
            }]
        }
    };
}

function updateChartsFromHistory() {
    if (!app.charts || !app.charts.temperature || !app.charts.humidity) return;

    const chartData = prepareChartData();

    app.charts.temperature.data.labels = chartData.temperature.labels;
    app.charts.temperature.data.datasets[0].data = chartData.temperature.datasets[0].data;
    app.charts.temperature.update();

    app.charts.humidity.data.labels = chartData.humidity.labels;
    app.charts.humidity.data.datasets[0].data = chartData.humidity.datasets[0].data;
    app.charts.humidity.update();
}


function getChartOptions(title, color) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        animation: {
            duration: 700,
            easing: 'easeOutCubic'
        },
        elements: {
            point: {
                radius: 4,
                hoverRadius: 8
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 12
                    }
                }
            }
            ,
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        family: "'Poppins', sans-serif"
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: "'Poppins', sans-serif"
                    }
                }
            }
        }
    };
}

function initChartControls() {
    const chartControlBtns = document.querySelectorAll('.chart-control-btn');
    chartControlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            chartControlBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Here you would filter chart data by range
            // For now, we'll just keep the same data
        });
    });
}

// ============================================
// 12. SETTINGS
// ============================================

function initSettings() {
    const humidityRiskThreshold = document.getElementById('humidityRiskThreshold');
    const humidityDangerThreshold = document.getElementById('humidityDangerThreshold');
    const riskValue = document.getElementById('riskValue');
    const dangerValue = document.getElementById('dangerValue');
    const updateFrequency = document.getElementById('updateFrequency');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const clearAlertsBtn = document.getElementById('clearAlertsBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Set initial values
    if (humidityRiskThreshold) {
        humidityRiskThreshold.value = app.thresholds.risk;
        riskValue.textContent = app.thresholds.risk;

        humidityRiskThreshold.addEventListener('input', (e) => {
            riskValue.textContent = e.target.value;
        });
    }

    if (humidityDangerThreshold) {
        humidityDangerThreshold.value = app.thresholds.danger;
        dangerValue.textContent = app.thresholds.danger;

        humidityDangerThreshold.addEventListener('input', (e) => {
            dangerValue.textContent = e.target.value;
        });
    }

    if (updateFrequency) {
        updateFrequency.value = app.settings.updateFrequency;
    }

    // Save settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            app.thresholds.risk = parseInt(humidityRiskThreshold.value);
            app.thresholds.danger = parseInt(humidityDangerThreshold.value);
            app.settings.updateFrequency = parseInt(updateFrequency.value);

            // Update checkbox states
            // document.querySelectorAll('.setting-item.checkbox input').forEach(checkbox => {
            //     const settingName = checkbox.id;
            //     app.settings[settingName] = checkbox.checked;
            // });

            // Save to local storage (for demo mode or initial load)
            saveToLocalStorage('thresholds', app.thresholds);
            saveToLocalStorage('settings', app.settings);

            // Restart data update interval with new frequency
            startDataUpdateInterval();

            // Send settings to Flask backend
            fetch('/api/settings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${app.idToken}`
                },
                body: JSON.stringify({
                    humidityRiskThreshold: app.thresholds.risk,
                    humidityDangerThreshold: app.thresholds.danger
                    // Add other settings if they are managed by backend
                })
            })
            .then(response => {
                if (response.ok) {
                    showToast(getTranslation('saveSettingsSuccess'), 'success');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            })
            .catch(error => showToast(`Failed to save settings: ${error.message}`, 'error'));
        });
    }

    // Clear alerts
    if (clearAlertsBtn) {
        clearAlertsBtn.addEventListener('click', clearAlerts);
    }

    // Download CSV
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadDataAsCSV);
    }
}

function downloadDataAsCSV() {
    if (app.dataHistory.length === 0) {
        showToast(getTranslation('noDataToDownload') || 'No data to download', 'warning');
        return;
    }

    let csv = 'Timestamp,Temperature (°C),Humidity (%),Status\n';

    app.dataHistory.forEach(record => {
        csv += `"${record.timestamp}",${record.temperature},${record.humidity},${record.status}\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iron-monitor-data-${formatDateTime().replace(/\s/g, '_').replace(/:/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast(getTranslation('downloadSuccess'), 'success');
}

// ============================================
// 13. EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Filter alerts
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            filterAlerts(filter);
        });
    });
}

function filterAlerts(filter) {
    const alertsFullList = document.getElementById('alertsFullList');
    if (!alertsFullList) return;

    let filtered = app.alerts;

    if (filter !== 'all') {
        filtered = app.alerts.filter(a => a.type === filter);
    }

    alertsFullList.innerHTML = filtered.map(alert => `
        <div class="alert-item ${alert.type}-alert">
            <i class="fas fa-${alert.type === 'danger' ? 'exclamation-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <div class="alert-content">
                <p class="alert-title">${alert.title}</p>
                <p class="alert-message">${alert.message}</p>
            </div>
            <span class="alert-time">Now</span>
        </div>
    `).join('');
}

// ============================================
// 14. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check the current page and initialize accordingly
    const pageTitle = document.title;

    const body = document.body;
    if (body.classList.contains('login-page')) {
        initLoginPage();
    } else if (body.classList.contains('signup-page')) {
        initSignupPage();
    } else if (body.classList.contains('dashboard-page')) {
        initDashboard();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, could pause updates
    } else {
        // Page is visible, ensure data is fresh
        if (app.isLoggedIn || loadFromLocalStorage('user')) {
            // Trigger an immediate poll when returning to the page
            pollSensorAndUpdateUI();
        }
    }
});

// Initialize SocketIO connection for real-time updates
if (window.io || window.firebaseEnabled) { // Initialize SocketIO if available
    const socket = (typeof io === 'function') ? io() : null; // connect to same origin
    if (socket) {

    socket.on('connect', () => {
        console.log('Connected to SocketIO server');
        setConnectionState(true);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from SocketIO server');
        setConnectionState(false);
    });

    socket.on('sensor_update', (data) => {
        console.log('Real-time sensor update:', data);
        const previousStatus = app.sensorData.status;
        app.sensorData = data; // Update global state with new data
        updateDashboardData(); // Refresh dashboard UI
        checkAndAddAlerts(previousStatus);
        addToHistory(); // Add to history and update display
    });

    socket.on('new_alert', (alerts) => {
        console.log('New alerts received:', alerts);
        alerts.forEach(alert => {
            // Ensure alert is not a duplicate before adding
            if (!app.alerts.some(a => a.message === alert.message && a.timestamp === alert.timestamp)) {
                app.alerts.push(alert);
                showToast(alert.message, alert.level);
            }
        });
        updateAlertsDisplay();
    });
    }
}

// Responsive sidebar
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});
