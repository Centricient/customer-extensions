
(function() {
'use strict';

// Helper functions
function addEventBlock(text, headerText, alertLevel) {
  alertLevel = alertLevel || 'info';
  var eventBlock = document.createElement('div');
  eventBlock.className = 'bs-callout bs-callout-' + alertLevel;
  var textNode = document.createTextNode(text);
  if (headerText) {
    var header = document.createElement('h4');
    var headerTextNode = document.createTextNode(headerText);
    header.appendChild(headerTextNode);
    eventBlock.appendChild(header);
  }
  eventBlock.appendChild(textNode);

  var mainDiv = document.getElementById('mainDiv');
  mainDiv.appendChild(eventBlock);
}

function updateIdFields() {
  var userIdSpan = document.getElementById('userId');
  var tenantIdSpan = document.getElementById('tenantId');
  userId.textContent = Centricient.getUserId();
  tenantId.textContent = Centricient.getTenantId();
}

function updateExtensionData() {
  var dataField = document.getElementById('extensionData');

  // Get current data
  dataField.textContent = Centricient.getExtensionData();
}

// Initialization
function callInit() {
  const url = document.getElementById('site').value;
  Centricient.init(url);
}

document.getElementById('initBtn').addEventListener('click', callInit);

// Event listeners
Centricient.on('init', function() {
  addEventBlock('AddIn loaded', null, 'success');
  updateIdFields();
  updateExtensionData();
});

Centricient.on('messageAdded', function(data) {
  var totalMessages = Centricient.getConversation().messages.length;
  addEventBlock(data.text + ' (' + totalMessages + ' total messages)', 'Message sent');
});

Centricient.on('messageReceived', function(data) {
  addEventBlock(data.message.text, 'Message received');
})

Centricient.on('collaborationMessageReceived', function(data) {
  addEventBlock(data.message.text, 'Collaboration message received');
})

Centricient.on('conversationAccepted', function(data) {
  addEventBlock('Conversation accepted', null, 'success');
});

Centricient.on('conversationStatusChanged', function(data) {
  if (data.status === 'inactive') { addEventBlock('Conversation inactive', null, 'warning'); }
  if (data.status === 'active') { addEventBlock('Conversation became active', null, 'success'); }
});

Centricient.on('extensionDataChanged', updateExtensionData);

document.getElementById('prepareHelloButton').addEventListener('click', function() {
  Centricient.prepareMessage('Hello world');
});

document.getElementById('sendOnCloseButton').addEventListener('click', function() {
  var text = document.getElementById('sendOnCloseField').value;
  Centricient.sendOnClose(text);
});

document.getElementById('updateContactBtn').addEventListener('click', function() {
  var firstName = document.getElementById('firstNameField').value;
  var lastName = document.getElementById('lastNameField').value;
  Centricient.updateContactDisplayName({firstName: firstName, lastName: lastName});
})

document.getElementById('fetchButton').addEventListener('click', function() {
  Centricient.fetchUsers().then(function(data) {
    addEventBlock(JSON.stringify(data), null, 'success');
  });
});

document.getElementById('setDataButton').addEventListener('click', function() {
  var newData = document.getElementById('dataField').value;
  var testObject = { textBoxContent: newData };
  Centricient.setExtensionData(JSON.stringify(testObject)).then(updateExtensionData);
});

})()
