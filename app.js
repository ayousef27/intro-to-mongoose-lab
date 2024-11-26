const prompt = require('prompt-sync')()
const mongoose = require('mongoose')
require('dotenv').config()
const Customer = require('./models/customer');


const username = prompt('What is your name? ')
console.log(`Welcome ${username}`)


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB!')
    
    await insertCustomerData()
    await showMenu()
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message)
    console.error('Stack trace:', err.stack)
  }
}


async function insertCustomerData() {
  try {
    const existingCustomers = await Customer.find({})
    
    
    if (existingCustomers.length === 0) {
      const customers = await Customer.insertMany([
        {
          _id: new mongoose.Types.ObjectId("658226acdcbecfe9b99d5421"), 
          name: 'Matt',
          age: 43
        },
        {
          _id: new mongoose.Types.ObjectId("65825d1ead6cd90c5c430e24"), 
          name: 'Vivienne',
          age: 6
        }
      ])

      console.log('Customers added:', customers)
    } else {
      console.log('Customers already exist in the database.')
    }
  } catch (error) {
    console.error('Error inserting data:', error)
  }
}

// Show the menu and handle user input
async function showMenu() {
  let quit = false

  while (!quit) {
    console.log('\nWhat would you like to do?\n')
    console.log('  1. Create a customer')
    console.log('  2. View all customers')
    console.log('  3. Update a customer')
    console.log('  4. Delete a customer')
    console.log('  5. Quit');

    const choice = prompt('Number of action to run: ').trim()

    switch (choice) {
      case '1':
        await createCustomer()
        break
      case '2':
        await viewCustomers()
        break
      case '3':
        await updateCustomer()
        break
      case '4':
        await deleteCustomer()
        break
      case '5':
        quit = true
        console.log('Goodbye!')
        break
      default:
        console.log('Invalid option, please choose again.')
        break
    }
  }
}


async function createCustomer() {
  const name = prompt('Enter the customer name: ').trim()
  const age = parseInt(prompt('Enter the customer age: ').trim(), 10)

  const newCustomer = new Customer({
    name,
    age
  })

  try {
    await newCustomer.save()
    console.log(`Customer created: ${newCustomer.name}, Age: ${newCustomer.age}`)
  } catch (error) {
    console.error('Error creating customer:', error)
  }
}

// View all customers
async function viewCustomers() {
  try {
    const customers = await Customer.find()
    console.log('Customer List:')
    customers.forEach((customer) => {
      console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
    })
  } catch (error) {
    console.error('Error viewing customers:', error)
  }
}


async function updateCustomer() {
  
  const customerId = prompt('Enter the customer ID you want to update: ').trim()

  
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    console.log('Invalid customer ID format!')
    return
  }

  
  const customer = await Customer.findById(customerId)
  if (!customer) {
    console.log('Customer not found!')
    return
  }

  
  const newName = prompt(`Enter the new name for ${customer.name}: `)
  const newAge = prompt(`Enter the new age for ${customer.name}: `)

  
  customer.name = newName
  customer.age = newAge

 
  await customer.save()

  
  console.log(`Customer updated: ${customer.name}, Age: ${customer.age}`)
}


async function deleteCustomer() {
  const customerId = prompt('Enter the customer ID you want to delete: ').trim()

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    console.log('Invalid customer ID format!')
    return
  }

  try {
    const result = await Customer.findByIdAndDelete(customerId)
    if (result) {
      console.log(`Customer with ID: ${customerId} has been deleted.`)
    } else {
      console.log('Customer not found!')
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}

connect()

