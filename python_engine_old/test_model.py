import pandas as pd
import pickle
import os
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
import numpy as np

print("="*70)
print("🔬 COMPREHENSIVE MODEL EVALUATION")
print("="*70)

# Set base path
base_path = os.path.dirname(os.path.abspath(__file__))

# Load the training dataset
print("\n📊 Loading training dataset for cross-validation...")
training_path = os.path.join(base_path, 'Training.csv')
train_data = pd.read_csv(training_path)

X = train_data.drop("prognosis", axis=1)
y = train_data["prognosis"]

print(f"   - Training data shape: {X.shape}")
print(f"   - Number of diseases: {y.nunique()}")
print(f"   - Total samples: {len(y)}")

# ============================================================================
# PART 1: CROSS-VALIDATION (MOST RELIABLE METHOD)
# ============================================================================
print("\n" + "="*70)
print("📈 PART 1: CROSS-VALIDATION ON TRAINING DATA")
print("="*70)
print("This is the MOST RELIABLE way to evaluate your model")
print("We split your training data into 5 folds and test on each fold\n")

# Use same model configuration as in training
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Perform 5-fold cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')

print(f"Cross-Validation Results (5-fold):")
print(f"   - Fold 1: {cv_scores[0]*100:.2f}%")
print(f"   - Fold 2: {cv_scores[1]*100:.2f}%")
print(f"   - Fold 3: {cv_scores[2]*100:.2f}%")
print(f"   - Fold 4: {cv_scores[3]*100:.2f}%")
print(f"   - Fold 5: {cv_scores[4]*100:.2f}%")
print(f"\n{'='*70}")
print(f"🎯 AVERAGE ACCURACY: {cv_scores.mean()*100:.2f}% (± {cv_scores.std()*100:.2f}%)")
print(f"{'='*70}")

# Interpretation
if cv_scores.mean() >= 0.95:
    print("\n✅ EXCELLENT! Your model performs very well.")
    print("   This suggests the symptom patterns are distinctive.")
elif cv_scores.mean() >= 0.85:
    print("\n✅ GOOD! Your model has strong performance.")
    print("   There may be some overlapping symptoms between diseases.")
elif cv_scores.mean() >= 0.75:
    print("\n⚠️  MODERATE. The model works but has room for improvement.")
    print("   Some diseases may have very similar symptoms.")
else:
    print("\n❌ NEEDS IMPROVEMENT. Consider:")
    print("   - Collecting more training data")
    print("   - Feature engineering")
    print("   - Trying different model parameters")

# ============================================================================
# PART 2: TRAIN/TEST SPLIT EVALUATION
# ============================================================================
print("\n" + "="*70)
print("📊 PART 2: TRAIN/TEST SPLIT EVALUATION")
print("="*70)

from sklearn.model_selection import train_test_split

# Split data: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Split data:")
print(f"   - Training samples: {len(X_train)}")
print(f"   - Testing samples: {len(X_test)}")

# Train model on training split
model_split = RandomForestClassifier(n_estimators=100, random_state=42)
model_split.fit(X_train, y_train)

# Predict on test split
y_pred = model_split.predict(X_test)
split_accuracy = accuracy_score(y_test, y_pred)

print(f"\n🎯 Test Set Accuracy: {split_accuracy*100:.2f}%")

# Show confusion matrix for most commonly confused diseases
cm = confusion_matrix(y_test, y_pred)
misclassified = pd.DataFrame({
    'actual': y_test[y_test != y_pred],
    'predicted': y_pred[y_test != y_pred]
})

if len(misclassified) > 0:
    print(f"\n❌ Misclassifications found: {len(misclassified)}")
    print("\nTop 5 Most Common Mistakes:")
    misclass_counts = misclassified.groupby(['actual', 'predicted']).size().sort_values(ascending=False)
    for i, ((actual, predicted), count) in enumerate(misclass_counts.head(5).items(), 1):
        print(f"   {i}. {actual} → {predicted}: {count} times")
else:
    print("\n✅ Perfect! No misclassifications on test set.")

# ============================================================================
# PART 3: FEATURE IMPORTANCE ANALYSIS
# ============================================================================
print("\n" + "="*70)
print("🔍 PART 3: FEATURE IMPORTANCE ANALYSIS")
print("="*70)
print("Which symptoms are most important for predictions?\n")

# Get feature importance
model.fit(X, y)  # Fit on full data for feature importance
feature_importance = pd.DataFrame({
    'symptom': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Top 15 Most Important Symptoms:")
for i, row in feature_importance.head(15).iterrows():
    print(f"   {row.name+1:2d}. {row['symptom']:35s} {row['importance']:.4f}")

print("\nBottom 10 Least Important Symptoms:")
for i, row in feature_importance.tail(10).iterrows():
    print(f"   {row.name+1:2d}. {row['symptom']:35s} {row['importance']:.4f}")

# ============================================================================
# PART 4: PER-DISEASE PERFORMANCE
# ============================================================================
print("\n" + "="*70)
print("📊 PART 4: PER-DISEASE PERFORMANCE")
print("="*70)

# Calculate per-disease accuracy from the train/test split
unique_diseases = sorted(y_test.unique())
disease_accuracy = {}

for disease in unique_diseases:
    mask = y_test == disease
    if mask.sum() > 0:
        correct = (y_test[mask] == y_pred[mask]).sum()
        total = mask.sum()
        accuracy_pct = (correct / total * 100) if total > 0 else 0
        disease_accuracy[disease] = (accuracy_pct, total)

# Sort by accuracy
sorted_diseases = sorted(disease_accuracy.items(), key=lambda x: x[1][0], reverse=True)

print("\n🏆 Top 10 Best Performing Diseases:")
for i, (disease, (acc, samples)) in enumerate(sorted_diseases[:10], 1):
    print(f"   {i:2d}. {disease:40s} {acc:6.2f}% ({samples} samples)")

print("\n⚠️  Top 10 Worst Performing Diseases:")
for i, (disease, (acc, samples)) in enumerate(sorted_diseases[-10:], 1):
    print(f"   {i:2d}. {disease:40s} {acc:6.2f}% ({samples} samples)")

# ============================================================================
# SUMMARY & RECOMMENDATIONS
# ============================================================================
print("\n" + "="*70)
print("📋 SUMMARY & RECOMMENDATIONS")
print("="*70)

avg_cv_accuracy = cv_scores.mean() * 100
split_accuracy_pct = split_accuracy * 100

print(f"\n📊 Key Metrics:")
print(f"   - Cross-Validation Accuracy: {avg_cv_accuracy:.2f}% ± {cv_scores.std()*100:.2f}%")
print(f"   - Train/Test Split Accuracy: {split_accuracy_pct:.2f}%")
print(f"   - Number of misclassifications: {len(misclassified)}/{len(y_test)}")

print(f"\n💡 Interpretation:")
if avg_cv_accuracy >= 95:
    print("   ✅ Your model is performing EXCELLENTLY")
    print("   ✅ The symptom patterns are highly distinctive")
    print("   ✅ Ready for production use with confidence")
elif avg_cv_accuracy >= 85:
    print("   ✅ Your model is performing WELL")
    print("   ⚠️  Some symptom overlap between diseases")
    print("   💡 Consider collecting more edge cases for improvement")
elif avg_cv_accuracy >= 75:
    print("   ⚠️  Your model is MODERATE")
    print("   ❌ Significant symptom overlap between some diseases")
    print("   💡 Recommendations:")
    print("      - Increase training data")
    print("      - Try different algorithms (XGBoost, Neural Networks)")
    print("      - Feature engineering (symptom combinations)")
else:
    print("   ❌ Your model needs IMPROVEMENT")
    print("   💡 Recommendations:")
    print("      - Collect much more training data")
    print("      - Verify data quality")
    print("      - Try ensemble methods")
    print("      - Consider feature selection")

# Check for overfitting
diff = abs(avg_cv_accuracy - split_accuracy_pct)
print(f"\n🔍 Overfitting Check:")
print(f"   - Difference between CV and Split: {diff:.2f}%")
if diff < 2:
    print("   ✅ No overfitting detected - model generalizes well")
elif diff < 5:
    print("   ⚠️  Minor variance - acceptable")
else:
    print("   ❌ Possible overfitting - consider regularization")

print("\n" + "="*70)
print("✅ COMPREHENSIVE EVALUATION COMPLETE!")
print("="*70)
print("\n💡 The Cross-Validation accuracy is your MOST RELIABLE metric.")
print("   Use this number when reporting model performance.\n")