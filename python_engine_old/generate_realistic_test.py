import pandas as pd
import numpy as np
import random
import os

print("="*70)
print("🔬 GENERATING REALISTIC CHALLENGING TEST DATASET")
print("="*70)

# Set base path
base_path = os.path.dirname(os.path.abspath(__file__))

# Load training data to understand patterns
print("\n📊 Analyzing training data patterns...")
training_path = os.path.join(base_path, 'Training.csv')
train_data = pd.read_csv(training_path)

symptoms = [col for col in train_data.columns if col != 'prognosis']
diseases = train_data['prognosis'].unique()

print(f"   - Found {len(symptoms)} symptoms")
print(f"   - Found {len(diseases)} diseases")

# Analyze symptom patterns for each disease from training data
disease_patterns = {}
for disease in diseases:
    disease_data = train_data[train_data['prognosis'] == disease]
    # Get symptoms that appear in >50% of cases for this disease
    symptom_freq = disease_data[symptoms].mean()
    common_symptoms = symptom_freq[symptom_freq > 0.5].index.tolist()
    occasional_symptoms = symptom_freq[(symptom_freq > 0.2) & (symptom_freq <= 0.5)].index.tolist()
    
    disease_patterns[disease] = {
        'common': common_symptoms,
        'occasional': occasional_symptoms
    }

print(f"   ✅ Learned patterns for {len(disease_patterns)} diseases")

# Generate challenging test cases
test_data = []
random.seed(123)  # Different seed than training
np.random.seed(123)

print("\n🎯 Generating test cases with realistic challenges:")
print("   - Incomplete symptom reporting (patients forget symptoms)")
print("   - Extra noise symptoms (unrelated symptoms)")
print("   - Atypical presentations (unusual symptom combinations)")
print("   - Borderline cases (minimal symptoms)")

for disease in diseases:
    pattern = disease_patterns[disease]
    
    # Generate 8-12 samples per disease with varying difficulty
    num_samples = random.randint(8, 12)
    
    for i in range(num_samples):
        row = {symptom: 0 for symptom in symptoms}
        
        # Determine case difficulty
        difficulty = random.choice(['easy', 'medium', 'hard', 'very_hard'])
        
        if difficulty == 'easy':
            # Easy case: Most common symptoms present
            for symptom in pattern['common']:
                if random.random() < 0.9:  # 90% chance
                    row[symptom] = 1
            for symptom in pattern['occasional']:
                if random.random() < 0.4:  # 40% chance
                    row[symptom] = 1
                    
        elif difficulty == 'medium':
            # Medium: Some symptoms missing
            for symptom in pattern['common']:
                if random.random() < 0.7:  # 70% chance
                    row[symptom] = 1
            for symptom in pattern['occasional']:
                if random.random() < 0.3:  # 30% chance
                    row[symptom] = 1
                    
        elif difficulty == 'hard':
            # Hard: Many symptoms missing, more noise
            for symptom in pattern['common']:
                if random.random() < 0.5:  # Only 50% chance
                    row[symptom] = 1
            for symptom in pattern['occasional']:
                if random.random() < 0.2:  # 20% chance
                    row[symptom] = 1
            # Add more noise
            noise_symptoms = random.sample(symptoms, min(3, len(symptoms)))
            for symptom in noise_symptoms:
                if random.random() < 0.15:  # 15% chance of random symptom
                    row[symptom] = 1
                    
        else:  # very_hard
            # Very hard: Minimal symptoms, atypical presentation
            # Only use a few common symptoms
            if len(pattern['common']) > 0:
                few_symptoms = random.sample(
                    pattern['common'], 
                    min(max(2, len(pattern['common'])//2), len(pattern['common']))
                )
                for symptom in few_symptoms:
                    if random.random() < 0.6:
                        row[symptom] = 1
            # Add significant noise
            noise_symptoms = random.sample(symptoms, min(5, len(symptoms)))
            for symptom in noise_symptoms:
                if random.random() < 0.2:  # 20% chance of random symptom
                    row[symptom] = 1
        
        row['prognosis'] = disease
        test_data.append(row)

# Create DataFrame
df = pd.DataFrame(test_data)

# Add index column as first column
df.insert(0, 'index', range(len(df)))

# Shuffle the data
df = df.sample(frac=1, random_state=123).reset_index(drop=True)
df['index'] = range(len(df))

# Save to CSV
output_path = os.path.join(base_path, 'testing_dataset_realistic.csv')
df.to_csv(output_path, index=False)

print(f"\n✅ Realistic challenging test dataset created!")
print(f"📊 Shape: {df.shape}")
print(f"📁 Saved to: {output_path}")
print(f"\n🔢 Dataset statistics:")
print(f"   - Total samples: {len(df)}")
print(f"   - Number of diseases: {df['prognosis'].nunique()}")
print(f"   - Samples per disease: {len(df) / df['prognosis'].nunique():.1f} (average)")

print(f"\n💡 This dataset includes:")
print(f"   - Incomplete symptom reporting")
print(f"   - Random noise symptoms")
print(f"   - Atypical disease presentations")
print(f"   - Borderline/minimal symptom cases")

print(f"\n⚠️  Expected accuracy: 75-90% (realistic for medical diagnosis)")
print(f"   (100% would indicate the test is too easy)")

print(f"\n✅ Ready to use for realistic model testing!")