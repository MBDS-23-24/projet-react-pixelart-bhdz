db = db.getSiblingDB('pixel_art');

//Drop all existing collections
db.user.drop();
db.role.drop();
db.pixel_board.drop();
db.line.drop();

//Collection : User
db.createCollection("user",
    {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["username", "email", "password"],
                properties: {
                    username: {
                        bsonType: "string",
                        description: "Pseudo / Username"
                    },
                    email: {
                        bsonType: "string",
                        description: "Email address"
                    },
                    password: {
                        bsonType: "string",
                        description: "Encrypted Password"
                    }
                }
            }
        }
    }
);

db.createCollection("pixel_board", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "creator_id", "date_created", "start_date", "end_date", "delay_ms", "pixel_width", "pixel_height", "is_pixel_overwrite"],
            properties: {
                title: {
                    bsonType: "string",
                    description: "Title of the pixel board"
                },
                creator_id: {
                    bsonType: "objectId",
                    description: "Creator's id of the pixel board"
                },
                date_created: {
                    bsonType: "date",
                    description: "Date of creation of the pixel board"
                },
                start_date: {
                    bsonType: "date",
                    description: "Date of start of the pixel board"
                },
                end_date: {
                    bsonType: "date",
                    description: "Date of end of the pixel board"
                },
                delay_ms: {
                    bsonType: "number",
                    minimum: 0,
                    description: "Delay in milliseconds between each pixel for one user"
                },
                pixel_width: {
                    bsonType: "number",
                    minimum: 0,
                    description: "Width in pixels of the pixel board"
                },
                pixel_height: {
                    bsonType: "number",
                    minimum: 0,
                    description: "Height in pixels of the pixel board"
                },
                is_pixel_overwrite: {
                    bsonType: "bool",
                    description: "Boolean to know if the pixel can be overwritten or not"
                }
            }
        }
    }
})

db.createCollection("role");

db.createCollection("line", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["position", "pixel_board_id", "pixels"],
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                position: {
                    bsonType: "number",
                    description: "Position y of the line on the pixel board"
                },
                pixel_board_id: {
                    bsonType: "objectId",
                    description: "Pixel board's id concerned of the line"
                },
                pixels: {
                    description: "Array of pixels of the line",
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["position", "hexa_color", "owner_id"],
                        properties: {
                            hexa_color: {
                                bsonType: "string"
                            },
                            position: {
                                bsonType: "number",
                            },
                            owner_id: {
                                bsonType: "objectId"
                            }
                        }
                    }
                }
            }
        }
    }
})
db.line.createIndex({"position": 1, "pixel_board_id": 1}, {unique: true})