# AI-Powered Customer Churn Prediction Web App

This is a full-stack dashboard application designed to predict customer churn, categorize risk, and provide actionable insights using a pre-trained scikit-learn model. 

## Project Structure

The project consists of two main components:
- `backend/`: A Python Flask API that loads the machine learning model (`churn_model.pkl`), performs data validation, executes feature engineering, and serves the prediction results.
- `frontend/`: A React (Vite) application that acts as the corporate dashboard. It accepts user input, connects to the backend API, and renders the predictions alongside dynamic visual components and intelligent suggestions.

## Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (3.10+)
- **pip** (Python Package Installer)

---

## How to Run the Application Locally

You will need to run the **backend** and **frontend** concurrently in two separate terminal windows.

### 1. Start the Flask Backend
Open a new terminal window and navigate to the project directory:

```bash
# Navigate to the backend directory
cd backend

# (Optional but recommended) Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the exact Python dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```
> The backend should now be running at `http://localhost:5000`. You will see a `Model loaded successfully.` message in the terminal.

### 2. Start the React Frontend
Open a second terminal window and navigate to the project directory:

```bash
# Navigate to the frontend directory
cd frontend

# Install the Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```
> The frontend should now be running at `http://localhost:5173`. 

---

## Testing the Flow
1. Open your browser and navigate to `http://localhost:5173`.
2. Fill out the **Customer Profile** form.
3. Click the **Predict Churn** button.
4. The **Insights Dashboard** will instantly update to show the customer's churn probability, risk level, predictive reasons, and recommended actions.

## Troubleshooting
- **Model Load Errors**: Ensure that `scikit-learn` version `1.6.1` is strictly installed in the backend as defined in `requirements.txt`. The model was trained with this specific version and might fail to load on newer versions like `1.8.0`.
- **API Connection Error**: If the frontend displays an API connection error, ensure your Flask backend terminal is actively running without any crashed stack traces, and verify it is running on port `5000`.
