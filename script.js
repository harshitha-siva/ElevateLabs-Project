// Password Strength Analysis JavaScript Application

class PasswordStrengthAnalyzer {
    constructor() {
        this.personalInfo = {};
        this.useCommonWordlist = false;
        this.analysisHistory = [];
        this.commonWordlist = this.loadCommonWordlist();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
    }

    loadCommonWordlist() {
        return [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'hello',
            'login', 'princess', 'qwertyuiop', 'solo', 'passw0rd', 'starwars',
            'freedom', 'whatever', 'qazwsx', 'trustno1', '654321', 'jordan23',
            'harley', 'password1', '1234', 'robert', 'matthew', 'jordan',
            'daniel', 'andrew', '12345', 'tigger', 'sunshine', 'iloveyou',
            '2000', 'charlie', 'monkey', 'jordan', 'harley', 'ranger', 'hunter',
            'buster', 'soccer', 'hockey', 'killer', 'george', 'andrew', 'charlie',
            'superman', 'dallas', 'jessica', 'pepper', '1234567890', '1234567',
            '111111', '000000', '123123', '654321', '555555', '7777777',
            '121212', '789456', '123654', '987654321', '147258369', 'qwerty123',
            '1q2w3e4r', 'qwertyui', 'asdfgh', 'zxcvbn', '1qaz2wsx', 'qazwsxedc',
            'root', 'user', 'guest', 'test', 'demo', 'sample', 'default', 'temp',
            'temporary', 'password123', 'admin123', 'user123', 'test123'
        ];
    }

    setupEventListeners() {
        // Password input analysis
        document.getElementById('passwordInput').addEventListener('input', (e) => {
            this.analyzePassword(e.target.value);
        });

        // Toggle password visibility
        document.getElementById('toggleVisibility').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Generate personal wordlist button
        document.getElementById('generatePersonalWordlistBtn').addEventListener('click', () => {
            this.togglePersonalInfoForm();
        });

        // Toggle common wordlist button
        document.getElementById('toggleCommonWordlistBtn').addEventListener('click', () => {
            this.toggleCommonWordlist();
        });

        // Save personal info
        document.getElementById('savePersonalInfo').addEventListener('click', () => {
            this.savePersonalInfo();
        });

        // Clear history button
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('passwordInput');
        const toggleBtn = document.getElementById('toggleVisibility');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁';
        }
    }

    togglePersonalInfoForm() {
        const form = document.getElementById('personalInfoForm');
        const btn = document.getElementById('generatePersonalWordlistBtn');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            btn.textContent = '👤 Hide Personal Info Form';
            btn.classList.add('active');
        } else {
            form.style.display = 'none';
            btn.textContent = '👤 Generate Personal Info Wordlist';
            btn.classList.remove('active');
        }
    }

    toggleCommonWordlist() {
        this.useCommonWordlist = !this.useCommonWordlist;
        const btn = document.getElementById('toggleCommonWordlistBtn');
        const display = document.getElementById('wordlistDisplay');
        
        if (this.useCommonWordlist) {
            btn.textContent = '📋 Disable Common Wordlist Check';
            btn.classList.add('active');
            this.showWordlist();
        } else {
            btn.textContent = '📋 Check Against Common Weak Passwords';
            btn.classList.remove('active');
            display.style.display = 'none';
        }
        
        // Re-analyze current password if there is one
        const password = document.getElementById('passwordInput').value;
        if (password) {
            this.analyzePassword(password);
        }
    }

    showWordlist() {
        const display = document.getElementById('wordlistDisplay');
        const content = document.getElementById('wordlistContent');
        
        display.style.display = 'block';
        content.innerHTML = '';

        this.commonWordlist.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'wordlist-item';
            wordItem.textContent = word;
            content.appendChild(wordItem);
        });
    }

    savePersonalInfo() {
        this.personalInfo = {
            name: document.getElementById('name').value.trim(),
            nickname: document.getElementById('nickname').value.trim(),
            birthDate: document.getElementById('birthDate').value,
            petName: document.getElementById('petName').value.trim()
        };

        // Remove empty values
        Object.keys(this.personalInfo).forEach(key => {
            if (!this.personalInfo[key]) {
                delete this.personalInfo[key];
            }
        });

        this.saveSettings();
        this.showToast('Personal information saved!', 'success');
        
        // Re-analyze current password if there is one
        const password = document.getElementById('passwordInput').value;
        if (password) {
            this.analyzePassword(password);
        }
    }

    analyzePassword(password) {
        if (!password) {
            this.hideAnalysisResults();
            return;
        }

        const score = this.calculateStrengthScore(password);
        const crackTime = this.calculateCrackTime(password);
        const weakAspects = this.identifyWeakAspects(password);
        const improvements = this.suggestImprovements(password);

        this.displayAnalysisResults(score, crackTime, weakAspects, improvements);
    }

    calculateStrengthScore(password) {
        let score = 0;

        // Length bonus
        if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else if (password.length >= 6) score += 5;

        // Character variety
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/\d/.test(password)) score += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;

        // Pattern penalties
        const patterns = this.extractCommonPatterns(password);
        if (patterns.numbersOnly || patterns.lettersOnly) score -= 30;
        if (patterns.commonPatterns) score -= 20;
        if (patterns.repeatedChars) score -= 15;
        if (patterns.sequential) score -= 25;
        if (patterns.keyboardPatterns) score -= 20;

        // Personal info penalties
        const personalWarnings = this.checkPersonalInfo(password);
        score -= personalWarnings.length * 15;

        // Common wordlist penalties
        if (this.useCommonWordlist) {
            const wordlistWarnings = this.checkCommonWordlist(password);
            score -= wordlistWarnings.length * 10;
        }

        return Math.max(0, Math.min(score, 100));
    }

    calculateCrackTime(password) {
        const charset = this.getCharacterSetSize(password);
        const combinations = Math.pow(charset, password.length);
        const attemptsPerSecond = 1000000000; // 1 billion attempts per second
        
        const seconds = combinations / (2 * attemptsPerSecond);
        
        if (seconds < 1) return "Less than 1 second";
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
        return `${Math.round(seconds / 3153600000)} centuries`;
    }

    getCharacterSetSize(password) {
        let charset = 0;
        if (/[a-z]/.test(password)) charset += 26;
        if (/[A-Z]/.test(password)) charset += 26;
        if (/\d/.test(password)) charset += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charset += 32;
        return charset || 1;
    }

    identifyWeakAspects(password) {
        const weakAspects = [];
        const patterns = this.extractCommonPatterns(password);

        if (password.length < 8) {
            weakAspects.push("Password is too short (less than 8 characters)");
        }

        if (patterns.numbersOnly) {
            weakAspects.push("Contains only numbers");
        }

        if (patterns.lettersOnly) {
            weakAspects.push("Contains only letters");
        }

        if (patterns.commonPatterns) {
            weakAspects.push("Contains common patterns (123, abc, etc.)");
        }

        if (patterns.repeatedChars) {
            weakAspects.push("Contains repeated characters");
        }

        if (patterns.sequential) {
            weakAspects.push("Contains sequential characters");
        }

        if (patterns.keyboardPatterns) {
            weakAspects.push("Contains keyboard patterns");
        }

        // Check personal info
        const personalWarnings = this.checkPersonalInfo(password);
        weakAspects.push(...personalWarnings);

        // Check common wordlist
        if (this.useCommonWordlist) {
            const wordlistWarnings = this.checkCommonWordlist(password);
            weakAspects.push(...wordlistWarnings);
        }

        return weakAspects;
    }

    suggestImprovements(password) {
        const improvements = [];

        if (password.length < 12) {
            improvements.push(`Increase length to at least 12 characters (currently ${password.length})`);
        }

        if (!/[A-Z]/.test(password)) {
            improvements.push("Add uppercase letters");
        }

        if (!/[a-z]/.test(password)) {
            improvements.push("Add lowercase letters");
        }

        if (!/\d/.test(password)) {
            improvements.push("Add numbers");
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            improvements.push("Add special characters");
        }

        const patterns = this.extractCommonPatterns(password);
        if (patterns.commonPatterns) {
            improvements.push("Avoid common patterns like '123' or 'abc'");
        }

        if (patterns.sequential) {
            improvements.push("Avoid sequential characters");
        }

        if (patterns.keyboardPatterns) {
            improvements.push("Avoid keyboard patterns");
        }

        if (patterns.repeatedChars) {
            improvements.push("Avoid repeated characters");
        }

        return improvements;
    }

    extractCommonPatterns(password) {
        return {
            numbersOnly: /^\d+$/.test(password),
            lettersOnly: /^[a-zA-Z]+$/.test(password),
            commonPatterns: /(123|abc|qwe|asd|zxc)/.test(password.toLowerCase()),
            repeatedChars: /(.)\1{2,}/.test(password),
            sequential: this.checkSequential(password),
            keyboardPatterns: this.checkKeyboardPatterns(password)
        };
    }

    checkSequential(password) {
        const sequences = [
            '123', '234', '345', '456', '567', '678', '789', '890',
            'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
            'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
            'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
            'zxc', 'xcv', 'cvb', 'vbn', 'bnm'
        ];

        const passwordLower = password.toLowerCase();
        return sequences.some(seq => passwordLower.includes(seq));
    }

    checkKeyboardPatterns(password) {
        const keyboardRows = [
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm',
            '1234567890'
        ];

        const passwordLower = password.toLowerCase();
        return keyboardRows.some(row => {
            for (let i = 0; i <= row.length - 3; i++) {
                const pattern = row.substring(i, i + 3);
                if (passwordLower.includes(pattern)) {
                    return true;
                }
            }
            return false;
        });
    }

    checkPersonalInfo(password) {
        const warnings = [];
        const passwordLower = password.toLowerCase();

        Object.entries(this.personalInfo).forEach(([key, value]) => {
            if (!value) return;

            const valueStr = value.toString().toLowerCase().trim();
            
            // Direct match
            if (passwordLower.includes(valueStr)) {
                warnings.push(`Contains personal information: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} '${value}'`);
            }

            // Partial match for longer values
            if (valueStr.length > 3) {
                for (let i = 0; i <= valueStr.length - 3; i++) {
                    const substring = valueStr.substring(i, i + 3);
                    if (passwordLower.includes(substring)) {
                        warnings.push(`Contains part of personal information: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} '${substring}'`);
                    }
                }
            }
        });

        return warnings;
    }

    checkCommonWordlist(password) {
        const warnings = [];
        const passwordLower = password.toLowerCase();

        this.commonWordlist.forEach(word => {
            if (passwordLower.includes(word)) {
                warnings.push(`Contains common weak password: '${word}'`);
            }
        });

        return warnings;
    }

    displayAnalysisResults(score, crackTime, weakAspects, improvements) {
        // Display score
        document.getElementById('scoreValue').textContent = score;
        document.getElementById('scoreDisplay').style.display = 'block';

        // Update score circle color based on score
        const scoreCircle = document.querySelector('.score-circle');
        if (score >= 80) {
            scoreCircle.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        } else if (score >= 60) {
            scoreCircle.style.background = 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)';
        } else if (score >= 40) {
            scoreCircle.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }

        // Display crack time
        document.getElementById('crackTimeText').textContent = crackTime;
        document.getElementById('crackTimeDisplay').style.display = 'block';

        // Display weak aspects
        const weakAspectsList = document.getElementById('weakAspectsList');
        weakAspectsList.innerHTML = '';
        if (weakAspects.length > 0) {
            weakAspects.forEach(aspect => {
                const li = document.createElement('li');
                li.textContent = `• ${aspect}`;
                weakAspectsList.appendChild(li);
            });
            document.getElementById('weakAspectsDisplay').style.display = 'block';
        } else {
            document.getElementById('weakAspectsDisplay').style.display = 'none';
        }

        // Display improvements
        const improvementsList = document.getElementById('improvementsList');
        improvementsList.innerHTML = '';
        if (improvements.length > 0) {
            improvements.forEach(improvement => {
                const li = document.createElement('li');
                li.textContent = `• ${improvement}`;
                improvementsList.appendChild(li);
            });
            document.getElementById('improvementsDisplay').style.display = 'block';
        } else {
            document.getElementById('improvementsDisplay').style.display = 'none';
        }
    }

    hideAnalysisResults() {
        document.getElementById('scoreDisplay').style.display = 'none';
        document.getElementById('crackTimeDisplay').style.display = 'none';
        document.getElementById('weakAspectsDisplay').style.display = 'none';
        document.getElementById('improvementsDisplay').style.display = 'none';
    }

    clearHistory() {
        this.analysisHistory = [];
        this.displayHistory();
        this.saveSettings();
        this.showToast('History cleared!', 'success');
    }

    displayHistory() {
        const historyList = document.getElementById('historyList');
        const clearHistoryBtn = document.getElementById('clearHistory');

        if (this.analysisHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history">No analyses yet. Check a password to see history!</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }

        clearHistoryBtn.style.display = 'block';
        historyList.innerHTML = '';

        this.analysisHistory.slice(0, 10).forEach((analysis, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-header">
                    <h4>Analysis #${index + 1}</h4>
                    <span class="history-strength">Score: ${analysis.score}/100</span>
                </div>
                <div class="history-details">
                    <div><strong>Crack Time:</strong> ${analysis.crackTime}</div>
                    <div><strong>Weak Aspects:</strong> ${analysis.weakAspects.length}</div>
                    <div><strong>Time:</strong> ${analysis.timestamp}</div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveSettings() {
        const settings = {
            personalInfo: this.personalInfo,
            useCommonWordlist: this.useCommonWordlist,
            analysisHistory: this.analysisHistory
        };
        localStorage.setItem('passwordAnalyzerSettings', JSON.stringify(settings));
    }

    loadSavedData() {
        const saved = localStorage.getItem('passwordAnalyzerSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.personalInfo = settings.personalInfo || {};
                this.useCommonWordlist = settings.useCommonWordlist || false;
                this.analysisHistory = settings.analysisHistory || [];

                // Update UI
                if (this.useCommonWordlist) {
                    document.getElementById('toggleCommonWordlistBtn').textContent = '📋 Disable Common Wordlist Check';
                    document.getElementById('toggleCommonWordlistBtn').classList.add('active');
                }

                // Populate form fields
                if (this.personalInfo.name) document.getElementById('name').value = this.personalInfo.name;
                if (this.personalInfo.nickname) document.getElementById('nickname').value = this.personalInfo.nickname;
                if (this.personalInfo.birthDate) document.getElementById('birthDate').value = this.personalInfo.birthDate;
                if (this.personalInfo.petName) document.getElementById('petName').value = this.personalInfo.petName;

                this.displayHistory();
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthAnalyzer();
});