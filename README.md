# Intelligent Helpdesk Ticketing System with Automated Root-Cause Category Mapping

A modern, responsive, full-stack AI-powered helpdesk ticketing web application designed to automate ticket classification, hierarchical root-cause category mapping, semantic duplicate detection, and intelligent solution recommendations based on the reference design.

---

## 📸 UI Reference Alignment

The application matches the provided reference interface:

| Screen / Feature | Reference Image Mapping | Implementation Details |
| :--- | :--- | :--- |
| **Theme & Layout** | Dark Navy Sidebar (`#0e1726`), Clean Blue/White Canvas, Soft Rounded Cards | Built using Tailwind CSS, responsive on desktop and mobile. |
| **Top Navigation** | Search bar, Notification Bell (Badge 1), User Profile (`Shreenithi - Employee`) | Interactive global search, real-time alert popover, role switcher (Employee, Engineer, Admin). |
| **Dashboard Metric Cards** | Total Tickets: 24 (+12%), Resolved: 16 (+20%), In Progress: 5 (+17%), Open: 3 (-25%) | Dynamically computed from real application state. |
| **Category Donut Chart** | 24 Total in center. Legend: IT Support (8), Software Issue (6), Hardware Issue (4), Account Access (3), Network (2), Others (1) | Rendered with Recharts `PieChart`, centered label, colored dots & percentages. |
| **7-Day Trend Bar Chart** | Oct 9 - Oct 15 (Created vs Resolved bars) | Rendered with Recharts grouped `BarChart`. |
| **Recent Tickets Table** | Shows #HD-1024, #HD-1023, #HD-1022, #HD-1021 with colored Category, Priority, and Status pills | Fully interactive table with direct "View" button to ticket detail. |
| **My Tickets Page** | Tabs: All (24), Open (3), In Progress (5), Resolved (16) with pagination `< 1 2 3 4 5 >` | Search, Category & Priority filter dropdowns, paginated at 5 per page. |
| **Create Ticket Page** | Subject, Category, Priority, Description, Drag & Drop Upload | Integrated real-time AI Assistant with debounced automated prediction. |
| **Ticket Detail & AI Analysis** | #HD-1024 (VPN connection issue), Root cause, Solution, Similar tickets | Hierarchical tree: `Network > VPN > VPN server issue`, 94% confidence, similar duplicate drawer. |
| **Analytics & Reports** | Total (124), Resolved (98), Avg Res (4.2 hrs), CSAT (4.6/5), Priority Donut, Horizontal Category Bars | Filterable by 7d, 30d, 90d, 1y. |
| **Knowledge Base** | Troubleshooting articles used by AI solution engine | Category filters, article reader modal, like tracker, admin article creation. |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Axios
- **Backend API**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate, REST APIs
- **AI Microservice**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, NumPy, Sentence-Transformers
- **NLP / ML Pipeline**:
  - TF-IDF Vectorization (`ngram_range=(1, 2)`)
  - Multi-Class Logistic Regression & Linear SVC for automated Category and Root Cause
  - Cosine Similarity & Semantic Embeddings for duplicate ticket detection
  - Knowledge Base & Past Resolution Recommender
- **Database**: PostgreSQL 15 (with seamless H2 / LocalStorage zero-setup development fallback)
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start Guide

### Option 1: Run Everything with Docker Compose (Recommended)

Make sure Docker is running on your machine, then execute:

```bash
docker compose up --build
```

Services will start at:
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **Spring Boot Backend**: [http://localhost:8080](http://localhost:8080)
- **FastAPI AI Microservice**: [http://localhost:8000](http://localhost:8000)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Database**: `localhost:5432` (`helpdesk_db`)

---

### Option 2: Run Locally Step-by-Step

#### 1. AI Microservice (Python FastAPI)

```bash
cd ai-service

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
*API will run on [http://localhost:8000](http://localhost:8000).*

#### 2. Backend (Java Spring Boot)

Ensure Java 17 and Maven are installed:

```bash
cd backend

# Run with local H2 in-memory DB or PostgreSQL
mvn spring-boot:run
```
*Backend REST API will run on [http://localhost:8080](http://localhost:8080).*

#### 3. Frontend (React with Vite)

Ensure Node.js 18+ is installed:

```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
*Frontend will open on [http://localhost:3000](http://localhost:3000).*

> **💡 Zero-Setup Standalone Mode:**
> If you start just the frontend (`npm run dev`), the application will detect that the backend is offline and will **automatically switch to local persistent storage mode** pre-seeded with the exact 24 tickets from the screenshot. You can create tickets, update statuses, add comments, and test AI prediction without needing to configure a database first!

---

## 🧠 AI Root-Cause Category Mapping & NLP Architecture

1. **Category Classification**:
   Text descriptions are preprocessed and vectorized using TF-IDF n-grams $(1, 2)$. A multi-class classifier predicts one of:
   - `Network`
   - `Hardware Issue`
   - `Software Issue`
   - `Account Access`
   - `IT Support`
   - `Others`

2. **Hierarchical Root-Cause Mapping**:
   Instead of flat labels, the engine maps issues to an enterprise taxonomy tree:
   - `Network` ➔ `VPN` ➔ `VPN server issue`
   - `Hardware Issue` ➔ `Laptop` ➔ `Power / Motherboard Failure`
   - `Software Issue` ➔ `Developer Tools` ➔ `Missing WSL2 Kernel`
   - `Account Access` ➔ `Active Directory` ➔ `Expired Credentials`

3. **Semantic Duplicate Detection**:
   Calculates cosine similarity between incoming problem descriptions and existing tickets in the database. Tickets with $\ge 75\%$ similarity score are flagged to prevent duplicate workload.

4. **Intelligent Solution Recommendations**:
   Matches symptoms against the enterprise Knowledge Base (`KB-101` to `KB-106`) and past resolved tickets, surfacing step-by-step troubleshooting instructions directly on the ticket.

---

## 📂 Repository File Structure

```
helpdesk-ai/
├── README.md                      # Complete system documentation
├── docker-compose.yml             # Full stack multi-container orchestration
├── ai-service/                    # Python FastAPI AI microservice
│   ├── main.py                    # FastAPI REST endpoints
│   ├── model.py                   # NLP pipeline, classifiers, similarity engine
│   ├── dataset.py                 # Training data & knowledge base corpus
│   ├── train.py                   # Offline training & serialization
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # Container image definition
├── backend/                       # Java Spring Boot backend
│   ├── pom.xml                    # Maven dependencies
│   ├── Dockerfile                 # Multi-stage Java build
│   └── src/
│       ├── main/java/com/helpdesk/
│       │   ├── HelpdeskApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── model/             # Ticket, User, Comment, KnowledgeArticle
│       │   ├── repository/        # JPA repositories with filtering & search
│       │   ├── service/           # TicketService, AIServiceClient, KBService
│       │   ├── controller/        # REST controllers
│       │   └── dto/               # Request/Response data transfer objects
│       └── main/resources/
│           ├── application.yml    # Database & service URL configuration
│           ├── schema.sql         # PostgreSQL schema definition
│           └── data.sql           # Initial 24 seeded tickets & KB articles
└── frontend/                      # React.js + Vite + Tailwind CSS
    ├── package.json               # Node dependencies
    ├── vite.config.js             # Vite config & API proxying
    ├── tailwind.config.js         # Custom colors, theme & badges
    ├── index.html                 # HTML entrypoint
    ├── Dockerfile                 # Nginx production build
    └── src/
        ├── App.jsx                # Main layout & navigation
        ├── components/
        │   ├── Sidebar.jsx        # Dark navy sidebar
        │   ├── Header.jsx         # Search, notifications & role switcher
        │   ├── StatCard.jsx       # Metric & trend cards
        │   ├── CategoryChart.jsx  # Donut chart with centered total count
        │   ├── TrendChart.jsx     # Grouped 7-day bar chart
        │   ├── RecentTicketsTable.jsx
        │   ├── AIAnalysisCard.jsx # Root cause tree & duplicate drawer
        │   └── Badges.jsx         # Status, Category, Priority pills
        ├── pages/
        │   ├── Dashboard.jsx      # Top reference screen
        │   ├── MyTickets.jsx      # Bottom-left reference screen
        │   ├── CreateTicket.jsx   # Bottom-center reference screen
        │   ├── TicketDetail.jsx   # Bottom-center-right reference screen
        │   ├── Reports.jsx        # Bottom-right reference screen
        │   ├── KnowledgeBase.jsx  # Knowledge base management
        │   ├── AIAnalysisPage.jsx # Standalone AI inference playground
        │   └── Settings.jsx       # Architecture status & role simulator
        ├── context/
        │   └── TicketContext.jsx  # Global state & toast manager
        └── services/
            ├── api.js             # Unified API client with automatic fallback
            └── mockData.js        # Seed data matching reference image UI
```
