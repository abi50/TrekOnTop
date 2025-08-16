# 🌍 TrekOnTop – Travel Recommendations Platform

## 📖 Overview
**TrekOnTop** is a full-stack web application that allows users to **explore, share, and rate travel recommendations worldwide**.  
The project is built with **C# .NET 7 (Web API)** for the backend and **React + Redux (TypeScript)** for the frontend.

---

## 🔑 Features
- **User Management**
  - Registration & Login with JWT authentication  
  - Profile page with editable details and profile picture  
- **Places & Recommendations**
  - Browse by **country**, **city**, or **category**  
  - Add new recommendations with **multiple images**  
  - View recommendations with **likes/dislikes** and comments  
- **Smart Search & Map**
  - Find places by category, distance, or city  
  - Interactive map powered by **Google Maps API**  
- **Likes & Ratings**
  - Like/dislike recommendations (only one active at a time)  
- **Admin Tools**
  - Manage categories, countries, and cities  

---

## 🗂 Project Structure
- **DTOs (Data Transfer Objects)**  
  `UserDto`, `PlaceDto`, `CityDto`, `CountryDto`, `RecommendationDto`, `ImageDto`, `CategoryDto`, `RecommendationLikeDto`

- **Controllers (API Endpoints)**  
  - `AuthController` – Login/Register with JWT  
  - `UserController` – Manage users and profile pictures  
  - `PlaceController` – Manage places, nearby search, filter by country  
  - `RecommendationController` – CRUD for recommendations & images  
  - `RecommendationLikeController` – Likes & dislikes  
  - `ImageController` – Upload and manage images  
  - `CountryController`, `CityController`, `CategoryController` – Reference data  

---

## ⚙️ Tech Stack
- **Backend:** ASP.NET Core Web API, C#, Entity Framework  
- **Frontend:** React + Redux (TypeScript)  
- **Database:** SQL Server  
- **Authentication:** JWT Tokens  
- **Maps & Data:** Google Maps API  

---

## 🚀 Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/abi50/TrekOnTop.git

   ###

2. **Backend (C# .NET)**
- Open the solution in **Visual Studio**  
- Configure **`appsettings.json`** with your DB connection & JWT secret  
- Run with **IIS Express** or:  
  ```bash
  dotnet run
  ###
3. **Frontend (React)**
    ```bash
    cd client
    npm install
    npm start
    ###

 4. **Access the app**
- **Backend API:** [https://localhost:7083/api](https://localhost:7083/api)  
- **Frontend:** [http://localhost:3000](http://localhost:3000)  

---

## 👥 Authors & Copyright
Developed by **Abigail Berk**  

© 2025 TrekOnTop. All rights reserved.  

---

## 📊 Quick Access Summary

| Component  | URL                                |
|------------|------------------------------------|
| Backend API | [https://localhost:7083/api](https://localhost:7083/api) |
| Frontend   | [http://localhost:3000](http://localhost:3000) |

