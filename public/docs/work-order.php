<?php
$pageTitle = 'Work Orders - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container-fluid">
            <article class="docs-article" id="section-work-order">
                <header class="docs-header">
                    <h1 class="docs-heading">Work Orders Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>Work Orders are the <strong>main module</strong> of the fleet management tool. They are used to plan, track, and complete repair and maintenance jobs for vehicles—from opening a job to scheduling, assigning, adding labour and parts, and closing it.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Work Orders Are For</h2>
                    <p>A <strong>work order</strong> is one repair or maintenance job for a vehicle. It ties together:</p>
                    <ul>
                        <li><strong>Which vehicle</strong> the work is for</li>
                        <li><strong>Status</strong> (Open, In Progress, Completed) and <strong>priority</strong> (e.g. Low, Medium, High)</li>
                        <li><strong>Dates:</strong> issue date, scheduled start, actual start, expected and actual completion</li>
                        <li><strong>Who does the work</strong> – assigned contact (e.g. technician) and optional vendor</li>
                        <li><strong>What was done</strong> – service line items (labour) and parts used</li>
                        <li><strong>Costs</strong> – base value, discount, tax, total; optional invoice and PO numbers</li>
                        <li><strong>Issues</strong> – defects or problems reported for the vehicle can be linked to the work order so one job can address multiple issues</li>
                    </ul>
                    <p>The list and filters let you see all work orders, focus by status or priority, and export for reporting.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Work Orders</strong>. From here you see the overview counts, the list, and you can create or open any work order.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Work Orders List Screen</h2>
                    <ul>
                        <li><strong>Overview cards</strong> – Total work orders, Open, In Progress, Completed.</li>
                        <li><strong>Create Work Order</strong> – Starts a new work order.</li>
                        <li><strong>Table</strong> – One row per work order (vehicle, status, priority, dates, assigned to, vendor, invoice/PO, etc.).</li>
                        <li><strong>Search</strong> – Find by work order details, vehicle name, assigned person, or vendor.</li>
                        <li><strong>Filters</strong> – Status (Open / In Progress / Completed), Priority (e.g. Low / Medium / High). Other filters may include vehicle, vendor, assigned to, issue month, or completion date range.</li>
                        <li><strong>Pagination</strong> – Many results are paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View (open detail), Edit, Delete. <strong>Export</strong> – Download list (or filtered list) to Excel.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Work Order</h2>
                    <p><strong>Create Work Order</strong> (or <strong>Edit</strong> from the list) opens a form with sections such as:</p>
                    <ul>
                        <li><strong>Vehicle</strong> – Select the vehicle (from Vehicles).</li>
                        <li><strong>Status</strong> – Open, In Progress, or Completed.</li>
                        <li><strong>Priority</strong> – e.g. Low, Medium, High.</li>
                        <li><strong>Dates</strong> – Issue date, scheduled start, actual start, expected completion, actual completion. Option to send a reminder for scheduled start.</li>
                        <li><strong>Assigned to</strong> – Contact (e.g. technician) from Contacts.</li>
                        <li><strong>Vendor</strong> – Optional workshop or supplier from Vendors.</li>
                        <li><strong>Invoice / PO</strong> – Optional invoice number and PO number.</li>
                        <li><strong>Service line items</strong> – Labour items (description, labour cost, etc.).</li>
                        <li><strong>Parts</strong> – Parts used (part, quantity, unit price).</li>
                        <li><strong>Pricing</strong> – Base value, discount (type and value), tax (type and value), total.</li>
                        <li><strong>Notes</strong> – Free text.</li>
                    </ul>
                    <p>You can also <strong>link Issues</strong>: choose existing open issues for that vehicle that are not yet on a work order and attach them to this work order so the job is tied to those issues. Save when done.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Work Order Detail</h2>
                    <h4>Opening a work order</h4>
                    <p>Opening a work order shows its full details:</p>
                    <ul>
                        <li><strong>Header</strong> – Vehicle, status (often changeable here), priority, key dates, assigned to, vendor.</li>
                        <li><strong>Tabs/sections</strong> – e.g. <strong>Service Line Items</strong> (labour), <strong>Parts</strong> (parts used), and <strong>Resolved Issues</strong> (issues linked to this work order).</li>
                        <li><strong>Costs</strong> – Line items and parts with totals, discount, tax, and total value. From the detail screen you can usually edit the work order or update status.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Status and Priority</h2>
                    <ul>
                        <li><strong>Status</strong>: Open → In Progress → Completed. Used to see what is pending, being worked on, or done.</li>
                        <li><strong>Priority</strong> (e.g. Low, Medium, High): Used to sort and filter which jobs to do first.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Work Orders Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Every work order is for one vehicle (from Vehicles).</li>
                        <li><strong>Contacts</strong> – The person doing the work (Assigned to) is a Contact.</li>
                        <li><strong>Vendors</strong> – Optional vendor (e.g. workshop) from Vendors.</li>
                        <li><strong>Issues</strong> – Issues are created in the Issues module. When creating or editing a work order, you can attach open issues (for that vehicle) to the work order so one job covers multiple issues. Those appear under the work order’s Resolved/Issues section. Work orders feed dashboard and reporting (e.g. open vs completed, costs).</li>
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
                                    <td>See all work orders</td>
                                    <td>Menu: <strong>Work Orders</strong></td>
                                </tr>
                                <tr>
                                    <td>See counts (open, in progress, completed)</td>
                                    <td>Overview cards at top of Work Orders</td>
                                </tr>
                                <tr>
                                    <td>Create a job</td>
                                    <td><strong>Create Work Order</strong> → fill vehicle, status, dates, assignee, line items/parts, etc. → Save</td>
                                </tr>
                                <tr>
                                    <td>Link issues to a job</td>
                                    <td>In Create/Edit, use the option to select issues for that vehicle and add them to the work order</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> / <strong>Priority</strong> (and other) filters on the list</td>
                                </tr>
                                <tr>
                                    <td>View full job</td>
                                    <td><strong>View</strong> on the row → see detail and tabs (Service Line Items, Parts, Issues)</td>
                                </tr>
                                <tr>
                                    <td>Change job</td>
                                    <td><strong>Edit</strong> on the row or from detail</td>
                                </tr>
                                <tr>
                                    <td>Remove job</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                                <tr>
                                    <td>Download list</td>
                                    <td><strong>Export</strong> (optionally filter first)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Work Orders module works for your team. It is the central place for organising and tracking repair and maintenance work on your fleet.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
