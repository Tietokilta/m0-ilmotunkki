import {
  createContext, useState, useEffect, FC, useCallback
} from "react";
import { fetchAPI } from "../lib/api";
import { Customer, Item, ItemType, Order } from "../utils/models";

export interface AppContextType {
  itemTypes: ItemType[];
  order: Order;
  customer: Customer;
  items: Item[];
  initializeOrder: () => Promise<Order>;
  refreshFields: () => Promise<void>;
  addItem: (item: ItemType, orderId: number) => Promise<void>;
  deleteItem: (itemSlug: string) => Promise<void>;
}
const initialCustomer =  {
  id: 0,
  attributes: {
    firstName: '',
    lastName: '',
    createdAt: '',
    email: '',
    extra: '',
    phone: '',
    postalCode: '',
    publishedAt: '',
    startYear: '',
    updatedAt: '',
    uid: '',
    orders: {
      data: [],
    },
  }
};
const appContextDefault: AppContextType = {
  itemTypes: [],
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
  initializeOrder: () => Promise.resolve(appContextDefault.order),
  refreshFields: () => Promise.resolve(),
  addItem: () => Promise.resolve(),
  deleteItem: () => Promise.resolve(),
};

export const AppContext = createContext<AppContextType>(appContextDefault);

type Props = {
  children: React.ReactNode
}

const ItemProvider: FC<Props> = ({ children }) => {
  const [order, setOrder] = useState<Order>(appContextDefault.order);
  const [customer, setCustomer] = useState<Customer>(appContextDefault.customer);
  const [items, setItems] = useState<Item[]>(appContextDefault.items);
  const [itemTypes, setItemTypes] = useState<ItemType[]>(appContextDefault.itemTypes);

  const updateItemTypes = useCallback( async () => {
    const types = await fetchAPI<ItemType[]>('/item-types',{},{
      populate: ['itemCategory'],
    });
    return setItemTypes(types);
  },[]);

  const initializeOrder = async () => {
    const newOrder = await fetchAPI<Order>('/orders',{
      method: 'POST',
      body: JSON.stringify({
        data: {}
      }),
    });
    setOrder(newOrder);
    sessionStorage.setItem('orderId', String(newOrder.id));
    const newCustomer = await fetchAPI<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          orders: [newOrder.id]
        }
      }),
    });
    setCustomer(newCustomer);
    return newOrder;
  };
  const refreshFields = useCallback(async () => {
    if(!order.id) return;
    try {
      const newOrder = await fetchAPI<Order>(`/orders/${order.id}`,{},{
        populate: [
          'customer',
          'items',
          'items.itemType',
          'items.itemType.itemCategory',
        ]
      });
      setOrder(newOrder);
      setCustomer(newOrder.attributes.customer.data);
      setItems(newOrder.attributes.items.data);
    } catch(error) {
      console.error(error);
      setOrder(appContextDefault.order);
      setCustomer(appContextDefault.customer);
      setItems(appContextDefault.items);
      sessionStorage.removeItem('orderId');
    }
  },[order.id]);

  const deleteItem = async (itemSlug: string) => {
    const itemToRemove = items.find(({attributes: {itemType}}) => itemType.data.attributes.slug === itemSlug);
    if (!itemToRemove) return;
    const removeResult = await fetchAPI<Item>(`/items/${itemToRemove.id}`, {
      method: 'DELETE',
    });
    const filteredItems = items.filter(item => item.id !== removeResult.id);
    setItems(filteredItems);
  };

  const addItem = async (itemType: ItemType, orderId: number) => {
    const itemCategory = itemType.attributes.itemCategory.data;
    const categoryItemCount = items.filter(item => 
      item
      .attributes.itemType.data
      .attributes.itemCategory.data
      .id === itemCategory.id
      ).length;
    if (categoryItemCount + 1 > itemCategory.attributes.orderItemLimit) {
      return;
    }
    try {
      const newItem = await fetchAPI<Item>('/items', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            itemType: itemType.id,
            order: orderId,
          }
        }),
      },
      {
        populate: ['itemType', 'itemType.itemCategory']
      });
      setItems([...items, newItem]);
    } catch(error) {
    }
  }

  useEffect(() => {
    const savedOrderId = Number(sessionStorage.getItem('orderId'));
    if(savedOrderId) {
      setOrder(previousOrder => ({
        ...previousOrder,
        id: savedOrderId,
      }))
    }
  },[]);

  useEffect(() => {
    updateItemTypes();
    refreshFields()
  },[updateItemTypes,refreshFields])

  return (
    <AppContext.Provider value={
      {
        itemTypes,
        items,
        order,
        customer,
        initializeOrder,
        refreshFields,
        addItem,
        deleteItem,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default ItemProvider;