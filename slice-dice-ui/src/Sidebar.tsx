import { List } from "@mui/material";
import Definitions from "./Definitions";
import { Config } from "../../src/main";
import Pipelines from "./Pipelines";

type Props = {
    definitions: Config["definitions"];
    pipelines: Config["pipelines"];
    setOpenAddDefinition: (state: boolean) => void;
};

export default function Sidebar({ definitions, pipelines, setOpenAddDefinition }: Props) {
    return (
        <div
            style={{
                pointerEvents: "all",
                height: "100vh",
                resize: "horizontal",
                minWidth: "300px",
                width: "300px",
                background: "#f8f8f8",
                overflowX: "hidden",
                overflowY: "auto",
                flexShrink: 0,
            }}
        >
            <List component="div">
                <Definitions definitions={definitions} setOpenAddDefinition={setOpenAddDefinition} />
                <div style={{ height: "10px", background: "#999" }} />
                <Pipelines pipelines={pipelines}/>
            </List>
            <div
                style={{
                    height: "100vh",
                }}
            ></div>
        </div>
    );
}
