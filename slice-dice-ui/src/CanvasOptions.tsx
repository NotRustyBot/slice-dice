import { Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { setSharedData, sharedData } from "./shared";

export default function CanvasOptions() {
    return (
        <div
            style={{
                pointerEvents: "all",
                background: "#f8f8f8",
                width: "100%",
                height: "min-content",
                flexGrow: 0,
                padding: "10px",
                display: "flex",
                alignItems: "center",
            }}
        >
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            value={sharedData.selectNewRectangles}
                            onChange={(e) => {
                                const copy = { ...sharedData };
                                copy.selectNewRectangles = e.target.checked;
                                setSharedData(copy);
                            }}
                        />
                    }
                    label="Rename on Create"
                />
            </FormGroup>
            <TextField
                label="Outlined"
                variant="outlined"
                type="number"
                value={sharedData.gridSize}
                onChange={(e) => {
                    const copy = { ...sharedData };
                    copy.gridSize = Math.max(Number(e.target.value), 1);
                    setSharedData(copy);
                }}
            />
        </div>
    );
}
