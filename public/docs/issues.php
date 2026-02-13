<?php
$pageTitle = 'Issues - Veda Theme Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article" id="section-issues">
                <header class="docs-header">
                    <h1 class="docs-heading">Issues Module – How It Works</h1>
                    <section class="docs-intro">
                        <p>The <strong>Issues</strong> module is where you <strong>report and track defects or problems</strong> on a vehicle (e.g. brake noise, check-engine light, damage). Each issue is tied to one vehicle and can be assigned to someone to fix. Issues can be linked to a <strong>Work Order</strong> when you schedule the repair—so one work order can cover multiple issues.</p>
                    </section>
                </header>

                <section class="docs-section">
                    <h2 class="section-heading">What Issues Are For</h2>
                    <ul>
                        <li><strong>Vehicle</strong> – Which vehicle has the problem (required).</li>
                        <li><strong>Summary</strong> – Short title of the issue (required).</li>
                        <li><strong>Reported date</strong> – When it was reported (required); optional time.</li>
                        <li><strong>Description</strong> – More detail about the problem.</li>
                        <li><strong>Priority</strong> – e.g. Low, Medium, High, Urgent, Critical (for sorting and filtering).</li>
                        <li><strong>Labels</strong> – Optional category or tag (from a fixed list).</li>
                        <li><strong>Primary meter</strong> – Odometer when the issue was reported (optional).</li>
                        <li><strong>Assigned to</strong> – Contact (e.g. technician) responsible for fixing it.</li>
                        <li><strong>Due date</strong> – Optional date by when it should be addressed.</li>
                        <li><strong>Primary meter due</strong> – Optional mileage by when it should be addressed.</li>
                        <li><strong>Status</strong> – Open, Overdue, Resolved, or Closed.</li>
                        <li><strong>Work order</strong> – Optional link to a Work Order once repair is scheduled.</li>
                    </ul>
                    <p>Depending on your role, you may only see issues you reported or are assigned to; admins and managers typically see all issues.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Where to Find It</h2>
                    <p>In the main menu, go to <strong>Issues</strong>. From here you see the list (filtered by your access) and can add, view, edit, or delete issues. Issues for a vehicle can also appear on that vehicle’s detail page (e.g. a tab or section for issues).</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">The Issues List Screen</h2>
                    <ul>
                        <li><strong>Add</strong> – Create a new issue.</li>
                        <li><strong>Tabs or filters</strong> – e.g. All, Open, Overdue, Resolved, Closed.</li>
                        <li><strong>Table</strong> – One row per issue: vehicle, summary, status, priority, reported date, assigned to, labels, and related info.</li>
                        <li><strong>Search</strong> – Find by issue or vehicle/assignee details.</li>
                        <li><strong>Filters</strong> – Status; optionally by assigned person or label.</li>
                        <li><strong>Pagination</strong> – Results paged (e.g. 20 per page).</li>
                        <li><strong>Row actions</strong> – View, Edit, Delete.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Creating or Editing an Issue</h2>
                    <p><strong>Create Issue</strong> (or <strong>Edit</strong> on a row) opens a form with fields such as:</p>
                    <ul>
                        <li><strong>Vehicle</strong> (required) – Select from Vehicles.</li>
                        <li><strong>Summary</strong> (required) – Short title (e.g. “Brake noise when stopping”).</li>
                        <li><strong>Reported date</strong> (required) – When it was reported; optional time.</li>
                        <li><strong>Description</strong> – Full details.</li>
                        <li><strong>Priority</strong> – e.g. Low, Medium, High, Urgent, Critical.</li>
                        <li><strong>Labels</strong> – Optional category (from list).</li>
                        <li><strong>Primary meter</strong> – Odometer at report time (optional).</li>
                        <li><strong>Assigned to</strong> – Contact from Contacts (optional).</li>
                        <li><strong>Due date</strong> – Optional.</li>
                        <li><strong>Primary meter due</strong> – Optional.</li>
                        <li><strong>Status</strong> – Open, Overdue, Resolved, or Closed.</li>
                    </ul>
                    <p>You can link the issue to a <strong>Work Order</strong> when creating or editing the work order (by selecting this issue for that vehicle). Once linked, the issue appears under that work order and can be marked Resolved/Closed when the job is done.</p>
                    <p>Save when done.</p>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">Status</h2>
                    <ul>
                        <li><strong>Open</strong> – Reported, not yet fixed.</li>
                        <li><strong>Overdue</strong> – Past due date or due meter.</li>
                        <li><strong>Resolved</strong> – Fixed; may be reopened if needed.</li>
                        <li><strong>Closed</strong> – No further action.</li>
                    </ul>
                </section>

                <section class="docs-section">
                    <h2 class="section-heading">How Issues Connect to the Rest of the System</h2>
                    <ul>
                        <li><strong>Vehicles</strong> – Each issue is for one vehicle (from Vehicles).</li>
                        <li><strong>Contacts</strong> – The person assigned to fix it is a Contact (Assigned to).</li>
                        <li><strong>Work Orders</strong> – When you create or edit a Work Order, you can attach open issues (for that vehicle) that are not yet on any work order.</li>
                    </ul>
                    <p>So: report problems in <strong>Issues</strong>, then schedule the repair in <strong>Work Orders</strong> by linking the relevant issues to the job.</p>
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
                                    <td>See issues (yours or all, by role)</td>
                                    <td>Menu: <strong>Issues</strong>; use tabs/filters (Open, Resolved, etc.)</td>
                                </tr>
                                <tr>
                                    <td>Report a problem</td>
                                    <td><strong>Add</strong> → vehicle, summary, reported date → optional description, priority, assignee, due date → Save</td>
                                </tr>
                                <tr>
                                    <td>Find or filter</td>
                                    <td><strong>Search</strong> and <strong>Status</strong> / <strong>Assigned to</strong> / <strong>Label</strong> filters</td>
                                </tr>
                                <tr>
                                    <td>Assign to a work order</td>
                                    <td>When creating/editing a <strong>Work Order</strong>, select open issues for that vehicle to attach</td>
                                </tr>
                                <tr>
                                    <td>Change or close</td>
                                    <td><strong>Edit</strong> on the row → update status (e.g. Resolved/Closed), assignee, or other fields</td>
                                </tr>
                                <tr>
                                    <td>Remove an issue</td>
                                    <td><strong>Delete</strong> on the row (confirm when asked)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted mb-0">This guide describes how the Issues module works for your team. Use it to log vehicle problems and then tie them to work orders when scheduling repairs.</p>
                </section>
            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>
