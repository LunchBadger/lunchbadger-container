export default {
  '010': {
    title: 'Model Connectors Menu',
    text: `
Integrate your LunchBadger Project with existing data sources and services, such as MySQL, MongoDB, or a SOAP service with Model Connectors.
`,
    selector: '.Tool.dataSource',
    position: 'right',
    allowClicksThruHole: false,
  },
  '011': {
    title: 'Model Connector Entities Overview',
    text: 'Each Model Connector Entity will come with its own set of properties specific for that connection type.',
    waitForSelector: 'div[role=presentation]',
    position: 'right',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: api => [
      api.openEntitySubmenu('dataSource'),
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '012': {
    title: 'Memory Model Connector Selection',
    text: `
Let's get started! Select the Memory Model Connector.
<br />
<br />
C'mon, click it!
`,
    waitForSelector: '.Tool__submenuItem.memory',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.DataSource.memory', false),
    ],
    onBefore: api => [
      api.blockClicks(),
      api.focus('.Tool__submenuItem.memory'),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '013': {
    title: 'Memory Model Connector Creation',
    text: `
Most Model Connector Entities will present configuration options for connecting to your data source or service, such as host, port, username, and password. We don't need these with the Memory Model Connector.
<br />
<br />
Click <pre>OK</pre> to continue.
`,
    waitForSelector: '.Entity.DataSource.memory.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.DataSource.memory.editable'),
    ],
    onBefore: api => [
      api.focus('.Entity.DataSource.editable .submit'),
    ],
  },
  '020': {
    title: 'Model Entities Overview',
    text: `
Models are objects with properties. A Model can be connected to a Model Connector to read and write data to a data source or service. Custom logic can be created on a Model using JavaScript.
<br />
<br />
C'mon, click it!
`,
    waitForSelector: '.Tool.model',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .EntityHeader', false),
    ],
    onBefore: api => [
      api.focus('.Tool.model button'),
    ],
  },
  '021': {
    title: 'Name the Model Entity',
    text: `
Here, you define the name of the Model Entity.
<br /><br />
Let's name it <pre>Car</pre>.
`,
    selector: '.Entity.Model.editable .EntityHeader',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .EntityHeader input[value="Car"]'),
      api.blur('.Entity.Model.editable .EntityHeader input'),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .EntityHeader input'),
    ],
  },
  '022': {
    title: 'Model Entity Context Path',
    text: `
The Context Path assigns a URL path for the Model Entity's built in RESTFul endpoint.
<br /><br />
Let's name it <pre>cars</pre>.
`,
    selector: '.Entity.Model.editable .EntityProperties .EntityProperty',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__httppath input[value="cars"]'),
      api.blur('.Entity.Model.editable .input__httppath input'),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .input__httppath input'),
    ],
  },
  '023': {
    title: 'Model Properties Overview',
    text: `
Select the plus icon to assign properties to the Model Entity. Properties map to fields to a data source connected through a Model Connector.
<br /><br />
C'mon, click it!
`,
    waitForSelector: '.Entity.Model.editable .button__add__Properties',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name', false),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .button__add__Properties'),
    ],
  },
  '024': {
    title: 'Add a Property',
    text: `
Let's set <pre>year</pre> as the property name.
`,
    waitForSelector: '.Entity.Model.editable .input__properties0name',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name input[value="year"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .input__properties0name input'),
    ],
  },
  '025': {
    title: 'Set the Property Type',
    text: `
Let's set the Property type.
<br /><br />
Select <pre>Number</pre> from the dropdown list.
`,
    waitForSelector: '.Entity.Model.editable .select__properties0type',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    onBefore: api => [
      api.setOverlayBack(true),
      api.focus('.Entity.Model.editable .select__properties0type button'),
    ],
    onAfter: api => [
      api.setOverlayBack(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .properties0type__Number'),
      api.wait(500),
      api.focus('.Entity.Model.editable .input__properties0name input'),
      api.blur('.Entity.Model.editable .input__properties0name input'),
    ],
  },
  '026': {
    title: 'Finish Creating the Model',
    text: `
Click <pre>OK</pre> to create the <pre>Car</pre> Model Entity.
`,
    waitForSelector: '.Entity.Model.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Model.editable'),
      api.setShowOverlay(false),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .submit'),
    ],
  },
  '0270': {
    title: 'Model is creating',
    text: `
Please wait till the <pre>Car</pre> is saved and the walkthrough will continue automatically.
`,
    position: 'right',
    selector: '.Entity.Model',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Model.wip'),
      api.setWaitMethod(),
    ],
    onBefore: api => [
      api.click('.Entity.Model'),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
  },
  '0271': {
    title: 'Quick Edit',
    text: `
This icon allows you to quick edit entity on the canvas. Quick edit exposes only the bare minimum required properties to fill in.
<br />
<br />
Keep in mind, it applies also to almost all other entity types.
`,
    selector: '.Entity.Model .Toolbox__button--edit',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.click('.Entity.Model'),
      api.waitUntilPresent('.Entity.Model.highlighted .Toolbox__button--edit'),
    ],
  },
  '0272': {
    title: 'Full Edit',
    text: `
This icon opens up the Model details for full edit.
<br />
<br />
C'mon, click it!
`,
    selector: '.Entity.Model .Toolbox__button--zoom',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .RnD__content', false),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(3000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.click('.Entity.Model'),
      api.waitUntilPresent('.Entity.Model.highlighted .Toolbox__button--zoom'),
      api.focus('.Entity.Model .Toolbox__button--zoom'),
    ],
  },
  '0273': {
    title: 'Model Details Panel',
    text: `
Use full edit, when you want to add more than what is required in quick edit and get into more detailed information.
<br />
<br />
Keep in mind, that almost all entities has details that are available in full edit.
`,
    selector: '.RnD__box',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '0274': {
    title: 'Code editor',
    text: 'Custom code for the Car model can be entered in the code editor',
    waitForSelector: '.DetailsPanel .BaseDetails__content > div > .CollapsibleProperties:last-child',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: api => [
      api.autoscroll('.DetailsPanel .BaseDetails__content > div > .CollapsibleProperties:last-child'),
    ],
  },
  '0275': {
    title: 'Return to Canvas from Model Details Panel',
    text: `
Click <pre>Cancel</pre> to return to the LunchBadger Canvas view.
`,
    waitForSelector: '.DetailsPanel .cancel',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .cancel'),
    ],
  },
  '028': {
    title: 'Connect Model Connector to Model',
    text: `
Click on the <pre>Memory</pre> Model Connector circular connection port and drag your cursor to the <pre>Car</pre> Model Entity's circular connection port. This links a Model to a Model Connector.
`,
    selector: '.Entity.DataSource.memory .port-out',
    position: 'bottom-left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setHole({width: '69px'}),
      api.waitUntilPresent('.Entity.DataSource.memory .port-out .port__anchor--connected'),
    ],
  },
  '030': {
    title: 'Function Entities Overview',
    text: `
A Function Entity represents a serverless function that's managed by your LunchBadger Project.
<br /><br />
C'mon, click it!
`,
    waitForSelector: '.Tool.function',
    allowClicksThruHole: true,
    skipLastStep: true,
    position: 'right',
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Function_.editable', false),
    ],
    onBefore: api => [
      api.focus('.Tool.function button'),
    ],
  },
  '031': {
    title: 'Deploy Function',
    text: `
Click <pre>OK</pre> to deploy function.
`,
    waitForSelector: '.Entity.Function_.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Function_.editable'),
      api.setShowOverlay(false),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.Entity.Function_.editable .submit'),
    ],
  },
  '032': {
    title: 'Function is Deploying',
    text: `
Please wait till the <pre>myfunction</pre> is deployed and the walkthrough will continue automatically.
<br />
<br />
You'll see this Rocket Ship icon whenever an artifact is being deployed to your Kubernetes cluster.
`,
    position: 'right',
    selector: '.Entity.Function_',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Function_.deploying'),
      api.waitUntilNotPresent('.CanvasElement.Function_.wip'),
      api.setWaitMethod(),
    ],
  },
  '033': {
    title: 'View Function Details',
    text: `
The ellipses icon will open a Details Panel.
<br /><br />
C'mon, click it!
`,
    position: 'right',
    waitForSelector: '.Entity.Function_ .Toolbox__button--zoom',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .RnD__content', false),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(3000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.click('.Entity.Function_'),
      api.waitUntilPresent('.Entity.Function_.highlighted .Toolbox__button--zoom'),
      api.focus('.Entity.Function_ .Toolbox__button--zoom'),
    ],
  },
  '034': {
    title: `
Function Entity's Built-in Editor
`,
    text: 'Edit LunchBadger Functions with the built-in editor.',
    waitForSelector: '.DetailsPanel .FilesEditor',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '035': {
    title: 'Return to Canvas from Function Details Panel',
    text: `
Click <pre>Cancel</pre> to return to the LunchBadger Canvas view.
`,
    waitForSelector: '.DetailsPanel .cancel',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .cancel'),
    ],
  },
  // '040': {
  //   title: 'Microservices Entity Overview',
  //   text: '<i>This Entity is still in-development. It\'s not recommended for use at this time.</i>',
  //   selector: '.Tool.microservice',
  //   position: 'right',
  // },
};
