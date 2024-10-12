import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { Add } from "@mui/icons-material";
import Definition from "./Definition";
import { Config } from "../../src/main";

export default function Definitions({ definitions, setOpenAddDefinition }: { definitions: Config["definitions"], setOpenAddDefinition: (state: boolean) => void }) {
    return (
        <>
            <ListItemButton
                onClick={() => {
                    setOpenAddDefinition(true)
                }}
            >
                <ListItemText primary="Add Definition" />
                <Add />
            </ListItemButton>
            <Divider />
            <List component="div" disablePadding>
                {Object.keys(definitions).map((key) => {
                    const definition = { name: key, array: definitions[key as keyof typeof definitions] };
                    return <Definition key={key} definition={definition} />;
                })}
            </List>
        </>
    );
}
