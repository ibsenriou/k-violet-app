import Box from "@mui/material/Box";
import StoreCard from "./components/StoreCard";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "src/services/authService";
import UserCoinsCard from "./components/UserCoinsCard";
import FallbackSpinner from "@core/components/spinner";

const mockItems = [
  { id: 1, name: "Vale Doce", cost: 300, image: "/images/candy.png" },
  { id: 2, name: "Vale Brinquedo", cost: 500, image: "/images/toy.png" },
  { id: 3, name: "Passeio no Parquinho", cost: 100, image: "/images/park.png" },
  { id: 4, name: "Vale Cinema", cost: 5000, image: "/images/cinema.png" },
  { id: 5, name: "Dia do Pijama", cost: 900, image: "/images/pijama.png" },
  { id: 6, name: "Adesivo Especial", cost: 150, image: "/images/sticker.png" },
  { id: 7, name: "Hora Extra de Desenho", cost: 250, image: "/images/drawing.png" },
  { id: 8, name: "História na Hora de Dormir", cost: 300, image: "/images/storybook.png" },
  { id: 9, name: "Vale Jogo de Tabuleiro", cost: 450, image: "/images/boardgame.png" },
  { id: 10, name: "Bexiga Surpresa", cost: 1500, image: "/images/balloon.png" },
  { id: 11, name: "Dia Sem Tarefas", cost: 7000, image: "/images/noduties.png" },
  { id: 12, name: "Cesta de Guloseimas", cost: 2000, image: "/images/snackbasket.png" },
  { id: 15, name: "Vale Abraço", cost: 50, image: "/images/hug.png" },
];


const LittleStore = () => {
  const handleBuy = (itemId: number) => {
    console.log(`Bought item with ID: ${itemId}`);
  };

  const userCoinsQuery = useQuery({
    queryKey: ['userCoins'],
    queryFn: () => AuthService.user.get().then(response => response.data)
  })

  const user = userCoinsQuery.data

  const userCoins = user?.points || 0

  console.log("userCoinsQuery", user)

  const isLoading = userCoinsQuery.isLoading

  if (isLoading) return <FallbackSpinner />;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        padding: "1rem",
      }}
    >
    <UserCoinsCard availableCoins={userCoins} />

    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {mockItems.sort(
        (a, b) => a.cost - b.cost
      ).map((item) => (
        <StoreCard
          key={item.id}
          name={item.name}
          cost={item.cost}
          image={item.image}
          onBuy={(item) => handleBuy(item.id)}
          isAffordable={userCoins >= item.cost}
          currentCoins={userCoins}
        />
      ))}
    </Box>
    </Box>
  );
};

export default LittleStore;
