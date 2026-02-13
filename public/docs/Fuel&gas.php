<?php
$pageTitle = 'Fuel & Gas Stations - KAV Expediting Documentation';
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
?>
    <div class="docs-content">
        <div class="container">
            <article class="docs-article">
<h2>Fuel & Gas Stations Module – How It Works</h2>
<p>The <strong>Fuel & Gas Stations</strong> module (shown in the app as <strong>Fuels</strong>) is where you <strong>record refuels and fill-ups </strong>for your vehicles. Each entry is one fuel purchase: which vehicle, which vendor (gas station or supplier), how much fuel, at what price, and the odometer before and after. The system calculates total cost and supports fuel economy and cost statistics. Vendors used here are your gas stations or fuel suppliers from the **Vendors** list (mark them as “Fuel” type when relevant).</p>
<h2>What Fuel & Gas Stations Are For</h2>
<ul>
<li><strong>Vehicle –</strong>Which vehicle was refuelled (required). </li>
<li><strong>Vendor – </strong>Where you bought the fuel—gas station or supplier (required). The vendor must exist in <strong>Vendors</strong>; use vendors marked as Fuel type for easier selection. </li>
<li><strong>Fuel type –</strong>Gasoline, Diesel, Electric, or Hybrid.  </li>
<li><strong>Units –</strong>Amount of fuel (required). <strong>Unit type</strong> – US Gallons, Liters, or UK Gallons.</li>
<li><strong>Price per unit –</strong>Price per unit of volume (required). <strong>Total cost</strong>– Calculated automatically (units × price per unit).</li>
<li><strong>Previous meter –</strong>Odometer reading before this fill-up (required). <strong>Vehicle meter</strong> – Odometer after this fill-up (required). The vehicle meter must be <strong>greater than</strong> the previous meter. When adding a new entry, the form can show the last recorded meter for that vehicle to help you enter the correct previous meter.  </li>
<li><strong>Date –</strong>When the refuel happened (required). <strong>Notes</strong> – Optional. These records are used for fuel spend, volume, distance, and fuel economy (e.g. distance per gallon) on the overview and in reports.</li>
</ul>
<h2>Where to Find It</h2>
<p>Menu: <strong>Fuels</strong> (or <strong>Fuel & Gas Stations</strong> in the page title). From here you see the overview stats, the list of fuel entries, and you can add, view, or edit entries.</p>
<h2>List Screen</h2>
<ul>
<li><strong>Overview cards –</strong>Summary statistics such as total fuel cost, total volume, average fuel economy (e.g. distance per unit), and total distance. These update as you add or change fuel entries.</li>
<li><strong>Add Fuels-</strong>Record a new refuel.</li>
<li><strong>Table-</strong>One row per fuel entry: vehicle, vendor, date, fuel type, units, unit type, price, total cost, vehicle meter, previous meter, and often calculated mileage or economy.</li>
<li><strong>Pagination – </strong>Results paged (e.g. 20 per page), newest first.  </li>
<li><strong>Row actions –</strong>View (open detail), Edit, Delete.</li>
</ul>

<h2>Creating or Editing a Fuel Entry</h2>
<h4>Add Fuels (or <strong>Edit</strong> on a row) opens a form with:</h4>

<ul>
<li><strong>Vehicle (required) –</strong> Select from Vehicles.  </li>
<li> <strong>Vendor (required) –</strong> Select the gas station or fuel supplier from Vendors.  </li>
<li><strong>Fuel type (required) – </strong>Gasoline, Diesel, Electric, or Hybrid.  </li>
<li><strong>Unit type (required) –</strong> US Gallons, Liters, or UK Gallons.  </li>
<li><strong>Units (required) – </strong>Amount of fuel. <strong>Price per volume unit</strong> (required) – Cost per unit. Total cost is calculated for you.  </li>
<li><strong>Previous meter (required) – </strong>Odometer before fill-up. **Vehicle meter** (required) – Odometer after fill-up; must be **greater than** previous meter. The form may show the last meter for the selected vehicle so you can enter the right previous meter.</li>
<li><strong>Date (required) – </strong>Date of refuel. <strong>Notes</strong> – Optional. Save when done. If you enter a vehicle meter that is not greater than the previous meter, the system will ask you to correct it.</li>
</ul>
<h2>Fuel Entry Detail</h2>
<p>Opening a fuel entry shows the full record: vehicle, vendor, date, fuel type, units, unit type, price, total cost, previous and vehicle meter, notes, and any calculated values (e.g. distance or economy for that fill-up).</p>
<h2>How It Connects to the Rest of the System</h2>
<ul>
<li><strong>Vehicles –</strong> Each fuel entry is for one vehicle (from Vehicles). The vehicle’s current mileage is updated from <strong>Meter History</strong>, not from fuel entries; fuel entries use previous/vehicle meter for cost and economy only.</li>  
<li><strong>Vendors –</strong> The gas station or supplier is a <strong>Vendor</strong> (from Vendors). Create vendors for your gas stations and fuel suppliers and, if your system supports it, mark them as “Fuel” type so they are easy to find when logging fuel.  </li>
<li><strong>Vehicle detail –</strong> A vehicle’s fuel history can be shown on that vehicle’s detail page (e.g. Fuel tab).</li>  
<li><strong>Reports – </strong>Fuel data feeds fuel reports (e.g. cost and economy by vehicle or period).</li>
</ul>
<h2>Quick Reference</h2>

<table>
    <thead>
        <tr>
            <th>Task</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>See overview and list</td>
            <td><strong>Fuels</strong> (or Fuel &amp; Gas Stations) in menu</td>
        </tr>
        <tr>
            <td>Record a refuel</td>
            <td>
                <strong>Add Fuels</strong> → vehicle, vendor (gas station), fuel type, units, 
                unit type, price, previous meter, vehicle meter (must be higher), date → Save
            </td>
        </tr>
        <tr>
            <td>Use correct previous meter</td>
            <td>
                Select vehicle first; form may show last meter for that vehicle so you can 
                enter the right previous meter and a higher vehicle meter
            </td>
        </tr>
        <tr>
            <td>View one entry</td>
            <td><strong>View</strong> on the row</td>
        </tr>
        <tr>
            <td>Change an entry</td>
            <td><strong>Edit</strong> on the row</td>
        </tr>
        <tr>
            <td>Remove an entry</td>
            <td><strong>Delete</strong> on the row (confirm when asked)</td>
        </tr>
    </tbody>
</table>

<hr>

<p>
    This guide describes how the <strong>Fuel &amp; Gas Stations (Fuels)</strong> module works for your team. 
    Use it to log every refuel, track spend and volume, and keep gas stations/suppliers in 
    <strong>Vendors</strong> so they can be selected when recording fuel.
</p>

            </article>
        </div>
    </div>
<?php require_once 'includes/footer.php'; ?>