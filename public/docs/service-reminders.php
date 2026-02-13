<?php
$pageTitle = 'Service Reminders - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-service-reminders">
                <header class="docs-header">
                    <h1 class="docs-heading">Service Reminders Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>Service Reminders are used to <strong>schedule and remind</strong> when a vehicle is due for specific maintenance tasks (e.g. oil change, tire rotation). Each reminder is for one vehicle and one or more <strong>service tasks</strong>. You can trigger reminders by <strong>time</strong> (every X days/weeks/months/years) and/or by <strong>mileage</strong> (every X miles). Optional <strong>watchers</strong> can be notified when a reminder is due or due soon.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Service Reminders Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Asset the reminder is for.</li>
                        <li><strong>Service tasks</strong> – Tasks to perform (from Service Tasks). Multiple tasks can be selected.</li>
                        <li><strong>When it’s due</strong> – By time (e.g. every 3 months) and/or by meter (e.g. every 5,000 miles). System calculates next due or you can set manually.</li>
                        <li><strong>Due soon</strong> – Thresholds (e.g. 1 week before, 500 miles before) to flag “due soon”.</li>
                        <li><strong>Watchers</strong> – Contacts notified when reminder is due.</li>
                        <li><strong>Status</strong> – Active, Inactive, Completed. Completed allows recording last completed date/meter.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Service Reminders</strong>. From here you can view, create, or edit reminders. Vehicle reminders also appear on its detail page (e.g. Reminders tab).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Service Reminders List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new reminder.</li>
                        <li><strong>Table</strong> – One row per reminder: vehicle, service tasks, next due date, next due meter, status.</li>
                        <li><strong>Search</strong> – Find by reminder or vehicle details.</li>
                        <li><strong>Filters</strong> – Status (Active, Inactive, Completed); optional vehicle or watcher filters.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Service Reminder</h2>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles.</li>
                        <li><strong>Service tasks</strong> (required) – Select one or more tasks.</li>
                        <li><strong>Time-based</strong> – Interval value/unit (e.g. 3 months). Optional due soon threshold.</li>
                        <li><strong>Meter-based</strong> – Interval value/unit (e.g. 5,000 miles). Optional due soon threshold. Must be greater than current mileage.</li>
                        <li><strong>Manually set next reminder</strong> – Enter next due date/meter manually if enabled; otherwise system calculates from intervals.</li>
                        <li><strong>Notifications</strong> – Enable or disable.</li>
                        <li><strong>Watchers</strong> – Optional contacts notified.</li>
                        <li><strong>Status</strong> – Active, Inactive, Completed. When Completed, set last completed date/meter.</li>
                    </ul>
                    <p>Save when done. Next due date/meter will be either manually entered or calculated from intervals.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Status</h2>
                    <ul>
                        <li><strong>Active</strong> – Reminder is in use; due dates/meters and notifications apply.</li>
                        <li><strong>Inactive</strong> – Paused; no notifications.</li>
                        <li><strong>Completed</strong> – Service done; last completed date/meter recorded. Can edit or reactivate.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Service Reminders Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each reminder is for one vehicle; current mileage used for validation.</li>
                        <li><strong>Service Tasks</strong> – “What to do” list, managed in Service Tasks module.</li>
                        <li><strong>Contacts</strong> – Watchers receive notifications.</li>
                        <li><strong>Vehicle detail</strong> – Reminders shown on vehicle’s detail page (Reminders tab).</li>
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
                                    <td>See all reminders</td>
                                    <td>Menu: <strong>Service Reminders</strong></td>
                                </tr>
                                <tr>
                                    <td>Add a reminder</td>
                                    <td><strong>Add</strong> → choose vehicle and service tasks, set time/meter interval or manual next due, optional watchers → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> filters (optional vehicle/watcher)</td>
                                </tr>
                                <tr>
                                    <td>Change a reminder</td>
                                    <td><strong>Edit</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Stop notifications</td>
                                    <td>Set <strong>Status</strong> to Inactive or disable <strong>Notifications</strong></td>
                                </tr>
                                <tr>
                                    <td>Mark service done</td>
                                    <td><strong>Edit</strong> → set Status Completed, enter last completed date/meter → Save</td>
                                </tr>
                                <tr>
                                    <td>Remove a reminder</td>
                                    <td><strong>Delete</strong> on the row (confirm)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Service Reminders module works for your team. Use it to keep maintenance on schedule by time and/or mileage and to notify the right people when work is due.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
