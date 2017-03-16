
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
  userId.textContent = Quiq.getUserId();
  tenantId.textContent = Quiq.getTenantId();
}

function updateExtensionData() {
  var dataField = document.getElementById('extensionData');

  // Get current data
  dataField.textContent = Quiq.getExtensionData();
}

// Initialization
function callInit() {
  const url = document.getElementById('site').value;
  Quiq.init(url);
}

callInit();
document.getElementById('initBtn').addEventListener('click', callInit);

// Event listeners
Quiq.on('init', function() {
  addEventBlock('AddIn loaded', null, 'success');
  updateIdFields();
  updateExtensionData();
});

Quiq.on('messageAdded', function(data) {
  var totalMessages = Quiq.getConversation().messages.length;
  addEventBlock(data.text + ' (' + totalMessages + ' total messages)', 'Message sent');
});

Quiq.on('messageReceived', function(data) {
  addEventBlock(data.message.text, 'Message received');
})

Quiq.on('collaborationMessageReceived', function(data) {
  addEventBlock(data.message.text, 'Collaboration message received');
})

Quiq.on('conversationAccepted', function(data) {
  addEventBlock('Conversation accepted', null, 'success');
});

Quiq.on('conversationStatusChanged', function(data) {
  if (data.status === 'inactive') { addEventBlock('Conversation inactive', null, 'warning'); }
  if (data.status === 'active') { addEventBlock('Conversation became active', null, 'success'); }
});

Quiq.on('extensionDataChanged', updateExtensionData);

document.getElementById('prepareHelloButton').addEventListener('click', function() {
  Quiq.prepareMessage('Hello world');
});

document.getElementById('sendOnCloseButton').addEventListener('click', function() {
  var text = document.getElementById('sendOnCloseField').value;
  Quiq.sendOnClose(text);
});

document.getElementById('updateContactBtn').addEventListener('click', function() {
  var firstName = document.getElementById('firstNameField').value;
  var lastName = document.getElementById('lastNameField').value;
  Quiq.updateContactDisplayName({firstName: firstName, lastName: lastName});
})

document.getElementById('fetchButton').addEventListener('click', function() {
  Quiq.fetchUsers().then(function(data) {
    addEventBlock(JSON.stringify(data), null, 'success');
  });
});

document.getElementById('setDataButton').addEventListener('click', function() {
  var newData = document.getElementById('dataField').value;
  var testObject = { textBoxContent: newData };
  Quiq.setExtensionData(JSON.stringify(testObject)).then(updateExtensionData);
});

})()
