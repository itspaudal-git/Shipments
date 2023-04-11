import os
import re
import csv
import json
from googleapiclient.discovery import build
from google.oauth2 import service_account

# Define the regular expression for matching tracking numbers
tracking_number_ups = re.compile(r'\b1Z[0-9A-Z]{16}\b')
tracking_number_fdx = re.compile(r'\b6\d{11}\b')
tracking_number_uds = re.compile(r'\b[a-zA-Z0-9]{3}[A-Z]{3}\d{13}\b')
tracking_number_veho = re.compile(r'\b(?!\d{6})[A-Z0-9]{6}\b')

# Add the new tracking number regex patterns to the list
tracking_numbers = [tracking_number_ups, tracking_number_fdx, tracking_number_uds, tracking_number_veho]
all_header = ['Carrier','Tracking Numbers','Date','Facility','Cycle','Term']

# Create an empty list to store the tracking numbers
all_tracking_numbers = []

shipdate = str(input("What is the shipdate?"))
# Set the directory path where the files are located

excluded_values = ['NOTIFY', 'TOTALS', 'WEIGHT','625893943155','616832997455','606201718273']
# directory_path = r'C:\Users\Tovala\Box\Terms\Term 324\Chicago\CHI Cycle 1\CHI Tracking Numbers Cycle 1'
directory_path = r'C:\Users\Tovala\Box\Terms\Term 321\Chicago\CHI Cycle 2\CHI Tracking Numbers Cycle 2'

# Get the location from the directory path
location = os.path.basename(os.path.dirname(os.path.dirname(directory_path)))
print(location)  # Output: "Chicago"
# Get the cycle from the directory path
cycle = os.path.basename(directory_path).split()[-1]
print(cycle)  # Output: "2"
# Get the term number from the directory path using a regular expression
term_match = re.search(r'Term (\d+)', directory_path)
if term_match:
    term_number = term_match.group(1)
    term_dict = {'term_number': term_number}
    term_json = json.dumps(term_dict)
    # Extract the term number string
    term = json.loads(term_json)['term_number']
    print(term)  # Output: "321"
else:
    print("Error: Could not find term number in directory path.")

# Loop through all the files in the directory
for filename in os.listdir(directory_path):
    # Check if the file is a text file or a CSV file
    if filename.endswith('.txt') or filename.endswith('.csv'):
        # Open the file for reading
        with open(os.path.join(directory_path, filename), 'r') as file:
            # Read the contents of the file
            file_contents = file.read()
            # Search for all occurrences of the tracking number regex in the file contents
            for pattern in tracking_numbers:
                matches = pattern.findall(file_contents)
                # Add the tracking numbers to the list along with the date and carrier if found
                for match in matches:
                    if match not in excluded_values:
                        if pattern == tracking_number_ups:
                            carrier = 'UPS'
                        elif pattern == tracking_number_fdx:
                            carrier = 'Fedex'
                        elif pattern == tracking_number_uds:
                            carrier = 'UDS'
                        elif pattern == tracking_number_veho:
                            carrier = 'Veho'
                        all_tracking_numbers.append([carrier, match, shipdate,location, cycle, term])

# Save the tracking numbers to a CSV file
with open('Scanner/tracking_numbers.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(all_header)
    writer.writerows(all_tracking_numbers)

# Set up the Google Sheets API credentials
SERVICE_ACCOUNT_FILE = 'cred.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
workstation = '1S-YBULaz0PqsKUSB-h8Z0WhW7LzimyHSYomTNBmdlps'
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()

# Clear the existing values in the worksheet
request = sheet.values().clear(spreadsheetId=workstation, range="data!A2:F").execute()

# Upload the tracking numbers to the worksheet
request = sheet.values().update(spreadsheetId=workstation, range="data!A2:F", 
                                valueInputOption="USER_ENTERED", body={"values": all_tracking_numbers}).execute()
