<?php
$pageTitle = 'Vendors - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-vendors">
                <header class="docs-header">
                    <h1 class="docs-heading">Vendors Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Vendors</strong> module is your <strong>list of external suppliers and service providers</strong>: workshops, fuel suppliers, parts dealers, and similar. Each vendor has a name, contact details, address, and optional flags for what they provide (e.g. charging, fuel, service, vehicle). You can link a vendor to <strong>vehicles</strong> (e.g. preferred workshop), <strong>work orders</strong> (who did the repair), <strong>services</strong> (who performed the service), and <strong>expense history</strong> (who you paid), so all vendor-related records stay in one place.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Vendors Are For</h2>
                    <ul>
                        <li><strong>Basic info</strong> – Name (required), phone (required, unique), email (required, unique), website (optional).</li>
                        <li><strong>Address</strong> – Address, city, state, country, zip. Optional latitude/longitude for location.</li>
                        <li><strong>Contact person</strong> – Optional contact name, phone, and email for the person you deal with.</li>
                        <li><strong>Type</strong> – Optional checkboxes for what the vendor provides: <strong>Charging</strong>, <strong>Fuel</strong>, <strong>Service</strong>, <strong>Vehicle</strong> (e.g. sales). Used for filtering and reporting.</li>
                        <li><strong>Notes</strong> – Free text.</li>
                    </ul>
                    <p>Phone and email must be unique across vendors.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Vendors</strong>. From here you see the list (sorted by name A–Z) and can add, view, edit, or delete vendors.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Vendors List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new vendor.</li>
                        <li><strong>Table</strong> – One row per vendor: name, phone, email, and other key fields.</li>
                        <li><strong>Search</strong> – Find by name, phone, email, or other vendor fields.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete. <strong>Export</strong> – Download the list (or search results) to Excel.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Vendor</h2>
                    <p><strong>Add Vendor</strong> (or <strong>Edit</strong> on a row) opens a form with:</p>
                    <ul>
                        <li><strong>Name</strong> (required).</li>
                        <li><strong>Phone</strong> (required, unique). <strong>Email</strong> (required, unique).</li>
                        <li><strong>Website</strong> (optional, must be a valid URL).</li>
                        <li><strong>Address</strong> – Street, city, state, country, zip.</li>
                        <li><strong>Contact person</strong> – Contact name, contact phone, contact email (optional).</li>
                        <li><strong>Type</strong> – Checkboxes: Charging, Fuel, Service, Vehicle (optional).</li>
                        <li><strong>Notes</strong> – Free text.</li>
                    </ul>
                    <p>Save when done. On edit, phone and email must stay unique (except for the current vendor).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Vendors Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – A vehicle can have a preferred vendor (e.g. where it’s serviced or bought).</li>
                        <li><strong>Work Orders</strong> – A work order can be linked to a vendor (e.g. the workshop doing the job).</li>
                        <li><strong>Services</strong> – A service record can be linked to a vendor (who performed the work).</li>
                        <li><strong>Expense History</strong> – An expense entry can be linked to a vendor (who you paid).</li>
                        <li><strong>Vehicle import</strong> – When importing vehicles from a spreadsheet, you can match by vendor name to set the vehicle’s vendor.</li>
                    </ul>
                    <p>So: add suppliers and workshops in <strong>Vendors</strong> first, then choose them when adding vehicles, work orders, services, or expenses.</p>
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
                                    <td>See all vendors</td>
                                    <td>Menu: <strong>Vendors</strong> (list sorted by name)</td>
                                </tr>
                                <tr>
                                    <td>Add a vendor</td>
                                    <td><strong>Add</strong> → name, phone, email → optional address, contact person, type, notes → Save</td>
                                </tr>
                                <tr>
                                    <td>Find a vendor</td>
                                    <td><strong>Search</strong> on the list</td>
                                </tr>
                                <tr>
                                    <td>Change details</td>
                                    <td><strong>Edit</strong> on the row (or <strong>View</strong> then Edit)</td>
                                </tr>
                                <tr>
                                    <td>Remove a vendor</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                                <tr>
                                    <td>Download list</td>
                                    <td><strong>Export</strong> (optionally search first)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Vendors module works for your team. Use it to keep one list of suppliers and link them to vehicles, work orders, services, and expenses.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
