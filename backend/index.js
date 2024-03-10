import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Nandi@0805",
    database: "test"
});

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => { //everytime user come to the main page or home page below msg will be shown as req and res...
    res.json("hello this is the backend"); //response sent to the user
})

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books"
    db.query(q, (err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
}) 

//to solve auth problem use in mysql workbench : ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';

app.post("/books", (req, res) => {
    const q = "Insert into books(`title`, `desc`, `price`, `cover`) values (?)" // to provide security
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover // body is from postman body->json
        ];

         // by default we cann't send any data to our express server. to prevent this write in index app.use(express.json)-> allows us to send any json file using client
 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Book has been created Successfully")
    });
})

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?"
    db.query(q,[bookId], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Book has been deleted Successfully")
    })
})

app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover 
    ]

    db.query(q,[...values,bookId], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Book has been updated Successfully")
    })
})


app.listen(8080, ()=>{
    console.log("Connected to backend");
}) // to run our app