<?php
$pageTitle = 'Fuel Report - Veda Theme Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-reports-fuel">
                <header class="docs-header">
                    <h1 class="docs-heading">Reports – Fuel Report – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Fuel Report</strong> under <strong>Reports</strong> is a <strong>fuel summary or invoice</strong> for a vehicle over a date range. You choose the vehicle, optional vendor (gas station/supplier), start and end dates, and add <strong>line items</strong> (fuel type, quantity, price, etc.). The system can show <strong>fuel entries</strong> from the Fuels module for that vehicle and period so you can build the report from actual refuels. Each report can be <strong>downloaded as a PDF</strong> (invoice-style) for your records or to send to the customer.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Fuel Reports Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Which vehicle the report is for (required).</li>
                        <li><strong>Vendor</strong> – Gas station or fuel supplier (optional; from Vendors).</li>
                        <li><strong>Start date</strong> and <strong>End date</strong> – The period covered.</li>
                        <li><strong>Totals</strong> – Total value; optional sub total and sales tax.</li>
                        <li><strong>Reference fields</strong> – Invoice number, PO number, counter number, customer account, ordered by, sale type, date, ship via.</li>
                        <li><strong>Line items</strong> – Rows for fuel (vehicle name, fuel type, meter reading, unit type, quantity, tax, price per unit, net amount). Can be added manually or copied from fuel entries.</li>
                        <li><strong>Payment</strong> – Payment method and payment reference (optional).</li>
                        <li><strong>Special instructions</strong> – Free text (optional).</li>
                    </ul>
                    <p>The report is saved and can be downloaded as a PDF (e.g. <code>Fuel_Report_&lt;id&gt;_&lt;date&gt;.pdf</code>) including company details, line items, and fuel entries in that period.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Reports → Fuel</strong> (or <strong>Fuel Report</strong>). From here you can create, edit, view, download, or delete reports.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Fuel Report List Screen</h2>
                    <ul>
                        <li><strong>Create</strong> – Start a new fuel report.</li>
                        <li><strong>Table</strong> – One row per report showing vehicle, vendor, start date, end date, total value, invoice number, PO number, sale type, date, and related details.</li>
                        <li><strong>Search</strong> – Find reports by key fields.</li>
                        <li><strong>Filters</strong> – Optional filters such as vehicle or date range.</li>
                        <li><strong>Pagination</strong> – Results shown in pages (e.g. 20 per page), newest first.</li>
                        <li><strong>Row actions</strong> – View, Edit, <strong>Download</strong> (PDF), Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Fuel Report</h2>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles.</li>
                        <li><strong>Vendor</strong> – Optional; select from Vendors.</li>
                        <li><strong>Start date</strong> and <strong>End date</strong> – Define the period.</li>
                        <li>The screen may show <strong>fuel entries</strong> from the Fuels module for this vehicle and date range to help build line items.</li>
                        <li><strong>Reference fields</strong> – Invoice number, PO number, counter number, customer account, ordered by, sale type, date, ship via.</li>
                        <li><strong>Line items</strong> – Add manually or fill from displayed fuel entries.</li>
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
                        <li>The report’s line items</li>
                        <li>Fuel entries for that vehicle and date range</li>
                    </ul>
                    <p>Use the PDF for filing, reporting, or sending to customers.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Fuel Reports Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each report is linked to one vehicle.</li>
                        <li><strong>Vendors</strong> – The gas station or supplier comes from Vendors.</li>
                        <li><strong>Fuels</strong> – Fuel entries (refuels) for the selected vehicle and period are used when building the report.</li>
                        <li><strong>Settings</strong> – Company name, address, and logo are used in the PDF.</li>
                    </ul>
                    <p>Create fuel entries in <strong>Fuels</strong> first, then create a <strong>Fuel Report</strong> for the same vehicle and date range.</p>
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
                                    <td>See all fuel reports</td>
                                    <td><strong>Reports → Fuel</strong></td>
                                </tr>
                                <tr>
                                    <td>Create a report</td>
                                    <td><strong>Create</strong> → Select vehicle, start/end dates, optional vendor → Add line items → Enter totals and references → Save</td>
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
                    <p class="text-muted mb-0">This guide explains how the Reports → Fuel Report module works. Use it to create fuel reports for a vehicle and period, and download them as PDFs for records or customers.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
