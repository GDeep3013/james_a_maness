<?php
$pageTitle = 'Schedules - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-schedules">
                <header class="docs-header">
                    <h1 class="docs-heading">Schedules Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Schedules</strong> module is used to <strong>plan when a vehicle is due</strong> for specific maintenance tasks (e.g. oil change, inspection). Each schedule is for one vehicle and one or more <strong>service tasks</strong>. You set the <strong>next due date</strong> and <strong>next due meter</strong> yourself; optional <strong>watchers</strong> can be notified. After work is done, you can record the last completed date and meter and update the next due values.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Schedules Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Which vehicle the schedule is for (required).</li>
                        <li><strong>Service tasks</strong> – Tasks to perform (from Service Tasks). You can select multiple tasks per schedule (required).</li>
                        <li><strong>Next due date</strong> – Date when the work should be done (required).</li>
                        <li><strong>Next due meter</strong> – Mileage when the work should be done (required).</li>
                        <li><strong>Notifications</strong> – Option to turn notifications on or off.</li>
                        <li><strong>Watchers</strong> – Optional contacts to be notified (from Contacts).</li>
                        <li><strong>Status</strong> – Active, Inactive, or Completed. When completed, you can set <strong>last completed date</strong> and <strong>last completed meter</strong>, then update next due values.</li>
                    </ul>
                    <p>Unlike Service Reminders, Schedules do <strong>not</strong> auto-calculate the next due date/meter; you enter them manually.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Schedules</strong>. From here you can view, create, or edit schedules. Vehicle schedules may also appear on the vehicle’s detail page or calendar view.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Schedules List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new schedule.</li>
                        <li><strong>Table</strong> – One row per schedule: vehicle, service task(s), next due date, next due meter, status.</li>
                        <li><strong>Search</strong> – Find by schedule or vehicle details.</li>
                        <li><strong>Filters</strong> – Status (Active, Inactive, Completed); optionally by vehicle.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Schedule</h2>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles.</li>
                        <li><strong>Service tasks</strong> (required) – Select one or more tasks.</li>
                        <li><strong>Next due date</strong> (required) – Date when work is due.</li>
                        <li><strong>Next due meter</strong> (required) – Mileage when work is due.</li>
                        <li><strong>Notifications</strong> – Enable or disable notifications.</li>
                        <li><strong>Watchers</strong> – Optional contacts to notify.</li>
                        <li><strong>Status</strong> – Active, Inactive, or Completed.</li>
                    </ul>
                    <p>When editing, you can also set <strong>last completed date</strong> and <strong>last completed meter</strong> after work is done, then update <strong>next due date</strong> and <strong>next due meter</strong> for the next cycle. Save when done.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Status</h2>
                    <ul>
                        <li><strong>Active</strong> – Schedule is in use; due date/meter and notifications apply.</li>
                        <li><strong>Inactive</strong> – Paused; no notifications.</li>
                        <li><strong>Completed</strong> – Work done; last completed date/meter recorded. Can edit to set next cycle or reactivate.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Schedules Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each schedule is linked to one vehicle.</li>
                        <li><strong>Service Tasks</strong> – “What to do” list, e.g. Oil change, Brake check. Manage in Service Tasks, then select when creating a schedule.</li>
                        <li><strong>Contacts</strong> – Watchers can receive notifications when schedule is due.</li>
                        <li><strong>Vehicle detail / Calendar</strong> – Schedules may appear on vehicle pages or calendar views.</li>
                    </ul>
                    <p><strong>Schedules vs Service Reminders:</strong> Service Reminders can auto-calculate next due using intervals. Schedules use manual next due date and meter only.</p>
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
                                    <td>See all schedules</td>
                                    <td>Menu: <strong>Schedules</strong></td>
                                </tr>
                                <tr>
                                    <td>Add a schedule</td>
                                    <td><strong>Add</strong> → vehicle, service task(s), next due date, next due meter → optional watchers → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> (optional vehicle filter)</td>
                                </tr>
                                <tr>
                                    <td>Mark work done</td>
                                    <td><strong>Edit</strong> → last completed date/meter, update next due date/meter → set Status Completed if desired → Save</td>
                                </tr>
                                <tr>
                                    <td>Pause notifications</td>
                                    <td>Set <strong>Status</strong> to Inactive or turn off <strong>Notifications</strong></td>
                                </tr>
                                <tr>
                                    <td>Remove a schedule</td>
                                    <td><strong>Delete</strong> on the row (confirm)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Schedules module works for your team. Use it when you want to plan maintenance by specific due date and mileage without using automatic intervals.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
