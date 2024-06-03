// /server/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },  // Hasło nie jest wymagane podczas rejestracji
    role: { type: String, enum: ['Admin', 'User', 'Marketing', 'Bukmacher', 'Bok'], required: true }
}, { collection: 'users' });

userSchema.pre('save', async function (next) {
    // Sprawdza, czy hasło zostało zmodyfikowane i czy nie jest już zahashowane
    if (this.isModified('password') && this.password && !this.password.startsWith('$2a$12$')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
