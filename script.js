
"use strict";

// ========================================
// 1. DASHBOARD ELEMENTS
// ========================================

const spiDashboardValue = document.getElementById("spi-value");
const cpiDashboardValue = document.getElementById("cpi-value");

const currentSemesterSelect =
    document.getElementById("current-semester-select");

const currentSemesterValue =
    document.getElementById("current-semester-value");

const CURRENT_SEMESTER_KEY = "engineeringCurrentSemester";


// ========================================
// 2. SPI CALCULATOR ELEMENTS
// ========================================

const subjectsContainer =
    document.getElementById("subjects-container");

const addSubjectButton =
    document.getElementById("add-subject-btn");

const calculateSPIButton =
    document.getElementById("calculate-semester-btn");

const spiResult = document.getElementById("spi-result");
const spiError = document.getElementById("spi-error");

const totalCreditsDisplay =
    document.getElementById("total-credits");

const weightedPointsDisplay =
    document.getElementById("weighted-points");


// ========================================
// 3. ADD SPI SUBJECT
// ========================================

function addSubject(name = "", credits = "", gradePoint = "") {
    const row = document.createElement("div");
    row.className = "subject-row";

    row.innerHTML = `
        <div class="subject-field">
            <label>Subject name</label>
            <input
                type="text"
                class="subject-name"
                placeholder="e.g. Mathematics"
            >
        </div>

        <div class="subject-field">
            <label>Credits</label>
            <input
                type="number"
                class="subject-credits"
                min="0.01"
                step="any"
                placeholder="e.g. 4"
            >
        </div>

        <div class="subject-field">
            <label>Grade point</label>
            <input
                type="number"
                class="subject-grade"
                min="0"
                max="10"
                step="any"
                placeholder="e.g. 9"
            >
        </div>

        <button type="button" class="remove-subject-btn">
            Remove
        </button>
    `;

    row.querySelector(".subject-name").value = name;
    row.querySelector(".subject-credits").value = credits;
    row.querySelector(".subject-grade").value = gradePoint;

    row.querySelector(".remove-subject-btn")
        .addEventListener("click", () => {
            row.remove();
            clearSPIResult();
            saveData();
        });

    subjectsContainer.appendChild(row);
}


function clearSPIResult() {
    spiResult.textContent = "--";
    spiError.textContent = "";
    totalCreditsDisplay.textContent = "0";
    weightedPointsDisplay.textContent = "0";
    spiDashboardValue.textContent = "---";
}


addSubjectButton.addEventListener("click", () => {
    addSubject();
    clearSPIResult();
    saveData();
});


// ========================================
// 4. CALCULATE SPI
// ========================================

calculateSPIButton.addEventListener("click", () => {
    clearSPIResult();

    const rows =
        subjectsContainer.querySelectorAll(".subject-row");

    let totalCredits = 0;
    let weightedPoints = 0;

    if (rows.length === 0) {
        spiError.textContent =
            "Please add at least one subject.";
        return;
    }

    for (const row of rows) {
        const name =
            row.querySelector(".subject-name").value.trim();

        const creditsInput =
            row.querySelector(".subject-credits");

        const gradeInput =
            row.querySelector(".subject-grade");

        const credits = Number(creditsInput.value);
        const gradePoint = Number(gradeInput.value);

        if (
            name === "" ||
            creditsInput.value.trim() === "" ||
            gradeInput.value.trim() === "" ||
            !Number.isFinite(credits) ||
            !Number.isFinite(gradePoint) ||
            credits <= 0 ||
            gradePoint < 0 ||
            gradePoint > 10
        ) {
            spiError.textContent =
                "Enter a subject name, positive credits, and a grade point from 0 to 10 for every subject.";
            return;
        }

        totalCredits += credits;
        weightedPoints += credits * gradePoint;
    }

    if (totalCredits <= 0) {
        spiError.textContent =
            "Total credits must be greater than zero.";
        return;
    }

    const spi = weightedPoints / totalCredits;

    spiResult.textContent = spi.toFixed(2);
    spiDashboardValue.textContent = spi.toFixed(2);

    totalCreditsDisplay.textContent =
        Number(totalCredits.toFixed(4)).toString();

    weightedPointsDisplay.textContent =
        Number(weightedPoints.toFixed(4)).toString();
});


// ========================================
// 5. CURRENT SEMESTER SELECTION
// ========================================

function updateCurrentSemester(value) {
    if (value === "") {
        currentSemesterValue.textContent = "Not selected";
        localStorage.removeItem(CURRENT_SEMESTER_KEY);
        return;
    }

    currentSemesterValue.textContent =
        `You are currently in Semester ${value}`;

    localStorage.setItem(CURRENT_SEMESTER_KEY, value);
}


currentSemesterSelect.addEventListener("change", () => {
    updateCurrentSemester(currentSemesterSelect.value);
});


// Restore the student's saved semester selection.

const savedCurrentSemester =
    localStorage.getItem(CURRENT_SEMESTER_KEY);

if (
    savedCurrentSemester !== null &&
    /^[1-8]$/.test(savedCurrentSemester)
) {
    currentSemesterSelect.value = savedCurrentSemester;
    updateCurrentSemester(savedCurrentSemester);
} else {
    currentSemesterSelect.value = "";
    currentSemesterValue.textContent = "Not selected";
}


// ========================================
// 6. CPI CALCULATOR ELEMENTS
// ========================================

const semestersContainer =
    document.getElementById("semesters-container");

const addSemesterButton =
    document.getElementById("add-semester-btn");

const calculateCPIButton =
    document.getElementById("calculate-cpi-btn");

const cpiResult = document.getElementById("cpi-result");
const cpiError = document.getElementById("cpi-error");

const cpiTotalCredits =
    document.getElementById("cpi-total-credits");

const cpiWeightedPoints =
    document.getElementById("cpi-weighted-points");

let semesterCount = 0;


// ========================================
// 7. UPDATE SEMESTER NUMBERS
// ========================================

function updateSemesterNumbers() {
    const semesterCards =
        semestersContainer.querySelectorAll(".semester-card");

    semesterCards.forEach((card, index) => {
        const heading = card.querySelector("h3");

        if (heading) {
            heading.textContent = `Semester ${index + 1}`;
        }
    });

    semesterCount = semesterCards.length;
}


// ========================================
// 8. ADD SEMESTER
// ========================================

function addSemester() {
    const semesterCard = document.createElement("div");

    semesterCard.className = "semester-card";

    semesterCard.innerHTML = `
        <h3>Semester</h3>

        <button type="button" class="add-semester-subject-btn">
            Add Subject
        </button>

        <button type="button" class="remove-semester-btn">
            Remove Semester
        </button>

        <div class="semester-subjects"></div>
    `;

    const subjectsArea =
        semesterCard.querySelector(".semester-subjects");

    semesterCard
        .querySelector(".add-semester-subject-btn")
        .addEventListener("click", () => {
            addSemesterSubject(subjectsArea);
            clearCPIResult();
            saveData();
        });

    semesterCard
        .querySelector(".remove-semester-btn")
        .addEventListener("click", () => {
            semesterCard.remove();

            updateSemesterNumbers();
            clearCPIResult();
            saveData();
        });

    semestersContainer.appendChild(semesterCard);

    updateSemesterNumbers();
}


addSemesterButton.addEventListener("click", () => {
    addSemester();
    clearCPIResult();
    saveData();
});


// ========================================
// 9. ADD SUBJECT TO A SEMESTER
// ========================================

function addSemesterSubject(subjectsArea) {
    const subjectRow = document.createElement("div");

    subjectRow.className = "semester-subject-row";

    subjectRow.innerHTML = `
        <div class="subject-field">
            <label>Subject name</label>
            <input
                type="text"
                class="semester-subject-name"
                placeholder="e.g. Mathematics"
            >
        </div>

        <div class="subject-field">
            <label>Credits</label>
            <input
                type="number"
                class="semester-subject-credits"
                min="0.01"
                step="any"
                placeholder="e.g. 4"
            >
        </div>

        <div class="subject-field">
            <label>Grade point</label>
            <input
                type="number"
                class="semester-subject-grade"
                min="0"
                max="10"
                step="any"
                placeholder="e.g. 9"
            >
        </div>

        <button type="button" class="remove-semester-subject-btn">
            Remove
        </button>
    `;

    subjectRow
        .querySelector(".remove-semester-subject-btn")
        .addEventListener("click", () => {
            subjectRow.remove();
            clearCPIResult();
            saveData();
        });

    subjectsArea.appendChild(subjectRow);

    subjectRow.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
            clearCPIResult();
            saveData();
        });
    });
}


// ========================================
// 10. CLEAR CPI RESULTS
// ========================================

function clearCPIResult() {
    cpiResult.textContent = "--";
    cpiError.textContent = "";

    cpiTotalCredits.textContent = "0";
    cpiWeightedPoints.textContent = "0";

    cpiDashboardValue.textContent = "---";
}


// ========================================
// 11. CALCULATE CPI
// ========================================

calculateCPIButton.addEventListener("click", () => {
    clearCPIResult();

    const semesters =
        semestersContainer.querySelectorAll(".semester-card");

    let totalCredits = 0;
    let totalWeightedPoints = 0;

    if (semesters.length === 0) {
        cpiError.textContent =
            "Please add at least one semester.";
        return;
    }

    for (let i = 0; i < semesters.length; i++) {
        const semester = semesters[i];

        const subjects = semester.querySelectorAll(
            ".semester-subject-row"
        );

        if (subjects.length === 0) {
            cpiError.textContent =
                `Please add at least one subject to Semester ${i + 1}.`;
            return;
        }

        for (const subject of subjects) {
            const name = subject.querySelector(
                ".semester-subject-name"
            ).value.trim();

            const creditsInput = subject.querySelector(
                ".semester-subject-credits"
            );

            const gradeInput = subject.querySelector(
                ".semester-subject-grade"
            );

            const credits = Number(creditsInput.value);
            const gradePoint = Number(gradeInput.value);

            if (
                name === "" ||
                creditsInput.value.trim() === "" ||
                gradeInput.value.trim() === "" ||
                !Number.isFinite(credits) ||
                !Number.isFinite(gradePoint) ||
                credits <= 0 ||
                gradePoint < 0 ||
                gradePoint > 10
            ) {
                cpiError.textContent =
                    "Check every subject: enter a name, positive credits, and a grade point from 0 to 10.";
                return;
            }

            totalCredits += credits;
            totalWeightedPoints += credits * gradePoint;
        }
    }

    if (totalCredits <= 0) {
        cpiError.textContent =
            "Total credits must be greater than zero.";
        return;
    }

    const cpi = totalWeightedPoints / totalCredits;

    cpiResult.textContent = cpi.toFixed(2);
    cpiDashboardValue.textContent = cpi.toFixed(2);

    cpiTotalCredits.textContent =
        Number(totalCredits.toFixed(4)).toString();

    cpiWeightedPoints.textContent =
        Number(totalWeightedPoints.toFixed(4)).toString();
});


// ========================================
// 12. SAVE DATA
// ========================================

const STORAGE_KEY = "engineeringGradeCalculatorData";

function saveData() {
    const spiSubjects = [];

    document.querySelectorAll(
        "#subjects-container .subject-row"
    ).forEach((row) => {
        spiSubjects.push({
            name: row.querySelector(".subject-name").value,
            credits: row.querySelector(".subject-credits").value,
            gradePoint: row.querySelector(".subject-grade").value
        });
    });

    const semesters = [];

    document.querySelectorAll(
        "#semesters-container .semester-card"
    ).forEach((card) => {
        const subjects = [];

        card.querySelectorAll(".semester-subject-row")
            .forEach((row) => {
                subjects.push({
                    name: row.querySelector(
                        ".semester-subject-name"
                    ).value,

                    credits: row.querySelector(
                        ".semester-subject-credits"
                    ).value,

                    gradePoint: row.querySelector(
                        ".semester-subject-grade"
                    ).value
                });
            });

        semesters.push({ subjects });
    });

    const data = {
        spiSubjects,
        semesters
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


// ========================================
// 13. LOAD SAVED DATA
// ========================================

function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return false;
    }

    try {
        const data = JSON.parse(savedData);

        if (
            !data ||
            !Array.isArray(data.spiSubjects) ||
            !Array.isArray(data.semesters) ||
            !data.semesters.every(
                semester =>
                    semester &&
                    Array.isArray(semester.subjects)
            )
        ) {
            console.error(
                "Saved calculator data has an invalid format."
            );

            return false;
        }

        subjectsContainer.innerHTML = "";
        semestersContainer.innerHTML = "";

        semesterCount = 0;

        data.spiSubjects.forEach((subject) => {
            addSubject(
                subject.name ?? "",
                subject.credits ?? "",
                subject.gradePoint ?? ""
            );
        });

        data.semesters.forEach((semester) => {
            addSemester();

            const cards = semestersContainer.querySelectorAll(
                ".semester-card"
            );

            const card = cards[cards.length - 1];

            const subjectsArea =
                card.querySelector(".semester-subjects");

            semester.subjects.forEach((subject) => {
                addSemesterSubject(subjectsArea);

                const rows = subjectsArea.querySelectorAll(
                    ".semester-subject-row"
                );

                const row = rows[rows.length - 1];

                row.querySelector(
                    ".semester-subject-name"
                ).value = subject.name ?? "";

                row.querySelector(
                    ".semester-subject-credits"
                ).value = subject.credits ?? "";

                row.querySelector(
                    ".semester-subject-grade"
                ).value = subject.gradePoint ?? "";
            });
        });

        updateSemesterNumbers();

        clearSPIResult();
        clearCPIResult();

        return true;

    } catch (error) {
        console.error(
            "Could not load saved calculator data:",
            error
        );

        return false;
    }
}


// ========================================
// 14. INITIALIZE SAVED DATA
// ========================================

const hasSavedData = loadData();

if (!hasSavedData) {
    saveData();
}


// ========================================
// 15. TRANSFER SPI SUBJECTS TO CPI
// ========================================

const addSPIToCPIButton =
    document.getElementById("add-spi-to-cpi-btn");

addSPIToCPIButton.addEventListener("click", () => {
    const spiRows = Array.from(
        subjectsContainer.querySelectorAll(".subject-row")
    );

    if (spiRows.length === 0) {
        alert(
            "Please add subjects in the SPI calculator first."
        );
        return;
    }

    const spiSubjects = [];

    for (const row of spiRows) {
        const name =
            row.querySelector(".subject-name").value.trim();

        const creditsInput =
            row.querySelector(".subject-credits");

        const gradeInput =
            row.querySelector(".subject-grade");

        const credits = Number(creditsInput.value);
        const gradePoint = Number(gradeInput.value);

        if (
            !name ||
            creditsInput.value.trim() === "" ||
            gradeInput.value.trim() === "" ||
            !Number.isFinite(credits) ||
            !Number.isFinite(gradePoint) ||
            credits <= 0 ||
            gradePoint < 0 ||
            gradePoint > 10
        ) {
            alert(
                "Complete every SPI subject correctly before transferring."
            );
            return;
        }

        spiSubjects.push({
            name,
            credits,
            gradePoint
        });
    }

    let semesterCards = Array.from(
        semestersContainer.querySelectorAll(".semester-card")
    );

    const options = semesterCards.map(
        (_, index) => `Semester ${index + 1}`
    );

    options.push("Create a new semester");

    const choice = prompt(
        "Transfer SPI subjects to which semester?\n\n" +
        options.map(
            (option, index) => `${index + 1}. ${option}`
        ).join("\n") +
        "\n\nEnter the option number:"
    );

    if (choice === null) {
        return;
    }

    const selectedNumber = Number(choice);

    if (
        choice.trim() === "" ||
        !Number.isInteger(selectedNumber) ||
        selectedNumber < 1 ||
        selectedNumber > options.length
    ) {
        alert("Invalid semester selection.");
        return;
    }

    let selectedCard;

    if (selectedNumber === options.length) {
        addSemester();

        semesterCards = Array.from(
            semestersContainer.querySelectorAll(".semester-card")
        );

        selectedCard = semesterCards[semesterCards.length - 1];
    } else {
        selectedCard = semesterCards[selectedNumber - 1];
    }

    if (!selectedCard) {
        alert("Could not find the selected semester.");
        return;
    }

    const subjectsArea =
        selectedCard.querySelector(".semester-subjects");

    if (!subjectsArea) {
        alert("Could not find the semester subjects area.");
        return;
    }

    const existingRows = subjectsArea.querySelectorAll(
        ".semester-subject-row"
    );

    if (existingRows.length > 0) {
        const replace = confirm(
            "This semester already contains subjects.\n\n" +
            "OK = Replace existing subjects\n" +
            "Cancel = Append transferred subjects"
        );

        if (replace) {
            subjectsArea.innerHTML = "";
        }
    }

    spiSubjects.forEach((subject) => {
        addSemesterSubject(subjectsArea);

        const rows = subjectsArea.querySelectorAll(
            ".semester-subject-row"
        );

        const newRow = rows[rows.length - 1];

        newRow.querySelector(
            ".semester-subject-name"
        ).value = subject.name;

        newRow.querySelector(
            ".semester-subject-credits"
        ).value = subject.credits;

        newRow.querySelector(
            ".semester-subject-grade"
        ).value = subject.gradePoint;
    });

    clearCPIResult();
    saveData();

    alert(
        `${spiSubjects.length} subject(s) transferred successfully!`
    );
});
