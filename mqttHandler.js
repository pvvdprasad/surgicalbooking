// mqttHandler.js
var conn = require('./model/db').conn;
const mqtt = require('mqtt');
const fs = require('fs');

async function updateBinStatus(message){
    // console.log(message);
    const parsedMessage = JSON.parse(message);
    const { macId, status1 } = parsedMessage;
    try{
        
        // Check if bin with given macId exists
        const binLogResult = await conn.query('SELECT uid FROM bins WHERE mac_id = ?', [macId]);
        // console.log(binLogResult)
        if (binLogResult.length === 0) {
            console.log(`No bin with MAC address ${macId} is present in the system`);
            return { message: `No bin with MAC address ${macId} is present in the system` };
        }else{

          // Update connection status
          const updateResult = await conn.query('UPDATE bins SET binstatus = ?, timestamp= CURRENT_TIMESTAMP, connection_status= 1 WHERE mac_id = ?', [status1, macId]);
          // console.log(`Update is done:`, updateResult);
          return updateResult;
        }

    }catch(error){
        // console.error("Error updating bin status:", error);
        throw error;
    }

}

module.exports = function() {
  // Define the MQTT endpoint
  const endpoint = 'a2z6bsd9ppx4b9-ats.iot.us-east-1.amazonaws.com'; // You can find this in the AWS IoT Core console

  // Set up MQTT client
  const client = mqtt.connect({
    host: endpoint,
    port: 8883, // MQTT over TLS port
    protocol: 'mqtts',
    clientId: 'iotconsole-83695ba8-3e41-49cf-9426-49be0361bf09', // Provide a unique client ID
    // Supply certificates for secure connection
    key: fs.readFileSync('./aws_certificate/Private.key'),
    cert: fs.readFileSync('./aws_certificate/Device Certificate.crt'),
    ca: [fs.readFileSync('./aws_certificate/AmazonRootCA1.pem')],
  });

  // Subscribe to the topic
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(['esp32/binStatus', 'esp32/binData'], (err) => {
      if (!err) {
        console.log('Subscribed to esp32/binStatus, esp32/binData');
      } else {
        console.error('Subscription failed', err);
      }
    });
  });

  // Handle incoming messages
  client.on('message',async  (topic, message) => {
    await updateBinStatus(message);
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    // Process the message as needed
  });

  // Handle errors
  client.on('error', (err) => {
    console.error('MQTT client error:', err);
  });
};

