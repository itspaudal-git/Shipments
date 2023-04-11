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

# Get user input for Facility Term, Date, and Carrier
location = input("Enter the Location to delete: ")
term = int(input("Enter the Term to delete: "))
date = input("Enter the Date to delete (MM/DD/YYYY): ")
carrier = input("Enter the Carrier_Meals_Ice Configuration to delete: ")

# Initialize a counter variable
deleted_count = 0

# Iterate through the data to find rows with the specified Term, Date, and Carrier
for key, value in data.items():
    if int(value["Term"]) == term or value["Carrier"] == carrier or value["Facility"] == location or value["Date"] == date:
        print(key, value)
        # Delete the node with the specified key
        ref.child(key).delete()

        # Increment the counter
        deleted_count += 1

print(f"Deleted {deleted_count} selected record(s)")
