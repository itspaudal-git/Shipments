import re
import csv
from googleapiclient.discovery import build
from google.oauth2 import service_account

# File paths
file_path_text = r'C:\Users\Tovala\Desktop\files\fdx\fedex.txt'
file_path_csv = r'C:\Users\Tovala\Desktop\files\fdx\fedex.csv'

# Read text file
with open(file_path_text, 'r') as file:
    data = file.readlines()

# Extract headers and records
headers = []
records = []

for line in data:
    if 'SHIP DATE' in line:
        headers = re.split(r'\s{2,}', line.strip())
    elif re.match(r'\d{2}/\d{2}/\d{4}', line.strip()) and not re.match(r'\d{2}/\d{2}/\d{4} - \d{2}/\d{2}/\d{4}\s+\d+\s+\d+ Manual Report\s+CAFE3621\s+Page: 1', line.strip()):
        records.append(re.split(r'\s{2,}', line.strip()))

# Write to CSV file
with open(file_path_csv, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(headers)
    writer.writerows(records)


# Set up the Google Sheets API credentials
SERVICE_ACCOUNT_FILE = 'cred.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
workstation = '1nM3qTKCZRz-aqYYZVb4QbS7cfzQHjL6WDrxqyNIIYYA'
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()

# Clear the existing values in the worksheet
request = sheet.values().clear(spreadsheetId=workstation, range="FDX!A2:F").execute()

# Upload the tracking numbers to the worksheet
request = sheet.values().update(spreadsheetId=workstation, range="FDX!A2:F", 
                                valueInputOption="USER_ENTERED", body={"values": records}).execute()
