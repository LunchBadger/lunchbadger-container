const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (entity, itemOrder, hoverOrder) => {
  dispatch('UpdateGatewayOrder', {
    entity,
    itemOrder,
    hoverOrder
  });
};
