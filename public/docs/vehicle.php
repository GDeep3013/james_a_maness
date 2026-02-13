<?php
$pageTitle = 'Vehicle - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container-fluid">
            <article class="docs-article" id="section-vehicle">
                <header class="docs-header">
                    <h1 class="docs-heading">Vehicle Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>This guide explains how the <strong>Vehicle</strong> area of the fleet management tool works, for your team (e.g. web manager, fleet coordinators) who use the system day to day.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What the Vehicle Module Is For</h2>
                    <p>The Vehicle module is your <strong>main list of all fleet assets</strong>. Here you:</p>
                    <ul>
                        <li>Add new vehicles and keep their details up to date</li>
                        <li>See at a glance how many vehicles you have and their status</li>
                        <li>Search and filter to find specific vehicles</li>
                        <li>Assign a driver to a vehicle (or remove the assignment)</li>
                        <li>Attach documents (e.g. registration, insurance) to a vehicle</li>
                        <li>Open a vehicle to see its fuel history, reminders, maintenance, and documents in one place</li>
                        <li>Bring in many vehicles at once from a spreadsheet, or download the current list to Excel</li>
                    </ul>
                    <p>Everything described below is done in the application through the menus and buttons; no technical or IT steps are required.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Vehicles</strong> (or <strong>Asset List</strong>). That opens the vehicle list and is the starting point for all vehicle-related tasks.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Vehicle List Screen</h2>
                    <h4>At the Top</h4>
                    <ul>
                        <li><strong>Summary cards</strong> – Total vehicles, how many are Active, In Maintenance, and Available. These numbers update automatically.</li>
                        <li><strong>Add New Vehicle</strong> – Starts adding a single vehicle.</li>
                        <li><strong>Import Vehicles</strong> – Upload an Excel or CSV file to add many vehicles at once.</li>
                    </ul>
                    <h4>The Table</h4>
                    <ul>
                        <li>One row per vehicle.</li>
                        <li>Columns typically include: name, type, VIN, license plate, fuel type, year, make, model, mileage, status, location, assigned driver, vendor.</li>
                        <li>Use <strong>Search</strong> to find by any of these (e.g. license plate, name, VIN).</li>
                        <li><strong>Filters</strong> – Narrow the list by <strong>Status</strong> (Available, Active, In Maintenance) and <strong>Fuel type</strong> (Gasoline, Diesel, etc.).</li>
                        <li><strong>Pagination</strong> – If you have many vehicles, use the page controls at the bottom.</li>
                        <li><strong>Actions per row</strong> – View, Edit, Delete, and sometimes Export.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Adding a New Vehicle</h2>
                    <p>Click <strong>Add New Vehicle</strong>. You go through three steps:</p>
                    <h4>Step 1 – Basic Information</h4>
                    <ul>
                        <li><strong>Vehicle name</strong> and <strong>Type</strong> are required.</li>
                        <li>Optional: VIN, license plate, fuel type, year, make, model, and other details.</li>
                    </ul>
                    <h4>Step 2 – Specifications</h4>
                    <ul>
                        <li>Engine size, transmission, purchase date, current mileage, purchase price, status, and notes.</li>
                        <li>All optional but useful for reporting and maintenance.</li>
                    </ul>
                    <h4>Step 3 – Assignment</h4>
                    <ul>
                        <li><strong>Assigned driver</strong> – Choose from the Contacts list.</li>
                        <li><strong>Vendor</strong> – Link to a vendor if relevant.</li>
                        <li><strong>Primary location</strong> and <strong>Department</strong>.</li>
                    </ul>
                    <p>Use <strong>Next</strong> / <strong>Back</strong> to move between steps and <strong>Save</strong> when done.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Editing a Vehicle</h2>
                    <p>From the vehicle list, use <strong>Edit</strong> on the row (or open the vehicle and click <strong>Edit</strong>). Change the fields and save. You can also change or clear the assigned driver here.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Viewing One Vehicle (Vehicle Detail)</h2>
                    <p>Click <strong>View</strong> (or the vehicle name) to open the detail page.</p>
                    <ul>
                        <li><strong>Top section</strong> – Vehicle name, status, key details, and buttons to Edit or Delete.</li>
                        <li><strong>Tabs</strong>:
                            <ul>
                                <li><strong>Fuel</strong> – Fuel entries and history.</li>
                                <li><strong>Reminders</strong> – Service reminders.</li>
                                <li><strong>Documents</strong> – Attached files (registration, insurance, etc.).</li>
                                <li><strong>Maintenance</strong> – Maintenance records.</li>
                            </ul>
                        </li>
                    </ul>
                    <p>This is the central place to see everything about one vehicle.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Assigning a Driver to a Vehicle</h2>
                    <ul>
                        <li>When adding or editing, use the <strong>Assigned driver</strong> field in Step 3.</li>
                        <li>To remove assignment, clear the assigned driver field and save.</li>
                    </ul>
                    <p>The driver must already exist in <strong>Contacts</strong>.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Vehicle Documents</h2>
                    <p>From the vehicle detail page, open the <strong>Documents</strong> tab.</p>
                    <ul>
                        <li><strong>Add</strong> – Title, upload file, optional expiry date.</li>
                        <li><strong>View / Download</strong> – Open or save the file.</li>
                        <li><strong>Edit</strong> – Update title, file, or expiry date.</li>
                        <li><strong>Delete</strong> – Remove the document.</li>
                    </ul>
                    <p>Supported types: PDF, Word, Excel, and common image formats. Maximum file size typically around 10 MB per file.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Importing Vehicles from a Spreadsheet</h2>
                    <p>Use <strong>Import Vehicles</strong> from the vehicle list.</p>
                    <h4>File Requirements</h4>
                    <ul>
                        <li>Must include a header row with column names.</li>
                        <li><strong>Required columns:</strong> Vehicle name, License plate, Type.</li>
                        <li>Optional: Make, Model, Year, VIN, Color, Fuel type, Transmission, Purchase date, Engine size, Current mileage, Purchase price, Status, Vendor name, Driver email, Primary location, Notes, Department.</li>
                    </ul>
                    <h4>Duplicates</h4>
                    <ul>
                        <li>Same <strong>license plate</strong> → row skipped.</li>
                        <li>Same <strong>VIN</strong> → row skipped.</li>
                    </ul>
                    <p>After import, the system shows how many were added and skipped.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Exporting the Vehicle List</h2>
                    <p>Use <strong>Export</strong> from the vehicle list. The system downloads an Excel file with the vehicles currently shown (including filters).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Status and Dropdown Options</h2>
                    <p>Available options for status, type, fuel type, and transmission are listed below.</p>
                    <table class="table table-bordered font-monospace">
                        <thead>
                            <tr>
                                <th class="font-monospace">Option</th>
                                <th class="font-monospace">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>Status</code></td>
                                <td><code>Available, Active, In Maintenance, Inactive, Assigned</code></td>
                            </tr>
                            <tr>
                                <td><code>Type</code></td>
                                <td><code>Car, Bus, Truck, Van, SUV, Motorcycle, Tractor, Trailer, Other</code></td>
                            </tr>
                            <tr>
                                <td><code>Fuel Type</code></td>
                                <td><code>Gasoline, Diesel, Petrol, Electric, Hybrid, CNG, LPG</code></td>
                            </tr>
                            <tr>
                                <td><code>Transmission</code></td>
                                <td><code>Automatic, Manual, CVT</code></td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Vehicles Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Contacts</strong> – Assigned driver must exist in Contacts.</li>
                        <li><strong>Vendors</strong> – Vehicles can be linked to vendors.</li>
                        <li><strong>Fuel and Expenses</strong> – Linked to each vehicle.</li>
                        <li><strong>Work Orders and Maintenance</strong> – Tied to the vehicle and visible in its tabs.</li>
                        <li><strong>Assignments / Calendar</strong> – Vehicles can be scheduled for specific dates and times.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Quick Reference</h2>
                    <p>Use the table below to find where to go for common tasks.</p>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>I want to…</th>
                                    <th>Where to go / what to do</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>See all vehicles</td>
                                    <td>Menu: <strong>Vehicles</strong> (Asset List)</td>
                                </tr>
                                <tr>
                                    <td>Add one vehicle</td>
                                    <td><strong>Add New Vehicle</strong> → Complete 3 steps → Save</td>
                                </tr>
                                <tr>
                                    <td>Add many vehicles</td>
                                    <td><strong>Import Vehicles</strong> → Upload Excel/CSV</td>
                                </tr>
                                <tr>
                                    <td>Find a vehicle</td>
                                    <td>Use <strong>Search</strong> or filters</td>
                                </tr>
                                <tr>
                                    <td>Change vehicle details</td>
                                    <td><strong>Edit</strong> → Save</td>
                                </tr>
                                <tr>
                                    <td>Assign or change driver</td>
                                    <td>Edit vehicle → Step 3 → Assigned driver</td>
                                </tr>
                                <tr>
                                    <td>See everything for one vehicle</td>
                                    <td><strong>View</strong> → Use tabs</td>
                                </tr>
                                <tr>
                                    <td>Add or manage documents</td>
                                    <td>Open vehicle → <strong>Documents</strong> tab</td>
                                </tr>
                                <tr>
                                    <td>Download vehicle list</td>
                                    <td><strong>Export</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
