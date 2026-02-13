<?php $currentPage = basename(urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))); ?>
    <div class="docs-wrapper">
        <div id="docs-sidebar" class="docs-sidebar sidebar-visible">
            <div class="top-search-box d-lg-none p-3">
                <form autocomplete="off">
                    <div class="autocomplete" style="width:300px;">
                        <input id="myInput" type="text" name="search" placeholder="Search the docs..." class="form-control search-input">
                        <button type="submit" class="btn search-btn" value="Search"><i class="fas fa-search"></i></button>
                    </div>
                </form>
            </div>
            <nav id="docs-nav" class="docs-nav navbar">
                <ul class="section-items list-unstyled nav flex-column pb-3">
                    <li class="nav-item section-title mt-3"><a class="nav-link" href="#section-3"><span class="theme-icon-holder me-2"><img src="assets/icons/car.svg" alt="" class="sidebar-icon"></span>Vehicles</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'vehicle.php' ? ' active' : ''; ?>" href="vehicle.php"><span class="theme-icon-holder me-2"><img src="assets/icons/car.svg" alt="" class="sidebar-icon"></span>Assets List</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'meter.php' ? ' active' : ''; ?>" href="meter.php"><span class="theme-icon-holder me-2"><img src="assets/icons/total-mileage.svg" alt="" class="sidebar-icon"></span>Meter History</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'expense.php' ? ' active' : ''; ?>" href="expense.php"><span class="theme-icon-holder me-2"><img src="assets/icons/dollar-line.svg" alt="" class="sidebar-icon"></span>Expense History</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link" href="#section-4"><span class="theme-icon-holder me-2"><img src="assets/icons/maintenance.svg" alt="" class="sidebar-icon"></span>Maintenance</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'work-order.php' ? ' active' : ''; ?>" href="work-order.php"><span class="theme-icon-holder me-2"><img src="assets/icons/task-icon.svg" alt="" class="sidebar-icon"></span>Work Orders</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'service-reminders.php' ? ' active' : ''; ?>" href="service-reminders.php"><span class="theme-icon-holder me-2"><img src="assets/icons/calender-line.svg" alt="" class="sidebar-icon"></span>Service Reminders</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'services.php' ? ' active' : ''; ?>" href="services.php"><span class="theme-icon-holder me-2"><img src="assets/icons/service.svg" alt="" class="sidebar-icon"></span>Services</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'issues.php' ? ' active' : ''; ?>" href="issues.php"><span class="theme-icon-holder me-2"><img src="assets/icons/issues.svg" alt="" class="sidebar-icon"></span>Issues</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'shedules.php' ? ' active' : ''; ?>" href="shedules.php"><span class="theme-icon-holder me-2"><img src="assets/icons/calendar.svg" alt="" class="sidebar-icon"></span>Shedules</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link<?php echo $currentPage === 'contacts.php' ? ' active' : ''; ?>" href="contacts.php"><span class="theme-icon-holder me-2"><img src="assets/icons/contacts.svg" alt="" class="sidebar-icon"></span>Contacts</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link<?php echo $currentPage === 'vendors.php' ? ' active' : ''; ?>" href="vendors.php"><span class="theme-icon-holder me-2"><img src="assets/icons/vendors.svg" alt="" class="sidebar-icon"></span>Vendors</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link<?php echo $currentPage === 'Fuel&gas.php' ? ' active' : ''; ?>" href="Fuel&gas.php"><span class="theme-icon-holder me-2"><img src="assets/icons/fuel.svg" alt="" class="sidebar-icon"></span>Fuel & Gas Station</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link" href="#section-5"><span class="theme-icon-holder me-2"><img src="assets/icons/reports.svg" alt="" class="sidebar-icon"></span>Reports</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'reports-mmr.php' ? ' active' : ''; ?>" href="reports-mmr.php"><span class="theme-icon-holder me-2"><img src="assets/icons/file.svg" alt="" class="sidebar-icon"></span>Monthly Maintenance Reports (MMR)</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'reports-maintenance.php' ? ' active' : ''; ?>" href="reports-maintenance.php"><span class="theme-icon-holder me-2"><img src="assets/icons/file.svg" alt="" class="sidebar-icon"></span>Maintenance Report</a></li>
                    <li class="nav-item"><a class="nav-link<?php echo $currentPage === 'reports-fuel.php' ? ' active' : ''; ?>" href="reports-fuel.php"><span class="theme-icon-holder me-2"><img src="assets/icons/fuel.svg" alt="" class="sidebar-icon"></span>Fuel Report</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link<?php echo $currentPage === 'service-task.php' ? ' active' : ''; ?>" href="service-task.php"><span class="theme-icon-holder me-2"><img src="assets/icons/servicetask.svg" alt="" class="sidebar-icon"></span>Service Task</a></li>
                    <li class="nav-item section-title mt-3"><a class="nav-link<?php echo $currentPage === 'part.php' ? ' active' : ''; ?>" href="part.php"><span class="theme-icon-holder me-2"><img src="assets/icons/parts.svg" alt="" class="sidebar-icon"></span>Parts</a></li>
                </ul>
            </nav>
        </div>
    </div>
