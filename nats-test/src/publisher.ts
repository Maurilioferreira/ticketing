import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// stan = client (or nats reverse)
const stan = nats.connect('ticketing', 'abcd', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});