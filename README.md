# FitMotiv

FitMotiv is a mobile application that motivates users to complete physical workouts through financial incentives, smart contracts on the Ethereum blockchain, and real-time AI-based motion analysis.

## 📱 Overview

**FitMotiv** allows users to:
- Create fitness challenges.
- Stake money on completing them.
- Have their exercise performance validated using real-time computer vision.
- Earn back funds when goals are achieved.

If a user fails to complete a challenge, the funds may be forfeited.

---

## 🔥 Key Features

### 🎯 Challenge Creation
- Select exercise type (squats, push-ups, plank).
- Set parameters: number of reps or duration.
- Choose a deadline and stake amount (e.g., 0.005 ETH).
- Smart contract locks the deposit until completion.

### 🧠 Real-Time Motion Analysis
- Uses the camera to analyze body movement.
- Powered by MediaPipe.js for posture & repetition tracking.
- Verifies correct form and counts reps automatically.

### ⛓️ Blockchain-Backed
- All funds are handled transparently using Ethereum smart contracts.
- Challenge outcomes trigger automated payouts or forfeitures.
- Wallets are auto-generated and managed in-app.

### 📊 Statistics & History
- Displays earnings, completed challenges, missed deadlines.

---

## 💻 Tech Stack

### Frontend
- **React Native** with **Expo Go**
- Real-time camera integration and feedback UI

### Backend
- **Node.js** with **Express**
- User authentication & session management
- MongoDB and Firebase for user data & challenge history

### Blockchain
- **Solidity** Smart Contracts
- Ethereum testnet (Sepolia)
- Integration via Infura

### Computer Vision
- **MediaPipe.js** for pose detection and movement classification

---

## 📲 UI Screens

1. **Authentication**
   - Email + password login
   - Ethereum wallet creation

2. **Dashboard**
   - Wallet balance + upcoming rewards
   - Challenge list with statuses (Awaiting / Active / Completed)

3. **Challenge View**
   - View challenge details
   - Real-time camera analysis and repetition counter

4. **Challenge Creation**
   - Full form: wallet address, type, reps/time, deadline, stake

5. **Wallet**
   - Balance, deposits, withdrawals, and transaction history

6. **Execution Screen**
   - Live video feed with overlayed motion feedback and timer

---
### Testing & Demo
You can quickly try the app using Expo Go on Appetize: [click](https://appetize.io/app/b_5kjlb7koh5wko6bh3h72jhqg34?device=pixel4xl&osVersion=12.0&toolbar=true)
or
Install Expo Go from the App Store or Google Play.

Scan the QR code below to open the app instantly(also [link](https://expo.dev/preview/update?message=Initial%20preview&updateRuntimeVersion=1.0.0&createdAt=2025-06-18T14%3A26%3A35.990Z&slug=exp&projectId=6ad7ebeb-419d-46a1-9ad8-5181039e0aa0&group=ed69fd96-06ce-4d2c-af06-2f8508f33c71))

![image](https://github.com/user-attachments/assets/b8540938-1111-4bfe-821d-796d46a8b995)

Use the following test account credentials to log in:
Email: admin@admin.com
Password: 123123

Or register your own account to explore full functionality.

📷 Screenshots

![Group 95](https://github.com/user-attachments/assets/171d8547-07dd-4191-8e6d-92eab6a2fc73)


## 🚀 Getting Started (Dev Environment)

### Prerequisites
- Node.js ≥ v18
- npm
- Expo CLI (`npm install -g expo-cli`)
- MongoDB and Firebase setup
- Infura/Alchemy Ethereum node key

### Setup

```bash
git clone https://github.com/your-username/fitmotiv.git
cd fitmotiv

# Install dependencies
npm install

# Start Expo dev server - cd /Frontend/fitmotiv
npx expo start

# Start node dev server - cd /Backend/fitmotiv-backend
npm run start
