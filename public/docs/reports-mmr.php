<?php
$pageTitle = 'MMR (Monthly Maintenance Report) - Veda Theme Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-reports-mmr">
                <header class="docs-header">
                    <h1 class="docs-heading">Reports – MMR (Monthly Maintenance Report) – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>MMR</strong> report under <strong>Reports</strong> is a <strong>Monthly Maintenance Report</strong> for a vehicle. You choose the month, the vehicle, where it is domiciled, who provided the maintenance, and list the maintenance tasks or work done. The report can be <strong>downloaded as a PDF</strong> for filing or compliance. Maintenance tasks can be entered manually or pulled from <strong>work orders</strong> for that vehicle and month.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What MMR Reports Are For</h2>
                    <ul>
                        <li><strong>Date</strong> – Month and year the report covers (required).</li>
                        <li><strong>Vehicle</strong> – Vehicle the report is for (required). Current mileage may auto-fill.</li>
                        <li><strong>Domicile station</strong> – Where the vehicle is based or stationed (required).</li>
                        <li><strong>Provider company name</strong> – Company that performed or is responsible for the maintenance (required).</li>
                        <li><strong>Current mileage</strong> – Odometer at report time (optional).</li>
                        <li><strong>Completed date</strong> – Date the report was completed (required).</li>
                        <li><strong>Preventative maintenance</strong> – Yes/No (optional). <strong>Out of service</strong> – Yes/No (optional).</li>
                        <li><strong>Maintenance records</strong> – List of maintenance items (date, description, optional work order link). Can be added manually or loaded from work orders.</li>
                        <li><strong>Signature</strong> – Optional. <strong>Declaration</strong> – Optional confirmation.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Reports → MMR</strong> (or <strong>Monthly Maintenance</strong>). You can create, edit, view, download PDF, or delete reports.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The MMR List Screen</h2>
                    <ul>
                        <li><strong>Create</strong> – Start a new MMR report.</li>
                        <li><strong>Table</strong> – One row per report: date, vehicle, domicile station, provider, current mileage, completed date.</li>
                        <li><strong>Search</strong> – Find reports by any main field.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page), newest first.</li>
                        <li><strong>Row actions</strong> – Edit, <strong>Download</strong> (PDF), Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing an MMR Report</h2>
                    <ul>
                        <li><strong>Date</strong> (required) – Month and year the report covers (month–year picker).</li>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles. Mileage may auto-fill.</li>
                        <li><strong>Domicile station</strong> (required) – Text for station or location.</li>
                        <li><strong>Provider company name</strong> (required) – Text for maintenance provider.</li>
                        <li><strong>Current mileage</strong> – Optional; often pre-filled.</li>
                        <li><strong>Completed date</strong> (required) – When the report was completed.</li>
                        <li><strong>Preventative maintenance</strong> – Yes/No. <strong>Out of service</strong> – Yes/No.</li>
                        <li><strong>Maintenance records</strong> – Add date, description, optional work order. Can type manually or load from work orders.</li>
                        <li><strong>Signature</strong> – Optional. <strong>Declaration</strong> – Optional checkbox/confirmation.</li>
                    </ul>
                    <p>Save when done. After saving, use <strong>Download</strong> to get the PDF.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Downloading the PDF</h2>
                    <p>From the list, click <strong>Download</strong>. The system generates a PDF (e.g. <code>MMR_Report_&lt;id&gt;_&lt;date&gt;.pdf</code>) with header, vehicle, dates, domicile, provider, mileage, and maintenance records.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How MMR Connects to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each MMR is linked to a vehicle. Mileage may auto-fill.</li>
                        <li><strong>Work Orders</strong> – Maintenance tasks can be loaded from work orders. Report stores its own records.</li>
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
                                    <td>See all MMR reports</td>
                                    <td><strong>Reports → MMR</strong> (or Monthly Maintenance)</td>
                                </tr>
                                <tr>
                                    <td>Create a report</td>
                                    <td><strong>Create</strong> → choose month, vehicle, domicile station, provider, completed date → add records → Save</td>
                                </tr>
                                <tr>
                                    <td>Find a report</td>
                                    <td><strong>Search</strong> on the list</td>
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
                                    <td><strong>Delete</strong> on the row (confirm)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide explains how the Reports → MMR (Monthly Maintenance Report) module works. Use it to create monthly maintenance reports and download them as PDFs for filing or compliance.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
