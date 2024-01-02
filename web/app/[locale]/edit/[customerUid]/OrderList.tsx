import { Order } from '@/utils/models';
import Link from 'next/link';
import OrderComponent from '@/components/Order';


type Props = {
  locale: string;
  orders: Order[];
  translation: Record<string, string>;
}

const OrderList = ({locale, orders, translation }: Props) => {
  return (
    <div className="container max-w-3xl mx-auto">
      {orders?.map(order =>
      <div key={order.id} className="text-secondary-800 dark:text-secondary-100 bg-secondary-50 dark:bg-secondary-800  p-1 pt-4 sm:p-8 rounded shadow-md my-8">
        <OrderComponent
          translation={translation}
          locale={locale}
          items={order.attributes.items.data}
        />
        {order.attributes.status === 'admin-new' &&
          <Link passHref href={`/${locale}/checkout/${order.attributes.uid}`}>
          <button className='btn mt-5'
            disabled={
            order.attributes.items.data.length === 0
          }>{translation.pay}</button></Link>}
          <div className='mt-4 flex flex-wrap gap-4'>
            {translation.tickets}
            { order.attributes.items.data
                .sort((a,b) => a.id-b.id)
                .map(item =>
            <div
              key={item.id}
              className="p-4 w-fit"
            >
              <p className='text-center'>{translation[item.attributes.itemType.data.attributes.slug]} ID: {item.id}</p>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;