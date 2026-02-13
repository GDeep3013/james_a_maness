<?php
$pageTitle = 'Contacts - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-contacts">
                <header class="docs-header">
                    <h1 class="docs-heading">Contacts Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The Contacts module is your list of people used across the fleet system: drivers, technicians, and other staff. Each contact has a login account (email/password) and can be assigned to vehicles (as driver), assigned to work orders and issues (who does the repair), or added as watchers on service reminders and schedules so they get notified when work is due. Contact detail shows that person’s info plus their vehicle assignments, work orders, issues, and reminders in one place.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Contacts Are For</h2>
                    <ul>
                        <li><strong>Basic info</strong> – First name (required), last name, phone (required, unique), email (required, unique), address, and optional profile picture.</li>
                        <li><strong>License</strong> – License number (required, unique), class, issue country/state, issue and expiry dates, optional license document upload.</li>
                        <li><strong>Job</strong> – Job title, employee number, join/leave date, hourly labour rate, designation, optional offer letter.</li>
                        <li><strong>Emergency</strong> – Emergency contact name, phone, address.</li>
                        <li><strong>Status</strong> – Active or Inactive (e.g. for login and assignments).</li>
                        <li><strong>Other</strong> – Optional fields such as date of birth, immigration status, classification, comments.</li>
                    </ul>
                    <p>Adding a contact also creates a user account so they can log in to the system. Phone and email must be unique across contacts; license number must be unique.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Contacts</strong>. From here you see the list and can add, view, edit, or delete contacts. Opening a contact shows their full profile and their assignments (vehicles, work orders, issues, reminders).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Contacts List Screen</h2>
                    <ul>
                        <li><strong>Add Contact</strong> – Create a new contact (and user account).</li>
                        <li><strong>Table</strong> – One row per contact: name, email, phone, license, status, designation, and related info.</li>
                        <li><strong>Search</strong> – Find by name, email, phone, or other contact fields.</li>
                        <li><strong>Filters</strong> – Status (e.g. Active, Inactive).</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View (open detail), Edit, Delete. <strong>Export</strong> – Download the list (or filtered list) to Excel.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Contact</h2>
                    <p><strong>Add Contact</strong> (or <strong>Edit</strong> on a row) opens a form with sections such as:</p>
                    <ul>
                        <li><strong>Basic</strong> – First name, last name, phone, email, address, optional profile picture.</li>
                        <li><strong>License</strong> – License number, class, issue country/state, issue and expiry dates, optional license file.</li>
                        <li><strong>Job</strong> – Job title, employee number, join/leave date, hourly rate, designation, optional offer letter.</li>
                        <li><strong>Emergency</strong> – Emergency contact name, phone, address.</li>
                        <li><strong>Status</strong> – Active or Inactive.</li>
                        <li><strong>Other</strong> – Date of birth, immigration status, classification, comments, etc.</li>
                    </ul>
                    <p>Phone, email, and license number must be unique. Save when done. On create, a user account is created so the contact can log in.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Contact Detail</h2>
                    <h4>Opening a contact shows</h4>
                    <ul>
                        <li><strong>Profile</strong> – Name, designation, status, phone, email, address, license details, classification, job info, emergency contact, and other saved fields.</li>
                        <li><strong>Assignments</strong> – Tabs or sections for:
                            <ul>
                                <li><strong>Vehicle assignments</strong> – Vehicles assigned to this contact (as driver). You can add or remove vehicle assignments here.</li>
                                <li><strong>Work order assignments</strong> – Work orders assigned to this contact.</li>
                                <li><strong>Issue assignments</strong> – Issues assigned to this contact.</li>
                                <li><strong>Service reminder assignments</strong> – Reminders where this contact is a watcher or otherwise linked.</li>
                            </ul>
                        </li>
                    </ul>
                    <p>Use <strong>Edit</strong> to change the contact’s profile.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Contacts Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – A contact can be set as the assigned driver for a vehicle (one driver per vehicle).</li>
                        <li><strong>Work Orders</strong> – A contact can be assigned to a work order (who does the job).</li>
                        <li><strong>Issues</strong> – A contact can be assigned to an issue (who fixes it).</li>
                        <li><strong>Service Reminders / Schedules</strong> – Contacts can be watchers and receive notifications when a reminder or schedule is due.</li>
                        <li><strong>Calendar / Assignments</strong> – The calendar/assignment feature can assign contacts to vehicles for specific dates; this is separate from the vehicle’s “assigned driver” but both use Contacts.</li>
                    </ul>
                    <p>So: add people in Contacts first, then use them as drivers, assignees, or watchers elsewhere.</p>
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
                                    <td>See all contacts</td>
                                    <td>Menu: <strong>Contacts</strong></td>
                                </tr>
                                <tr>
                                    <td>Add a person</td>
                                    <td><strong>Add Contact</strong> → Fill required fields (first name, phone, email, license no) and optional sections → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> filter</td>
                                </tr>
                                <tr>
                                    <td>View profile and assignments</td>
                                    <td><strong>View</strong> on the row → See profile and Vehicle / Work Order / Issue / Reminder tabs</td>
                                </tr>
                                <tr>
                                    <td>Assign vehicle to contact</td>
                                    <td>Open contact → <strong>Vehicle Assignments</strong> → Add assignment</td>
                                </tr>
                                <tr>
                                    <td>Change or deactivate</td>
                                    <td><strong>Edit</strong> on the row → Update fields or set Status to Inactive</td>
                                </tr>
                                <tr>
                                    <td>Remove a contact</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                                <tr>
                                    <td>Download list</td>
                                    <td><strong>Export</strong> (optionally filter first)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Contacts module works for your team. Contacts are the people used everywhere else: as drivers, assignees on work orders and issues, and watchers on reminders and schedules.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
