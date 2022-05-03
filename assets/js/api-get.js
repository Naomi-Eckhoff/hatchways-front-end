const container = document.querySelector("#students-output");
const nameSearchBar = document.querySelector("#name-search-bar");
const tagSearchBar = document.querySelector("#tag-search-bar");

const studentsApiUrl = "https://api.hatchways.io/assessment/students";

const submitHandler = function(event) {
    event.preventDefault();
    studentsFetcher();
};

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

let studentsStorage = {};

const studentsFetcher = async function() {
    await fetch(studentsApiUrl)
        .then((res) => res.json())
        .then((data) => {
            studentsStorage = data.students;
            for (i = 0; i < studentsStorage.length; i++) {
                studentsOutput(studentsStorage[i]);
            };
        });    
}

const studentsOutput = function(students) {
    const studentsDivEl = document.createElement("div");
    studentsDivEl.className = "students-storage-div";
    studentsDivEl.id = "student" + i;


    const studentsImgDivEl = document.createElement("div");
    studentsImgDivEl.className = "students-img-div";
    const studentsPicEl = document.createElement("img");
    studentsPicEl.setAttribute("src", students.pic);
    studentsImgDivEl.appendChild(studentsPicEl);
    studentsDivEl.appendChild(studentsImgDivEl);

    const studentsInfoDivEl = document.createElement("div");

    const studentsNameEl = document.createElement("h2");
    studentsNameEl.textContent = students.firstName.toUpperCase() + " " + students.lastName.toUpperCase();
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
    studentsTableDivEl.id = "student-table-div" + i;
    studentsInfoDivEl.appendChild(studentsTableDivEl);

    const studentsTagsDivEl = document.createElement("div");
    studentsTagsDivEl.className = "students-tags-div";
    studentsTagsDivEl.id = "student-tags-div" + i;

    const studentsTagsStorageDivEl = document.createElement("div");
    studentsTagsStorageDivEl.className = "students-tags-storage-div";
    studentsTagsStorageDivEl.id = "student-tags-storage-div" + i;
    studentsTagsDivEl.appendChild(studentsTagsStorageDivEl);

    const studentsTagsEntryDivEl = document.createElement("div");
    studentsTagsEntryDivEl.className = "students-tags-entry-div";
    studentsTagsEntryDivEl.id = "student-tags-entry-div" + i;

    const studentsTagsEntryInputEl = document.createElement("input");
    Object.assign(studentsTagsEntryInputEl, {
        className: "students-tags-entry-input",
        id: "student-tags-entry-input" + i,
        type: "text",
        placeholder: "Add a tag",
//        SubmitEvent: "handleNewTag("+i+")"
    });
    studentsTagsEntryInputEl.setAttribute("submit", "handleNewTag(" + i + ")")   //("submit", "handleNewTag("+i+")");

    studentsTagsEntryDivEl.appendChild(studentsTagsEntryInputEl);
    studentsTagsDivEl.appendChild(studentsTagsEntryDivEl);

    studentsInfoDivEl.appendChild(studentsTagsDivEl);

    studentsInfoDivEl.classList = "list";

    studentsDivEl.appendChild(studentsInfoDivEl);

    const studentsGradesButtonEl = document.createElement("button");
    studentsGradesButtonEl.textContent = "+";
    studentsGradesButtonEl.type = "button";
    studentsGradesButtonEl.setAttribute("onclick", "handleTestsButtonClick(" + i + ")");

    studentsDivEl.appendChild(studentsGradesButtonEl);

    container.appendChild(studentsDivEl);
}


const studentsOutputCleaner = function() {
    while(container.getElementsByClassName("students-storage-div").length > 0) {
        container.getElementsByClassName("students-storage-div")[0].parentNode.removeChild(container.getElementsByClassName("students-storage-div")[0]);
    };    
}

const filteredStudents = function() {
    const searchString = nameSearchBar.value.toLowerCase();

    for (i = 0; i < studentsStorage.length; i++) {
        studentsStorage[i].fullName = studentsStorage[i].firstName.toLowerCase() + " " + studentsStorage[i].lastName.toLowerCase();
    };

    for (i = 0; i < studentsStorage.length; i++) {
        if (studentsStorage[i].fullName.includes(searchString)) {
            studentsOutput(studentsStorage[i]);
            console.log(studentsStorage[i]);
        }
    };
}

nameSearchBar.addEventListener("keyup", studentSearchBar(() => {
    console.log(nameSearchBar.value);
    studentsOutputCleaner();
    filteredStudents();
}, 250));

const handleTestsButtonClick = function(id) {
    if (!document.querySelector("#student-table" + id)) {
        const studentTestTable = document.createElement("table");
        studentTestTable.id = "student-table"+ id;

        for (i = 0; i < studentsStorage[id].grades.length; i++) {
            const studentTestRow = document.createElement("tr");
            const studentCellOne = document.createElement("td");
            const studentCellTwo = document.createElement("td");

            studentCellOne.textContent = "Test " + (i + 1) + ":";
            studentCellTwo.textContent = studentsStorage[id].grades[i] + "%";

            studentTestRow.appendChild(studentCellOne);
            studentTestRow.appendChild(studentCellTwo);

            studentTestTable.appendChild(studentTestRow);
        };

        const studentTableDiv = document.querySelector("#student-table-div" + id)    
        studentTableDiv.appendChild(studentTestTable);
    } else {
        const element = document.querySelector("#student-table" + id);
        element.parentNode.removeChild(element);
    };
};

const handleNewTag = function(id) {
    handleTestsButtonClick
    //if (document.getElementById("student-tags-entry-input" + id).value) {
       // event.preventDefault();

 //       const studentTag = document.createElement("p");
   //     studentTag.className = "student-tag";
     //   studentTag.textContent = document.querySelector("#student-tags-entry-input" + id).value;

 //       const studentTagStorageDiv = document.querySelector("#student-tags-storage-div" + id);
   //     studentTagStorageDiv.appendChild(studentTag);
  //  };
};

studentsFetcher();