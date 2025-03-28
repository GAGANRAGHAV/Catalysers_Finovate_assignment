# Task Management System with Payment Integration

This project is a Task Management System designed for scalability and flexibility, incorporating payment integration for premium features. Users can register, create tasks, assign tasks to team members, track task status, and manage subscriptions. It is containerized and deployed using Docker and Kubernetes.

## Drive Project Video Link
https://drive.google.com/file/d/1Hvyi5W_kMWN5tM60zwKO6qAe16H3NEOm/view?usp=sharing

## Architecture

![image](https://github.com/user-attachments/assets/e169b169-04d2-447d-bf94-6ebf31d1e289)

---
## Features Implemented

| Evaluation Criteria     | Status            |
|-------------------------|-------------------|
| Frontend                | ✅                |
| Backend                 | ✅                |
| Payment Integration     | ✅                |
| Kafka Implementation    | ✅                |
| Docker & Kubernetes     | Containerized     |
| Documentation           | ✅                |

## Features

### 1. User Authentication and Role Management
- Register and log in using JWT-based authentication.
- Support for user roles: **Admin**, **Manager**, and **User** to control access.

### 2. Task Management
- **Admins** can create and assign tasks.
- **Users** can view assigned tasks and update their statuses (Pending, In Progress, Completed).
- **Managers** can view reports of all tasks and their statuses.

### 3. Payment Integration
- Integrated **Stripe/Razorpay** for subscription-based payments.
- **Free users**: Limited task creation.
- **Premium users**: Unlimited task creation and access to advanced reports.
- Payment webhooks to update user subscription status.

### 4. Task Status Reports
- Generate real-time reports showing task progress.
- **Kafka** handles task updates and notifications.

---
## Tech Stack

| **Component**         | **Technology**                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| **Frontend**          | [Next.js](https://nextjs.org/)                                                |
| **Backend**           | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)         |
| **Database**          | [PostgreSQL](https://www.postgresql.org/)                                     |
| **Messaging**         | [Kafka](https://kafka.apache.org/)                                            |
| **Payment Gateway**   | [Stripe](https://stripe.com/)                                                 |
| **Containerization**  | [Docker](https://www.docker.com/)                                             |
| **Orchestration**     | [Kubernetes](https://kubernetes.io/)                                          |

---

## Implementation Details

### **Frontend (Next.js)**
1. **Pages**:
   - Registration and login.
   - Dashboard to display tasks.
2. **Features**:
   - Form to create and assign tasks.
   - Integration with Stripe/Razorpay for payment processing.
   - Display subscription status on the user profile.

### **Backend (Node.js + Express)**
1. **APIs**:
   - User registration and login.
   - Task creation and assignment.
   - Task status updates.
   - Payment webhook handling.
2. **Authentication**:
   - JWT-based authentication for security.
3. **Messaging**:
   - Publish task updates to a Kafka topic.

### **Database (PostgreSQL)**
1. Tables:
   - **Users**: Store user details and roles.
   - **Tasks**: Store task details and statuses.
   - **Payments**: Manage user subscription statuses.

### **Containerization and Orchestration**
1. **Docker**:
   - Dockerfiles for frontend and backend.
   - Docker Compose for multi-container setup.
2. **Kubernetes**:
   - YAML files for deployment in a Kubernetes cluster.
   - Use Secrets to securely store environment variables.

---

## Setup Instructions

### Prerequisites
- Node.js, Docker, Kubernetes, and PostgreSQL installed.
- Stripe/Razorpay API keys.


## Installation

To get started with the Project, follow these steps:

1. Clone the repository to your local machine :

```bash
git clone https://github.com/GAGANRAGHAV/Catalysers_Finovate_assignment
```

2. Navigate to the project  frontend directory:

```bash
cd client3
```

3. Install project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Navigate to the project backend directory:

```bash
cd server
```

6. Install project dependencies:

```bash
npm install
```

7. Start the development server:

```bash
node server.js
```


8. docker Command:

```bash
docker-compose build
docker-compose up
```


