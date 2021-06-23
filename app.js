const express = require('express');
const app = express();
const students = require('./students.json');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (request, response) => {
    response.send("You are the real OG, dawg!")
})

app.get('/students', (request, response) => {
    if(request.query.search) {
        response.send(students.filter(student => student.name.toUpperCase().includes(request.query.search.toUpperCase())));
    } else {
        response.send(students);
    }
});

app.get('/students/:studentId', (request, response) => {
    response.send(students.filter(student => Number(request.params.studentId) === student.id)[0]);
});

app.get('/grades/:studentId', (request, response) => {
    const student = students.filter(record => record.id === Number(request.params.studentId));
    if(student) {
        response.send(student[0].grades);
    } else {
        response.send(`No student at selected ID`);
    }
});

app.post('/grades', (request, response) => {
    const grade = request.body.grade;
    const studentId = request.body.studentId;
    if(grade && studentId){
        const student = students.filter(record => record.id === Number(studentId));
        if(student[0]) {
            student[0].grades.push(Number(grade));
            response.send("Success!");
        } else {
            response.send("Student id not in system.");
        }
    } else {
        response.send("grade or studentId not provided.");
    }
});

app.post('/register', (request, response) => {
    const name = request.body.name;
    const email = request.body.email;
    if(name && email) {
        const newStudent = {
            id: students.length,
            name: name, 
            email: email,
            grades: []
        };
        students.push(newStudent);
        response.send("Success!")
    } else {
        response.send("No email or name provided.");
    }
});

const port = 3001;
app.listen(port, () => console.log(`Amazing app listening at http://localhost:${port}`))
