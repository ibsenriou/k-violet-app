import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Confetti from "react-confetti"; // Add this package for celebration effect

interface PurchaseConfirmationDialogProps {
  dialogOpen: boolean;
  toggleDialog: () => void;
  onConfirm: () => void;
  itemName: string;
  itemCost: number;
  currentCoins: number;
}

const PurchaseConfirmationDialog: React.FC<PurchaseConfirmationDialogProps> = ({
  dialogOpen,
  toggleDialog,
  onConfirm,
  itemName,
  itemCost,
  currentCoins,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongratsDialog, setShowCongratsDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload the audio when the component mounts
    audioRef.current = new Audio("/audio/congrats.mp3");
    if (audioRef.current) {
      audioRef.current.preload = "auto"; // Preload the audio file
    }
  }, []);

  const handleConfirm = () => {
    setShowConfetti(true); // Show celebration effect
    onConfirm();
    toggleDialog();

    // Play the preloaded audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to the beginning in case it's already played
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }

    // Open the congratulations modal after confirmation
    setShowCongratsDialog(true);
    setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 3 seconds
      setShowCongratsDialog(false); // Auto-close congratulations modal
    }, 5000); // Auto-close after 5 seconds
  };

  const remainingCoins = currentCoins - itemCost;

  return (
    <>
      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={toggleDialog}
        aria-labelledby="purchase-dialog-title"
        aria-describedby="purchase-dialog-description"
      >
        <DialogTitle id="purchase-dialog-title">Confirmar Compra</DialogTitle>
        <DialogContent>
          <DialogContentText id="purchase-dialog-description">
            <Typography variant="h6" fontWeight="bold">
              Você deseja comprar <span style={{ color: "#ff5722" }}>{itemName}</span>?
            </Typography>
            <Typography variant="body1" mt={2}>
              <strong>Custo:</strong> {itemCost} moedinhas 💰
            </Typography>
            <Typography variant="body1">
              <strong>Moedinhas Atuais:</strong> {currentCoins} 💰
            </Typography>
            <Typography variant="body1" color={remainingCoins < 0 ? "error" : "textPrimary"}>
              <strong>Restantes:</strong> {remainingCoins} 💰
            </Typography>
            {remainingCoins < 0 && (
              <Typography variant="body2" color="error" mt={1}>
                Você não tem moedinhas suficientes para esta compra.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={remainingCoins < 0}
            autoFocus
            sx={{
              backgroundColor: remainingCoins >= 0 ? "#4caf50" : "gray",
              "&:hover": {
                backgroundColor: remainingCoins >= 0 ? "#388e3c" : "gray",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confetti Effect */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Congratulations Modal */}
      <Dialog
        open={showCongratsDialog}
        onClose={() => setShowCongratsDialog(false)}
        aria-labelledby="congrats-dialog-title"
      >
        <DialogTitle id="congrats-dialog-title">Parabéns!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              🎉 Você adquiriu <span style={{ color: "#ff5722" }}>{itemName}</span>! 🎉
            </Typography>
            <Typography variant="body1" mt={2} textAlign="center">
              Aproveite seu novo item! 😊
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchaseConfirmationDialog;
