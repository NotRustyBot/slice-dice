import { useState } from "react";
import EditElement from "./EditElement";
import { sharedData, SharedData, updateData, updateSetSharedData } from "./shared";
import Sidebar from "./Sidebar";
import AddDefinition from "./AddDefinition";
import CanvasOptions from "./CanvasOptions";
import ConfirmAction from "./ConfirmAction";
import PiplineEditor from "./PiplineEditor";
import { Fab } from "@mui/material";
import { Download, UploadFile } from "@mui/icons-material";

function App() {
    const [openAddDefinition, setOpenAddDefinition] = useState(false);
    const [selectedDefinition, setSelectedDefinition] = useState<string>("");

    const [data, setData] = useState<SharedData>(sharedData);

    updateData(data);
    updateSetSharedData(setData);

    return (
        <div style={{ pointerEvents: "none" }}>
            <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
                <Sidebar setOpenAddDefinition={setOpenAddDefinition} definitions={data.config.definitions} pipelines={data.config.pipelines} />
                {data.selectedPipeline != undefined ? <PiplineEditor /> : null}
                <CanvasOptions />
            </div>
            <EditElement {...data.rename} />
            <AddDefinition
                open={openAddDefinition}
                onClose={() => setOpenAddDefinition(false)}
                onChange={(e) => {
                    setSelectedDefinition(e.target.value);
                }}
                type={selectedDefinition}
            />
            <ConfirmAction {...data.confirm} />
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px", pointerEvents: "all" }} onClick={() => navigator.clipboard.writeText(JSON.stringify(data.config))}>
                <Download />
            </Fab>
            <Fab color="primary"
             style={{ position: "fixed", bottom: "100px", right: "20px", pointerEvents: "all" }} 
             onClick={() => {
                navigator.clipboard.readText().then((text) => {
                    const config = JSON.parse(text);
                    setData({ ...data, config });
                })
             }}>
                <UploadFile />
            </Fab>
        </div>
    );
}

export default App;
