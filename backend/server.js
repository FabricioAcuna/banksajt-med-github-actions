import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "mysql",
  database: "bank",
  port: "3306",
});

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// let userIds = 1;
// let balanceIds = 1;
// let sessionIds = 1;

// // Din kod här. Skriv dina arrayer
// let users = [];
// let sessions = [];
// let balances = [];

// Din kod här. Skriv dina routes:
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const params = [username, password];
    const result = await query(sql, params);
    console.log("result", result);

    const userId = result.insertId;
    const balanceSql = "INSERT INTO balances (user_id, amount) VALUES (?, ?)";
    await query(balanceSql, [userId, 0]);

    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating user", error: error.message });
  }

  // const userId = userIds++;

  // const user = { id: userId, username, password };
  // users.push(user);

  // const balance = { id: balanceIds++, userId: userId, amount: 0 };
  // balances.push(balance);

  // console.log("users: ", users);
});

app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    const [result] = await query(sql, [username, password]);
    console.log(result);

    if (result) {
      const user = result;
      const otp = Math.floor(10000 + Math.random() * 900000);
      const sessionSql = "INSERT INTO sessions (user_id, otp) VALUES (?, ?)";
      await query(sessionSql, [user.id, otp]);

      res.json({ otp });
    } else {
      res.status(400).json({ message: "Error" });
    }
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).send("Error creating session");
  }

  // if (user) {
  //   const otp = Math.floor(10000 + Math.random() * 900000);
  //   sessions.push({ id: sessionIds++, userId: user.id, otp });
  //   res.json({ otp });
  // } else {
  //   res.status(400).json({ message: "invalid credentials" });
  // }
});

app.post("/accounts", async (req, res) => {
  const { otp } = req.body;

  try {
    const sessionSql = "SELECT * FROM sessions WHERE otp = ?";
    const [sessions] = await query(sessionSql, [otp]);

    if (sessions) {
      const session = sessions;
      const userId = session.user_id;

      const balanceSql = "SELECT * FROM balances WHERE user_id = ?";
      const [balances] = await query(balanceSql, [userId]);

      if (balances) {
        const balance = balances;
        res.json({ amount: balance.amount });
      } else {
        res.status(400).json({ message: "Balance not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).send("Error fetching account");
  }
});

app.post("/me/accounts/transactions", async (req, res) => {
  const { otp, amount } = req.body;

  try {
    const sessionSql = "SELECT * FROM sessions WHERE otp = ?";
    const [sessions] = await query(sessionSql, [otp]);

    if (sessions) {
      const session = sessions;
      const userId = session.user_id;
      console.log("userId", userId);

      const balanceSql = "SELECT * FROM balances WHERE user_id = ?";
      const [balances] = await query(balanceSql, [userId]);

      console.log("balances", balances);

      if (balances) {
        const balance = balances;
        const newAmount = balance.amount + amount;

        const updateBalanceSql =
          "UPDATE balances SET amount = ? WHERE user_id = ?";
        await query(updateBalanceSql, [newAmount, userId]);

        res.json({ balance: newAmount });
      } else {
        res.status(400).json({ message: "Balance not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error with transaction:", error);
    res.status(500).send("Error with transaction");
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
