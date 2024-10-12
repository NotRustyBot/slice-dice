import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactNode } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    text: ReactNode;
};

export default function ConfirmAction({ open, onClose, text, onConfirm }: Props) {
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
            PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    onConfirm();
                    onClose();
                },
            }}
        >
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
                <Typography>{text}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button type="submit">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}
