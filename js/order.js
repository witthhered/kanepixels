// order.js - multi-step order form, facility data and order summary
// (validateField() comes from validation.js, which is loaded before this file)

var orderForm = document.getElementById("orderForm");
var steps = document.querySelectorAll(".form-step");
var stepLabel = document.getElementById("stepLabel");
var stepFill = document.getElementById("stepFill");
var backBtn = document.getElementById("backBtn");
var nextBtn = document.getElementById("nextBtn");
var submitBtn = document.getElementById("submitBtn");
var facilityInfo = document.getElementById("facilityInfo");
var orderSummary = document.getElementById("orderSummary");

var stepNames = ["Facility", "Contacts", "Details"];
var totalSteps = steps.length;
var currentStep = 1;

// which fields (ids from validation.js rules) must be valid on each step
var stepFields = {
    1: ["facility"],
    2: ["fullName", "email", "phone", "password", "confirmPassword"],
    3: ["sqmeters", "terms"]
};

// ---------- Data: array of objects with a method ----------
var facilities = [
    {
        value: "low-risk-storage",
        name: "The Roads",
        level: 10,
        risk: "Low",
        description: "Endless highways with stable lighting. Best for logistics hubs and storage.",
        title: function () {
            return this.name + " (Sub-Level " + this.level + ")";
        }
    },
    {
        value: "hydro-spatial-unit",
        name: "The House Unit",
        level: 7,
        risk: "Medium",
        description: "A quiet residential zone with a stable atmosphere. Good for offices and staff housing.",
        title: function () {
            return this.name + " (Sub-Level " + this.level + ")";
        }
    },
    {
        value: "high-containment-zone",
        name: "The Barbie Room",
        level: 402,
        risk: "High",
        description: "A sealed pink hall with unusual signal behaviour. Only for approved research projects.",
        title: function () {
            return this.name + " (Sub-Level " + this.level + ")";
        }
    }
];

// finds the facility object by the value of the selected radio button
function getFacilityByValue(value) {
    return facilities.find(function (facility) {
        return facility.value === value;
    });
}

function getSelectedFacility() {
    var checked = document.querySelector('input[name="facilityType"]:checked');
    if (!checked) {
        return null;
    }
    return getFacilityByValue(checked.value);
}

// switch: different notice for each risk level
function getRiskNotice(risk) {
    var notice;

    switch (risk) {
        case "Low":
            notice = "Standard clearance is enough for this level.";
            break;
        case "Medium":
            notice = "Security clearance is recommended for this level.";
            break;
        case "High":
            notice = "Security clearance and a custom entry portal are required.";
            break;
        default:
            notice = "";
    }

    return notice;
}

// shows the info box under the facility cards
function showFacilityInfo(facility) {
    facilityInfo.innerHTML =
        "<strong>" + facility.title() + "</strong> - risk: " + facility.risk +
        "<br>" + facility.description +
        "<br><em>" + getRiskNotice(facility.risk) + "</em>";
    facilityInfo.classList.add("visible");
}

var facilityRadios = document.querySelectorAll('input[name="facilityType"]');

facilityRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
        showFacilityInfo(getFacilityByValue(radio.value));
    });
});

// ---------- Steps ----------
// shows the step with the given number
function showStep(number) {
    currentStep = number;

    steps.forEach(function (step) {
        step.classList.remove("active");
    });
    steps[number - 1].classList.add("active");

    stepLabel.textContent = "Step " + number + " of " + totalSteps + ": " + stepNames[number - 1];
    stepFill.style.width = (number / totalSteps) * 100 + "%";

    // buttons depend on the step
    backBtn.classList.toggle("d-none", number === 1);
    nextBtn.classList.toggle("d-none", number === totalSteps);
    submitBtn.classList.toggle("d-none", number !== totalSteps);

    if (number === totalSteps) {
        updateSummary();
    }
}

// callback used by the buttons: shows the step and scrolls to the top of the form
function goToStep(number) {
    showStep(number);
    orderForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

// checks all fields of the step; returns true if all of them are valid
function validateStep(number) {
    var allValid = true;

    stepFields[number].forEach(function (id) {
        if (!validateField(id)) {
            allValid = false;
        }
    });

    return allValid;
}

// moves one step forward (1) or back (-1) and calls the callback with the new number
function changeStep(direction, callback) {
    var newStep = currentStep + direction;

    if (newStep < 1 || newStep > totalSteps) {
        return;
    }

    // going forward is allowed only when the current step is valid
    if (direction === 1 && !validateStep(currentStep)) {
        return;
    }

    callback(newStep);
}

nextBtn.addEventListener("click", function () {
    changeStep(1, goToStep);
});

backBtn.addEventListener("click", function () {
    changeStep(-1, goToStep);
});

// Enter in a text field goes to the next step instead of sending the form
orderForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName === "INPUT" && currentStep < totalSteps) {
        event.preventDefault();
        changeStep(1, goToStep);
    }
});

// "Clear form" button: go back to the first step and hide the info box
orderForm.addEventListener("reset", function () {
    facilityInfo.classList.remove("visible");
    orderSummary.innerHTML = "";
    showStep(1);
});

// ---------- Summary (arrays, loops, higher-order functions) ----------
// returns the labels of all checked boxes with the given name
function getCheckedLabels(name) {
    var boxes = Array.from(document.querySelectorAll('input[name="' + name + '"]'));

    return boxes
        .filter(function (box) {
            return box.checked;
        })
        .map(function (box) {
            return box.nextElementSibling.textContent;
        });
}

function updateSummary() {
    var facility = getSelectedFacility();
    var extras = getCheckedLabels("extras");
    var timeline = document.getElementById("timeline");
    var contact = document.querySelector('input[name="contactMethod"]:checked');
    var area = document.getElementById("sqmeters").value;

    // array of [label, value] pairs
    var rows = [
        ["Facility", facility ? facility.title() : "Not selected"],
        ["Client", document.getElementById("fullName").value.trim()],
        ["Email", document.getElementById("email").value.trim()],
        ["Contact by", contact ? contact.value : "-"],
        ["Area", area === "" ? "Not specified" : area + " m2"],
        ["Timeline", timeline.options[timeline.selectedIndex].text],
        ["Extras", extras.length > 0 ? extras.join(", ") : "None"]
    ];

    orderSummary.innerHTML = "";

    var title = document.createElement("h3");
    title.textContent = "Order summary";
    orderSummary.appendChild(title);

    var list = document.createElement("ul");

    // loop that builds the list; textContent is used because the text is typed by the user
    for (var i = 0; i < rows.length; i++) {
        var item = document.createElement("li");
        var label = document.createElement("strong");

        label.textContent = rows[i][0] + ": ";
        item.appendChild(label);
        item.appendChild(document.createTextNode(rows[i][1]));
        list.appendChild(item);
    }

    orderSummary.appendChild(list);
}

showStep(1);
