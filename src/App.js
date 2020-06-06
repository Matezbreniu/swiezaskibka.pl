import React, {Component} from 'react';
import './App.css';
import emailjs from 'emailjs-com';
import Confirmation from './Confirmation';

class App extends Component {
  state = {
    username: '',
    adress: '',
    city: '',
    phone: '',
    deliveryDate: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    slicedBread: false,
    productsPrice: 0,
    deliveryPrice: 0,
    paymentMethod: '',
    positiveValidation: false,

    errors: {
      username: false,
      adress: false,
      city: false,
      phone: false,
      deliveryDate: false,
      deliveryTimeFrom: false,
      deliveryTimeTo: false,
      paymentMethod: false,
    },

    products: [
      {
        name: 'Chleb zwykły',
        url: '/images/Chleb zwykły.JPG',
        amount: 0,
        price: 4.0,
      },
      {
        name: 'Chleb słonecznikowy',
        url: '/images/Chleb słonecznikowy.JPG',
        amount: 0,
        price: 4.5,
      },
      {
        name: 'Chleb wieloziarnisty',
        url: '/images/Chleb wieloziarnisty.JPG',
        amount: 0,
        price: 4.5,
      },
      {
        name: 'Chleb żytni razowy',
        url: '/images/Chleb żytni razowy.JPG',
        amount: 0,
        price: 4.5,
      },
      {
        name: 'Bułka zwykła',
        url: '/images/Bułka zwykła.JPG',
        amount: 0,
        price: 1.0,
      },
      {
        name: 'Bułka z makiem',
        url: '/images/Bułka z makiem.JPG',
        amount: 0,
        price: 1.0,
      },
      {
        name: 'Bułka cebulowa',
        url: '/images/Bułka cebulowa.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Bułka grahamka',
        url: '/images/Bułka grahamka.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Bułka mleczna',
        url: '/images/Bułka mleczna.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Bułka pszenna typu włoskiego',
        url: '/images/Bułka pszenna typu włoskiego.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Bułka wieloziarnista',
        url: '/images/Bułka wieloziarnista.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Bułka ze słonecznikiem',
        url: '/images/Bułka ze słonecznikiem.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Rogal mleczny',
        url: '/images/Rogal mleczny.JPG',
        amount: 0,
        price: 1.2,
      },
      {
        name: 'Drożdżówka z budyniem',
        url: '/images/Drożdżówka z budyniem.JPG',
        amount: 0,
        price: 2.5,
      },
      {
        name: 'Drożdżówka z owocem',
        url: '/images/Drożdżówka z owocem.JPG',
        amount: 0,
        price: 2.5,
      },
      {
        name: 'Drożdżówka z serem',
        url: '/images/Drożdżówka z serem.JPG',
        amount: 0,
        price: 2.5,
      },
      {
        name: 'Pączek',
        url: '/images/Pączek.JPG',
        amount: 0,
        price: 2.5,
      },
    ],
  };

  messages = {
    username_incorrect: 'Podaj imię i nazwisko.',
    adress_incorrect: 'Adres musi zawierać ulicę oraz numer domu.',
    city_incorrect: 'To pole musi zawierać miejscowość.',
    phone_incorrect: 'Numer telefonu musi zawierać 9 cyfr.',
    deliveryDate_incorrect: 'Data zamówienia się nie zgadza.',
    deliveryTimeFrom_incorrect: 'Godzina zamówienia musi być między 6 a 9.',
    deliveryTimeTo_incorrect:
      'Ostateczna godzina zamówienia musi być późniejsza niż początkowa oraz wczesniejsza niż 10.',
    paymentMethod_incorrect: 'Wybierz metodę płatności.',
  };

  countProductsPrice = (object) => {
    let productsPrice = 0;
    object.map((product) => {
      let price = product.amount * product.price;
      productsPrice += price;
      return price;
    });
    productsPrice = Number(productsPrice.toFixed(2));
    this.checkDeliveryPrice(productsPrice);
    this.setState({
      productsPrice,
    });
  };
  checkDeliveryPrice = (productsPrice, city = this.state.city) => {
    let deliveryPrice = 0;
    if (productsPrice >= 25) {
      deliveryPrice = 0;
    } else {
      if (city === 'Opalenica') {
        deliveryPrice = 4;
      } else {
        deliveryPrice = 6;
      }
    }
    this.setState({
      deliveryPrice,
    });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    const className = e.target.className;
    if (
      type === 'text' ||
      type === 'number' ||
      type === 'time' ||
      type === 'date' ||
      type === 'radio'
    ) {
      const value = e.target.value;
      if (name === 'city') {
        this.checkDeliveryPrice(this.state.productsPrice, value);
      }
      if (className === 'productInput') {
        const index = e.target.getAttribute('index');
        let productsCopy = JSON.parse(JSON.stringify(this.state.products));
        productsCopy[index].amount = value;
        this.countProductsPrice(productsCopy);
        this.setState({
          products: productsCopy,
        });

        return;
      }
      this.setState({
        [name]: value,
      });
    } else if (type === 'checkbox') {
      const checked = e.target.checked;
      this.setState({
        [name]: checked,
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const validation = this.formValidation();
    const products = [];
    this.state.products.map((product) => {
      if (product.amount > 0) {
        products.push([product.name, product.amount]);
      }
      return null;
    });
    console.log(products);
    if (validation.correct) {
      const template_params = {
        username: this.state.username,
        deliveryDate: this.state.deliveryDate,
        adress: this.state.adress,
        city: this.state.city,
        phone: this.state.phone,
        deliveryTimeFrom: this.state.deliveryTimeFrom,
        deliveryTimeTo: this.state.deliveryTimeTo,
        slicedBread: this.state.slicedBread,
        paymentMethod: this.state.paymentMethod,
        productsPrice: this.state.productsPrice,
        deliveryPrice: this.state.deliveryPrice,
        totalPrice: this.state.totalPrice,
        products: products,
      };

      const service_id = 'default_service';
      const template_id = 'template_2O1paUkV';
      const username_id = 'user_4cQfMG0bjeMAX3dCOccr9';
      emailjs.send(service_id, template_id, template_params, username_id).then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
      this.setState({
        positiveValidation: true,
      });
    } else {
      setTimeout(this.scrollToIncorrectValue, 100);
      this.setState({
        errors: {
          username: !validation.username,
          adress: !validation.adress,
          city: !validation.city,
          phone: !validation.phone,
          deliveryDate: !validation.deliveryDate,
          deliveryTimeFrom: !validation.deliveryTimeFrom,
          deliveryTimeTo: !validation.deliveryTimeTo,
          paymentMethod: !validation.paymentMethod,
          correct: !validation.correct,
        },
      });
    }
  };

  handleAddAmount = (product, e) => {
    e.preventDefault();
    let productsCopy = JSON.parse(JSON.stringify(this.state.products));
    productsCopy[product.index].amount++;
    this.countProductsPrice(productsCopy);
    this.setState({
      products: productsCopy,
    });
  };

  handleRemoveAmount = (product, e) => {
    e.preventDefault();
    if (product.amount > 0) {
      let productsCopy = JSON.parse(JSON.stringify(this.state.products));
      productsCopy[product.index].amount--;
      this.countProductsPrice(productsCopy);
      this.setState({
        products: productsCopy,
      });
    }
  };
  formValidation = () => {
    let username = false;
    let adress = false;
    let city = false;
    let phone = false;
    let deliveryDate = false;
    let deliveryTimeFrom = false;
    let deliveryTimeTo = false;
    let paymentMethod = false;
    let correct = false;

    if (this.state.username.indexOf(' ') > 0) {
      username = true;
    }
    if (this.state.adress.length > 1) {
      adress = true;
    }
    if (this.state.city.length > 1) {
      city = true;
    }
    if (this.state.phone.length === 9) {
      phone = true;
    }
    if (this.state.deliveryDate) {
      deliveryDate = true;
    }
    if (
      this.state.deliveryTimeFrom.slice(0, 2) >= 6 &&
      this.state.deliveryTimeFrom.slice(0, 2) < 10
    ) {
      deliveryTimeFrom = true;
    }
    if (
      this.state.deliveryTimeTo > this.state.deliveryTimeFrom &&
      this.state.deliveryTimeTo.slice(0, 2) < 10
    ) {
      deliveryTimeTo = true;
    }
    if (this.state.paymentMethod) {
      paymentMethod = true;
    }
    if (
      username &&
      adress &&
      city &&
      phone &&
      deliveryDate &&
      deliveryTimeFrom &&
      deliveryTimeTo &&
      paymentMethod
    ) {
      correct = true;
    }
    return {
      correct,
      username,
      adress,
      city,
      phone,
      deliveryDate,
      deliveryTimeFrom,
      deliveryTimeTo,
      paymentMethod,
    };
  };
  scrollToIncorrectValue = () => {
    const incorrectValue = document.querySelector('.validationError');
    if (incorrectValue) {
      window.scrollTo(0, incorrectValue.parentElement.offsetTop);
    }
  };
  componentDidMount() {
    let productsCopy = this.state.products;
    productsCopy.forEach((product, i) => {
      product.index = i;
    });
    this.setState({
      products: productsCopy,
    });
  }

  render() {
    return (
      <div className='App'>
        {this.state.positiveValidation && <Confirmation state={this.state} />}
        {!this.state.positiveValidation && (
          <div className='wrapper'>
            <h1 className='companyName'>Świeża skibka</h1>
            <h2 className='orderName'>Formularz zamówienia</h2>
            <form className='orderForm' onSubmit={this.handleSubmit} noValidate>
              <label htmlFor='user'>
                Imię i Nazwisko
                <input
                  type='text'
                  id='user'
                  name='username'
                  value={this.state.username}
                  onChange={this.handleChange}
                />
                {this.state.errors.username && (
                  <span className='validationError'>
                    {this.messages.username_incorrect}
                  </span>
                )}
              </label>
              <label htmlFor='adress'>
                Ulica i numer domu
                <input
                  type='text'
                  id='adress'
                  name='adress'
                  value={this.state.adress}
                  onChange={this.handleChange}
                />
                {this.state.errors.adress && (
                  <span className='validationError'>
                    {this.messages.adress_incorrect}
                  </span>
                )}
              </label>
              <label htmlFor='city'>
                Miasto
                <input
                  type='text'
                  id='city'
                  name='city'
                  value={this.state.city}
                  onChange={this.handleChange}
                />
                {this.state.errors.city && (
                  <span className='validationError'>
                    {this.messages.city_incorrect}
                  </span>
                )}
              </label>
              <label htmlFor='phone'>
                Numer telefonu
                <input
                  type='number'
                  id='phone'
                  name='phone'
                  value={this.state.phone}
                  onChange={this.handleChange}
                />
                {this.state.errors.phone && (
                  <span className='validationError'>
                    {this.messages.phone_incorrect}
                  </span>
                )}
              </label>
              <label htmlFor='deliveryDate'>
                Data dostawy
                <input
                  type='date'
                  id='deliveryDate'
                  name='deliveryDate'
                  value={this.state.deliveryDate}
                  onChange={this.handleChange}
                />
                {this.state.errors.deliveryDate && (
                  <span className='validationError'>
                    {this.messages.deliveryDate_incorrect}
                  </span>
                )}
              </label>
              <div className='deliveryTime'>
                <span>Godzina dostawy</span>
                <label htmlFor='deliveryTimeFrom'>
                  od
                  <input
                    type='time'
                    min='06:00'
                    max='09:00'
                    id='deliveryTimeFrom'
                    name='deliveryTimeFrom'
                    value={this.state.deliveryTimeFrom}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor='deliveryTimeTo'>
                  do
                  <input
                    type='time'
                    min='6:00'
                    max='9:00'
                    id='deliveryTimeTo'
                    name='deliveryTimeTo'
                    value={this.state.deliveryTimeTo}
                    onChange={this.handleChange}
                  />
                </label>
                {this.state.errors.deliveryTimeFrom && (
                  <span className='validationError'>
                    {this.messages.deliveryTimeFrom_incorrect}
                  </span>
                )}
                {this.state.errors.deliveryTimeTo && (
                  <span className='validationError'>
                    {this.messages.deliveryTimeTo_incorrect}
                  </span>
                )}
              </div>
              <label htmlFor='slicedBread'>
                Czy chleb ma być krojony
                <input
                  type='checkbox'
                  id='slicedBread'
                  name='slicedBread'
                  value={this.state.slicedBread}
                  onChange={this.handleChange}
                />
              </label>
              <div className='products'>
                <h3>Menu</h3>
                {this.state.products.map((product, index) => (
                  <div className='productContainer' key={index}>
                    <label
                      className='product'
                      htmlFor={product.name}
                      key={index}
                    >
                      <img src={product.url} alt={product.name} />
                      <button
                        className='remove'
                        onClick={(e) => this.handleRemoveAmount(product, e)}
                      >
                        -
                      </button>
                      <input
                        type='number'
                        className='productInput'
                        id={product.name}
                        index={index}
                        name={product.name}
                        min='0'
                        value={product.amount}
                        onChange={this.handleChange}
                      />
                      <button
                        className='add'
                        onClick={(e) => this.handleAddAmount(product, e)}
                      >
                        +
                      </button>
                      <div className='productName'>{product.name}</div>
                      <div>Cena: {product.price.toFixed(2)}zł</div>
                    </label>
                  </div>
                ))}
              </div>
              <div className='paymentMethod'>
                <span>Wybierz formę płatności</span>
                <label htmlFor='cash'>
                  <input
                    type='radio'
                    id='cash'
                    name='paymentMethod'
                    value='gotówka'
                    checked={this.state.paymentMethod === 'gotówka'}
                    onChange={this.handleChange}
                  />
                  Gotówka
                </label>
                <label htmlFor='blik'>
                  <input
                    type='radio'
                    id='blik'
                    name='paymentMethod'
                    value='BLIK'
                    checked={this.state.paymentMethod === 'BLIK'}
                    onChange={this.handleChange}
                  />
                  BLIK
                </label>
                <label htmlFor='transfer'>
                  <input
                    type='radio'
                    id='transfer'
                    name='paymentMethod'
                    value='przelew'
                    checked={this.state.paymentMethod === 'przelew'}
                    onChange={this.handleChange}
                  />
                  Przelew
                </label>
                {this.state.errors.paymentMethod && (
                  <span className='validationError'>
                    {this.messages.paymentMethod_incorrect}
                  </span>
                )}
              </div>
              <div className='priceTable'>
                <label htmlFor='productsPrice'>
                  Cena produktów: {this.state.productsPrice.toFixed(2)}zł
                  <input
                    readOnly
                    type='number'
                    id='productsPrice'
                    name='productsPrice'
                    value={this.state.productsPrice.toFixed(2)}
                  />
                </label>
                <label htmlFor='deliveryPrice'>
                  Cena dostawy: {this.state.deliveryPrice.toFixed(2)}zł
                  <input
                    readOnly
                    type='number'
                    id='deliveryPrice'
                    name='deliveryPrice'
                    value={this.state.deliveryPrice.toFixed(2)}
                  />
                </label>
                <label htmlFor='totalPrice'>
                  Cena całkowita:
                  {(
                    this.state.deliveryPrice + this.state.productsPrice
                  ).toFixed(2)}
                  zł
                  <input
                    readOnly
                    type='number'
                    id='totalPrice'
                    name='totalPrice'
                    value={(
                      this.state.deliveryPrice + this.state.productsPrice
                    ).toFixed(2)}
                  />
                </label>
              </div>
              <button className='orderButton'>Zamawiam</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default App;
