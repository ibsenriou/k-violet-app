import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface MissionCompleteDialogProps {
  dialogOpen: boolean;
  toggleDialog: () => void;
  onConfirm: () => void;
}

const MissionCompleteDialog: React.FC<MissionCompleteDialogProps> = ({
  dialogOpen,
  toggleDialog,
  onConfirm,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={toggleDialog}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">Marcar tarefa como concluída</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          Deseja marcar esta tarefa como concluída?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};



export default MissionCompleteDialog;
