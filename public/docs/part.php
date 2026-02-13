<?php
$pageTitle = 'Parts - Veda Theme Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-part">
                <header class="docs-header">
                    <h1 class="docs-heading">Parts Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Parts</strong> module is your <strong>catalogue of parts</strong> (e.g. filters, brake pads, fluids). Each part has a name, code, optional description, prices, optional vendor, and optional vehicle types it fits. You do not track stock or assign parts to a vehicle here—you just maintain the list. Then when you add <strong>parts</strong> to a <strong>Work Order</strong> or <strong>Service</strong> (labour and parts used), you can select from this list so descriptions and prices are consistent.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Parts Are For</h2>
                    <ul>
                        <li><strong>Part name</strong> – What the part is (required), e.g. “Oil filter”, “Brake pads”.</li>
                        <li><strong>Part code</strong> – Unique code or SKU (required, unique across parts).</li>
                        <li><strong>Description</strong> – Optional details.</li>
                        <li><strong>Vehicle types</strong> – Optional list of vehicle types this part fits (e.g. Car, Truck, Van).</li>
                        <li><strong>Unit price</strong> – Selling or billing price per unit (required).</li>
                        <li><strong>Purchase price</strong> – Cost per unit (required).</li>
                        <li><strong>Vendor</strong> – Optional supplier (from Vendors).</li>
                        <li><strong>Warranty period</strong> – Optional (e.g. months).</li>
                        <li><strong>Status</strong> – Active or Inactive.</li>
                    </ul>
                    <p>This module is the <strong>master list</strong> of parts. When and on which vehicle they were used is recorded in <strong>Work Orders</strong> and <strong>Services</strong>.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Parts</strong>. From here you see the list and can add, view, edit, or delete parts.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Parts List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new part.</li>
                        <li><strong>Table</strong> – One row per part: name, code, description, vehicle types, manufacturer, unit price, purchase price, vendor, warranty, status.</li>
                        <li><strong>Search</strong> – Find by name, code, description, or vendor.</li>
                        <li><strong>Filters</strong> – Status (Active, Inactive).</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page), newest first.</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Part</h2>
                    <ul>
                        <li><strong>Part name</strong> (required).</li>
                        <li><strong>Part code</strong> (required, unique).</li>
                        <li><strong>Description</strong> – Optional.</li>
                        <li><strong>Vehicle types</strong> – Optional multi-select (e.g. Car, Truck, Van).</li>
                        <li><strong>Manufacturer name</strong> – Optional.</li>
                        <li><strong>Unit price</strong> (required).</li>
                        <li><strong>Purchase price</strong> (required).</li>
                        <li><strong>Vendor</strong> – Optional (from Vendors).</li>
                        <li><strong>Warranty period</strong> – Optional (e.g. months).</li>
                        <li><strong>Status</strong> – Active or Inactive.</li>
                    </ul>
                    <p>Save when done. On edit, the part code must remain unique (except for the current part).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Parts Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vendors</strong> – The supplier can be selected from Vendors.</li>
                        <li><strong>Work Orders</strong> – When adding parts (quantity, unit price) to a work order, select from this Parts list for consistent details.</li>
                        <li><strong>Services</strong> – When adding parts to a service record, select from this Parts list.</li>
                    </ul>
                    <p>So: define parts in <strong>Parts</strong> first, then use them when adding parts line items to <strong>Work Orders</strong> and <strong>Services</strong>.</p>
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
                                    <td>See all parts</td>
                                    <td>Menu: <strong>Parts</strong></td>
                                </tr>
                                <tr>
                                    <td>Add a part</td>
                                    <td><strong>Add</strong> → Name, Code (unique), Unit Price, Purchase Price → Optional Description, Vehicle Types, Vendor, Warranty, Status → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> filter</td>
                                </tr>
                                <tr>
                                    <td>Change a part</td>
                                    <td><strong>Edit</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Remove a part</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked). Note: If used in work orders or services, those records may still show the part name/code.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Parts module works for your team. Use it to maintain a catalogue of parts, then select them when adding parts to Work Orders and Services.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
