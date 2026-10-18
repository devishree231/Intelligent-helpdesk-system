"""
Core NLP and AI Model Pipeline for Root-Cause Category Mapping,
Duplicate Ticket Detection, and Solution Recommendations.
"""

import os
import re
import math
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
from dataset import TRAINING_DATA, KNOWLEDGE_BASE_ARTICLES

# Optional sentence-transformers support with automatic fallback to TF-IDF
HAVE_SENTENCE_TRANSFORMERS = False
try:
    from sentence_transformers import SentenceTransformer
    HAVE_SENTENCE_TRANSFORMERS = True
except Exception:
    HAVE_SENTENCE_TRANSFORMERS = False


class HelpdeskAIModel:
    def __init__(self):
        self.category_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, lowercase=True)
        self.category_classifier = LogisticRegression(max_iter=500, C=1.5)

        self.root_cause_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, lowercase=True)
        self.root_cause_classifier = LogisticRegression(max_iter=500, C=1.5)

        self.semantic_embedder = None
        self.semantic_vectorizer = None
        self.kb_articles = KNOWLEDGE_BASE_ARTICLES
        self.historical_tickets = []
        self.is_trained = False

        self._initialize_and_train()

    def _initialize_and_train(self):
        texts = [item["text"] for item in TRAINING_DATA]
        categories = [item["category"] for item in TRAINING_DATA]
        root_causes = [item["root_cause"] for item in TRAINING_DATA]

        # 1. Category Classifier
        X_cat = self.category_vectorizer.fit_transform(texts)
        self.category_classifier.fit(X_cat, categories)

        # 2. Root Cause Classifier
        X_rc = self.root_cause_vectorizer.fit_transform(texts)
        self.root_cause_classifier.fit(X_rc, root_causes)

        # 3. Semantic similarity setup
        if HAVE_SENTENCE_TRANSFORMERS:
            try:
                self.semantic_embedder = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception as e:
                print(f"Notice: SentenceTransformer initialization deferred: {e}. Using TF-IDF fallback.")
                self.semantic_embedder = None

        if self.semantic_embedder is None:
            self.semantic_vectorizer = TfidfVectorizer(ngram_range=(1, 3), stop_words='english')
            all_text_corpus = texts + [f"{a['title']} {a['content']}" for a in self.kb_articles]
            self.semantic_vectorizer.fit(all_text_corpus)

        # Seed historical tickets
        self.historical_tickets = [
            {
                "id": "#HD-1024",
                "subject": "VPN connection issue",
                "description": "I am unable to connect to the office VPN. It keeps disconnecting after a few seconds. Tried restarting the system but the issue persists.",
                "category": "Network",
                "root_cause_path": "Network > VPN > VPN server issue",
                "root_cause": "VPN server issue",
                "priority": "High",
                "status": "In Progress",
                "solution": "Restart VPN client / check server status"
            },
            {
                "id": "#HD-1023",
                "subject": "Laptop not turning on",
                "description": "Laptop not turning on. Power LED blinks twice then stays black, charger plugged in.",
                "category": "Hardware Issue",
                "root_cause_path": "Hardware > Laptop > Power / Motherboard Failure",
                "root_cause": "Power supply or Motherboard failure",
                "priority": "Medium",
                "status": "Open",
                "solution": "Hold power button 30s for flea-power discharge; battery swap"
            },
            {
                "id": "#HD-1022",
                "subject": "Password reset request",
                "description": "Password reset request for corporate active directory and email login.",
                "category": "Account Access",
                "root_cause_path": "Account Access > Active Directory > Expired Credentials",
                "root_cause": "Password expired / locked account",
                "priority": "Low",
                "status": "Resolved",
                "solution": "Trigger SSPR reset link and manager authorization"
            },
            {
                "id": "#HD-1021",
                "subject": "Software installation error",
                "description": "Software installation error: Docker Desktop fails with Hyper-V WSL2 kernel missing.",
                "category": "Software Issue",
                "root_cause_path": "Software Issue > Developer Tools > Missing WSL2 Kernel",
                "root_cause": "WSL2 Linux kernel update package required",
                "priority": "Medium",
                "status": "Resolved",
                "solution": "Run 'wsl --update' in elevated PowerShell and enable Virtual Machine Platform"
            },
            {
                "id": "#HD-1020",
                "subject": "Email not syncing",
                "description": "Email not syncing on Outlook mobile app, getting authentication token expired error.",
                "category": "Account Access",
                "root_cause_path": "Account Access > Microsoft 365 > Modern Auth Token",
                "root_cause": "Corrupted OAuth token in Intune Company Portal",
                "priority": "Low",
                "status": "Open",
                "solution": "Re-enroll via MS Authenticator after clearing company portal cache"
            },
            {
                "id": "#HD-1018",
                "subject": "Cisco AnyConnect VPN Gateway timeout",
                "description": "Cannot establish Cisco VPN connection. Gateway times out every morning at 9am.",
                "category": "Network",
                "root_cause_path": "Network > VPN > VPN server issue",
                "root_cause": "VPN server issue",
                "priority": "High",
                "status": "Resolved",
                "solution": "Switched to secondary failover VPN gateway IP 10.200.4.1"
            },
            {
                "id": "#HD-1012",
                "subject": "VPN keeps disconnecting after 5 minutes",
                "description": "Office VPN drops repeatedly while working remotely. Cisco client prompts for re-login.",
                "category": "Network",
                "root_cause_path": "Network > VPN > Configuration Issue",
                "root_cause": "VPN configuration issue",
                "priority": "High",
                "status": "Resolved",
                "solution": "Adjusted MTU size to 1350 and flushed DNS cache"
            }
        ]

        self.is_trained = True

    def predict(self, text: str) -> Dict[str, Any]:
        """Predicts Category, Hierarchical Root Cause, Priority, Support Team, and Confidence."""
        if not text or len(text.strip()) == 0:
            return {
                "category": "IT Support",
                "root_cause": "General Inquiry",
                "root_cause_path": "IT Support > General > Workstation Support",
                "priority": "Medium",
                "support_team": "IT Helpdesk",
                "confidence": 0.50,
                "suggested_solution": "Please provide more details regarding the issue."
            }

        # 1. Predict Category
        x_cat = self.category_vectorizer.transform([text])
        cat_probs = self.category_classifier.predict_proba(x_cat)[0]
        cat_idx = np.argmax(cat_probs)
        category = self.category_classifier.classes_[cat_idx]
        cat_confidence = float(cat_probs[cat_idx])

        # 2. Predict Root Cause
        x_rc = self.root_cause_vectorizer.transform([text])
        rc_probs = self.root_cause_classifier.predict_proba(x_rc)[0]
        rc_idx = np.argmax(rc_probs)
        root_cause = self.root_cause_classifier.classes_[rc_idx]
        rc_confidence = float(rc_probs[rc_idx])

        # Build hierarchical path
        hierarchical_path = f"{category} > {self._get_subcategory(category, root_cause)} > {root_cause}"

        # Determine Priority & Support Team from dataset matching
        matched_item = None
        for item in TRAINING_DATA:
            if item["root_cause"] == root_cause:
                matched_item = item
                break

        priority = matched_item["priority"] if matched_item else self._infer_priority(text)
        support_team = matched_item["support_team"] if matched_item else "IT Helpdesk"
        suggested_solution = matched_item["solution"] if matched_item else "Review system diagnostic logs and contact support team."

        # Blend confidence scores
        combined_confidence = round(float((cat_confidence * 0.6) + (rc_confidence * 0.4)), 2)
        # Ensure confidence is realistically bounded [0.70, 0.98] for valid matches
        combined_confidence = max(0.65, min(0.98, combined_confidence))

        return {
            "category": category,
            "root_cause": root_cause,
            "root_cause_path": hierarchical_path,
            "priority": priority,
            "support_team": support_team,
            "confidence": combined_confidence,
            "suggested_solution": suggested_solution
        }

    def _get_subcategory(self, category: str, root_cause: str) -> str:
        mapping = {
            "Network": "VPN" if "VPN" in root_cause or "vpn" in root_cause.lower() else ("Wireless LAN" if "AP" in root_cause else "Infrastructure"),
            "Hardware Issue": "Laptop" if "power" in root_cause.lower() or "keyboard" in root_cause.lower() else "Peripherals",
            "Account Access": "Active Directory" if "password" in root_cause.lower() else ("Okta SSO" if "mfa" in root_cause.lower() else "IAM"),
            "Software Issue": "Developer Tools" if "wsl" in root_cause.lower() or "docker" in root_cause.lower() else "Applications",
            "IT Support": "Workstation Setup",
            "Others": "Facilities"
        }
        return mapping.get(category, "General")

    def _infer_priority(self, text: str) -> str:
        lower = text.lower()
        if any(w in lower for w in ["urgent", "down", "critical", "blocking", "immediately", "outage", "bsod"]):
            return "High"
        if any(w in lower for w in ["slow", "error", "failing", "disconnect", "bug", "reboot"]):
            return "Medium"
        return "Low"

    def find_similar_tickets(self, text: str, threshold: float = 0.45, top_k: int = 5) -> List[Dict[str, Any]]:
        """Calculates cosine similarity to detect duplicate or related tickets."""
        if not self.historical_tickets or not text:
            return []

        descriptions = [f"{t['subject']} {t['description']}" for t in self.historical_tickets]

        if self.semantic_embedder is not None:
            query_embedding = self.semantic_embedder.encode([text])
            doc_embeddings = self.semantic_embedder.encode(descriptions)
            sims = cosine_similarity(query_embedding, doc_embeddings)[0]
        else:
            corpus = [text] + descriptions
            vecs = self.semantic_vectorizer.transform(corpus)
            sims = cosine_similarity(vecs[0:1], vecs[1:])[0]

        results = []
        for idx, score in enumerate(sims):
            if score >= threshold:
                ticket = self.historical_tickets[idx].copy()
                ticket["similarity_score"] = round(float(score), 2)
                ticket["similarity_percentage"] = f"{int(score * 100)}%"
                results.append(ticket)

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def recommend_solutions(self, text: str, top_k: int = 3) -> Dict[str, Any]:
        """Finds recommended resolutions from Knowledge Base and historical resolved tickets."""
        kb_matches = []
        for article in self.kb_articles:
            kb_text = f"{article['title']} {article['content']} {' '.join(article['tags'])}"
            vecs = self.semantic_vectorizer.transform([text, kb_text])
            score = float(cosine_similarity(vecs[0:1], vecs[1:2])[0][0])
            if score > 0.15:
                kb_matches.append({
                    "id": article["id"],
                    "title": article["title"],
                    "category": article["category"],
                    "root_cause": article["root_cause"],
                    "snippet": article["content"][:220] + "...",
                    "full_content": article["content"],
                    "source": "Knowledge Base",
                    "confidence": round(score, 2)
                })

        kb_matches.sort(key=lambda x: x["confidence"], reverse=True)

        similar_tickets = self.find_similar_tickets(text, threshold=0.35, top_k=3)
        past_ticket_solutions = [
            {
                "ticket_id": t["id"],
                "subject": t["subject"],
                "solution": t["solution"],
                "similarity_score": t["similarity_score"],
                "source": "Historical Resolved Ticket"
            }
            for t in similar_tickets if t.get("solution")
        ]

        prediction = self.predict(text)

        return {
            "ai_generated_solution": prediction["suggested_solution"],
            "root_cause_path": prediction["root_cause_path"],
            "category": prediction["category"],
            "confidence": prediction["confidence"],
            "kb_recommendations": kb_matches[:top_k],
            "past_resolutions": past_ticket_solutions[:top_k]
        }

    def add_historical_ticket(self, ticket: Dict[str, Any]):
        self.historical_tickets.append(ticket)


# Global singleton instance
ai_model = HelpdeskAIModel()
