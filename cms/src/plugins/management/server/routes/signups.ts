export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/signups',
      handler: 'signups.signups',
      config: {
        policies: [],
      },
    },
  ],
};