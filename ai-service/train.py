"""
Offline training and model serialization script for Helpdesk AI Root-Cause Mapping.
"""

import joblib
from model import ai_model

def train_and_export():
    print("Training Helpdesk AI Classification & Root-Cause Pipeline...")
    # Model is initialized and fitted on dataset.py in constructor
    print("Saving vectorizers and models to disk...")
    joblib.dump(ai_model.category_vectorizer, "category_vectorizer.joblib")
    joblib.dump(ai_model.category_classifier, "category_classifier.joblib")
    joblib.dump(ai_model.root_cause_vectorizer, "root_cause_vectorizer.joblib")
    joblib.dump(ai_model.root_cause_classifier, "root_cause_classifier.joblib")
    print("Model training complete! Artifacts serialized successfully.")

if __name__ == "__main__":
    train_and_export()
