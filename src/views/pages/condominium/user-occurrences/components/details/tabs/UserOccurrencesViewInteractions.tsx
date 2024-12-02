import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import ChatWindow from "../../messages/ChatWindow"

const UserOccurrencesViewTabInteractions = () => {
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item sm={12} xs={12}>
          <ChatWindow />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default UserOccurrencesViewTabInteractions
