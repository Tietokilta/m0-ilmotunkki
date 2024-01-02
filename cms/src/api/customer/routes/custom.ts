export default {
  routes: [
    {
      method: "GET",
      path: "/customers/findByOrderUid/:uid",
      handler: "customer.findByOrderUid",
    },
    {
      method: "GET",
      path: "/customers/findByUid/:uid",
      handler: "customer.findByUid",
    }
  ],
};