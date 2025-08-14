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
    // feed.entity.forEach((entity) => {
    //   if (entity.vehicle && entity.vehicle.position) {
    //     console.log(`Vehicle ID: ${entity.vehicle.vehicle?.id || "N/A"}`);
    //     console.log(`  Latitude: ${entity.vehicle.position.latitude}`);
    //     console.log(`  Longitude: ${entity.vehicle.position.longitude}`);
    //     console.log(`  Bearing: ${entity.vehicle.position.bearing || "N/A"}`);
    //     console.log(`  Timestamp: ${entity.vehicle.timestamp || "N/A"}`);
    //     console.log("---");
    //   }
    // });
    const findBuses = feed.entity.filter((f) => {
      f.vehicle.routeId == "T2500" || f.vehicle.routeId == "U2500";
    });
    const cleanedBuses = findBuses.map((c) => {
      return {
        id: c.id,
        busRoute: c.vehicle.routeId,
        currentPosition: c.position,
      };
    });

    console.log(cleanedBuses);

    console.log("End process");
  } catch (err) {
    console.error("Error fetching or parsing data:", err);
  }
}

getVehiclePositions();
