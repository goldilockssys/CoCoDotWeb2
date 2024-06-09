import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import Chart from '@/components/chart'
import dayjs from 'dayjs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useQuery } from '@tanstack/react-query'
import request from '@/utils/request'
import { useState } from 'react'
import { Monitoring as Monit } from '@/types/data'
import { group } from 'radash'
import MultiBar from '@/components/chart/MultiBar'
import Cnee from '@/components/form/Cnee'
import { DatepickerRange } from '@/components/ui/datepicker-range'
import Loading from '@/components/ui/loading'
import { DateRange } from 'react-day-picker'

export default function DashboardView() {
  const [progressRangeDate, setProgressRangeDate] = useState<DateRange>({
    from: dayjs().subtract(6, 'day').toDate(),
    to: new Date(),
  })

  const {
    data: Count,
    isLoading: isGetCount,
    isRefetching: isRefetchingCount,
  } = useQuery({
    queryKey: ['getMainCount', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMainCount', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data[0]
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Progress,
    isLoading: isGetProgress,
    isRefetching: isRefetchProgress,
  } = useQuery({
    queryKey: ['getRateOfProgress', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getRateOfProgress', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })
      return [
        {
          name: 'ATA_CNT',
          data: response.data.map((item: any) => item.ATA_CNT),
          date: response.data.map((item: any) => item.VIEW_DATE),
        },
        {
          name: 'ETD_CNT',
          data: response.data.map((item: any) => item.ETD_CNT),
          date: response.data.map((item: any) => item.VIEW_DATE),
        },
      ]
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Delivery,
    isLoading: isGetDelivery,
    isRefetching: isRefetchDelivery,
  } = useQuery({
    queryKey: ['getDelivery', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getDelivery', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: LeadTimeAVG,
    isLoading: isGetLeadTime,
    isRefetching: isRefetchLeadTime,
  } = useQuery({
    queryKey: ['getLeadTimeAVG', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTimeAVG', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const { data: LeadTime } = useQuery({
    queryKey: ['getLeadTime', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTime', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })
      const routeGroup = group(response.data, (item: any) => item.ROUTE)
      const titleGroup = group(response.data, (item: any) => item.TITLE)

      const data = {
        labels: Object.keys(titleGroup).reverse(),
        datasets: Object.values(routeGroup).map((item: any) => ({
          name: item[0].ROUTE,
          data: item.map((item: any) => item.READTIME),
        })),
      }

      return data
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: ListOfProcessing,
    isLoading: isGetListOfProcessing,
    isRefetching: isRefetchingListOfProcessing,
  } = useQuery({
    queryKey: ['getListOfProcessing', progressRangeDate],
    queryFn: async () => {
      const response = await request.post('/monitoring/getListOfProcessing', {
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Monitoring,
    isLoading: isGetMonitoring,
    isRefetching: isRefetchMonitoring,
  } = useQuery<Monit[]>({
    queryKey: ['getMonitoring'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMonitoring', {})
      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  return (
    <>
      <div className="grid grid-cols-2 items-center justify-start gap-2 lg:flex lg:justify-end lg:gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="airplane-mode" className="cursor-pointer">
            Auto Refetch
          </Label>
          <Switch id="airplane-mode" checked={true} />
        </div>
        <Cnee className="w-[100px]" />
        <DatepickerRange
          date={progressRangeDate}
          setDate={setProgressRangeDate}
        ></DatepickerRange>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.PROCESSING} />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of ata border
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.ATA_BORDER_CNT} />}
            </div>
            <div className="mt-2">
              {Count?.ATA_BORDER_CNT}/{Count?.ATA_BORDER_PER}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of pass border
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && (
                <CountUp duration={1} end={Count.PASS_BORDER_CNT}></CountUp>
              )}
            </div>
            <div className="mt-2">
              {Count?.PASS_BORDER_CNT}/{Count?.PASS_BORDER_PER}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of ata factory
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.ATA_FACTORY_CNT} />}
            </div>
            <p className="mt-2">
              {Count?.ATA_FACTORY_CNT}/{Count?.ATA_FACTORY_PER}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>A Rate Of Progress</CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[400px]">
            <Loading isLoading={isGetProgress || isRefetchProgress}></Loading>
            {Progress && <Chart data={Progress}></Chart>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Time(Border Passing)</CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[400px]">
            <Loading isLoading={isGetDelivery || isRefetchDelivery}></Loading>
            {LeadTime && <MultiBar data={LeadTime}></MultiBar>}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Delivery Leadtime by Regional</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Loading isLoading={isGetDelivery || isRefetchDelivery}></Loading>
            <Table>
              <TableHeader>
                <TableRow className="whitespace-pre-line text-xs">
                  <TableHead></TableHead>
                  <TableHead>ATD ~ ATA Border</TableHead>
                  <TableHead>~ Pass Border</TableHead>
                  <TableHead>~ ATA VN Yard</TableHead>
                  <TableHead>~ ATA Factory</TableHead>
                  <TableHead>~ Total leadtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Delivery?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.REGION_NAME}</TableCell>
                    <TableCell>{item.ATA_BORDER}</TableCell>
                    <TableCell>{item.PASS_BORDER}</TableCell>
                    <TableCell>{item.ATA_VN_YARD}</TableCell>
                    <TableCell>{item.ATA_FACTORY}</TableCell>
                    <TableCell>
                      {item.READTIME} {item.REDDAY}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>ESTIMATED L/T(Border Passing)</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Loading isLoading={isGetLeadTime || isRefetchLeadTime}></Loading>
            {LeadTimeAVG?.map((item: any) => (
              <div
                key={item.id}
                className="flex h-10 items-center justify-between"
              >
                <div>{item.ROUTE}</div>
                <div className="flex items-center gap-1">
                  <div className="text-xl font-bold">{item.READTIME}</div>
                  <div className="text-sm text-muted-foreground">hrc</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>A list of progress</CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[300px]">
            <Loading
              isLoading={isGetListOfProcessing || isRefetchingListOfProcessing}
            ></Loading>
            <Table className="mt-2">
              <TableHeader>
                <TableRow className="[&>th]:text-center">
                  <TableHead></TableHead>
                  <TableHead>DAY1</TableHead>
                  <TableHead>DAY2</TableHead>
                  <TableHead>DAY3</TableHead>
                  <TableHead>DAY4</TableHead>
                  <TableHead>DAY5</TableHead>
                  <TableHead>DAY6</TableHead>
                  <TableHead>DAY7</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ListOfProcessing?.map((item: any) => (
                  <TableRow
                    key={item.id}
                    className="[&>td]:relative [&>td]:p-2 [&>td]:text-center"
                  >
                    <TableCell>{item.LOC}</TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY1}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY1}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY2}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY2}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY3}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY3}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY4}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY4}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY5}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY5}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY6}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY6}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="absolute bottom-1 left-0 right-0 top-1 flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                        style={{ width: `${item.DAY7}%` }}
                      ></div>
                      <div className="relative z-10">{item.DAY7}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Monitoring</CardTitle>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/monitoring">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="relative flex flex-col gap-1">
            <Loading
              isLoading={isGetMonitoring || isRefetchMonitoring}
            ></Loading>
            {Monitoring?.map((item) => (
              <div key={item.id} className="border-b py-1 last:border-0">
                <div className="flex items-start gap-1">
                  <div className="whitespace-nowrap">LSP:</div>
                  <div>{item.LSP_CD}</div>
                </div>
                <div className="flex items-start gap-1">
                  <div className="whitespace-nowrap">Remarks:</div>
                  <div>{item.REF_NO}</div>
                </div>
                <div className="flex items-start gap-1">
                  <div className="whitespace-nowrap">Now Status:</div>
                  <div>{item.NOW_STATUS}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
