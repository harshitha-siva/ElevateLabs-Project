# ElevateLabs-Project

# 🔍 Password Strength Analyzer

A robust, client-side web application built with HTML, CSS, and vanilla JavaScript to provide real-time, detailed analysis of password security.

---

## ✨ Features

* **Real-Time Strength Scoring:** Get an immediate score based on length, complexity, and pattern checks.
* **Crack Time Estimation:** Calculates the theoretical time required for a high-speed attacker to brute-force the password.
* **Personal Info Check:** Define your name, birthdate, and pet name to check if your password contains easily guessable personal information.
* **Common Wordlist Check:** Toggles checking the password against a built-in list of common, weak, and compromised passwords.
* **Actionable Feedback:** Provides detailed lists of **Weak Aspects** and **Suggested Improvements**.
* **Analysis History:** Stores recent password analyses locally to help track your security efforts.
* **Responsive Design:** Optimized layout for desktop, tablet, and mobile devices.

---

## 🚀 Getting Started

This project is a static web application and requires no build steps or backend server.

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge, Safari, etc.)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/Password-Strength-Analyzer.git](https://github.com/YourUsername/Password-Strength-Analyzer.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Password-Strength-Analyzer
    ```
3.  **Open the file:**
    Simply open the `index.html` file in your preferred web browser.

    ```bash
    # Example using a file path on your system
    open index.html 
    ```

---

## 🛠️ Technology Stack

* **HTML5:** Structure and content.
* **CSS3:** Custom styling (`styles.css`) for a modern, dark-themed, and responsive UI.
* **Vanilla JavaScript (ES6+):** Core logic for password analysis, scoring, pattern detection, and DOM manipulation (`script.js`).

---

## ⚙️ How the Analyzer Works

The strength analysis is performed by the `PasswordStrengthAnalyzer` class in `script.js` using a custom algorithm that:

1.  **Base Score:** Assigns points based on password length and the presence of mixed character types (uppercase, lowercase, numbers, special characters).
2.  **Penalty Deduction:** Deducts points for the following vulnerabilities:
    * Passwords found in the **Common Weak Wordlist**.
    * Inclusion of **Personal Information** (names, dates, etc.).
    * Detection of **Common Patterns** (e.g., `123`, `abc`, `qwerty`).
    * **Sequential or Repeated Characters** (e.g., `111`, `abcd`).
3.  **Crack Time Calculation:** Estimates the time to crack based on the password length and the size of the character set used (complexity).

---


## 📄 License

This project is licensed under the MIT License - see the `LICENSE.md` file (if you create one) for details.

---

