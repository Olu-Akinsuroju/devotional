// This is the main JavaScript file for the devotional app.
// Functionality to load and display devotional content will be added here.

document.addEventListener('DOMContentLoaded', () => {
    const godNameEl = document.getElementById('god-name');
    const godMeaningEl = document.getElementById('god-meaning');
    const bibleRef1El = document.getElementById('bible-ref-1');
    const bibleRef2El = document.getElementById('bible-ref-2');
    const reflectiveQ1El = document.getElementById('reflective-q-1');
    const reflectiveQ2El = document.getElementById('reflective-q-2');
    const reflectiveQ3El = document.getElementById('reflective-q-3');
    const nextButton = document.getElementById('next-devotional');

    let devotionals = [];
    let currentDevotionalIndex = 0;

    // Function to calculate the day of the year
    function getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Function to display devotional content
    function displayDevotional(index) {
        if (!devotionals.length || index < 0 || index >= devotionals.length) {
            console.error("Invalid index or no devotionals loaded.");
            godNameEl.textContent = 'Error loading devotional.';
            godMeaningEl.textContent = 'Please try again later.';
            // Clear other fields
            bibleRef1El.textContent = '';
            bibleRef2El.textContent = '';
            reflectiveQ1El.textContent = '';
            reflectiveQ2El.textContent = '';
            reflectiveQ3El.textContent = '';
            return;
        }

        const devotional = devotionals[index];
        godNameEl.textContent = devotional.name;
        godMeaningEl.textContent = devotional.meaning;

        if (devotional.references && devotional.references.length > 0) {
            bibleRef1El.textContent = devotional.references[0] || '';
            bibleRef2El.textContent = devotional.references[1] || '';
        } else {
            bibleRef1El.textContent = 'No reference provided.';
            bibleRef2El.textContent = '';
        }

        if (devotional.questions && devotional.questions.length > 0) {
            reflectiveQ1El.textContent = devotional.questions[0] || '';
            reflectiveQ2El.textContent = devotional.questions[1] || '';
            reflectiveQ3El.textContent = devotional.questions[2] || '';
        } else {
            reflectiveQ1El.textContent = 'No question provided.';
            reflectiveQ2El.textContent = '';
            reflectiveQ3El.textContent = '';
        }

        // Store the current index for the "Next Devotional" functionality
        localStorage.setItem('currentDevotionalIndex', index.toString());
    }

    // Fetch devotional data
    async function loadDevotionals() {
        try {
            const response = await fetch('names_of_god.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            devotionals = await response.json();
            if (!Array.isArray(devotionals) || devotionals.length === 0) {
                console.error("Fetched data is not a valid array or is empty.");
                godNameEl.textContent = 'No devotionals available.';
                return;
            }
            initialize();
        } catch (error) {
            console.error("Error fetching devotional data:", error);
            godNameEl.textContent = 'Failed to load devotionals.';
            godMeaningEl.textContent = 'Please check your connection or the data file and try again.';
        }
    }

    // Initialize the app
    function initialize() {
        // For initial load, use day of the year to select devotional
        const dayOfYear = getDayOfYear();
        currentDevotionalIndex = dayOfYear % devotionals.length;

        // Check if there's a stored index for the "Next Devotional" button,
        // but prioritize day of year for initial load logic.
        // For this version, we will always start with day of year.
        // If we wanted to persist the "Next" button state across page loads:
        // const storedIndex = localStorage.getItem('currentDevotionalIndex');
        // if (storedIndex !== null) {
        //    currentDevotionalIndex = parseInt(storedIndex, 10);
        //    if (currentDevotionalIndex >= devotionals.length || currentDevotionalIndex < 0) {
        //        currentDevotionalIndex = 0; // Reset if out of bounds
        //    }
        // }


        displayDevotional(currentDevotionalIndex);

        // "Next Devotional" button event listener
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentDevotionalIndex = (currentDevotionalIndex + 1) % devotionals.length;
                displayDevotional(currentDevotionalIndex);
            });
        } else {
            console.error("Next devotional button not found.");
        }
    }

    loadDevotionals();
});
