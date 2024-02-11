import {MongoClient, ObjectId} from 'mongodb'
import dotenv from 'dotenv';

import "../../../config.js"

// URL de connexion à la base de données
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

// Nom de la base de données
const dbName = process.env.DB_NAME;

// Créer un nouveau client MongoDB
const client = new MongoClient(url);

// Données à insérer dans les collections
const data = () => {
    const users = [
        {
            "_id": new ObjectId(0),
            "email": "quentin.hoareau@pixelart.com",
            "username": "quentinhro",
            "password": "123456",
            "role_id": "ROLE_ADMIN"
        },
        {
            "_id": new ObjectId(1),
            "email": "pierre.bihannic@pixelart.com",
            "username": "pierrebhc",
            "password": "123456",
            "role_id": "ROLE_USER"
        },
        {
            "_id": new ObjectId(2),
            "email": "mouctar.diallo@pixelart.com",
            "username": "mouctardlo",
            "password": "123456",
            "role_id": "ROLE_USER"
        },
        {
            "_id": new ObjectId(3),
            "email": "yehoudi.vincent@pixelart.com",
            "username": "yehoudivct",
            "password": "123456",
            "role_id": "ROLE_USER"
        },
        {
            "_id": new ObjectId(4),
            "email": "dounia.zoubid@pixelart.com",
            "username": "douniazbd",
            "password": "123456",
            "role_id": "ROLE_USER"
        },
    ]

    const roles = [
        {"_id": "ROLE_USER", "label": "User"},
        {"_id": "ROLE_MODERATOR", "label": "Moderator"},
        {"_id": "ROLE_ADMIN", "label": "Administrateur"}
    ]

    const pixel_boards = [
        {
            "_id": new ObjectId(0),
            "title": "Example Test 1",
            "creator_id": users[0]["_id"],
            "date_created": adjustDate(new Date(), 0, 0, -2),
            "start_date": adjustDate(new Date(), 0, 0, 1),
            "end_date": adjustDate(new Date(), 0, 0, 5),
            "delay_ms": 1000,
            "pixel_width": 30,
            "pixel_height": 30,
            "is_pixel_overwrite": true
        },
        {
            "_id": new ObjectId(1),
            "title": "Example Test 2",
            "creator_id": users[1]["_id"],
            "date_created": adjustDate(new Date(), -30, 0, 0),
            "start_date": adjustDate(new Date(), 15, 0, 1),
            "end_date": adjustDate(new Date(), 0, 0, 7),
            "delay_ms": 5000,
            "pixel_width": 50,
            "pixel_height": 50,
            "is_pixel_overwrite": true
        },
        {
            "_id": new ObjectId(0),
            "title": "Example Test 3",
            "creator_id": users[0]["_id"],
            "date_created": adjustDate(new Date(), 0, 0, -3),
            "start_date": adjustDate(new Date(), 0, 0, 2),
            "end_date": adjustDate(new Date(), 0, 0, 5),
            "delay_ms": 5000,
            "pixel_width": 100,
            "pixel_height": 100,
            "is_pixel_overwrite": false
        },
    ]

    const lines = [
        {
            "_id": new ObjectId(0),
            "position": 0,
            owner_id: users[0]["_id"],
            pixel_board_id: pixel_boards[0]["_id"],
            "pixels": [
                {"position": 0, "hexa_color": "#000000", last_update: adjustDate(new Date(), 0, 0, -2)},
                {"position": 14, "hexa_color": "#b01a1a", last_update: adjustDate(new Date(), 0, 0, -1)},
            ]
        },
        {
            "_id": new ObjectId(1),
            "position": 2,
            owner_id: users[0]["_id"],
            pixel_board_id: pixel_boards[1]["_id"],
            "pixels": [
                {"position": 2, "hexa_color": "#67218f", last_update: adjustDate(new Date(), 0, 0, -2)},
                {"position": 8, "hexa_color": "#38bb4f", last_update: adjustDate(new Date(), -20, 0, 0)},
            ]
        },
        {
            "_id": new ObjectId(2),
            "position": 0,
            owner_id: users[1]["_id"],
            pixel_board_id: pixel_boards[0]["_id"],
            "pixels": [
                {"position": 2, "hexa_color": "#b7632c", last_update: adjustDate(new Date(), -33, -2, 0)},
                {"position": 10, "hexa_color": "#1f9f9d", last_update: adjustDate(new Date(), -22, -1, 0)},
            ]
        },
        {
            "_id": new ObjectId(2),
            "position": 0,
            owner_id: users[0]["_id"],
            pixel_board_id: pixel_boards[1]["_id"],
            "pixels": [
                {"position": 2, "hexa_color": "#67218f", last_update: adjustDate(new Date(), -2, -2, 0)},
                {"position": 8, "hexa_color": "#38bb4f", last_update: adjustDate(new Date(), -1, -2, 0)},
                {"position": 6, "hexa_color": "#38bb4f", last_update: adjustDate(new Date(), -5, -2, 0)},
            ]
        }

    ]

    return {
        user: users,
        role: roles,
        pixel_board: pixel_boards,
        line: lines
    }
};


function adjustDate(date, minutes = 0, hours = 0, days = 0) {
    // Convert the date to milliseconds
    let dateInMilliseconds = date.getTime();

    // Add days, hours, and minutes
    dateInMilliseconds += days * 24 * 60 * 60 * 1000;
    dateInMilliseconds += hours * 60 * 60 * 1000;
    dateInMilliseconds += minutes * 60 * 1000;

    // Create a new date from the adjusted milliseconds
    let newDate = new Date(dateInMilliseconds);

    return newDate;
}


// Fonction pour insérer des données dans les collections
async function insererDonneesCollections() {
    try {
        // Se connecter au serveur MongoDB
        await client.connect();

        // Sélectionner la base de données
        const db = client.db(dbName);

        const donneesCollections = data();
        // Boucler sur les collections et leurs données
        for (const collectionName in donneesCollections) {
            if (donneesCollections.hasOwnProperty(collectionName)) {
                const collectionData = donneesCollections[collectionName];

                // Supprimer la collection
                await db.collection(collectionName).deleteMany({});
                console.log(`La collection ${collectionName} a été effacée.`);


                // Sélectionner la collection dans laquelle insérer les données
                const collection = db.collection(collectionName);


                // Insérer les données dans la collection
                const result = await collection.insertMany(collectionData);

                console.log(`${result.insertedCount} documents insérés dans la collection ${collectionName} avec succès.`);
            }
        }
    } catch (error) {
        console.error("Error during mock insertion", error);
    } finally {
        // Fermer la connexion
        client.close();
    }
}

// Appeler la fonction pour insérer les données dans les collections
insererDonneesCollections();
//Pour exécuter ce script, exécutez la commande suivante dans votre terminal: yarn workspace database reset-mock
