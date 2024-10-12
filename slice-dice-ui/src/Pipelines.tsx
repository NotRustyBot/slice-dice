import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Config } from "../../src/main";
import Pipeline from "./Pipeline";
import AddPipeline from "./AddPipeline";
import { useState } from "react";

export default function Pipelines({ pipelines }: { pipelines: Config["pipelines"] }) {
    const [openAddPipeline, setOpenAddPipeline] = useState(false);
    const [newPipelineName, setNewPipelineName] = useState("");
    return (
        <>
            <ListItemButton
                onClick={() => {
                    setOpenAddPipeline(true);
                }}
            >
                <ListItemText primary="Add Pipeline" />
                <Add />
            </ListItemButton>
            <Divider />
            <List component="div" disablePadding>
                {pipelines.map((pipeline, index) => {
                    return <Pipeline key={pipeline.name} pipeline={pipeline} index={index} />;
                })}
            </List>
            <AddPipeline
                open={openAddPipeline}
                onClose={() => setOpenAddPipeline(false)}
                onChange={(e) => {
                    setNewPipelineName(e);
                }}
                name={newPipelineName}
            />
        </>
    );
}
