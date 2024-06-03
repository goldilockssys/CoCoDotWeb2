import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const CneeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Cnee, isPending } = useQuery({
      queryKey: ['getCnee'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getCnee', {})
        return data
      },
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Cnee?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
          <option
            key={item.DT_CODE}
            value={item.DT_CODE}
            data-name={item.LOC_VALUE}
          >
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default CneeSelect
