import firebase_admin
from firebase_admin import credentials, db
import os

# Set the environment variable to specify the service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "Data/serviceAccountKey.json"

# Initialize the Firebase Admin SDK
cred = credentials.Certificate("Data/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://shipments-169d4-default-rtdb.firebaseio.com/'
})

# Create a reference to the "Data" node in the Realtime Database
ref = db.reference('Data')

# Retrieve data from the "Data" node
data = ref.get()

# Print the data retrieved
print("Retrieved data:", data)

# Initialize a counter variable
deleted_count = 0

# Iterate through the data to find rows with the specified date
for key, value in data.items():
    if int(value["Term"]) == 322:  # Convert the "Term" value to an integer before comparison
        print(key, value)
        # Delete the node with the specified key
        ref.child(key).delete()
        
        # Increment the counter
        deleted_count += 1

print(f"Deleted {deleted_count} selected Term(s)")


