import {Box, Button, Checkbox, Divider, NumberInput, TextInput} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import { DateTimePicker } from '@mantine/dates';
import {addPixelBoard, updatePixelBoard} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {useMutation} from "react-query";
import {updateUser} from "../../functions/backend_functions/user_backend_functions.js";

export default function FormAddAndEditPixelBoard({user, pixelBoard, onCancel, formType, refreshPixels, formInfo}) {
    const pixelSelected = pixelBoard;

    const form = useForm({
        initialValues: {
            title: pixelSelected ? pixelSelected.title : null,
            startDate: pixelSelected ? new Date(pixelSelected.startDate) : null,
            endDate: pixelSelected ? new Date(pixelSelected.endDate) : null,
            delayMs: pixelSelected ? pixelSelected.pixelHeight : null,
            pixelWidth: pixelSelected ? pixelSelected.pixelWidth : null,
            pixelHeight: pixelSelected ? pixelSelected.pixelHeight : null,
            isPixelOverwrite: pixelSelected ? pixelSelected.isPixelOverwrite : false,
        },
        validate: {
            title: (value) => {
                if (!value || value === "") return "Title is required";
                if (value.length < 4) return "Title must be at least four characters long";
                return undefined;
            },
            startDate: (value) => {
                if (pixelSelected) return undefined;
                if (!value || value === "") return "Start date is required";
                if (value < new Date()) return "Start date must be in the future";
                return undefined;
            },
            endDate: (value) => {
                if (pixelSelected) return undefined;
                if (!value || value === "") return "End date is required";
                if (value < new Date()) return "End date must be in the future";
                if (value < form.values.startDate) return "End date must be after start date";
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

    const editPixelboard = useMutation(updatePixelBoard, {
        onSuccess: () => {
            notifications.show({
                title: "Update successful",
                message: "Pixelboard has been updated",
                color: "green",
                icon: <IconCheck size={24} />,
            });
            refreshPixels();
            onCancel();
        },
        onError: (error) => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: 'User has not been updated',
                color: 'red',
                icon: null,
            });
        }
    })

    const addPixelboard = useMutation(addPixelBoard, {
        onSuccess: () => {
            notifications.show({
                title: "Creation successful",
                message: "Pixelboard has been added",
                color: "green",
                icon: <IconCheck size={24} />,
            });
            refreshPixels();
            onCancel();
        },
        onError: (error) => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: 'User has not been updated',
                color: 'red',
                icon: null,
            });
        }
    })

    const onSubmit = (event) => {
        event.preventDefault();
        if (form.isValid) {
            const modelPixel = {
                title: form.values.title,
                delayMs : form.values.delayMs,
                pixelHeight:  form.values.pixelHeight,
                pixelWidth: form.values.pixelWidth,
                isPixelOverwrite: form.values.isPixelOverwrite,
                startDate: form.values.startDate.toISOString(),
                endDate: form.values.endDate.toISOString(),
                dateCreated: new Date().toISOString(),
                creatorId: user.id,
            }
           if (formType === "update"){
               modelPixel.id = pixelSelected.id;
               editPixelboard.mutate(modelPixel)
           }

           if (formType === "add"){
                addPixelboard.mutate(modelPixel)
           }
        }
    }

    return (
        <Box maw={340} mx="auto">
            <form onSubmit={onSubmit}>
                <TextInput label="Title" placeholder="Title" {...form.getInputProps("title")} />
                <NumberInput
                    mt="sm"
                    label="Delay"
                    placeholder="Delay in milliseconds"
                    min={0}
                    max={2000}
                    {...form.getInputProps("delayMs")}
                />
                <NumberInput
                    mt="sm"
                    label="Width"
                    placeholder="Width"
                    min={0}
                    max={500}
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
                    placeholder="Start date"
                    {...form.getInputProps("startDate")}
                />
                <DateTimePicker
                    label="endDate"
                    placeholder="End date"
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