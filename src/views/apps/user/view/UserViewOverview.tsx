import { Fragment } from 'react'

import { InvoiceType } from '@typesApiMapping/apps/invoiceTypes'

interface Props {
    invoiceData: InvoiceType[]
}

// Styled Timeline component
// const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
//     margin: 0,
//     padding: 0,
//     marginLeft: theme.spacing(0.75),
//     '& .MuiTimelineItem-root': {
//         '&:before': {
//             display: 'none'
//         },
//         '&:last-child': {
//             minHeight: 60
//         }
//     }
// }))

// // Styled component for images
// const Img = styled('img')(({ theme }) => ({
//     width: 32,
//     height: 32,
//     borderRadius: '50%',
//     marginRight: theme.spacing(3)
// }))

const UserViewOverview = ({ invoiceData }: Props) => {

    return (
        <Fragment>
            {/* <Card sx={{ marginBottom: 6 }}>
        <CardHeader title='Project List' titleTypographyProps={{ variant: 'h6' }} />

        <Divider sx={{ margin: 0 }} />

        <TableContainer>
          <Table size='small' sx={{ minWidth: 500 }}>
            <TableHead
              sx={{ backgroundColor: theme => (theme.palette.mode === 'light' ? 'grey.50' : 'background.default') }}
            >
              <TableRow>
                <TableCell sx={{ height: '3.375rem' }}>Project</TableCell>
                <TableCell sx={{ height: '3.375rem' }}>Total Task</TableCell>
                <TableCell sx={{ height: '3.375rem' }}>Progress</TableCell>
                <TableCell sx={{ height: '3.375rem' }}>Hours</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {projectListDate.map((item: ProjectListDataType, index: number) => (
                <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Img src={item.img} alt={`project-${index + 1}`} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.projectTitle}</Typography>
                        <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                          {item.projectType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{item.totalTask}</TableCell>
                  <TableCell>
                    <Typography variant='body2'>{item.progressValue}%</Typography>
                    <LinearProgress
                      variant='determinate'
                      value={item.progressValue}
                      color={item.progressColor}
                      sx={{ height: 6, marginTop: 1, borderRadius: '5px' }}
                    />
                  </TableCell>
                  <TableCell>{item.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ marginBottom: 6 }}>
        <CardHeader title='User Activity Timeline' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='error' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    User login
                  </Typography>
                  <Typography variant='caption'>12 min ago</Typography>
                </Box>
                <Typography variant='body2'>User login at 2:12pm</Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    Meeting with John
                  </Typography>
                  <Typography variant='caption'>45 min ago</Typography>
                </Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  React Project meeting with John @10:15am
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar alt='Avatar' src='/images/avatars/2.png' sx={{ width: 40, height: 40, marginRight: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Leona Watkins (Client)
                    </Typography>
                    <Typography variant='body2'>CEO of Watkins Group</Typography>
                  </Box>
                </Box>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='info' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    Create a new react project for client
                  </Typography>
                  <Typography variant='caption'>2 day ago</Typography>
                </Box>
                <Typography variant='body2'>Add files to new design folder</Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='success' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    Create invoices for client
                  </Typography>
                  <Typography variant='caption'>12 min ago</Typography>
                </Box>
                <Typography variant='body2'>Create new invoices and send to Leona Watkins</Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 28, height: 'auto' }}>
                    <img width={28} height={28} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                  </Box>
                  <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                    invoice.pdf
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>

      <UsersInvoiceListTable invoiceData={invoiceData} /> */}
        </Fragment>
    )
}

export default UserViewOverview
