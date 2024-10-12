import { ListItemButton, ListItemText } from "@mui/material";
import { Config } from "../../src/main";
import { LinearScale } from "@mui/icons-material";
import { setSharedData, sharedData } from "./shared";

export default function Pipeline({ pipeline, index }: { pipeline: Config["pipelines"][0]; index: number }) {
    return (
        <ListItemButton
            selected={sharedData.selectedPipeline == index}
            onClick={() => {
                const copy = { ...sharedData };
                if (copy.selectedPipeline == index) {
                    copy.selectedPipeline = undefined;
                } else {
                    copy.selectedPipeline = index;
                }
                setSharedData(copy);
            }}
        >
            <LinearScale />
            <ListItemText primary={pipeline.name} secondary={`Pipeline ${index}`} />
        </ListItemButton>
    );
}
