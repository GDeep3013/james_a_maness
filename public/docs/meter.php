<?php
$pageTitle = 'Meter History - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container-fluid">
            <article class="docs-article" id="section-meter">
                <header class="docs-header">
                    <h1 class="docs-heading">Meter History Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>This guide explains how <strong>Meter History</strong> works in the fleet management tool, for your team (e.g. web manager, fleet coordinators) who record and review odometer readings.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What the Meter History Module Is For</h2>
                    <p><strong>Meter History</strong> is where you record and view <strong>odometer (meter) readings</strong> for your vehicles. Each entry is: which vehicle, what the reading was, and the date it was taken.</p>
                    <p><strong>Why it matters:</strong></p>
                    <ul>
                        <li><strong>Current mileage</strong> on each vehicle is kept up to date automatically when you add or edit a meter reading.</li>
                        <li>You keep a clear <strong>history</strong> of readings over time for each vehicle.</li>
                        <li>Other parts of the system (e.g. fuel, maintenance, service reminders) can use this mileage data.</li>
                    </ul>
                    <p>Staff use this area to log readings from the field or after inspections, and managers use it to see when each vehicle was last updated and what its mileage is.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Meter History</strong> (or <strong>Meters History</strong>). That opens the list of all meter readings and is the starting point for adding, viewing, editing, or exporting readings.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Meter History List Screen</h2>
                    <h4>At the top</h4>
                    <ul>
                        <li><strong>Meter History</strong> (or Meters History) as the page title.</li>
                        <li><strong>Add Meter Entry</strong> – Opens the form to record a new reading.</li>
                    </ul>
                    <h4>The table</h4>
                    <ul>
                        <li>One row per meter entry.</li>
                        <li>Columns usually include:
                            <ul>
                                <li><strong>Date</strong> – The date of the reading (and sometimes the entry ID).</li>
                                <li><strong>Vehicle</strong> – Which vehicle the reading is for.</li>
                                <li><strong>Meter Reading</strong> – The odometer value (e.g. 108043).</li>
                                <li><strong>Recorded At</strong> – When the entry was saved in the system.</li>
                            </ul>
                        </li>
                        <li><strong>Search</strong> – Find entries by vehicle name or reading value.</li>
                        <li><strong>Export</strong> – Download the list (or search results) to an Excel file.</li>
                        <li><strong>Pagination</strong> – Results are shown in pages (e.g. 20 per page).</li>
                        <li><strong>Actions per row</strong>:
                            <ul>
                                <li><strong>View</strong> – Open the full detail of that reading.</li>
                                <li><strong>Edit</strong> – Change the vehicle, date, or meter value.</li>
                                <li><strong>Delete</strong> – Remove that reading from the history.</li>
                            </ul>
                        </li>
                    </ul>
                    <p>The list is ordered by <strong>date (newest first)</strong> so the latest readings appear at the top.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Adding a Meter Entry</h2>
                    <p>Click <strong>Add Meter Entry</strong>. You will see a form with three main fields:</p>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Choose from the Vehicles dropdown.</li>
                        <li><strong>Date</strong> (required) – The date the reading was taken.</li>
                        <li><strong>Vehicle Meter Reading</strong> (required) – The odometer value shown on the vehicle.</li>
                    </ul>
                    <p><strong>Important rule:</strong> The new reading must be <strong>higher than</strong> the vehicle’s current mileage. The form may show the previous meter reading so you can enter a greater value. If not greater, the system will show an error.</p>
                    <p>When you <strong>Save</strong>:</p>
                    <ul>
                        <li>The new meter entry is stored.</li>
                        <li>The vehicle’s <strong>current mileage</strong> is automatically updated.</li>
                    </ul>
                    <p>Use <strong>Cancel</strong> to go back without saving.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Editing a Meter Entry</h2>
                    <p>From the list, click <strong>Edit</strong> on a row. Update Vehicle, Date, or Meter Reading as needed. The reading must still be greater than the vehicle’s current mileage. After saving, the vehicle’s current mileage updates automatically.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Viewing One Meter Entry (Detail)</h2>
                    <p>Click <strong>View</strong> on a row to open the detail page.</p>
                    <ul>
                        <li><strong>Details</strong> – Reading ID, Vehicle, Meter Reading, Date, Recorded By, Recorded At.</li>
                        <li><strong>Reading information</strong> – Clear summary of the recorded data.</li>
                    </ul>
                    <p>This page shows the full official record for that entry.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Deleting a Meter Entry</h2>
                    <p>From the list, use <strong>Delete</strong> on the row and confirm. The entry is removed from history.</p>
                    <p>Note: Deleting does <strong>not</strong> automatically change the vehicle’s current mileage. To correct mileage, edit the vehicle in <strong>Vehicles</strong> or add a new meter entry with the correct value.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Exporting Meter History</h2>
                    <p>Use the <strong>Export</strong> button on the list page. The system generates an Excel file with the readings currently displayed (or matching your search).</p>
                    <p>The file typically includes: Reading ID, Date, Vehicle ID, Vehicle Name, Meter Reading, Recorded By, Recorded At.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Meter History Connects to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each meter entry is linked to one vehicle and updates its current mileage.</li>
                        <li><strong>Users</strong> – Each entry records who saved it (Recorded By).</li>
                        <li><strong>Fuel, maintenance, service reminders</strong> – These areas use the vehicle’s current mileage for calculations and scheduling.</li>
                    </ul>
                    <p>So: <strong>Meter History</strong> is where official odometer readings are recorded, and the latest reading keeps each vehicle’s mileage current across the system.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Tips for Your Team</h2>
                    <ul>
                        <li>Record readings regularly to keep mileage accurate.</li>
                        <li>Check the previous meter reading before saving.</li>
                        <li>Use <strong>Search</strong> to find specific vehicles or readings.</li>
                        <li>Use <strong>Export</strong> when sharing reports outside the system.</li>
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
                                    <td>See all meter entries</td>
                                    <td>Menu: <strong>Meter History</strong></td>
                                </tr>
                                <tr>
                                    <td>Add a new reading</td>
                                    <td><strong>Add Meter Entry</strong> → Choose Vehicle, Date, enter Meter Reading → Save</td>
                                </tr>
                                <tr>
                                    <td>Find entries</td>
                                    <td>Use <strong>Search</strong></td>
                                </tr>
                                <tr>
                                    <td>Change a reading</td>
                                    <td><strong>Edit</strong> on the row → Update details → Save</td>
                                </tr>
                                <tr>
                                    <td>See full details</td>
                                    <td><strong>View</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Remove an entry</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                                <tr>
                                    <td>Download the list</td>
                                    <td><strong>Export</strong> (optionally search first)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Meter History module works for your non-technical team. Similar guides can be created for other modules such as Vehicles, Fuels, and Work Orders.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
