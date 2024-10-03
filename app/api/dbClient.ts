// import {Client} from 'pg';

// const client = new Client({
//     user: 'postgres',
//     host:'localhost',
//     database: 'music_preference_app',
//     password: 'Siva#1207',
//     port: 5432,
// });

// client.connect()
// try{
//     console.log('connected to database');
// }
// catch(err){
//     console.log('Failed to connect to');
// }

// export default client;



import { Client } from 'pg';

const client = new Client({
    user: 'default', // Vercel username
    host: 'ep-soft-wave-a4243c36-pooler.us-east-1.aws.neon.tech', // Vercel host
    database: 'verceldb', // Vercel database name
    password: 'Sdzc2fwy5hKt', // Vercel password
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Important for Vercel connection
    }
});

client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

export default client;
