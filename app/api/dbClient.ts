import {Client} from 'pg';

const client = new Client({
    user: 'postgres',
    host:'localhost',
    database: 'music_preference_app',
    password: 'Siva#1207',
    port: 5432,
});

client.connect()
try{
    console.log('connected to database');
}
catch(err){
    console.log('Failed to connect to');
}

export default client;