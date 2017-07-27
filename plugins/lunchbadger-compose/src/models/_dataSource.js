import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  data: {
    facetName: 'server',
    name: '',
    connector: '',
    url: '',
    database: '',
    username: '',
    password: '',
    itemOrder: 0,
  },
  metadata: {
    type: 'DataSource',
    loaded: true,
    processing: false,
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.lunchbadgerId || uuid.v4();
    return {
      data: {
        ...initialModel.data,
        ...model,
        id: `server.${model.name}`,
        lunchbadgerId: id,
      },
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.PRIVATE,
            portType: 'out',
          },
        ],
        ...metadata,
        id,
      },
    };
  },
  validate: ({data, metadata}, model, state) => {
    const invalid = {};
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.dataSources)
        .filter(id => id !== metadata.id)
        .filter(id => state.entities.dataSources[id].data.name === model.name)
        .length > 0;
      if (isDuplicateName) {
        invalid.name = LunchBadgerCore.utils.messages.duplicatedEntityName('Data Source');
      }
    }
    const fields = ['name', 'url', 'database', 'username', 'password'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};

const checkFields = (fields, model, invalid) => {
  const {fieldCannotBeEmpty} = LunchBadgerCore.utils.messages;
  fields.forEach((field) => {
    if (model[field] === '') invalid[field] = fieldCannotBeEmpty;
  });
}
