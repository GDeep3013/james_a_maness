import React from "react";
import { WorkOrder } from "../types/workOrderTypes";

export const formatTypeModel = (vehicle?: WorkOrder["vehicle"]) => {
  if (!vehicle) {
    return (
      <div>
        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">N/A</p>
      </div>
    );
  }

  const makeModelParts: string[] = [];
  if (vehicle.make && vehicle.model) {
    makeModelParts.push(`${vehicle.make} ${vehicle.model}`);
  } else if (vehicle.make) {
    makeModelParts.push(vehicle.make);
  } else if (vehicle.model) {
    makeModelParts.push(vehicle.model);
  }

  const mainText = makeModelParts.length > 0
    ? makeModelParts.join(" ")
    : vehicle.vehicle_name || "N/A";

  const secondaryParts: string[] = [];
  if (vehicle.year) {
    secondaryParts.push(String(vehicle.year));
  }
  if (vehicle.license_plate) {
    secondaryParts.push(vehicle.license_plate);
  }

  return (
    <div>
      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
        {mainText}
      </p>
      {secondaryParts.length > 0 && (
        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
          {secondaryParts.join(" • ")}
        </p>
      )}
    </div>
  );
};

