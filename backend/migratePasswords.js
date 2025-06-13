// const bcrypt = require('bcrypt');
// const db = require('./config/db'); // Adjust path if needed

// const saltRounds = 10;

// async function migratePlaintextPasswords() {
//   try {
//     // 1. Find users with plaintext passwords (not starting with $2)
//     const [users] = await db.query(
//       'SELECT user_id, password_hash FROM users WHERE password_hash NOT LIKE "$2%"'
//     );

//     if (users.length === 0) {
//       console.log('No plaintext passwords found. Migration not needed.');
//       process.exit(0);
//     }

//     for (const user of users) {
//       const plain = user.password_hash;
//       // 2. Hash the plaintext password
//       const hashed = await bcrypt.hash(plain, saltRounds);
//       // 3. Update the password_hash column with the hashed password
//       await db.query(
//         'UPDATE users SET password_hash = ? WHERE user_id = ?',
//         [hashed, user.user_id]
//       );
//       console.log(`Updated user_id ${user.user_id}`);
//     }

//     console.log('✅ All plaintext passwords have been hashed!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Migration error:', error);
//     process.exit(1);
//   }
// }

// migratePlaintextPasswords();
