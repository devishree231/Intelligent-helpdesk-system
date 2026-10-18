"""
FastAPI Microservice for AI-powered Root-Cause Category Mapping,
Semantic Duplicate Detection, and Intelligent Solution Recommendations.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import uvicorn
from model import ai_model

app = FastAPI(
    title="Intelligent Helpdesk AI Microservice",
    description="Automated Root-Cause Category Mapping and Semantic Solution Recommender",
    version="1.0.0"
)

# Enable CORS for React Frontend and Spring Boot Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketAnalysisRequest(BaseModel):
    subject: Optional[str] = ""
    description: str = Field(..., description="The user's ticket problem description")
    ticket_id: Optional[str] = None


class DuplicateDetectionRequest(BaseModel):
    text: str
    threshold: Optional[float] = 0.40
    top_k: Optional[int] = 5


class SolutionRecommendationRequest(BaseModel):
    text: str
    top_k: Optional[int] = 3


class NewTicketSyncRequest(BaseModel):
    id: str
    subject: str
    description: str
    category: str
    root_cause: Optional[str] = None
    priority: str
    status: str
    solution: Optional[str] = None


@app.get("/")
def read_root():
    return {
        "service": "Helpdesk AI Microservice",
        "status": "operational",
        "model": "TF-IDF + Hierarchical Multi-Class Logistic Regression & Cosine Similarity Embedder",
        "version": "1.0.0"
    }


@app.get("/api/ai/health")
def health():
    return {
        "status": "healthy",
        "is_model_trained": ai_model.is_trained,
        "corpus_ticket_count": len(ai_model.historical_tickets),
        "kb_article_count": len(ai_model.kb_articles)
    }


@app.post("/api/ai/predict")
def predict_category_and_root_cause(request: TicketAnalysisRequest):
    """
    Automated Root-Cause Category Mapping:
    Predicts the Category, Hierarchical Root-Cause Path, Probable Root Cause,
    Suggested Priority, and Estimated Confidence.
    """
    combined_text = f"{request.subject} {request.description}".strip()
    if not combined_text:
        raise HTTPException(status_code=400, detail="Description cannot be empty.")

    prediction = ai_model.predict(combined_text)
    similar_tickets = ai_model.find_similar_tickets(combined_text, threshold=0.40, top_k=3)

    return {
        "ticket_id": request.ticket_id,
        "category": prediction["category"],
        "probable_root_cause": prediction["root_cause"],
        "root_cause_path": prediction["root_cause_path"],
        "predicted_priority": prediction["priority"],
        "suggested_solution": prediction["suggested_solution"],
        "suggested_support_team": prediction["support_team"],
        "confidence_score": prediction["confidence"],
        "similar_ticket_count": len(similar_tickets),
        "similar_tickets": similar_tickets
    }


@app.post("/api/ai/similar-tickets")
def find_similar_tickets(request: DuplicateDetectionRequest):
    """
    Semantic Duplicate Detection:
    Finds existing tickets that share similar root cause or symptoms using cosine similarity.
    """
    results = ai_model.find_similar_tickets(
        text=request.text,
        threshold=request.threshold,
        top_k=request.top_k
    )
    return {
        "query": request.text,
        "matches_count": len(results),
        "similar_tickets": results
    }


@app.post("/api/ai/recommend-solution")
def recommend_solutions(request: SolutionRecommendationRequest):
    """
    Intelligent Solution Recommendation:
    Retrieves recommended solutions from historical resolved tickets and knowledge-base articles.
    """
    recommendations = ai_model.recommend_solutions(text=request.text, top_k=request.top_k)
    return recommendations


@app.post("/api/ai/sync-ticket")
def sync_ticket(ticket: NewTicketSyncRequest):
    """
    Syncs a new ticket into the AI similarity corpus dynamically.
    """
    ai_model.add_historical_ticket(ticket.dict())
    return {"status": "synced", "ticket_id": ticket.id}


@app.get("/api/ai/taxonomy")
def get_root_cause_taxonomy():
    """
    Returns the supported categories and hierarchical root cause taxonomy.
    """
    return {
        "categories": [
            {
                "name": "Network",
                "subcategories": [
                    {"name": "VPN", "root_causes": ["VPN server issue", "VPN configuration issue", "Client certificate error"]},
                    {"name": "Wireless LAN", "root_causes": ["AP Congestion / Channel interference", "SSID beacon loss"]},
                    {"name": "Switchport / DHCP", "root_causes": ["DHCP scope exhausted", "VLAN mismatch"]}
                ]
            },
            {
                "name": "Hardware Issue",
                "subcategories": [
                    {"name": "Laptop", "root_causes": ["Power supply or Motherboard failure", "Physical keyboard membrane failure"]},
                    {"name": "Battery", "root_causes": ["Degraded battery health", "Charging port pin damage"]},
                    {"name": "Peripherals", "root_causes": ["Faulty USB-C DisplayPort cable", "Docking station firmware"]}
                ]
            },
            {
                "name": "Account Access",
                "subcategories": [
                    {"name": "Active Directory", "root_causes": ["Password expired / locked account", "Kerberos ticket expiry"]},
                    {"name": "Okta SSO", "root_causes": ["MFA push token out of sync", "Suspicious login block"]},
                    {"name": "Microsoft 365", "root_causes": ["Corrupted OAuth token in Intune Company Portal"]}
                ]
            },
            {
                "name": "Software Issue",
                "subcategories": [
                    {"name": "Developer Tools", "root_causes": ["WSL2 Linux kernel update package required", "Docker daemon socket hung"]},
                    {"name": "Collaboration", "root_causes": ["Corrupted Teams Electron app cache", "Slack audio driver conflict"]},
                    {"name": "IDE", "root_causes": ["Insufficient JVM maximum heap size (-Xmx)"]}
                ]
            },
            {
                "name": "IT Support",
                "subcategories": [
                    {"name": "Workstation Setup", "root_causes": ["Workstation docking configuration", "Cable management"]},
                    {"name": "Printing", "root_causes": ["Roller paper jam in output tray", "Spooler service stopped"]},
                    {"name": "AV Systems", "root_causes": ["AV soundbar USB hub power disconnect"]}
                ]
            },
            {
                "name": "Others",
                "subcategories": [
                    {"name": "Facilities", "root_causes": ["Server room HVAC condenser leak", "Desk power trip"]},
                    {"name": "Policy", "root_causes": ["HR Policy inquiry", "Asset return request"]}
                ]
            }
        ]
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting Helpdesk AI Service on {host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=True)
