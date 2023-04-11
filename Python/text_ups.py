import re
import csv

# File paths
try:
    with open(r'C:\Users\Tovala\Desktop\files\fdx\fedex.txt', 'r'):
        file_path_text = r'C:\Users\Tovala\Desktop\files\fdx\ups.txt'
        file_path_csv = r'C:\Users\Tovala\Desktop\files\fdx\ups.csv'
except FileNotFoundError:
    file_path_text = r'C:\Users\Tovala\Pau Dal\files\fdx\ups.txt'
    file_path_csv = r'C:\Users\Tovala\Pau Dal\files\fdx\ups.csv'


# Read text file
with open(file_path_text, 'r') as file:
    data = file.readlines()
    print(data)

# # Extract headers and records
# headers = []
# records = []

# for line in data:
#     if 'SHIP DATE' in line:
#         headers = re.split(r'\s{2,}', line.strip())
#     elif re.match(r'\d{2}/\d{2}/\d{4}', line.strip()):
#         records.append(re.split(r'\s{2,}', line.strip()))

# # Write to CSV file
# with open(file_path_csv, 'w', newline='') as file:
#     writer = csv.writer(file)
#     writer.writerow(headers)
#     writer.writerows(records)
