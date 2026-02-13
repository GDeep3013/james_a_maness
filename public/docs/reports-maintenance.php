<?php
$pageTitle = 'Maintenance Report - Veda Theme Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-reports-maintenance">
                <header class="docs-header">
                    <h1 class="docs-heading">Reports – Maintenance Report – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Maintenance Report</strong> under <strong>Reports</strong> is a <strong>maintenance record</strong> for a vehicle: one job or invoice with vehicle, vendor, dates, line items (parts/labour), and totals. You can create a report from scratch or use data from <strong>work orders</strong> for that vehicle and date range. Each report can be <strong>downloaded as a PDF</strong> (invoice-style) for your records or to send to the customer.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Maintenance Reports Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Which vehicle the maintenance was for (required).</li>
                        <li><strong>Vendor</strong> – Workshop or supplier who did the work (optional; from Vendors).</li>
                        <li><strong>Dates</strong> – Actual start date, actual completion date, and optional report date.</li>
                        <li><strong>Totals</strong> – Total value; optional sub total and sales tax.</li>
                        <li><strong>Reference</strong> – Invoice number, PO number, counter number, customer account, ordered by, sale type, ship via.</li>
                        <li><strong>Line items</strong> – Quantity, item number, description, warranty, unit, tax, list/net price, extended amount. Can be added manually or pulled from work orders (if supported).</li>
                        <li><strong>Payment</strong> – Payment method and payment reference (optional).</li>
                        <li><strong>Special instructions</strong> – Free text (optional).</li>
                    </ul>
                    <p>The report is saved and can be downloaded as a PDF (e.g. <code>Maintenance_Report_&lt;id&gt;_&lt;date&gt;.pdf</code>) including company details, line items, and related work order information.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Reports → Maintenance</strong> (or <strong>Maintenance Report</strong>). From here you can create, edit, view, download, or delete reports.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Maintenance Report List Screen</h2>
                    <ul>
                        <li><strong>Create</strong> – Start a new maintenance report.</li>
                        <li><strong>Table</strong> – One row per report showing vehicle, vendor, start date, completion date, total value, invoice number, PO number, sale type, date, and related details.</li>
                        <li><strong>Search</strong> – Find reports by main fields.</li>
                        <li><strong>Filters</strong> – Optional filters such as vehicle or date range.</li>
                        <li><strong>Pagination</strong> – Results shown in pages (e.g. 20 per page), newest first.</li>
                        <li><strong>Row actions</strong> – View, Edit, <strong>Download</strong> (PDF), Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Maintenance Report</h2>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles.</li>
                        <li><strong>Vendor</strong> – Optional; select from Vendors.</li>
                        <li><strong>Actual start date</strong> – When work started. <strong>Actual completion date</strong> – When work was completed. <strong>Date</strong> – Optional report date.</li>
                        <li><strong>Reference fields</strong> – Invoice number, PO number, counter number, customer account, ordered by, sale type, ship via.</li>
                        <li><strong>Line items</strong> – Quantity, line, item number, description, warranty, unit, tax, list/net price, extended amount. Add manually or load from related work orders (if supported).</li>
                        <li><strong>Sub total</strong>, <strong>Sales tax</strong>, <strong>Total value</strong>.</li>
                        <li><strong>Payment method</strong>, <strong>Payment reference</strong> – Optional.</li>
                        <li><strong>Special instructions</strong> – Free text.</li>
                    </ul>
                    <p>Click <strong>Save</strong> when done. After saving, use <strong>Download</strong> to generate the PDF.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Downloading the PDF</h2>
                    <p>From the list, click <strong>Download</strong> on the row. The system generates a PDF using:</p>
                    <ul>
                        <li>Company details from <strong>Settings</strong></li>
                        <li>Vehicle and vendor information</li>
                        <li>Start and completion dates</li>
                        <li>Line items and totals</li>
                        <li>Related work order information (if applicable)</li>
                    </ul>
                    <p>Use the PDF for filing, reporting, or sending to customers.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Maintenance Reports Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each report is linked to one vehicle.</li>
                        <li><strong>Vendors</strong> – The workshop or supplier is selected from Vendors.</li>
                        <li><strong>Work Orders</strong> – Line items or context may be pulled from work orders for the same vehicle and date range.</li>
                        <li><strong>Settings</strong> – Company name, address, logo, and other details are used in the generated PDF.</li>
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
                                    <td>See all maintenance reports</td>
                                    <td><strong>Reports → Maintenance</strong></td>
                                </tr>
                                <tr>
                                    <td>Create a report</td>
                                    <td><strong>Create</strong> → Select vehicle, optional vendor and dates → Add line items (manual or from work orders) → Enter totals and references → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and optional Vehicle / Date filters</td>
                                </tr>
                                <tr>
                                    <td>Change a report</td>
                                    <td><strong>Edit</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Get a PDF</td>
                                    <td><strong>Download</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Remove a report</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide explains how the Reports → Maintenance Report module works. Use it to create maintenance records with line items and totals, and download them as PDFs for records or customers.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
