import React from 'react';
import './Confirmation.css';

const paymentMethodInfo = {
  gotówka: ['Płatność przy odbiorze'],
  BLIK: ['Płatność w aplikacji banku', 'Odbiorca: Dawid Bręk 663-811-309'],
  przelew: [
    '80 1050 1458 1000 0092 1533 6620',
    'Dawid Bręk',
    'ul. Wyzwolenia 74, 64-330 Opalenica',
  ],
};

function Confirmation(props) {
  const data = props.state;
  const name = data.username.substr(0, data.username.indexOf(' '));
  return (
    <div className='confirmation-wrapper'>
      <div className='confirmation-order'>
        <h3>Potwierdzenie zamówienia</h3>
        <div className='confirmation-description'>
          {name}!
          <br /> Dziękujemy za złożenie zamówienia. Dostarczymy je w dniu{' '}
          {data.deliveryDate}, na adres {data.adress} {data.city} od godziny{' '}
          {data.deliveryTimeFrom} do {data.deliveryTimeTo}.
          <br /> Pozdrawiamy,
          <br /> Świeża skibka!
        </div>
        <div className='confirmation-products'>
          Twoje zamówienie:
          {data.products.map((product, index) => {
            if (product.amount > 0) {
              return (
                <div className='confirmation-product' key={index}>
                  {product.name}: {product.amount}
                </div>
              );
            }
            return false;
          })}
        </div>
        <div className='confirmation-paymentMethod'>
          Wybrana metoda płatności: {data.paymentMethod}
        </div>
        {paymentMethodInfo[data.paymentMethod].map((payment, index) => {
          return (
            <p className='confirmation-paymentMethodDescription' key={index}>
              {payment}
            </p>
          );
        })}
        <div className='confirmation-price'>
          Cena zamówienia:{' '}
          {(data.deliveryPrice + data.productsPrice).toFixed(2)}zł
        </div>
        <h4>Zapraszamy ponownie!</h4>
      </div>
    </div>
  );
}

export default Confirmation;
