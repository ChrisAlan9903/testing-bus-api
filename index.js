import fetch from "node-fetch";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const url =
  "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl";

async function getVehiclePositions() {
  try {
    // Fetch the protobuf binary

    console.log("Starting process");

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    // Parse using GTFS Realtime Bindings
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    // Loop through entities and display vehicle positions
    feed.entity.forEach((entity) => {
      if (entity.vehicle && entity.vehicle.position) {
        console.log(`Vehicle ID: ${entity.vehicle.vehicle?.id || "N/A"}`);
        console.log(`  Latitude: ${entity.vehicle.position.latitude}`);
        console.log(`  Longitude: ${entity.vehicle.position.longitude}`);
        console.log(`  Bearing: ${entity.vehicle.position.bearing || "N/A"}`);
        console.log(`  Timestamp: ${entity.vehicle.timestamp || "N/A"}`);
        console.log("---");
      }
    });

    console.log("End process");
  } catch (err) {
    console.error("Error fetching or parsing data:", err);
  }
}

getVehiclePositions();
