import {
  createContext, useState, useEffect, FC, useCallback, useRef, useMemo
} from "react";
import useSWR, {mutate} from "swr";
import { fetchAPI } from "../lib/api";
import { Customer, Item, ItemType, Order } from "../utils/models";

export interface AppContextType {
  order?: Order;
  customer: Customer;
  items: Item[];
  initializeOrder: () => Promise<string>;
  refreshFields: () => Promise<void>;
  addItem: (item: ItemType) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
  isEmpty: boolean;
  reset: () => void;
}
export const initialCustomer =  {
  id: 0,
  attributes: {
    firstName: '',
    lastName: '',
    createdAt: '',
    email: '',
    extra: '',
    locale: '',
    phone: '',
    postalCode: '',
    publishedAt: '',
    startYear: '',
    updatedAt: '',
    uid: '',
  }
};
const appContextDefault: Required<AppContextType> = {
  customer: initialCustomer,
  order: {
    id: 0,
    attributes: {
      createdAt: '',
      uid: '',
      publishedAt: '',
      status: 'new',
      updatedAt: '',
      transactionId: '',
      items: {
        data: []
      },
      customer: {
        data: initialCustomer
      }
    }
  },
  items: [],
  isEmpty: true,
  initializeOrder: () => Promise.resolve(''),
  refreshFields: () => Promise.resolve(),
  addItem: () => Promise.resolve(),
  deleteItem: () => Promise.resolve(),
  reset: () => null,
};

export const AppContext = createContext<AppContextType>(appContextDefault);

type Props = {
  children: React.ReactNode
}

const AppProvider: FC<Props> = ({ children }) => {
  const [orderUid, setOrderUid] = useState<string | undefined>(undefined);
  const {data: order, mutate: mutateOrder, error} = useSWR<Order>(orderUid ? `/orders/findByUid/${orderUid}` : null, fetchAPI);
  const customer = useMemo(() => order?.attributes.customer.data || appContextDefault.customer,[order]);
  const items = useMemo(() => order?.attributes.items?.data || appContextDefault.items, [order]);
  const reset = useCallback(() => {
    localStorage.removeItem('orderUid');
    setOrderUid('');
    mutateOrder(undefined);
  },[mutateOrder]);

  useEffect(() => {
    if(error && error.status === 404) {
      reset();
    }
  },[error,reset]);

  const initializeOrder = async () => {
    const newOrder = await fetchAPI<Order>('/orders',{
      method: 'POST',
      body: JSON.stringify({
        data: {}
      }),
    });
    setOrderUid(newOrder.attributes.uid);
    localStorage.setItem('orderUid', String(newOrder.attributes.uid));
    const newCustomer = await fetchAPI<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          orders: [newOrder.id]
        }
      }),
    });
    newOrder.attributes.customer = {data:newCustomer}
    newOrder.attributes.items = {data: appContextDefault.items}
    mutateOrder(newOrder);
    return newOrder.attributes.uid;
  };

  const deleteItem = async (itemId: number) => {
    const itemToRemove = items?.find(({attributes: {itemType}}) => itemType.data.id === itemId);
    if (!itemToRemove) return;
    try {
      const removeResult = await fetchAPI<Item>(`/items/${itemToRemove.id}`, {
        method: 'DELETE',
      },
      {
        orderUid,
      });
      const filteredItems = items?.filter(item => item.id !== removeResult.id) || [];
      const newOrder = order || appContextDefault.order;
      newOrder.attributes.items = {data:filteredItems};
      mutateOrder(newOrder);
    } catch(error) {
    }
  };

  const addItem = async (itemType: ItemType) => {
    const currentOrderUid = orderUid || await initializeOrder();
    try {
      const newItem = await fetchAPI<Item>('/items', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            itemType: itemType.id,
            order: currentOrderUid,
          }
        }),
      });
      const newItems = [...items, newItem];
      const newOrder = order || appContextDefault.order;
      newOrder.attributes.items = {data: newItems};
      mutateOrder(newOrder);
    } catch(error) {
    }
  }
  const refreshFields = async () => {
    mutateOrder();
  }

  useEffect(() => {
    const savedOrderUid = localStorage.getItem('orderUid');
    if(savedOrderUid) {
      setOrderUid(savedOrderUid);
      return;
    }
    setOrderUid('');
  },[]);
  return (
    <AppContext.Provider value={
      {
        items: items,
        order: order,
        isEmpty: orderUid === '' && !error && !order, // Is empty;
        customer,
        initializeOrder,
        refreshFields,
        addItem,
        deleteItem,
        reset,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;