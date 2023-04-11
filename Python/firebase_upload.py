import csv
import firebase_admin
from firebase_admin import credentials, db
import os

# Set the path to your CSV file
csv_path = "Scanner/veho.csv"

# Set the environment variable to specify the service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "Data/serviceAccountKey.json"

# Initialize the Firebase Admin SDK
cred = credentials.Certificate("Data/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://shipments-169d4-default-rtdb.firebaseio.com/'
})

# Create a reference to the "Tracking Numbers" node in the Realtime Database
ref = db.reference('Scanned')

# # Delete the entire "Tracking Numbers" node and its child nodes
# ref.delete()

# Read the CSV file and store the data in a list of dictionaries
shipments = []
try:
    with open(csv_path, "r") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            shipment = {
                "Carrier": row.get("Carrier", ""),
                "Tracking_Numbers": row.get("Tracking_Numbers", ""),
                "Date": row.get("Date", ""),
                "Facility": row.get("Facility", ""),
                "Cycle": int(row.get("Cycle", 0)),
                "Term": row.get("Term", "")
            }
            shipments.append(shipment)
except FileNotFoundError:
    print(f"Error: CSV file {csv_path} not found")
    exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    exit(1)

# Add each shipment to the "Tracking Numbers" node in the Realtime Database
for shipment in shipments:
    new_shipment_ref = ref.push()
    new_shipment_ref.set(shipment)
