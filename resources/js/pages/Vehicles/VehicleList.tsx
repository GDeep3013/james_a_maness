import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table";
  import Badge from "../../components/ui/badge/Badge";
  
  interface Vehicle {
    id: number;
    vehicle: {
      image: string;
      name: string;
      role: string;
    };
    vehicleName: string;
    team: {
      images: string[];
    };
    vehicleStatus: string;
    vehicleBudget: string;
  }
  
  // Define the table data using the interface
  const tableData: Vehicle[] = [ 
    {
      id: 1,
      vehicle: {
        image: "/images/user/user-17.jpg",
        name: "Lindsey Curtis",
        role: "Web Designer",
      },
      vehicleName: "Agency Website",
      team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
      vehicleBudget: "3.9K",
      vehicleStatus: "Active",
    }
  ];
  
  export default function VehicleList() {
    return (
        <>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100">
                <TableRow>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Vehicle
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Vehicle Name
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Vehicle Status
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Vehicle Budget
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Budget
                    </TableCell>
                </TableRow>
                </TableHeader>
    
                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100">
                {tableData.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                            width={40}
                            height={40}
                            src={vehicle.vehicle.image}
                            alt={vehicle.vehicle.name}
                            />
                        </div>
                        <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {vehicle.vehicle.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {vehicle.vehicle.role}
                            </span>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {vehicle.vehicleName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex -space-x-2">
                        {vehicle.team.images.map((teamImage: string, index: number) => (
                            <div
                            key={index}
                            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                            >
                            <img
                                width={24}
                                height={24}
                                src={teamImage}
                                alt={`Team member ${index + 1}`}
                                className="w-full size-6"
                            />
                            </div>
                        ))}
                        </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                        size="sm"
                        color={
                            vehicle.vehicleStatus === "Active"
                            ? "success"
                            : vehicle.vehicleStatus === "Pending"
                            ? "warning"
                            : "error"
                        }
                        >
                        {vehicle.vehicleStatus}
                        </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {vehicle.vehicleBudget}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </div>
        </>
    );
  }