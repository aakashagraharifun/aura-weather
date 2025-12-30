

# ☁️ SkyWea — Weather Web App

**SkyWea** is a modern, fast, and responsive weather web application that gives users real-time weather information for any city around the world. Built with a clean UI and smooth experience, SkyWea makes it easy to find weather data at a glance.

🔗 **Live Demo:** [https://skywea.netlify.app/](https://skywea.netlify.app/)

---

## 🚀 Features

* 📍 **Search Weather by City**
* 🌡️ **Temperature, Humidity, Wind Speed & Conditions**
* 🌍 **Global Weather Lookup**
* 🕒 **Real-Time Current Weather**
* 📱 **Responsive & Mobile-Friendly**
* ☁️ **Beautiful UI with Intuitive UX**

Weather icons and animations help visualize the current condition clearly.

---

## 🛠️ Tech Stack

### 🧠 Frontend

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **React.js** *(if used — otherwise plain JS; you can replace as per your stack)*

### 🚀 APIs

* **OpenWeatherMap API** — Fetches real-time weather data based on city search. ([GitHub][1])

### ☁️ Hosting & Deployment

* **Netlify** — Frontend deployed with continuous deployment from GitHub. ([Netlify][2])
  ⛅ Fast global CDN, HTTPS, and instant sharable links included.

---

## 📦 How It Works

SkyWea sends city search requests to the **OpenWeatherMap API**, retrieves weather details like temperature, humidity, and wind speed, and displays them in a clean UI. User input is validated, and errors (like invalid city names) show friendly messages.

---

## 🧩 Installation & Setup

To run SkyWea locally and customize it:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/skywea.git
cd skywea
```

### 2️⃣ Install Dependencies

If your project uses **Node** and a package manager:

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root and add your weather API key:

```env
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
```

> Get your API key from [https://openweathermap.org/](https://openweathermap.org/)

### 4️⃣ Start the App

```bash
npm start
```

Then open:

👉 `http://localhost:3000`

---

## 📈 Usage Instructions

1. Enter a **city name** in the search bar.
2. Press **Enter** or click the search button.
3. View the **current weather details**.
4. Weather results update as you search new cities.

---


## 📦 API Reference

**OpenWeatherMap API**



## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch 
3. Make your changes
4. Submit a Pull Request

Please ensure code quality and clean UI standards.

---

## 📄 License

This project is licensed under the **MIT License** — see the **LICENSE** file for details.

---

## 👤 Author

**Aakash Agrahari**
🔗 Live Demo: [https://skywea.netlify.app/](https://skywea.netlify.app/)



