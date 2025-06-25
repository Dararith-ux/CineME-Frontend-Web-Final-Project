# 🎬 CineME: Movie Browsing Website

**CineME** is a dynamic movie browsing web app powered by the **TMDB API**, built with **JavaScript** and **Tailwind CSS**. Users can explore trending films, watch trailers, manage a personalized "Watch Later" list, and even simulate adding new movies — all in a sleek, interactive interface.

## 🌐 Live Demo

👉 [Try CineME now](https://final-project-ihl8.vercel.app/)

## 🚀 Key Features

### 🏠 Homepage

* **Navbar** with:

  * Links to **Homepage** and **Dashboard**
  * **Profile icon**
  * **Night mode toggle**
* **Slideshow Banner** showing top trending movies (via TMDB)
* **Movie Posters Grid**:

  * Each card shows the **poster**, **title**, and **release date**
  * Clicking a poster opens a **popup modal** with:

    * 🎬 Overview
    * ⭐ Rating
    * 📅 Release Date
    * ▶️ Embedded Trailer
    * 🕒 "Add to Watch Later" button

### 📋 Dashboard

* View movies added to your **Watch Later** list
* Remove movies from the list anytime
* Use the **"Add New Movie"** section to simulate server-side updates (adds new movie to homepage using localStorage)

## 🧠 Data Handling

| Feature               | Method Used  |
| --------------------- | ------------ |
| Watch Later list      | Cookies      |
| Add New Movie (admin) | LocalStorage |

## 🧰 Tech Stack

* **HTML**
* **Tailwind CSS**
* **JavaScript (Vanilla)**
* **TMDB API**
* **Cookies + LocalStorage**

## 📁 Project Structure

```
/project-root
├── index.html
├── package.json
└── /src
    ├── /img        # Images and assets
    ├── /js         # JavaScript functionality
    ├── /pages      # Additional HTML pages (e.g., dashboard.html)
    └── /styles     # Tailwind and custom styles
```

## 🛠 Setup & Usage

1. **Clone this repository:**

   ```bash
   git clone https://github.com/Dararith-ux/FinalProject.git
   ```
2. **Open `index.html`** in your browser or deploy it on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.
3. **TMDB API Key**: Replace with your own if needed.

## 💡 Future Improvements

* Add **search** and **filter** functionality
* Integrate with a real backend for account login and storage

---

