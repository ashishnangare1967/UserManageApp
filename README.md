
# **User Management API**

## **Description**
The **User Management API** is a backend system built using Node.js, Express, and TypeScript, with MongoDB as the database. It provides user registration, login, and admin functionalities, utilizing JWT for authentication and role-based access control (RBAC).


## **Prerequisites**
Before you begin, make sure you have the following installed on your system:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (either local or cloud-based, e.g., MongoDB Atlas)

## **Installation Instructions**

### **Step 1: Clone the repository**
Open your terminal and run the following command to clone the project repository:

```bash
git clone git@github.com:ashishnangare1967/UserManageApp.git
```

### **Step 2: Install dependencies**
Navigate to the project folder and install the required dependencies:

```bash
cd UserManageApp
npm install
```

### **Step 3: Create `.env` file**
Create a `.env` file in the root directory of the project, and add the following environment variables:

```
MONGODB_URI=your-mongodb-connection-string
PORT=5000
JWT_SECRET=your-secret-key
```

Replace `your-mongodb-connection-string` with your MongoDB URI, and `your-secret-key` with a secret for JWT generation.

### **Step 4: Run the application**
Start the server with the following command:

```bash
npm run dev
```

The API will start on `http://localhost:5000`.


## **API Endpoints**

### **User Module**

1. **Register**:  
   `POST /api/user/register`  
   Allows new users to register.

   - Request Body:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123"
     }
     ```

2. **Login**:  
   `POST /api/user/login`  
   Allows users to log in and receive a JWT token.

   - Request Body:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```

3. **View Profile**:  
   `GET /api/user/profile`  
   Allows authenticated users to view their profile (JWT required).

### **Admin Module**

1. **Create User**:  
   `POST /api/admin/users`  
   Allows admin users to create other users.

2. **Get Users**:  
   `GET /api/admin/users`  
   Allows admin users to view all registered users (with pagination and filters).

3. **Update User**:  
   `PUT /api/admin/users/:id`  
   Allows admin users to update user details.

4. **Delete User**:  
   `DELETE /api/admin/users/:id`  
   Allows admin users to delete a user (except themselves).

---

## **Authentication & Authorization**
- **JWT Authentication**:  
  Use the `Authorization` header with the value `Bearer <token>` to access protected routes.
  
- **Role-Based Access Control**:  
  Only users with the role `admin` can access the `/api/admin/*` endpoints.

---

## **Logging & Error Handling**
The application includes proper logging for unhandled rejections and uncaught exceptions, ensuring stability. Logs are recorded during the server shutdown process as well.

---

## **Contact**
For further assistance or queries, please contact:

- **Name**: Ashish Nangare
- **Email**: ashishnangare1967@gmail.com
- **Phone No**: 8452857699
