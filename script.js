document.addEventListener("DOMContentLoaded", () => {
    const textArea = document.getElementById("textArea");
    const wordCountDisplay = document.getElementById("wordCount");
    const sentenceCountDisplay = document.getElementById("sentenceCount");
    const characterCountDisplay = document.getElementById("characterCount");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const fontSelect = document.getElementById("fontSelect");
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const body = document.body;

    const toSentenceCaseButton = document.getElementById("toSentenceCase");
    const toLowerCaseButton = document.getElementById("toLowerCase");
    const toUpperCaseButton = document.getElementById("toUpperCase");
    const sidePanel = document.getElementById("sidePanel");
    const sidePanelToggle = document.getElementById("sidePanelToggle");
    const keywordDensityContent = document.getElementById("keywordDensityContent");
    const letterOccurrencesContent = document.getElementById("letterOccurrencesContent");
    const keywordDensityButton = document.getElementById("keywordDensityButton");
    const letterOccurrencesButton = document.getElementById("letterOccurrencesButton");
    const clearButton = document.getElementById("clearButton");
    const exportButton = document.getElementById("exportButton");

    const uniqueWordsDisplay = document.getElementById("uniqueWords");
    const charactersNoSpacesDisplay = document.getElementById("charactersNoSpaces");
    const longestSentenceDisplay = document.getElementById("longestSentence");
    const shortestSentenceDisplay = document.getElementById("shortestSentence");
    const avgSentenceWordsDisplay = document.getElementById("avgSentenceWords");
    const avgSentenceCharsDisplay = document.getElementById("avgSentenceChars");
    const avgWordLengthDisplay = document.getElementById("avgWordLength");
    const paragraphsDisplay = document.getElementById("paragraphs");
    const pagesDisplay = document.getElementById("pages");
    const syllablesDisplay = document.getElementById("syllables");
    const linesDisplay = document.getElementById("lines");

    const readingTimeDisplay = document.getElementById("readingTime");
    const speakingTimeDisplay = document.getElementById("speakingTime");
    const readabilityScoreDisplay = document.getElementById("readabilityScore");

    const exportFormatSelect = document.getElementById("exportFormat");

    let undoStack = [];
    let redoStack = [];

    document.addEventListener("keydown", handleKeyboardShortcuts);

    if (!textArea || !wordCountDisplay || !sentenceCountDisplay || !characterCountDisplay || !darkModeToggle || !fontSelect || !toSentenceCaseButton || !toLowerCaseButton || !toUpperCaseButton || !sidePanel || !sidePanelToggle || !keywordDensityContent || !letterOccurrencesContent || !keywordDensityButton || !letterOccurrencesButton || !clearButton || !uniqueWordsDisplay || !charactersNoSpacesDisplay || !longestSentenceDisplay || !shortestSentenceDisplay || !avgSentenceWordsDisplay || !avgSentenceCharsDisplay || !avgWordLengthDisplay || !paragraphsDisplay || !pagesDisplay || !syllablesDisplay || !linesDisplay || !exportButton || !fontSizeSelect) {
        console.error("One or more elements are missing in the HTML.");
        return;
    }

    document.addEventListener("input", () => {
        updateWordCount();
        updateKeywordDensity();
        updateLetterOccurrences();
        updateAdditionalData();
        updateTextStatistics();
    });
    document.addEventListener("mouseup", updateSelectionStats);
    document.addEventListener("keyup", updateSelectionStats);
    darkModeToggle.addEventListener("change", toggleDarkMode);
    fontSelect.addEventListener("change", changeFont);
    fontSizeSelect.addEventListener("change", changeFontSize);

    toSentenceCaseButton.addEventListener("click", () => {
        textArea.value = toSentenceCase(textArea.value);
        updateWordCount();
        updateKeywordDensity();
        updateLetterOccurrences();
        updateAdditionalData();
        updateTextStatistics();
    });

    toLowerCaseButton.addEventListener("click", () => {
        textArea.value = textArea.value.toLowerCase();
        updateWordCount();
        updateKeywordDensity();
        updateLetterOccurrences();
        updateAdditionalData();
        updateTextStatistics();
    });

    toUpperCaseButton.addEventListener("click", () => {
        textArea.value = textArea.value.toUpperCase();
        updateWordCount();
        updateKeywordDensity();
        updateLetterOccurrences();
        updateAdditionalData();
        updateTextStatistics();
    });

    clearButton.addEventListener("click", () => {
        textArea.value = "";
        updateWordCount();
        updateKeywordDensity();
        updateLetterOccurrences();
        updateAdditionalData();
        updateTextStatistics();
    });

    sidePanelToggle.addEventListener("click", () => {
        sidePanel.classList.toggle("collapsed");
        const img = sidePanelToggle.querySelector("img");
        if (sidePanel.classList.contains("collapsed")) {
            img.style.transform = "rotate(0deg)";
        } else {
            img.style.transform = "rotate(180deg)";
        }
    });

    function updateSidebarState() {
        const img = sidePanelToggle.querySelector("img");
        if (window.innerWidth <= 600) {
            sidePanel.classList.add("collapsed");
            img.style.transform = "rotate(0deg)";
        } else {
            sidePanel.classList.remove("collapsed");
            img.style.transform = "rotate(180deg)";
        }
    }

    updateSidebarState();
    window.addEventListener("resize", updateSidebarState);

    const img = sidePanelToggle.querySelector("img");
    if (window.innerWidth > 600) {
        img.style.transform = "rotate(180deg)";
    } else {
        img.style.transform = "rotate(0deg)";
    }

    keywordDensityButton.addEventListener("click", () => {
        keywordDensityContent.classList.add("active");
        letterOccurrencesContent.classList.remove("active");
    });

    letterOccurrencesButton.addEventListener("click", () => {
        letterOccurrencesContent.classList.add("active");
        keywordDensityContent.classList.remove("active");
    });

    exportButton.addEventListener("click", () => {
        const format = exportFormatSelect.value;
        exportData(format);
    });

    textArea.addEventListener("input", () => {
        undoStack.push(textArea.value);
        if (undoStack.length > 100) undoStack.shift();
        redoStack = [];
    });

    function updateWordCount() {
        const text = textArea.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        const sentenceCount = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
        const characterCount = text.length;
        wordCountDisplay.textContent = `Word Count: ${wordCount}`;
        sentenceCountDisplay.textContent = `Sentence Count: ${sentenceCount}`;
        characterCountDisplay.textContent = `Character Count: ${characterCount}`;
    }

    function updateSelectionStats() {
        const text = textArea.value.trim();
        const selectionStart = textArea.selectionStart;
        const selectionEnd = textArea.selectionEnd;
        if (selectionStart === selectionEnd) {
            updateWordCount();
            return;
        }
        const selectedText = textArea.value.substring(selectionStart, selectionEnd).trim();
        if (selectedText) {
            const selectedWordCount = selectedText.split(/\s+/).length;
            const selectedSentenceCount = selectedText.split(/[.!?]+/).filter(Boolean).length;
            const selectedCharacterCount = selectedText.length;
            wordCountDisplay.textContent = `Word Count: ${selectedWordCount}/${text.split(/\s+/).length}`;
            sentenceCountDisplay.textContent = `Sentence Count: ${selectedSentenceCount}/${text.split(/[.!?]+/).filter(Boolean).length}`;
            characterCountDisplay.textContent = `Character Count: ${selectedCharacterCount}/${text.length}`;
        } else {
            updateWordCount();
        }
    }

    function toggleDarkMode(event) {
        if (event.target.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.removeItem("darkMode");
        }
    }

    function changeFont(event) {
        textArea.style.fontFamily = event.target.value;
    }

    function changeFontSize(event) {
        textArea.style.fontSize = event.target.value;
    }

    function toSentenceCase(text) {
        return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    }

    function updateKeywordDensity() {
        const text = textArea.value.trim().toLowerCase();
        const words = text ? text.replace(/[.,!?*"']/g, '').split(/\s+/).filter(word => word.length > 1) : [];
        const wordCount = words.length;
        const wordFrequency = {};

        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);
        const keywordDensityList = sortedWords.filter(word => wordFrequency[word] >= 2).map(word => {
            const percentage = ((wordFrequency[word] / wordCount) * 100).toFixed(2);
            return `<li><span>${word}</span><span>${wordFrequency[word]} (${percentage}%)</span></li>`;
        }).join("");

        keywordDensityContent.innerHTML = `<h2>Keyword Density</h2><ul>${keywordDensityList}</ul>`;
    }

    function updateLetterOccurrences() {
        const text = textArea.value.trim().toLowerCase().replace(/[^a-z\u00C0-\u017F]/g, '');
        const letterFrequency = {};

        for (const letter of text) {
            letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
        }

        const sortedLetters = Object.keys(letterFrequency).sort((a, b) => letterFrequency[b] - letterFrequency[a]);
        const letterOccurrencesList = sortedLetters.map(letter => {
            return `<li><span>${letter}</span><span>${letterFrequency[letter]}</span></li>`;
        }).join("");

        letterOccurrencesContent.innerHTML = `<h2>Letter Occurrences</h2><ul>${letterOccurrencesList}</ul>`;
    }

    function updateAdditionalData() {
        const text = textArea.value.trim();
        const words = text ? text.split(/\s+/) : [];
        const sentences = text ? text.split(/[.!?]+/).filter(Boolean) : [];
        const charactersNoSpaces = text.replace(/\s+/g, '').length;
        const uniqueWords = new Set(words).size;
        const longestSentence = sentences.length ? Math.max(...sentences.map(s => s.split(/\s+/).length)) : 0;
        const shortestSentence = sentences.length ? Math.min(...sentences.map(s => s.split(/\s+/).length)) : 0;
        const avgSentenceWords = sentences.length ? (words.length / sentences.length).toFixed(2) : 0;
        const avgSentenceChars = sentences.length ? (charactersNoSpaces / sentences.length).toFixed(2) : 0;
        const avgWordLength = words.length ? (charactersNoSpaces / words.length).toFixed(2) : 0;
        const paragraphs = text.split(/\n+/).filter(Boolean).length;
        const pages = (words.length / 250).toFixed(2);
        const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
        const lines = text.split(/\n/).length;

        uniqueWordsDisplay.textContent = `Unique Words: ${uniqueWords}`;
        charactersNoSpacesDisplay.textContent = `Characters (no spaces): ${charactersNoSpaces}`;
        longestSentenceDisplay.textContent = `Longest Sentence (words): ${longestSentence}`;
        shortestSentenceDisplay.textContent = `Shortest Sentence (words): ${shortestSentence}`;
        avgSentenceWordsDisplay.textContent = `Avg. Sentence (words): ${avgSentenceWords}`;
        avgSentenceCharsDisplay.textContent = `Avg. Sentence (chars): ${avgSentenceChars}`;
        avgWordLengthDisplay.textContent = `Avg. Word Length: ${avgWordLength}`;
        paragraphsDisplay.textContent = `Paragraphs: ${paragraphs}`;
        pagesDisplay.textContent = `Pages: ${pages}`;
        syllablesDisplay.textContent = `Syllables: ${syllables}`;
        linesDisplay.textContent = `Lines: ${lines}`;
    }

    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const syllableMatch = word.match(/[aeiouy]{1,2}/g);
        return syllableMatch ? syllableMatch.length : 1;
    }

    function updateTextStatistics() {
        const text = textArea.value.trim();
        const words = text.split(/\s+/).length;
        const readingTime = (words / 200).toFixed(2);
        const speakingTime = (words / 130).toFixed(2);
        const readabilityScore = calculateReadability(text);

        readingTimeDisplay.textContent = `Reading Time: ${readingTime} min`;
        speakingTimeDisplay.textContent = `Speaking Time: ${speakingTime} min`;
        readabilityScoreDisplay.textContent = `Readability Score: ${readabilityScore}`;
    }

    function calculateReadability(text) {
        const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
        const words = text.split(/\s+/).length || 1;
        const syllables = words > 0 ? text.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0) : 0;
        const ASL = words / sentences;
        const ASW = syllables / words;
        const flesch = 206.835 - (1.015 * ASL) - (84.6 * ASW);
        return flesch.toFixed(2);
    }

    function undo() {
        if (undoStack.length > 0) {
            redoStack.push(textArea.value);
            const previousValue = undoStack.pop();
            textArea.value = previousValue;
            updateWordCount();
            updateKeywordDensity();
            updateLetterOccurrences();
            updateAdditionalData();
            updateTextStatistics();
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(textArea.value);
            const nextValue = redoStack.pop();
            textArea.value = nextValue;
            updateWordCount();
            updateKeywordDensity();
            updateLetterOccurrences();
            updateAdditionalData();
            updateTextStatistics();
        }
    }

    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    undo();
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 'f':
                    e.preventDefault();
                    // Focus on Find Text input
                    document.getElementById("findText").focus();
                    break;
                case 's':
                    e.preventDefault();
                    exportData(exportFormatSelect.value);
                    break;
                default:
                    break;
            }
        }
    }

    function exportData(format) {
        const text = textArea.value.trim();
        const data = {
            "Text": text,
            "Word Count": wordCountDisplay.textContent,
            "Sentence Count": sentenceCountDisplay.textContent,
            "Character Count": characterCountDisplay.textContent,
            "Unique Words": uniqueWordsDisplay.textContent,
            "Characters (no spaces)": charactersNoSpacesDisplay.textContent,
            "Longest Sentence (words)": longestSentenceDisplay.textContent,
            "Shortest Sentence (words)": shortestSentenceDisplay.textContent,
            "Avg. Sentence (words)": avgSentenceWordsDisplay.textContent,
            "Avg. Sentence (chars)": avgSentenceCharsDisplay.textContent,
            "Avg. Word Length": avgWordLengthDisplay.textContent,
            "Paragraphs": paragraphsDisplay.textContent,
            "Pages": pagesDisplay.textContent,
            "Syllables": syllablesDisplay.textContent,
            "Lines": linesDisplay.textContent,
            "Reading Time": readingTimeDisplay.textContent,
            "Speaking Time": speakingTimeDisplay.textContent,
            "Readability Score": readabilityScoreDisplay.textContent
        };

        switch(format) {
            case 'json':
                downloadJSON(data);
                break;
            case 'csv':
                downloadCSV(data);
                break;
            default:
                alert("Unsupported export format.");
        }
    }

    function downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text_analysis.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadCSV(data) {
        const csvRows = [];
        for (const key in data) {
            csvRows.push(`"${key}","${data[key]}"`);
        }
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text_analysis.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    updateWordCount();
    updateKeywordDensity();
    updateLetterOccurrences();
    updateAdditionalData();
    updateTextStatistics();
});
