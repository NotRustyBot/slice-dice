import { Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import { useState } from "react";
import { getDefinitionData } from "./definitionData";
import { setSharedData, sharedData } from "./shared";

type Props = {
    name: string;
    array: Array<{
        id: number;
    }>;
};

export default function Definition({ definition }: { definition: Props }) {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const useIcon = getDefinitionData(definition.name).icon;
    const editAction = getDefinitionData(definition.name).edit;

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>{useIcon}</ListItemIcon>
                <ListItemText primary={definition.name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {definition.array.map((def) => {
                        const secondaryText = getDefinitionData(definition.name).info(def);
                        return (
                            <ListItemButton
                                key={def.id}
                                sx={{ pl: 4 }}
                                onClick={() => {
                                    console.log(sharedData.config.definitions[definition.name].find((d) => d.id === def.id));
                                    editAction(sharedData.config.definitions[definition.name].find((d) => d.id === def.id));
                                }}
                            >
                                <ListItemText primary={definition.name + " " + def.id} secondary={secondaryText} />
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        let copy = { ...sharedData };
                                        copy.confirm = {
                                            open: true,
                                            onConfirm: () => {
                                                copy = { ...sharedData };
                                                copy.config.definitions[definition.name].splice(
                                                    copy.config.definitions[definition.name].findIndex((d) => d.id === def.id),
                                                    1
                                                );
                                                if (copy.config.definitions[definition.name].length === 0) {
                                                    delete copy.config.definitions[definition.name];
                                                }
                                                copy.confirm.open = false;
                                                setSharedData(copy);
                                            },
                                            onClose: () => {
                                                copy = { ...sharedData };
                                                copy.confirm.open = false;
                                                setSharedData(copy);
                                            },
                                            text: (
                                                <span>
                                                    Are you sure you want to delete <code>{definition.name + " " + def.id}</code>? This cannot be undone.
                                                </span>
                                            ),
                                        };
                                        setSharedData(copy);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemButton>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );
}
