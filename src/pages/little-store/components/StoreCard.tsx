import React, { useState } from "react";
import { Card, Box, Typography, Button } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import PurchaseConfirmationDialog from "./PurchaseConfirmationDialog"; // Ensure correct path

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CoreService } from "src/services/coreService";

interface StoreCardProps {
  itemId: number;
  name: string;
  cost: number;
  image: string;
  currentCoins: number;
  isAffordable: boolean;
}

const StoreCard: React.FC<StoreCardProps> = ({
  itemId,
  name,
  cost,
  image,
  currentCoins,
  isAffordable,
}) => {


  // State to control the dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => setDialogOpen(!dialogOpen);

  const queryClient = useQueryClient()

  const purchaseMutation = useMutation({
    mutationFn: () => CoreService.store_itemId_buy.post({ itemId: itemId }, {}).then(response => response.data),
    onMutate: () => {
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCoins"] });
    }
  });

  const handleConfirmPurchase = () => {
    purchaseMutation.mutate();
  };

  // Colors for light and dark modes
  const buttonBackgroundColors = {
    affordable: "linear-gradient(135deg, #ffdd67, #f78fb3)",
    unaffordable: "linear-gradient(135deg, #e0e0e0, #b0b0b0)",
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: 200,
          borderRadius: 3,
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          margin: 1,
          padding: 2,
          background: "linear-gradient(135deg, #fff5cc, #ffe0e0)",
          position: "relative",
          overflow: "hidden",
          transform: "scale(1)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        {/* Sparkling Animation */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 15%, transparent 60%)",
            animation: "spin 10s linear infinite",
            pointerEvents: "none",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#fff",
            overflow: "hidden",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: "1rem",
            color: "#333",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            marginTop: 1,
            textAlign: "center",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            color: isAffordable ? "#ffb74d" : "#b0b0b0",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {cost} moedinhas 💰
        </Typography>

        {/* Buy Button */}
        <Button
          onClick={toggleDialog}
          disabled={!isAffordable}
          sx={{
            marginTop: "auto",
            padding: "0.5rem 1.5rem",
            background: isAffordable
              ? buttonBackgroundColors.affordable
              : buttonBackgroundColors.unaffordable,
            color: "#fff",
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            "&:hover": {
              background: isAffordable
                ? "linear-gradient(135deg, #f78fb3, #ffdd67)"
                : buttonBackgroundColors.unaffordable,
            },
          }}
        >
          <ShoppingCart sx={{ marginRight: 1 }} /> Comprar
        </Button>
      </Card>

      {/* Purchase Confirmation Dialog */}
      <PurchaseConfirmationDialog
        dialogOpen={dialogOpen}
        toggleDialog={toggleDialog}
        onConfirm={handleConfirmPurchase}
        itemName={name}
        itemCost={cost}
        currentCoins={currentCoins}
      />
    </>
  );
};

export default StoreCard;
