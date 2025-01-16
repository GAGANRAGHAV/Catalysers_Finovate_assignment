const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let {pool: pool} = require('../db.js');

// Register User
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, role || 'User']
        );
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const JWT_SECRET = 'your_jwt_secret_key';


// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role , usertype: user.usertype}, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Fetch all users with role 'User'
exports.getAllUsersWithRoleUser = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE role = $1', 
            ['User']
        );
        res.status(200).json({ users: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
