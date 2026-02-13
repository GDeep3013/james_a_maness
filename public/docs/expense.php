<?php
$pageTitle = 'Expense History - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-expense">
                <header class="docs-header">
                    <h1 class="docs-heading">Expense History Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>This guide explains how <strong>Expense History</strong> works in the fleet management tool, for your team (e.g. web manager, fleet coordinators) who record and review costs linked to vehicles.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What the Expense History Module Is For</h2>
                    <p>Expense History is where you record costs linked to vehicles (e.g. maintenance, insurance, registration, repairs, parking, tolls). Each entry is tied to a vehicle and can optionally be linked to a vendor. Entries can be one-off (single) or recurring (monthly or annual).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Expense History</strong>. From there you can:</p>
                    <ul>
                        <li><strong>List</strong> – See all expense entries (newest first), with search and pagination. Export to Excel.</li>
                        <li><strong>Add</strong> – <strong>Add Expense Entry</strong>: choose vehicle, expense type, amount, date; optionally vendor, notes, and frequency (single or recurring; if recurring, monthly or annual).</li>
                        <li><strong>View</strong> – Open one entry to see full details.</li>
                        <li><strong>Edit</strong> – Change vehicle, type, amount, date, vendor, notes, or frequency.</li>
                        <li><strong>Delete</strong> – Remove an entry (with confirmation).</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Main Fields</h2>
                    <p><strong>Required:</strong> Vehicle, Expense type, Amount, Date.</p>
                    <p><strong>Optional:</strong> Vendor, Notes. <strong>Frequency</strong>: Single or Recurring; if Recurring, <strong>Recurrence period</strong>: Monthly or Annual.</p>
                    <h4>Expense types (examples)</h4>
                    <p>Down Payment, Maintenance, Insurance, Registration, Repair, Loan Payment, Parking, Toll, Other.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Expense History Connects to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each expense is for one vehicle (from the Vehicles list).</li>
                        <li><strong>Vendors</strong> – You can attach a vendor (e.g. workshop, insurer) if needed.</li>
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
                                    <td>See all expenses</td>
                                    <td>Menu: <strong>Expense History</strong></td>
                                </tr>
                                <tr>
                                    <td>Add an expense</td>
                                    <td><strong>Add Expense Entry</strong> → Fill required fields → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td>Use <strong>Search</strong> on the list</td>
                                </tr>
                                <tr>
                                    <td>Change or remove</td>
                                    <td><strong>Edit</strong> or <strong>Delete</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Download list</td>
                                    <td><strong>Export</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Expense History module works for your non-technical team. Similar guides are available for other modules such as Vehicles, Meter History, Fuels, and Work Orders.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
