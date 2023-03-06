import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: "AIzaSyBvjBF8oP9hhaorrsLU8pr2prCAmS7eXmg",
	authDomain: "shipments-169d4.firebaseapp.com",
	databaseURL: "https://shipments-169d4-default-rtdb.firebaseio.com",
	projectId: "shipments-169d4",
	storageBucket: "shipments-169d4.appspot.com",
	messagingSenderId: "500866362157",
	appId: "1:500866362157:web:9a4ddf3a59173bfc7041a4",
	measurementId: "G-Y3QBFBL0LB"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get a list of expected barcodes from your database
async function getExpectedBarcodes(db) {
  const expectedRef = ref(db, 'Shipments/Data');
  const expectedSnapshot = await get(expectedRef);
  const expectedList = Object.keys(expectedSnapshot.val() || {});
  return expectedList;
}

// Get the number of scanned barcodes from your database
function getScannedCount(db) {
  const scannedRef = ref(db, 'Shipments/Scanned');
  onValue(scannedRef, (snapshot) => {
    const scannedCount = snapshot.numChildren();
    document.getElementById('scanned').innerText = scannedCount;
  });
}

// Update the "Total" label with the total number of expected barcodes
getExpectedBarcodes(db).then((expectedList) => {
  const total = expectedList.length;
  document.getElementById('total').innerText = total;
});

// Update the "Scanned" label with the number of scanned barcodes
getScannedCount(db);
