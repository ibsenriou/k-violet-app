import Box from "@mui/material/Box";
import StoreCard from "./components/StoreCard";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "src/services/authService";
import UserCoinsCard from "./components/UserCoinsCard";
import FallbackSpinner from "@core/components/spinner";
import { CoreService } from "src/services/coreService";


const LittleStore = () => {
  const storeItemsQuery = useQuery({
    queryKey: ['storeItems'],
    queryFn: () => CoreService.store_items.get().then(response => response.data),
    select: (data) => data?.results
  })

  console.log("store items", storeItemsQuery.data)

  const userCoinsQuery = useQuery({
    queryKey: ['userCoins'],
    queryFn: () => AuthService.user.get().then(response => response.data)
  })

  const user = userCoinsQuery.data
  const userCoins = user?.coins || 0

  const storeItemsList = storeItemsQuery.data || []

  const isLoading = userCoinsQuery.isLoading || storeItemsQuery.isLoading

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
      {storeItemsList.map((item) => (
        <StoreCard
          key={item.id}
          itemId={item.id}
          name={item.name}
          cost={item.cost}
          image={item.image}
          isAffordable={userCoins >= item.cost}
          currentCoins={userCoins}
        />
      ))}
    </Box>
    </Box>
  );
};

export default LittleStore;
