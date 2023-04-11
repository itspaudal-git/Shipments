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

# Iterate through the data to find rows with the specified Carrier and Tracking_Numbers length not equal to 17
for key, value in data.items():
    if value["Carrier"] == "UPS_4_05B" and len(value["Tracking_Numbers"]) != 18:
        # Delete the node with the specified key
        ref.child(key).delete()

print("Deleted")
