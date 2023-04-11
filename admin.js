function parseDate(input) {
    const parts = input.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("delete-form");
    const status = document.getElementById("status");
  
    deleteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const inputShipdate = document.getElementById("shipdate").value;
      const shipdate = parseDate(inputShipdate);
      const facility = document.getElementById("facility").value;
      const cycle = document.getElementById("cycle").value;
      const carrier = document.getElementById("carrier").value;
      const meal = document.getElementById("meal").value;
      const config = document.getElementById("config").value;
      const fullCarrier = `${carrier}${meal ? '_' + meal : ''}${config ? '_' + config : ''}`;
  
      const db = firebase.database();
      const ref = db.ref("Data");
  
      try {
        const snapshot = await ref.once("value");
        const data = snapshot.val();
  
        let deletedCount = 0;
        for (const key in data) {
          const value = data[key];
          const valueFullCarrier = `${value.Carrier}${value.Meal ? '_' + value.Meal : ''}${value.Config ? '_' + value.Config : ''}`;
  
          console.log("Comparing:");
          console.log("shipdate:", shipdate, value.Date);
          console.log("facility:", facility, value.Facility);
          console.log("cycle:", cycle, value.Cycle);
          console.log("fullCarrier:", fullCarrier, valueFullCarrier);
  
          const isMatch = (
            (shipdate === "" || value.Date === shipdate) &&
            (facility === "" || value.Facility === facility) &&
            (cycle === "" || value.Cycle === cycle) &&
            (fullCarrier === "" || valueFullCarrier === fullCarrier)
          );
  
          if (isMatch) {
            console.log("Match found! Deleting:", key, value);
            await ref.child(key).remove();
            deletedCount += 1;
          }
        }
        status.textContent = `Deleted ${deletedCount} selected record(s)`;
        status.style.color = "green";
      } catch (error) {
        status.textContent = `Error: ${error.message}`;
        status.style.color = "red";
      }
    });
  });
  