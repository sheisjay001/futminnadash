# FUTMINNA Dash 3D

A third-person campus running game built with Three.js and Cannon.js. Navigate from Gidan Kwano to the lecture hall before 8am while dodging vehicles, collecting jollof and lecture notes to boost your CGPA.

![FUTMINNA Dash 3D](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-Proprietary-red)

## 🎮 Features

- **Open World Campus**: Explore a detailed 3D recreation of FUT Minna campus including Gidan Kwano and Bosso campuses
- **Realistic Vehicles**: Nigerian tricycles (keke), motorcycles (okada), and Alawusa buses with detailed models
- **Dynamic Weather System**: NEPA outages, Harmattan dust, and rain storms with thunder
- **Day-to-Evening Cycle**: Dynamic lighting and fog that changes as time progresses
- **Physics-Based Gameplay**: Real physics for vehicles, cones, drums, and other objects
- **CGPA System**: Collect jollof (+0.15 CGPA) and lecture notes (+0.25 CGPA) to improve your grade
- **Economy System**: Earn naira from pickups and spend on upgrades at the campus shop
- **Heat System**: Security guards chase you when your heat meter gets too high
- **Leaderboard**: Compete with other students by faculty and department
- **Mobile Responsive**: Touch controls with virtual joystick for mobile devices
- **Studio-Quality Audio**: Enhanced bus voice and shunt sound effects with Web Audio API processing

## 🕹️ Controls

### Desktop
- **WASD / Arrow Keys**: Move
- **Shift**: Sprint
- **Space**: Jump
- **Q / E**: Rotate camera
- **Mouse Drag**: Look around
- **F**: Enter/Exit vehicles (keke, okada)

### Mobile
- **Left Thumbstick**: Move
- **Drag Screen**: Look around
- **Jump Button**: Jump
- **Sprint Button**: Toggle sprint
- **DRIVE Button**: Enter/Exit nearby vehicles

## 🎯 How to Play

1. **Register**: Enter your name, faculty, and department
2. **Run**: Start at Gidan Kwano and run towards the lecture hall
3. **Dodge**: Avoid keke, okada, and Alawusa buses on the road
4. **Collect**: Pick up jollof and lecture notes to boost your CGPA
5. **Avoid Collisions**: Hitting vehicles or goats reduces your CGPA
6. **Watch Your Time**: You have 3 minutes to reach the lecture hall before 8am
7. **Shop**: Use earned naira to buy speed and jump upgrades
8. **Win**: Reach the lecture hall on time with the highest CGPA possible

## 🏗️ Technical Stack

- **Three.js r128**: 3D rendering engine
- **Cannon.js 0.6.2**: Physics simulation
- **Web Audio API**: Audio effects processing
- **HTML5 Canvas**: Texture generation
- **Vanilla JavaScript**: No frameworks

## 📦 Setup

1. Clone the repository:
```bash
git clone https://github.com/sheisjay001/futminnadash.git
cd futminnadash
```

2. Serve the files using any local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

## 📁 Project Structure

```
FUTMINNADASH/
├── index.html          # Main game file (HTML, CSS, JS)
├── bus-voice.mp3       # Bus voice audio
├── SHUNT.mp3           # Shunt collision audio
└── README.md           # This file
```

## 🎨 Customization

### Game Constants
Edit these values in `index.html` to adjust gameplay:

```javascript
const GOAL = -500;           // Lecture hall position (Z-coordinate)
const TIME0 = 180;          // Game duration in seconds (3 minutes)
const hallW = 80;           // Lecture hall width
const hallH = 25;           // Lecture hall height
const hallD = 30;           // Lecture hall depth
```

### Vehicle Counts
Adjust the number of vehicles spawned:

```javascript
for(let i=0;i<7;i++)veh('keke',...);    // Number of kekes
for(let i=0;i<5;i++)veh('okada',...);   // Number of okadas
for(let i=0;i<3;i++)veh('bus',...);     // Number of moving buses
```

## 🔧 Backend API

The game connects to a backend API for leaderboard functionality:

- **Base URL**: `https://futminnadash-backend.onrender.com/api`
- **POST /scores**: Save player score
- **GET /leaderboard**: Retrieve leaderboard by faculty/department

To use your own backend, set `window.BACKEND_URL` before loading the script:

```html
<script>
window.BACKEND_URL = 'https://your-backend.com/api';
</script>
```

## 🎓 Campus Locations

- **Gidan Kwano**: Starting point (Z: 0 to -100)
- **Gidan Kwano Bus Park**: First bus stop (Z: -100 to -200)
- **Bosso Campus**: Second campus area (Z: -200 to -300)
- **Bosso Bus Park**: Second bus stop (Z: -300 to -400)
- **Lecture Hall**: Final destination (Z: -500)

## 🏆 Achievements

- **First Class**: CGPA ≥ 4.5 (triggers confetti celebration)
- **Second Class Upper**: CGPA ≥ 3.5
- **Second Class Lower**: CGPA ≥ 2.4
- **Third Class**: CGPA ≥ 1.5
- **Carryover**: CGPA < 1.5

## 🐛 Known Issues

- Performance may vary on older mobile devices
- Audio requires user interaction to play (browser policy)
- Leaderboard depends on backend API availability

## 📝 Credits

**Created by**: Joy Auta

**Independent student project** - Not affiliated with or endorsed by Federal University of Technology, Minna.

## 📄 License

Copyright © 2026 Joy Auta. All rights reserved.

This is a proprietary project. All rights are reserved by the creator.

## 🤝 Contributing

This is an independent student project. For suggestions or feedback, please contact the creator.

## 📧 Contact

For inquiries about this project, please reach out through the repository issues or contact the creator directly.

---

**Technology for Empowerment** 🇳🇬
