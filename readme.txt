update Firebase-hosted website after making changes to your local files
1.Make sure you have Firebase CLI installed. If not, you can install it using npm (Node.js Package Manager) by running:

npm install -g firebase-tools

2.Navigate to the root directory of your project using the command line (CMD or terminal). This should be the directory containing the "firebase.json" file.
3.Make sure you're logged in to your Firebase account. If not, you can do this using the command:

firebase login

4.Double-check that your project is correctly initialized and connected to the right Firebase project. You can use the command
firebase use

If you need to switch to a different project, use:
firebase use [project-id]

5.After making the necessary changes to your local files, deploy the updated version to Firebase Hosting using the command:
firebase deploy


