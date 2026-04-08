# 🌆 Smart City Weather Dashboard

Welcome to the **Smart City Weather Dashboard**! This project was built to fulfill **Milestone 3 & 4** requirements, demonstrating advanced JavaScript concepts, premium UI/UX design, and deployment readiness.

## 🚀 Features & Technical Implementation

This project heavily utilizes modern JavaScript, Array Higher-Order Functions, and Web Storage APIs:

### 1. Data Searching, Filtering, & Sorting (Array HOFs)
As per the requirement, NO traditional loops (`for`, `while`) were used. All array manipulations are performed using Higher-Order Functions:
- **`Array.filter()`**: 
  - Used in the search bar to filter cities by name.
  - Used in the dropdown to filter cities strictly by temperature (`Hot > 30°C`, `Mild`, `Cold < 20°C`).
  - Used to toggle the selection of favorites.
- **`Array.sort()`**: 
  - Used in the sort dropdown to arrange cities alphabetically (`Name A-Z`, `Name Z-A`).
  - Used to arrange cities by temperature (`Low to High`, `High to Low`).
- **`Array.map()`**: 
  - Used to dynamically transform the `weatherData` array into HTML card elements and inject them into the DOM without mutating the original arrays.
  - Used with `Promise.all` to fetch initial data for an array of cities concurrently.

### 2. Bonus Features Implemented
- **Debouncing**: Applied to the search input. It restricts how frequently our filtering logic runs on keystrokes (`500ms` delay), ensuring optimal performance.
- **Local Storage**: Data persistence without a database!
  - **Theme Preference**: Remembering if a user prefers Dark Mode or Light Mode across sessions.
  - **Favorites (❤️)**: Remembering a user's favorited cities across reloads.
- **Loading Indicators**: A premium CSS spinning loader gives visual feedback while the API requests load.

### 3. Aesthetics & UI/UX
- **Premium Glassmorphism**: Cards and controls feature blur backdrops and soft shadows for a vibrant, modern look.
- **Micro-Animations**: Hover actions on buttons and cards ensure the dashboard feels alive.
- **Responsive Design**: The CSS grid dynamically collapses to a single column on mobile for full accessibility.
- **Dark/Light Mode**: Fully functional CSS variables-based theme switcher.

---

## 🛠️ How to Run Locally

1. Open a terminal and navigate to the project directory.
2. You can serve the files using a simple HTTP server (for example, with Python or Node.js):
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Or using Node (if installed)
   npx serve .
   ```
3. Open a web browser and go to `http://localhost:8000`.

---

## 🌐 Deployment (Final Submission)

To deploy this project so it can be accessed globally, follow these simple steps using **Netlify** or **Vercel**:

### Option 1: Netlify Drop (Easiest)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Create an account or log in.
3. Drag and drop the **entire project folder** directly onto their web interface.
4. Netlify will instantly provide a live URL!

### Option 2: GitHub Pages (Recommended for Portfolios)
1. Initialize a Git repository in this folder and push the code to a new public GitHub repository.
2. In your repository on GitHub, go to **Settings** -> **Pages**.
3. Under "Build and deployment", set the source branch to `main`.
4. Wait a few minutes, and GitHub will provide you with a live URL (e.g., `https://yourusername.github.io/weather-app/`).

---

**Milestones Completed**:
✅ Milestone 3 (Core Features + HOFs + Bonus Features)
✅ Milestone 4 (Documentation, Deployment, Final Submission)

*Built for the Final Web Development Submission.* 🚀
