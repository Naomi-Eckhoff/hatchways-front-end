const container = document.querySelector("#students-output");
const nameSearchBar = document.querySelector("#name-search-bar");
const tagSearchBar = document.querySelector("#tag-search-bar");

const studentsApiUrl = "https://api.hatchways.io/assessment/students";
var studentsStorage = {};

const studentsFetcher = async function() {
    await fetch(studentsApiUrl)
        .then((res) => res.json())
        .then((data) => {
            studentsStorage = data.students.map(arr => (
                {...arr,
                fullName: arr.firstName.toLowerCase() + " " + arr.lastName.toLowerCase(),
                tags: []
                }));

            for (i = 0; i < studentsStorage.length; i++) {
                studentsOutput(studentsStorage[i]);
            };
        });    
}

const studentsOutput = function(students) {
    const studentsDivEl = document.createElement("div");
    studentsDivEl.className = "students-storage-div";
    studentsDivEl.id = "student" + students.id;


    const studentsImgDivEl = document.createElement("div");
    studentsImgDivEl.className = "students-img-div";

    const studentsPicEl = document.createElement("img");
    studentsPicEl.setAttribute("src", students.pic);

    studentsImgDivEl.appendChild(studentsPicEl);

    studentsDivEl.appendChild(studentsImgDivEl);

    const studentsInfoDivEl = document.createElement("div");

    const studentsNameEl = document.createElement("h2");
    studentsNameEl.textContent = students.fullName.toUpperCase();
    studentsInfoDivEl.appendChild(studentsNameEl);

    const studentsEmailEl = document.createElement("p");
    studentsEmailEl.textContent = "Email: " + students.email;
    studentsInfoDivEl.appendChild(studentsEmailEl);

    const studentsCompanyEl = document.createElement("p");
    studentsCompanyEl.textContent = "Company: " + students.company;
    studentsInfoDivEl.appendChild(studentsCompanyEl);

    const studentsSkillEl = document.createElement("p");
    studentsSkillEl.textContent = "Skill: " + students.skill;
    studentsInfoDivEl.appendChild(studentsSkillEl);

    const studentsAverageEl = document.createElement("p");
    studentsAverageEl.textContent = "Average: " + (students.grades.map(Number).reduce((a, b) => a + b) / students.grades.length) + "%";
    studentsInfoDivEl.appendChild(studentsAverageEl);

    const studentsTableDivEl = document.createElement("div");
    studentsTableDivEl.className = "students-table-div";
    studentsTableDivEl.id = "student-table-div" + students.id;
    studentsInfoDivEl.appendChild(studentsTableDivEl);

    const studentsTagsDivEl = document.createElement("div");
    studentsTagsDivEl.className = "students-tags-div";
    studentsTagsDivEl.id = "student-tags-div" + students.id;

    const studentsTagsStorageDivEl = document.createElement("div");
    studentsTagsStorageDivEl.className = "students-tags-storage-div";
    studentsTagsStorageDivEl.id = "student-tags-storage-div" + students.id;

    studentsStorage[i].tags.map(arr => {
        const studentTag = document.createElement("span");
        studentTag.className = "student-tag";
        studentTag.textContent = arr;

        studentsTagsStorageDivEl.appendChild(studentTag);
    });

    studentsTagsDivEl.appendChild(studentsTagsStorageDivEl);

    const studentsTagsEntryFormEl = document.createElement("form");
    studentsTagsEntryFormEl.className = "students-tags-entry-form";
    studentsTagsEntryFormEl.id = "student-tags-entry-form" + students.id;
    studentsTagsEntryFormEl.setAttribute("onsubmit", "handleNewTag(" + students.id + ");return false")


    const studentsTagsEntryInputEl = document.createElement("input");
    Object.assign(studentsTagsEntryInputEl, {
        className: "search-bar",
        id: "student-tags-entry-input" + students.id,
        type: "text",
        placeholder: "Add a tag",
    });

    studentsTagsEntryFormEl.appendChild(studentsTagsEntryInputEl);
    studentsTagsDivEl.appendChild(studentsTagsEntryFormEl);

    studentsInfoDivEl.appendChild(studentsTagsDivEl);

    studentsInfoDivEl.classList = "list";

    studentsDivEl.appendChild(studentsInfoDivEl);

    const studentsGradesButtonEl = document.createElement("button");
    studentsGradesButtonEl.id = "test-toggle" + students.id;
    studentsGradesButtonEl.textContent = "+";
    studentsGradesButtonEl.type = "button";
    studentsGradesButtonEl.setAttribute("onclick", "handleTestsButtonClick(" + students.id + ")");

    studentsDivEl.appendChild(studentsGradesButtonEl);

    container.appendChild(studentsDivEl);
}

const handleNewTag = function(id) {
    if (document.querySelector("#student-tags-entry-input" + id).value) {
        const studentTag = document.createElement("span");
        studentTag.className = "student-tag";
        studentTag.textContent = document.querySelector("#student-tags-entry-input" + id).value;

        const studentTagStorageDiv = document.querySelector("#student-tags-storage-div" + id);
        studentTagStorageDiv.appendChild(studentTag);

        studentsStorage.find(arr => arr.id === String(id)).tags.push(document.querySelector("#student-tags-entry-input" + id).value);
    }
}

//My normal methods of simulating a pause in javascript was behaving either too aggressively
//or not aggressively enough, so I've shamelessly stolen this bit from stackoverflow.
//It's so much better than my method and is now my new method.
const studentSearchBar = function(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

nameSearchBar.addEventListener("keyup", studentSearchBar(() => {
    studentCombinedSearch();
}, 250))

tagSearchBar.addEventListener("keyup", studentSearchBar(() => {
    studentCombinedSearch();
}, 250))

const studentsOutputCleaner = function() {
    while(container.getElementsByClassName("students-storage-div").length > 0) {
        container.getElementsByClassName("students-storage-div")[0].parentNode.removeChild(container.getElementsByClassName("students-storage-div")[0]);
    };    
}

const studentCombinedSearch = function() {
    const searchName = nameSearchBar.value.toLowerCase();
    const searchTag = tagSearchBar.value;

    studentsOutputCleaner();

    if(searchTag) {
        for (i = 0; i < studentsStorage.length; i++) {
            if (studentsStorage[i].fullName.includes(searchName) && studentsStorage[i].tags.map(arr => arr.includes(String(searchTag))).includes(true)) {
                studentsOutput(studentsStorage[i]);
            }
        };
    }

    if(!searchTag){
        for (i = 0; i < studentsStorage.length; i++) {
            if (studentsStorage[i].fullName.includes(searchName)) {
                studentsOutput(studentsStorage[i]);
            }
        };
    }

};

const handleTestsButtonClick = function(id) { 
    if (!document.querySelector("#student-table" + id)) {
        const studentTestTable = document.createElement("table");
        studentTestTable.id = "student-table"+ id;

        for (i = 0; i < studentsStorage.find(arr => arr.id === String(id)).grades.length; i++) {
            const studentTestRow = document.createElement("tr");
            const studentCellOne = document.createElement("td");
            const studentCellTwo = document.createElement("td");

            studentCellOne.textContent = "Test " + (i + 1) + ":    ";
            studentCellTwo.textContent = studentsStorage.find(arr => arr.id === String(id)).grades[i] + "%";

            studentTestRow.appendChild(studentCellOne);
            studentTestRow.appendChild(studentCellTwo);

            studentTestTable.appendChild(studentTestRow);
        };

        const studentTableDiv = document.querySelector("#student-table-div" + id);    
        studentTableDiv.appendChild(studentTestTable);
        
        document.querySelector("#test-toggle" + id).textContent = "-";
    } else {
        const element = document.querySelector("#student-table" + id);
        element.parentNode.removeChild(element);

        document.querySelector("#test-toggle" + id).textContent = "+";
    }
};

studentsFetcher();