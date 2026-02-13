function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
            let itemText = arr[i].name;   // Item name
            let itemLink = arr[i].link;   // Item link URL

            // 🔹 **Check if user input is anywhere in the item name**
            if (itemText.toUpperCase().includes(val.toUpperCase())) {
                b = document.createElement("DIV");

                // 🔹 **Highlight the matching portion of the text**
                let startIndex = itemText.toUpperCase().indexOf(val.toUpperCase());
                let endIndex = startIndex + val.length;

                // Wrap the matched part in a <strong> tag to highlight it
                let highlightedText = itemText.slice(0, startIndex) + 
                                      "<strong>" + itemText.slice(startIndex, endIndex) + "</strong>" +
                                      itemText.slice(endIndex);

                b.innerHTML = highlightedText;

                // 🔗 **Add link inside hidden input**
                b.innerHTML += `<input type='hidden' value='${itemText}'>`;

                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();

                    // 🔄 **Navigate to the item link**
                    window.location.href = itemLink;
                });

                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");

        if (e.keyCode == 40) { // Down arrow
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // Up arrow
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // Enter
            e.preventDefault(); // Prevent form submission

            if (currentFocus > -1) {
                // If a suggestion is selected, click it
                if (x) x[currentFocus].click();
            } else {
                // If no suggestion is selected, find the first match and trigger it
                triggerSearch(inp.value);
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// ✅ **New Data Array with SKU & Links**
const countryArray = [];

document.querySelectorAll(".nav-item a").forEach((item) => {
    const countryName = item.textContent.trim();
    const countryLink = item.getAttribute("href");

    if (countryName && countryLink) {
        countryArray.push({ name: countryName, link: countryLink });
    }
});

console.log(countryArray);

// 🛠 **Apply Autocomplete**
autocomplete(document.getElementById("myInput"), countryArray);

// Function to trigger search logic manually (for both button click and Enter key)
function triggerSearch(query) {
    const searchQuery = query || document.getElementById("myInput").value;
    console.log("Search triggered with query:", searchQuery);
    
    // Look for the first match in the array
    const firstMatch = countryArray.find(item => item.name.toUpperCase().includes(searchQuery.toUpperCase()));
    
    if (firstMatch) {
        // Navigate to the link of the first matching item
        window.location.href = firstMatch.link;
    } else {
        console.log("No matching results found.");
    }
}

// 🛠 **Handle Search Button Click**
document.querySelector("button.btn.search-btn").addEventListener("click", function (e) {
    e.preventDefault();  // Prevent the default form submission
    triggerSearch(); // Trigger the search manually when the button is clicked
});
