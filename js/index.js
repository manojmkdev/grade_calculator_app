// ============================================================
//  Grade Calculator — index.js
//  Full Stack Development V8 · Assignment 6
// ============================================================

// ---- State ----
let subjectCount = 3; // default number of subjects

// ---- DOM References ----
const subjectsWrapper = document.getElementById("subjectsWrapper");
const addSubjectBtn   = document.getElementById("addSubjectBtn");
const removeSubjectBtn = document.getElementById("removeSubjectBtn");
const gradeForm       = document.getElementById("gradeForm");
const resultCard      = document.getElementById("resultCard");
const resTotal        = document.getElementById("resTotal");
const resAvg          = document.getElementById("resAvg");
const resGrade        = document.getElementById("resGrade");
const resMessage      = document.getElementById("resMessage");

// ---- Grade Logic ----
/**
 * Determines the letter grade based on the average score.
 * @param {number} avg - The average marks (0–100)
 * @returns {{ grade: string, message: string, cls: string }}
 */
function getGrade(avg) {
  if (avg >= 90) {
    return {
      grade: "A",
      message: "Outstanding performance! You've achieved the highest grade.",
      cls: "grade-A",
    };
  } else if (avg >= 75) {
    return {
      grade: "B",
      message: "Great work! You've demonstrated a strong understanding of the subject.",
      cls: "grade-B",
    };
  } else if (avg >= 60) {
    return {
      grade: "C",
      message: "Good effort. There is room for improvement — keep pushing!",
      cls: "grade-C",
    };
  } else if (avg >= 40) {
    return {
      grade: "D",
      message: "You passed, but consider revisiting the topics you struggled with.",
      cls: "grade-D",
    };
  } else {
    return {
      grade: "Fail",
      message: "Don't give up! Review the material and try again — you've got this.",
      cls: "grade-F",
    };
  }
}

// ---- Render Subject Rows ----
/**
 * Creates and appends subject input rows to the wrapper.
 * Preserves existing values when re-rendering.
 */
function renderSubjects() {
  // Collect existing values before clearing
  const existingInputs = subjectsWrapper.querySelectorAll(".subject-input");
  const savedValues = Array.from(existingInputs).map((el) => el.value);

  subjectsWrapper.innerHTML = "";

  for (let i = 0; i < subjectCount; i++) {
    const row = document.createElement("div");
    row.className = "subject-row";
    row.innerHTML = `
      <label class="subject-label" for="subject-${i}">Sub ${i + 1}</label>
      <input
        class="subject-input"
        id="subject-${i}"
        name="subject-${i}"
        type="number"
        min="0"
        max="100"
        placeholder="0 – 100"
        autocomplete="off"
      />
    `;
    subjectsWrapper.appendChild(row);

    // Restore saved value if it exists
    const input = row.querySelector("input");
    if (savedValues[i] !== undefined) {
      input.value = savedValues[i];
    }

    // Error element after the row
    const errEl = document.createElement("p");
    errEl.className = "error-msg";
    errEl.id = `err-${i}`;
    subjectsWrapper.appendChild(errEl);
  }

  // Disable remove button when only 1 subject remains
  removeSubjectBtn.disabled = subjectCount <= 1;
}

// ---- Validation ----
/**
 * Validates all subject inputs.
 * @returns {{ valid: boolean, values: number[] }}
 */
function validateInputs() {
  const inputs = subjectsWrapper.querySelectorAll(".subject-input");
  let valid = true;
  const values = [];

  inputs.forEach((input, i) => {
    const errEl = document.getElementById(`err-${i}`);
    const raw = input.value.trim();
    const val = Number(raw);

    // Clear previous error
    input.classList.remove("error");
    errEl.textContent = "";
    errEl.classList.remove("visible");

    if (raw === "") {
      input.classList.add("error");
      errEl.textContent = `Subject ${i + 1}: Please enter a mark.`;
      errEl.classList.add("visible");
      valid = false;
    } else if (isNaN(val) || val < 0 || val > 100) {
      input.classList.add("error");
      errEl.textContent = `Subject ${i + 1}: Mark must be between 0 and 100.`;
      errEl.classList.add("visible");
      valid = false;
    } else {
      values.push(val);
    }
  });

  return { valid, values };
}

// ---- Calculate ----
/**
 * Reads inputs, validates, computes total/average, assigns grade and updates UI.
 */
function calculate() {
  const { valid, values } = validateInputs();
  if (!valid) return;

  // Arithmetic
  const total   = values.reduce((sum, v) => sum + v, 0);
  const average = total / values.length;

  // Grade
  const { grade, message, cls } = getGrade(average);

  // Update result UI
  resTotal.textContent = total;
  resAvg.textContent   = average.toFixed(2);

  // Remove previous grade class
  resGrade.className = `result-val grade-badge ${cls}`;
  resGrade.textContent = grade;
  resMessage.textContent = message;

  // Show result card with animation
  resultCard.classList.add("visible");

  // Scroll to result
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---- Event Listeners ----

// Add subject
addSubjectBtn.addEventListener("click", () => {
  if (subjectCount < 10) {
    subjectCount++;
    renderSubjects();
  }
});

// Remove subject
removeSubjectBtn.addEventListener("click", () => {
  if (subjectCount > 1) {
    subjectCount--;
    renderSubjects();
  }
});

// Form submit
gradeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  calculate();
});

// Also allow button click (non-submit path covered by form submit above)
document.getElementById("calculateBtn").addEventListener("click", () => {
  gradeForm.dispatchEvent(new Event("submit", { cancelable: true }));
});

// Clear errors on input change
subjectsWrapper.addEventListener("input", (e) => {
  if (e.target.classList.contains("subject-input")) {
    const idx = e.target.id.split("-")[1];
    const errEl = document.getElementById(`err-${idx}`);
    e.target.classList.remove("error");
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.remove("visible");
    }
  }
});

// ---- Init ----
renderSubjects();
