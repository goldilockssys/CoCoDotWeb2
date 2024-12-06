import { useQuery } from '@tanstack/react-query';
import { Select, SelectProps } from '../ui/select';
import { forwardRef } from 'react';
import request from '@/utils/request';

interface Props extends SelectProps {
  nationcode: string | undefined;
}

const ToTruckType = forwardRef<HTMLSelectElement, Props>(
  ({ className, nationcode, ...props }, ref) => {
    const { data: TruckTypeCode, isLoading } = useQuery({
      queryKey: ['getToTruckCode', nationcode],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getTrcuk', {
          TO_NATION_CD: nationcode,
        });
        return data;
      },
    });

    return (
      <Select ref={ref} className={className} {...props}>
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          <>
            <option value="">Select</option>
            {TruckTypeCode?.map((item: { TRUCK_NO: string; TRUCK_TYPE: string }) => (
              <option
                key={item.TRUCK_NO}
                value={item.TRUCK_NO}
                data-type={item.TRUCK_TYPE}
              >
                {item.TRUCK_NO}
              </option>
            ))}
          </>
        )}
      </Select>
    );
  },
);

export default ToTruckType;
