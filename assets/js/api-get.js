const dataFormEl = document.querySelector("#data-form");
const container = document.querySelector("#json-print");

const studentsApiUrl = "https://api.hatchways.io/assessment/students";

const submitHandler = function(event) {
    event.preventDefault();
    studentsFetcher();
}

const studentsFetcher = async function() {
    await fetch(studentsApiUrl)
        .then((res) => res.json())
        .then((data) => {
            studentsOutput(data.students);
        });
};

const studentsOutput = function(students) {

    console.log(students);

    for (let i = 0; i < students.length; i++) {

        const studentsDivEl = document.createElement("div");

        const studentsPicEl = document.createElement("img");
        studentsPicEl.setAttribute("src", students[i].pic);
        studentsDivEl.appendChild(studentsPicEl);

        const studentsInfoDivEl = document.createElement("div");

        const studentsNameEl = document.createElement("h2");
        studentsNameEl.textContent = students[i].firstName + " " + students[i].lastName;
        studentsInfoDivEl.appendChild(studentsNameEl);

        const studentsEmailEl = document.createElement("p");
        studentsEmailEl.textContent = "Email: " + students[i].email;
        studentsInfoDivEl.appendChild(studentsEmailEl);

        const studentsCompanyEl = document.createElement("p");
        studentsCompanyEl.textContent = "Company: " + students[i].company;
        studentsInfoDivEl.appendChild(studentsCompanyEl);

        const studentsSkillEl = document.createElement("p");
        studentsSkillEl.textContent = "Skill: " + students[i].skill;
        studentsInfoDivEl.appendChild(studentsSkillEl);

        const studentsAverageEl = document.createElement("p");
        studentsAverageEl.textContent = "Average: " + (students[i].grades.map(Number).reduce((a, b) => a + b) / students[i].grades.length) + "%";
        studentsInfoDivEl.appendChild(studentsAverageEl);

        studentsInfoDivEl.classList = "list"

        studentsDivEl.appendChild(studentsInfoDivEl);

        container.appendChild(studentsDivEl);
    }
};

dataFormEl.addEventListener("submit", submitHandler);