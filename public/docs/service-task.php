<?php
$pageTitle = 'Service Tasks - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container-fluid">
            <article class="docs-article" id="section-service-task">
                <header class="docs-header">
                    <h1 class="docs-heading">Service Tasks Module – How It Works</h1>
                    <section class="docs-intro">
                        <p><strong>Service Tasks</strong> are the <strong>list of maintenance tasks</strong> you can schedule or remind for (e.g. “Oil change”, “Brake inspection”, “Tire rotation”). You do not assign them to a vehicle here—you define the task name, optional description, and optional labour cost. Then you select one or more service tasks when creating a <strong>Service Reminder</strong> or a <strong>Schedule</strong> for a vehicle, allowing reuse across vehicles.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Service Tasks Are For</h2>
                    <ul>
                        <li><strong>Name</strong> – Task name (required), e.g. “Oil change”.</li>
                        <li><strong>Description</strong> – Optional details.</li>
                        <li><strong>Labor cost</strong> – Optional default cost (for estimates or line items).</li>
                    </ul>
                    <p>This module is the <strong>master list</strong> of task types. Vehicle-specific due dates are set in <strong>Service Reminders</strong> or <strong>Schedules</strong>.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Service Tasks</strong>. From here you can view, add, edit, or delete tasks (sorted A–Z).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Service Tasks List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new service task.</li>
                        <li><strong>Table</strong> – One row per task: name, description, labour cost.</li>
                        <li><strong>Search</strong> – Find by name or description.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing a Service Task</h2>
                    <ul>
                        <li><strong>Name</strong> – Required (e.g. “Oil change”).</li>
                        <li><strong>Description</strong> – Optional details.</li>
                        <li><strong>Labor cost</strong> – Optional (default cost for estimates/line items).</li>
                    </ul>
                    <p>Save when done.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Service Tasks Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Service Reminders</strong> – Choose one or more tasks from this list when creating a reminder; system tracks due dates by time/mileage per vehicle.</li>
                        <li><strong>Schedules</strong> – Choose tasks from this list when creating a schedule; set next due date/meter per vehicle.</li>
                    </ul>
                    <p>Define task types here first, then use them in Service Reminders and Schedules.</p>
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
                                    <td>See all tasks</td>
                                    <td>Menu: <strong>Service Tasks</strong> (sorted by name)</td>
                                </tr>
                                <tr>
                                    <td>Add a task type</td>
                                    <td><strong>Add</strong> → name (required), optional description and labour cost → Save</td>
                                </tr>
                                <tr>
                                    <td>Find a task</td>
                                    <td><strong>Search</strong> on the list</td>
                                </tr>
                                <tr>
                                    <td>Change a task</td>
                                    <td><strong>Edit</strong> on the row</td>
                                </tr>
                                <tr>
                                    <td>Remove a task</td>
                                    <td><strong>Delete</strong> on the row (confirm). If used in reminders/schedules, update those.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Service Tasks module works for your team. Use it to maintain the list of maintenance task types, then select them when setting up Service Reminders and Schedules.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
