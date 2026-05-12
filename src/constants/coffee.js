import amberColdBrewImage from '../assets/images/Amber_Cold_Brew_image_2K_202605121049.jpeg'
import caffeMochaImage from '../assets/images/Caffe Mocha.jpeg'
import cappuccinoImage from '../assets/images/Cappuccino_2K_202605121052.jpeg'
import caramelMacchiatoImage from '../assets/images/Caramel_Macchiato_2K_202605121050.jpeg'
import flatWhiteImage from '../assets/images/Flat White.jpeg'
import icedAmericanoImage from '../assets/images/Iced_Americano_2K_202605121050.jpeg'
import matchaLatteImage from '../assets/images/Matcha_Latte_2K_202605121051.jpeg'
import redVelvetLatteImage from '../assets/images/red_Velvet_Latte_image_2K_202605121042.jpeg'
import vanillaSweetCreamImage from '../assets/images/Vanilla_Sweet_Cream_2K_202605121052.jpeg'

export const categories = ['All Coffee', 'Machiatto', 'Latte', 'Americano']

export const coffees = [
  {
    name: 'Caffe Mocha',
    tone: 'Deep Foam',
    price: 4.53,
    rating: 4.8,
    image: caffeMochaImage,
  },
  {
    name: 'Flat White',
    tone: 'Espresso',
    price: 3.53,
    rating: 4.8,
    image: flatWhiteImage,
  },
  {
    name: 'Velvet Latte',
    tone: 'Oat Cream',
    price: 5.18,
    rating: 4.9,
    image: redVelvetLatteImage,
  },
  {
    name: 'Amber Cold Brew',
    tone: 'Nitro',
    price: 4.9,
    rating: 4.7,
    image: amberColdBrewImage,
  },
  {
    name: 'Caramel Macchiato',
    tone: 'Vanilla Syrup',
    price: 4.80,
    rating: 4.9,
    image: caramelMacchiatoImage,
  },
  {
    name: 'Iced Americano',
    tone: 'Chilled',
    price: 3.20,
    rating: 4.5,
    image: icedAmericanoImage,
  },
  {
    name: 'Vanilla Sweet Cream',
    tone: 'Cold Brew',
    price: 5.10,
    rating: 4.8,
    image: vanillaSweetCreamImage,
  },
  {
    name: 'Matcha Latte',
    tone: 'Green Tea',
    price: 4.60,
    rating: 4.7,
    image: matchaLatteImage,
  },
  {
    name: 'Cappuccino',
    tone: 'Foamed Milk',
    price: 3.90,
    rating: 4.6,
    image: cappuccinoImage,
  },
]

export const navItems = ['Home', 'Favorite', 'Bag', 'Alert']
