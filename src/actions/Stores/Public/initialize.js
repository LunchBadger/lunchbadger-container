import API from 'models/API';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const APIs = data.apis;

  const APIObjects = APIs.map((APIDetails, index) => {
    return API.create({
      itemOrder: index,
      loaded: true,
      ...APIDetails
    });
  });

  dispatch('InitializePublic', {
    data: APIObjects
  });
};
