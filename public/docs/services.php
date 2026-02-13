<?php
$pageTitle = 'Services - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container-fluid">
            <article class="docs-article" id="section-services">
                <header class="docs-header">
                    <h1 class="docs-heading">Services Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Services</strong> module is where you <strong>record completed maintenance or repair work</strong> on a vehicle. Each service entry is a finished job: which vehicle, when it was done, what labour and parts were used, and the cost (with optional discount and tax). Unlike Work Orders (which track jobs from open to completion), Services log work that has already been completed—for history, cost tracking, and reporting.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Services Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Vehicle that was serviced.</li>
                        <li><strong>Vendor</strong> – Optional workshop or supplier.</li>
                        <li><strong>Priority</strong> – Low, Medium, High (for reporting).</li>
                        <li><strong>Primary meter</strong> – Odometer reading at service time.</li>
                        <li><strong>Completion date</strong> – When the work was completed. Optional start date.</li>
                        <li><strong>Service line items</strong> – Labour lines (description, cost).</li>
                        <li><strong>Parts</strong> – Parts used (part, quantity, unit price).</li>
                        <li><strong>Pricing</strong> – System calculates labour total, parts total, subtotal, applies discount/tax, produces total.</li>
                        <li><strong>Notes</strong> – Free text.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Services</strong>. From here you can view, add, edit, or delete service records. Vehicle service history may appear on the vehicle detail page (Maintenance tab).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Services List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new service record.</li>
                        <li><strong>Table</strong> – One row per service: vehicle, vendor, priority, primary meter, completion date, cost-related columns.</li>
                        <li><strong>Search</strong> – Find by service or vehicle/vendor details.</li>
                        <li><strong>Filters</strong> – Optional: vehicle, vendor, completion date range.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete. <strong>Export</strong> – Download list (or filtered list) to Excel.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Service</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Select from Vehicles.</li>
                        <li><strong>Vendor</strong> – Optional from Vendors.</li>
                        <li><strong>Priority</strong> – Low, Medium, High.</li>
                        <li><strong>Primary meter</strong> – Odometer at service time (optional, may show current mileage as hint).</li>
                        <li><strong>Completion date</strong> – When work was done. Option to set start date.</li>
                        <li><strong>Service line items</strong> – Add labour lines (description, cost).</li>
                        <li><strong>Parts</strong> – Add parts (part name/number, quantity, unit price).</li>
                        <li><strong>Discount / Tax</strong> – Type (percentage/fixed) and value. System computes subtotal, discount, tax, and total.</li>
                        <li><strong>Notes</strong> – Free text.</li>
                    </ul>
                    <p>Save when done. Totals calculated automatically from line items and parts.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Services Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each service is for one vehicle; history part of vehicle record.</li>
                        <li><strong>Vendors</strong> – Optional link to who performed the work.</li>
                        <li><strong>Vehicle detail</strong> – Service history shown on vehicle detail page (Maintenance tab).</li>
                        <li><strong>Reporting</strong> – Service records feed cost and maintenance reports (e.g. spend by vehicle/vendor, last service date/meter).</li>
                    </ul>
                    <p><strong>Services vs Work Orders:</strong> Work Orders plan and track jobs (open → in progress → completed). Services record <strong>completed</strong> work and its cost. You can complete a Work Order and log it as a Service, or log Services without a Work Order.</p>
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
                                    <td>See all service records</td>
                                    <td>Menu: <strong>Services</strong></td>
                                </tr>
                                <tr>
                                    <td>Log completed work</td>
                                    <td><strong>Add</strong> → choose vehicle, completion date, add line items and parts, optional vendor/discount/tax → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and optional <strong>Vehicle</strong> / <strong>Vendor</strong> / <strong>Date range</strong> filters</td>
                                </tr>
                                <tr>
                                    <td>Change a record</td>
                                    <td><strong>Edit</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Remove a record</td>
                                    <td><strong>Delete</strong> on the row (confirm)</td>
                                </tr>
                                <tr>
                                    <td>Download list</td>
                                    <td><strong>Export</strong> (optionally filter first)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Services module works for your team. Use it to keep a clear history of what was done on each vehicle and what it cost.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
