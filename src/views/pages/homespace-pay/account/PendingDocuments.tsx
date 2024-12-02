import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function PendingDocumentsView() {
    return (
        <Card>
            <CardHeader title='Criação de conta em Andamento' />
            <CardContent>
                <p>
                    Você receberá um e-mail com as instruções para envio dos documentos necessários para a criação da
                    conta.
                </p>
                <p>Caso já tenha enviado os documentos, aguarde a análise da equipe Homespace Pay.</p>
            </CardContent>
        </Card>
    )
}
