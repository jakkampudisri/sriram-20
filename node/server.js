const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
process.env.JWT_SECRET = "your_jwt_secret";
app.use(bodyParser.json());

app.use(cors());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"my_react"

});
db.connect((err) =>{
    if(err){
        console.error("Database connection faild:");
        return;
    }
    console.log("Connected");
})
app.post("/reviews",(req,res)=>{
    const {user_id,comment} = req.body;
    const query = "INSERT INTO todo (user_id,title) VALUES (?, ?)";
    const values = [user_id,comment];
    db.query(query,values,(err,results)=>{
        if(err){
            res.status(500).json({error:err.message});
        }else{
            res.status(201).json({message:"Todo added  successfully"});
        }
    })
})
app.get("/todo/:userId",(request,response)=>{
    db.query ("Select * From  todo where user_id = ? ",[request.params.userId],(err,results) =>{
        if(err){
            response.status(500).send(err);
        }else{
            response.json(results);
        }

    });
});

app.put("/todo/:todoId", (req, res) => {
    const todoId = req.params.todoId;
    const  status = 'completed';

    
        // Proceed with updating the review
        const updateSql = "UPDATE todo SET status = ? WHERE todo_id = ?";
        db.query(updateSql, [status, todoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Todo updated successfully" });
        });
    });


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log("Received login request:", email, password);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            console.log("Invalid email", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.json({ message: 'Invalid credentials' });
        }

        // Return userId and userEmail in response
        res.json({
            message: "Login successful",
            userId: user.id,
            userEmail: user.email
        });
    });
});





app.get("/users", (request, response) => {
   
 
    db.query(`
        SELECT  *
FROM users

ORDER BY name Asc;

    `, (err, results) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.json(results);
        }
    });
});



// 4. Delete a review
app.delete("/todo/:todoId", (req, res) => {
    const todoId = req.params.todoId;
     // Get the logged-in user_id from the request body

    

        // Proceed with deleting the review
        const deleteSql = "DELETE FROM todo WHERE todo_id = ?";
        db.query(deleteSql, [todoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Todo deleted successfully" });
        });
    });




app.listen(3000,()=>{
    console.log("server is starting");
});


