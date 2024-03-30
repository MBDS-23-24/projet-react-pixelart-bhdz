import { useForm } from "@mantine/form";
import { Box, Button, Checkbox, Divider, NumberInput, TextInput, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";
import {notifications} from "@mantine/notifications";
import {updatePixelBoard} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {UserContext} from "../../provider/UserContext.jsx";

export default function UpdatePixel({ pixelSelected, onCancel, refreshPixels}) {
    const form = useForm({
        initialValues: {
            title: pixelSelected ? pixelSelected.title : "",
            startDate:  new Date(),
            endDate: new Date(),
            delayMs: pixelSelected ? pixelSelected.pixelHeight : 0,
            pixelWidth: pixelSelected ? pixelSelected.pixelWidth : 0,
            pixelHeight: pixelSelected ? pixelSelected.pixelHeight : 0,
            isPixelOverwrite: pixelSelected ? pixelSelected.isPixelOverwrite : false,
        },
        validate: {
            title: (value) => {
                if (!value || value === "") return "Title is required";
                if (value.length < 4) return "Title must be at least four characters long";
                return undefined;
            },
            startDate: (value) => {
                const currentDate = new Date()
                currentDate.setDate(currentDate.getDate() - 1); // Obtenez la date du jour
                const enteredDate = new Date(value);

                if (!value || value === "") return "Start date is required";
                if (enteredDate < currentDate) return "Start date cannot be in the past"; // Vérifiez si la date est antérieure à la date du jour
                return undefined;
            },
            endDate: (value, allValues) => {
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - 1);
                const enteredDate = new Date(value);

                if (!value || value === "") return "End date is required";
                if (enteredDate < currentDate) return "End date cannot be in the past";
                if (allValues.startDate) {
                    let startDate = new Date(allValues.startDate);
                    if (startDate > enteredDate) {
                        return "End date must be later than start date";
                    }
                }
                return undefined;
            },
            delayMs: (value) => isNaN(value) || value < 0 || value === "" ? "Please enter a valid delay in milliseconds" : undefined,
            pixelWidth: (value) => {
                if (isNaN(value) || value < 0 || value === "") return "Please enter a valid pixel width";
                if (value > 500) return "Please enter a pixel width less than or equal to 500";
                return undefined;
            },
            pixelHeight: (value) => {
                if (isNaN(value) || value < 0 || value === "") return "Please enter a valid pixel height";
                if (value > 500) return "Please enter a pixel height less than or equal to 500";
                return undefined;
            },
        },
    });

    const onSubmit = (event) => {
        event.preventDefault();
        const { errors } = form.validate();
        if (Object.keys(errors).length === 0) {
            const pixelToUpdate = {
                title: form.values.title,
                delayMs : form.values.delayMs,
                pixelHeight:  form.values.pixelHeight,
                pixelWidth: form.values.pixelWidth,
                isPixelOverwrite: form.values.isPixelOverwrite,
                startDate: form.values.startDate.toISOString(),
                endDate: form.values.endDate.toISOString(),
                dateCreated: new Date().toISOString()
            }
            updatePixelBoard(pixelSelected.id, pixelToUpdate)
                .then(() =>{
                    notifications.show({
                        title: "Add Pixel Board",
                        message: "The pixel board is added successfully",
                        color: "green",
                        icon: <IconCheck size={24} />,
                    });
                    refreshPixels();
                    onCancel();
                })

        } else {
            notifications.show({
            title: "Validation errors",
            message: "There are some errors try to fix it",
            color: "red",
            icon: <IconX size={24} />,
        });
        }
    }

    return (
        <Box maw={340} mx="auto">
            <form onSubmit={onSubmit}>
                <TextInput label="Title" placeholder="Title" defaultValue={pixelSelected.title} {...form.getInputProps("title")} />
                <NumberInput
                    mt="sm"
                    label="Delay"
                    placeholder="Delay"
                    min={0}
                    max={2000}
                    defaultValue={pixelSelected.delayMs}
                    {...form.getInputProps("delayMs")}
                />
                <NumberInput
                    mt="sm"
                    label="Width"
                    placeholder="Width"
                    min={0}
                    max={500}
                    defaultValue={pixelSelected.pixelWidth}
                    {...form.getInputProps("pixelWidth")}
                />
                <NumberInput
                    mt="sm"
                    label="Height"
                    placeholder="Height"
                    min={0}
                    max={500}
                    {...form.getInputProps("pixelHeight")}
                />
                <DateTimePicker
                    label="Start date"
                    {...form.getInputProps("startDate")}
                />
                <DateTimePicker
                    label="endDate"
                    {...form.getInputProps("endDate")}
                />
                <Checkbox
                    label="Overwrite"
                    {...form.getInputProps("isPixelOverwrite", { type: "checkbox" })}
                    style={{ marginTop: 10, marginBottom: 10 }}
                />
                <Divider />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: 10 }}>
                    <Button rightSection={<IconX size={20} />} style={{ background: "red" }} onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button rightSection={<IconCheck size={20} />} type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Box>
    );
}