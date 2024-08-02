# Trek-To-DO Listing Website

## Framework & Database

- **Framework:** Node.js
- **Database:** MongoDB

---

## Modules / Packages Used

- **Express:** Web application framework for Node.js
- **EJS:** Templating engine for rendering views
- **method-override:** Middleware to support HTTP method overrides
- **EJS Mate:** Layouts and partials for EJS
- **Joi:** Schema-based validation for data
- **connect-flash:** Flash messaging for user notifications
- **passport:** Authentication middleware
- **multer:** Middleware for handling file uploads
- **cloudinary:** Cloud storage service for image management
- **MapBox:** Interactive maps integration
- **connect-mongo:** MongoDB session store
- **Atlas:** MongoDB cloud database

---

## Demo Site

Explore the live demo of the website [here](https://trek-to-do-listing-site.onrender.com/).

---

## Routes

- `/listings`: View all listings
- `/login`: User login page
- `/signup`: User signup page
- `/admin/login`: Admin login page
- `/admin/signup`: Admin signup page

---

## Running the Website Locally

### Installation

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2. **Navigate to your project directory:**
    ```bash
    cd <project-directory>
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1. **Create a `.env` file in the root directory and add your environment variables:**
    ```bash
    CLOUD_NAME=<your-cloudinary-cloud-name> // KEY
    CLOUD_API_KEY=<your-cloudinary-key> // KEY
    CLOULD_API_SECRET=<your-cloudinary-secret> // KEY
    MAP_TOKEN=<your-mapbox-token> // KEY
    ADMIN_KEY=<admin-key> //Any Secrect Text
    ATLAS_DB_URL=<your-mongodb-atlas-url> // KEY
    SESSION_SCRECT=<your-session-secret> //Any Secrect Text
    ```
2. **OR you can go with Previous version**


### Running the Application

1. **Start the server:**
    ```bash
    node app.js
    ```

### Viewing the Website

1. **Open your web browser and visit:**
    ```text
    http://localhost:8080/listings
    ```

---

Feel free to reach out with any questions or issues you encounter while setting up the project. Enjoy exploring Trek-To-DO Listing Website!
